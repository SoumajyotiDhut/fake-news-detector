from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional
from datetime import datetime, timezone
import os

DB_PATH = os.environ.get("DB_PATH", "predictions.db")
engine  = create_engine(f"sqlite:///{DB_PATH}", echo=False)


class Prediction(SQLModel, table=True):
    id:           Optional[int] = Field(default=None, primary_key=True)
    label:        str
    confidence:   float
    fake_prob:    float
    real_prob:    float
    text_preview: str
    word_count:   int
    source:       str = "text"
    created_at:   datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


def create_db():
    SQLModel.metadata.create_all(engine)


def save_prediction(label, confidence, fake_prob, real_prob,
                    text_preview, word_count, source="text"):
    with Session(engine) as session:
        record = Prediction(
            label=label,
            confidence=confidence,
            fake_prob=fake_prob,
            real_prob=real_prob,
            text_preview=text_preview,
            word_count=word_count,
            source=source
        )
        session.add(record)
        session.commit()
        session.refresh(record)
        return record


def get_history(limit: int = 20):
    with Session(engine) as session:
        records = session.exec(
            select(Prediction).order_by(Prediction.id.desc()).limit(limit)
        ).all()
        return records


def get_total_count():
    with Session(engine) as session:
        return len(session.exec(select(Prediction)).all())