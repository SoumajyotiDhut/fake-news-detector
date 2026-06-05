import joblib
import numpy as np
import sys
import os

MODEL_DIR = os.environ.get("MODEL_DIR", "../models")
sys.path.append(MODEL_DIR)

import preprocessing as pp

# Module-level singletons
tfidf_vec = None
scaler    = None
lr_model  = None


def load_model():
    global tfidf_vec, scaler, lr_model

    print("Loading models...")
    tfidf_vec = joblib.load(f"{MODEL_DIR}/tfidf_vectorizer.pkl")
    scaler    = joblib.load(f"{MODEL_DIR}/meta_scaler.pkl")
    lr_model  = joblib.load(f"{MODEL_DIR}/model_lr.pkl")
    print("✓ Models loaded successfully (LR + TF-IDF)")


def predict(text: str, threshold: float = 0.5) -> dict:
    assert lr_model is not None, "Call load_model() first"

    clean     = pp.preprocess_for_tfidf(text)
    vec       = tfidf_vec.transform([clean])
    probs     = lr_model.predict_proba(vec)[0]
    fake_prob = round(float(probs[0]), 4)
    real_prob = round(float(probs[1]), 4)
    label     = "REAL" if real_prob >= threshold else "FAKE"
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
    if lr_model is None or tfidf_vec is None:
        return {"fake_words": [], "real_words": []}

    clean         = pp.preprocess_for_tfidf(text)
    vec           = tfidf_vec.transform([clean])
    feature_names = np.array(tfidf_vec.get_feature_names_out())
    coef          = lr_model.coef_[0]
    scores        = np.asarray(vec.todense()).flatten() * coef
    nonzero       = np.where(scores != 0)[0]

    if len(nonzero) == 0:
        return {"fake_words": [], "real_words": []}

    sorted_idx = nonzero[np.argsort(scores[nonzero])]
    fake_words = feature_names[sorted_idx[:n]].tolist()
    real_words = feature_names[sorted_idx[-n:][::-1]].tolist()

    return {"fake_words": fake_words, "real_words": real_words}