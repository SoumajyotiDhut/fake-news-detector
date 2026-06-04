import torch
import torch.nn as nn
import joblib
import numpy as np
import sys
import os

MODEL_DIR = os.environ.get("MODEL_DIR", "../models")
sys.path.append(MODEL_DIR)

import preprocessing as pp
from transformers import AutoTokenizer, AutoModel


class FakeNewsClassifier(nn.Module):
    def __init__(self, model_name="distilbert-base-uncased",
                 num_classes=2, dropout=0.3):
        super().__init__()
        self.bert       = AutoModel.from_pretrained(model_name)
        self.dropout    = nn.Dropout(dropout)
        self.classifier = nn.Linear(self.bert.config.hidden_size, num_classes)

    def forward(self, input_ids, attention_mask):
        outputs    = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        cls_output = outputs.last_hidden_state[:, 0, :]
        cls_output = self.dropout(cls_output)
        return self.classifier(cls_output)


device    = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model     = None
tokenizer = None
tfidf_vec = None
scaler    = None


def load_model():
    global model, tokenizer, tfidf_vec, scaler

    print(f"Loading model on {device}...")

    tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
    model     = FakeNewsClassifier().to(device)

    checkpoint = torch.load(
        f"{MODEL_DIR}/best_model.pt",
        map_location=device,
        weights_only=False
    )
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    tfidf_vec = joblib.load(f"{MODEL_DIR}/tfidf_vectorizer.pkl")
    scaler    = joblib.load(f"{MODEL_DIR}/meta_scaler.pkl")

    print(f"✓ Model loaded — epoch {checkpoint['epoch']}, val_f1: {checkpoint['val_f1']:.4f}")
    return checkpoint


def predict(text: str, threshold: float = 0.5) -> dict:
    assert model is not None, "Call load_model() first"

    clean = pp.preprocess_for_bert(text)
    enc   = tokenizer(
        clean,
        max_length=512,
        truncation=True,
        padding="max_length",
        return_tensors="pt"
    )

    with torch.no_grad():
        input_ids      = enc["input_ids"].to(device)
        attention_mask = enc["attention_mask"].to(device)
        outputs        = model(input_ids, attention_mask)
        probs          = torch.softmax(outputs, dim=1)[0]

    fake_prob  = round(probs[0].item(), 4)
    real_prob  = round(probs[1].item(), 4)
    label      = "REAL" if real_prob >= threshold else "FAKE"
    confidence = max(fake_prob, real_prob)

    return {
        "label":        label,
        "confidence":   round(confidence, 4),
        "fake_prob":    fake_prob,
        "real_prob":    real_prob,
        "text_preview": text[:120].strip(),
        "word_count":   len(text.split())
    }


def get_top_words(text: str, n: int = 10) -> dict:
    lr_path = f"{MODEL_DIR}/model_lr.pkl"
    if not os.path.exists(lr_path):
        return {"fake_words": [], "real_words": []}

    lr            = joblib.load(lr_path)
    clean         = pp.preprocess_for_tfidf(text)
    vec           = tfidf_vec.transform([clean])
    feature_names = np.array(tfidf_vec.get_feature_names_out())
    coef          = lr.coef_[0]
    scores        = np.asarray(vec.todense()).flatten() * coef
    nonzero       = np.where(scores != 0)[0]

    if len(nonzero) == 0:
        return {"fake_words": [], "real_words": []}

    sorted_idx = nonzero[np.argsort(scores[nonzero])]
    fake_words = feature_names[sorted_idx[:n]].tolist()
    real_words = feature_names[sorted_idx[-n:][::-1]].tolist()

    return {"fake_words": fake_words, "real_words": real_words}