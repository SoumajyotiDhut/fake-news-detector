import re
import string
import nltk
from nltk.corpus import stopwords

nltk.download("stopwords", quiet=True)
nltk.download("punkt", quiet=True)

STOPWORDS = set(stopwords.words("english")) - {"not", "no", "never", "nor",
                                                "neither", "without", "against"}

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"<.*?>", " ", text)
    text = re.sub(r"\[.*?\]", " ", text)
    text = re.sub(r"pic\.twitter\.com\S+", " ", text)
    text = re.sub(r"@\w+", " ", text)
    text = re.sub(r"#\w+", " ", text)
    text = re.sub(r"\d+", " ", text)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def preprocess_for_tfidf(text: str) -> str:
    text = clean_text(text)
    tokens = [w for w in text.split()
              if w not in STOPWORDS and len(w) > 2]
    return " ".join(tokens)


def preprocess_for_bert(text: str, max_chars: int = 2000) -> str:
    text = clean_text(text)
    return text[:max_chars]


def add_meta_features(df):
    import pandas as pd
    df = df.copy()
    raw = df["content"].fillna("")
    df["meta_word_count"]        = raw.str.split().str.len()
    df["meta_char_count"]        = raw.str.len()
    df["meta_avg_word_len"]      = raw.apply(lambda x: sum(len(w) for w in x.split()) / max(len(x.split()), 1))
    df["meta_exclaim_count"]     = raw.str.count("!")
    df["meta_question_count"]    = raw.str.count(r"\?")
    df["meta_upper_ratio"]       = raw.apply(lambda x: sum(1 for c in x if c.isupper()) / max(len(x), 1))
    df["meta_unique_word_ratio"] = raw.apply(lambda x: len(set(x.lower().split())) / max(len(x.split()), 1))
    df["meta_url_count"]         = raw.str.count(r"http\S+|www\.\S+")
    df["meta_quote_count"]       = raw.str.count('"')
    return df