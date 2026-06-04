import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'api'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'models'))
os.environ["MODEL_DIR"] = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'models')
)

# Use a real temp file DB instead of :memory: — avoids engine sharing issues
TEST_DB = os.path.join(os.path.dirname(__file__), 'test_predictions.db')
os.environ["DB_PATH"] = TEST_DB

import pytest
from sqlmodel import SQLModel
from fastapi.testclient import TestClient

import database
from main import app


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    SQLModel.metadata.create_all(database.engine)
    yield
    # Close all connections before deleting on Windows
    database.engine.dispose()
    import time
    time.sleep(0.5)
    try:
        if os.path.exists(TEST_DB):
            os.remove(TEST_DB)
    except PermissionError:
        pass  # Windows file lock — file will be cleaned up on next run


@pytest.fixture(scope="session")
def client(setup_db):
    with TestClient(app) as c:
        yield c


# ── texts ─────────────────────────────────────────────────────
FAKE_TEXT = """
BREAKING: Deep state operatives have been caught rigging elections across the country.
Whistleblowers confirm the mainstream media is hiding this massive scandal from the
American people. Sources say government officials are involved in a massive cover-up!!!
"""

REAL_TEXT = """
The Federal Reserve raised its benchmark interest rate by 25 basis points on Wednesday,
the tenth increase since March 2022, as policymakers continue efforts to bring inflation
back to the 2 percent target. Fed Chair Jerome Powell said the decision was unanimous
among committee members and that further increases remain possible depending on data.
"""


# ── Health ────────────────────────────────────────────────────
def test_health_returns_200(client):
    r = client.get("/health")
    assert r.status_code == 200

def test_health_model_loaded(client):
    r = client.get("/health")
    data = r.json()
    assert data["status"] == "ok"
    assert data["model_loaded"] is True
    assert data["model_name"] == "distilbert-base-uncased"


# ── Predict ───────────────────────────────────────────────────
def test_predict_returns_200(client):
    r = client.post("/predict", json={"text": FAKE_TEXT})
    assert r.status_code == 200

def test_predict_fake_news(client):
    r = client.post("/predict", json={"text": FAKE_TEXT})
    data = r.json()
    assert data["label"] == "FAKE"
    assert data["confidence"] > 0.8
    assert abs(data["fake_prob"] + data["real_prob"] - 1.0) < 0.01

def test_predict_real_news(client):
    r = client.post("/predict", json={"text": REAL_TEXT})
    data = r.json()
    assert data["label"] in ["FAKE", "REAL"]
    assert data["confidence"] > 0.5
    assert data["word_count"] > 0

def test_predict_response_fields(client):
    r = client.post("/predict", json={"text": FAKE_TEXT})
    data = r.json()
    for field in ["label", "confidence", "fake_prob",
                  "real_prob", "text_preview", "word_count"]:
        assert field in data, f"Missing field: {field}"


# ── Validation ────────────────────────────────────────────────
def test_predict_too_short(client):
    r = client.post("/predict", json={"text": "too short"})
    assert r.status_code == 422

def test_predict_empty_string(client):
    r = client.post("/predict", json={"text": ""})
    assert r.status_code == 422

def test_predict_too_long(client):
    r = client.post("/predict", json={"text": "word " * 3000})
    assert r.status_code == 422

def test_predict_missing_field(client):
    r = client.post("/predict", json={})
    assert r.status_code == 422


# ── Explain ───────────────────────────────────────────────────
def test_explain_returns_word_signals(client):
    r = client.post("/explain", json={"text": FAKE_TEXT})
    assert r.status_code == 200
    data = r.json()
    assert "fake_words" in data
    assert "real_words" in data
    assert isinstance(data["fake_words"], list)
    assert isinstance(data["real_words"], list)

def test_explain_has_label(client):
    r = client.post("/explain", json={"text": FAKE_TEXT})
    data = r.json()
    assert data["label"] in ["FAKE", "REAL"]
    assert 0.0 <= data["confidence"] <= 1.0


# ── History ───────────────────────────────────────────────────
def test_history_returns_list(client):
    r = client.get("/history")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_history_limit_param(client):
    r = client.get("/history?limit=5")
    assert r.status_code == 200
    assert len(r.json()) <= 5

def test_history_record_fields(client):
    client.post("/predict", json={"text": FAKE_TEXT})
    r = client.get("/history?limit=1")
    assert r.status_code == 200
    records = r.json()
    assert len(records) >= 1
    for field in ["id", "label", "confidence", "text_preview",
                  "word_count", "source", "created_at"]:
        assert field in records[0], f"Missing field: {field}"


# ── URL validation ────────────────────────────────────────────
def test_predict_url_invalid(client):
    r = client.post("/predict-url", json={"url": "not-a-url"})
    assert r.status_code == 422

def test_predict_url_missing_scheme(client):
    r = client.post("/predict-url", json={"url": "example.com/article"})
    assert r.status_code == 422


# ── Stats ─────────────────────────────────────────────────────
def test_stats_returns_200(client):
    r = client.get("/stats")
    assert r.status_code == 200

def test_stats_fields(client):
    client.post("/predict", json={"text": FAKE_TEXT})
    r = client.get("/stats")
    assert r.status_code == 200
    data = r.json()
    for field in ["total", "fake_count", "real_count",
                  "fake_pct", "real_pct", "avg_confidence"]:
        assert field in data, f"Missing field: {field}"