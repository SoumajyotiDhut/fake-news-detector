from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime


class PredictRequest(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def validate_text(cls, v):
        v = v.strip()
        if len(v) < 20:
            raise ValueError("Text must be at least 20 characters")
        if len(v) > 10000:
            raise ValueError("Text must be under 10000 characters")
        return v


class URLRequest(BaseModel):
    url: str

    @field_validator("url")
    @classmethod
    def validate_url(cls, v):
        if not v.startswith(("http://", "https://")):
            raise ValueError("Must be a valid URL starting with http:// or https://")
        return v


class PredictionResult(BaseModel):
    label:        str
    confidence:   float
    fake_prob:    float
    real_prob:    float
    text_preview: str
    word_count:   int


class PredictionRecord(BaseModel):
    id:           int
    label:        str
    confidence:   float
    fake_prob:    float
    real_prob:    float
    text_preview: str
    word_count:   int
    source:       str
    created_at:   datetime

    model_config = {"from_attributes": True}   # ← replaces class Config


class HealthResponse(BaseModel):
    status:             str
    model_loaded:       bool
    model_name:         str
    total_predictions:  int