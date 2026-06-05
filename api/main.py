import sys
import os
import urllib.request

MODEL_DIR = os.environ.get("MODEL_DIR", "../models")
sys.path.append(MODEL_DIR)
sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import asyncio

from schemas  import PredictRequest, URLRequest, PredictionResult, HealthResponse
from database import create_db, save_prediction, get_history, get_total_count
import model as ml


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, ml.load_model)
    yield


app = FastAPI(
    title="Fake News Detector API",
    description="Detects fake news using DistilBERT",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health():
    return {
        "status":            "ok",
        "model_loaded":      ml.lr_model is not None,
        "model_name":        "logistic-regression-tfidf",
        "total_predictions": get_total_count()
    }


@app.post("/predict", response_model=PredictionResult)
async def predict(req: PredictRequest):
    try:
        # Strip excessive whitespace before inference
        text = " ".join(req.text.split())
        loop   = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, ml.predict, text)
        save_prediction(**result, source="text")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict-url", response_model=PredictionResult)
async def predict_url(req: URLRequest):
    try:
        from newspaper import Article
        import urllib.request

        # Set a browser user-agent to avoid blocks
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

        article = Article(req.url, browser_user_agent=headers['User-Agent'])
        article.download()
        article.parse()

        title = article.title or ""
        body  = article.text  or ""
        text  = (title + " " + body).strip()

        if len(text) < 20:
            raise HTTPException(
                status_code=422,
                detail="Could not extract enough text from this URL. Try pasting the article text directly."
            )

        loop   = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, ml.predict, text)
        save_prediction(**result, source="url")
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Could not scrape URL: {str(e)[:120]}. Try pasting the article text directly instead."
        )
        
@app.post("/predict-realtime")
async def predict_realtime(req: PredictRequest):
    """Lightweight endpoint for real-time analysis — no word signals."""
    try:
        text = " ".join(req.text.split())
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, ml.predict, text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def history(limit: int = 20):
    records = get_history(limit)
    return [
        {
            "id":           r.id,
            "label":        r.label,
            "confidence":   r.confidence,
            "fake_prob":    r.fake_prob,
            "real_prob":    r.real_prob,
            "text_preview": r.text_preview,
            "word_count":   r.word_count,
            "source":       r.source,
            "created_at":   r.created_at.isoformat()
        }
        for r in records
    ]

@app.get("/stats")
def stats():
    records = get_history(1000)
    if not records:
        return {"total": 0, "fake_count": 0, "real_count": 0,
                "fake_pct": 0, "real_pct": 0, "avg_confidence": 0}

    total      = len(records)
    fake_count = sum(1 for r in records if r.label == "FAKE")
    real_count = total - fake_count
    avg_conf   = sum(r.confidence for r in records) / total

    return {
        "total":          total,
        "fake_count":     fake_count,
        "real_count":     real_count,
        "fake_pct":       round(fake_count / total * 100, 1),
        "real_pct":       round(real_count / total * 100, 1),
        "avg_confidence": round(avg_conf * 100, 1)
    }
    
    
@app.post("/explain")
async def explain(req: PredictRequest):
    try:
        loop   = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, ml.predict, req.text)
        words  = await loop.run_in_executor(None, ml.get_top_words, req.text)
        return {**result, **words}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal error: {str(exc)}"}
    )


    
