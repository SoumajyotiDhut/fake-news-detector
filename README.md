# 🛡️ FakeGuard.ai — AI Fake News Detector

<div align="center">

![FakeGuard Banner](https://img.shields.io/badge/FakeGuard-AI%20Powered-blue?style=for-the-badge&logo=shield&logoColor=white)

**An end-to-end fake news detection system powered by DistilBERT**  
*Built in 7 days · From raw data to live deployment*

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🚀 Live Demo](#-live-demo) · [📖 How It Works](#-how-it-works) · [⚡ Quick Start](#-quick-start) · [📊 Model Results](#-model-performance) · [🛠️ API Docs](#-api-endpoints)

</div>

---

## 📌 What is FakeGuard.ai?

FakeGuard.ai is a **production-ready machine learning application** that detects fake news articles in real-time. Paste any news article or headline and get an instant AI verdict with:

- ✅ **Fake / Real classification** with confidence score
- 📊 **Probability breakdown** — fake % vs real %
- 🔍 **Word-level AI explanation** — which words triggered the decision
- ⚠️ **Risk meter** — Low / Medium / High / Critical
- ⚡ **Live real-time analysis** — results update as you type

> Built as a 7-day end-to-end ML project covering data collection, model training, backend API, frontend UI, testing, and Docker deployment.

---

## 🖥️ Screenshots

| Hero Page | Live Analysis | Results Dashboard |
|-----------|--------------|-------------------|
| Premium dark UI with animated neural network | Real-time detection as you type | Confidence ring, risk meter, word signals |

---

## 📊 Model Performance

| Model | Accuracy | F1 Macro | ROC-AUC |
|-------|----------|----------|---------|
| Naive Bayes | 93% | 0.93 | 0.98 |
| Logistic Regression | 98% | 0.98 | 0.99 |
| LightGBM | 98% | 0.98 | 0.99 |
| **DistilBERT (final)** | **99.9%** | **0.9991** | **1.0** |

> Trained on **39,103 articles** from the ISOT Fake News Dataset after deduplication.  
> Best model saved at **epoch 3** with val_f1 = 0.9993.

---

## 🧠 Tech Stack

### Machine Learning
| Tool | Purpose |
|------|---------|
| `DistilBERT` (HuggingFace) | Main classification model — 66M parameters |
| `scikit-learn` | TF-IDF features, Logistic Regression, baseline models |
| `LightGBM` | Gradient boosting baseline |
| `PyTorch` | Model training and inference |
| `NLTK` | Text preprocessing, stopword removal |

### Backend
| Tool | Purpose |
|------|---------|
| `FastAPI` | REST API framework |
| `SQLModel + SQLite` | Prediction history storage |
| `uvicorn` | ASGI server |
| `newspaper3k` | URL article scraping |

### Frontend
| Tool | Purpose |
|------|---------|
| `React 18 + Vite` | UI framework |
| `Framer Motion` | Premium animations |
| `TailwindCSS` | Styling |
| `Recharts` | Probability charts |

### DevOps
| Tool | Purpose |
|------|---------|
| `Docker + Docker Compose` | Containerization |
| `nginx` | Frontend serving + API proxy |
| `pytest` | Backend testing (19 tests) |
| `GitHub` | Version control |

---

## 📁 Project Structure

```
fake-news-detector/
│
├── 📂 api/                      # FastAPI backend
│   ├── main.py                  # App entry point, all routes
│   ├── model.py                 # Model loading + inference
│   ├── schemas.py               # Pydantic request/response models
│   └── database.py              # SQLite via SQLModel
│
├── 📂 models/                   # ML artifacts (not in git — see below)
│   ├── best_model.pt            # Fine-tuned DistilBERT (760MB)
│   ├── tfidf_vectorizer.pkl     # TF-IDF vectorizer
│   ├── meta_scaler.pkl          # Feature scaler
│   ├── model_lr.pkl             # Logistic Regression (for word signals)
│   └── preprocessing.py        # Shared text cleaning module
│
├── 📂 frontend/                 # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx         # Landing page with brain visualization
│   │   │   ├── Detector.jsx     # Main analysis interface
│   │   │   ├── ResultCard.jsx   # Results dashboard
│   │   │   ├── Features.jsx     # Feature cards section
│   │   │   ├── StatsSection.jsx # Animated counters
│   │   │   ├── HowItWorks.jsx   # 3-step timeline
│   │   │   ├── Testimonials.jsx # Auto-scrolling carousel
│   │   │   ├── Navbar.jsx       # Sticky navigation
│   │   │   ├── Footer.jsx       # Links and info
│   │   │   ├── Loader.jsx       # Boot screen animation
│   │   │   ├── AuroraBg.jsx     # Animated background
│   │   │   ├── Particles.jsx    # Interactive particle network
│   │   │   └── NeuralNet.jsx    # Canvas brain visualization
│   │   ├── api/
│   │   │   └── client.js        # Axios API client
│   │   ├── App.jsx              # Root component + routing
│   │   └── index.css            # Global styles + CSS variables
│   └── package.json
│
├── 📂 tests/                    # pytest test suite
│   └── test_api.py              # 19 endpoint tests
│
├── 📂 notebooks/                # Jupyter EDA notebooks (Colab)
│
├── Dockerfile.backend           # Python container
├── Dockerfile.frontend          # Node + nginx container
├── docker-compose.yml           # Orchestration
├── nginx.conf                   # Reverse proxy config
├── requirements.txt             # Python dependencies
└── README.md
```

---

## ⚡ Quick Start

### Option 1 — Docker (Recommended)

The easiest way. Runs the full stack in 2 commands.

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
# 1. Clone the repo
git clone https://github.com/SoumajyotiDhut/fake-news-detector.git
cd fake-news-detector

# 2. Add your trained model files to models/ folder
# (see "Model Files" section below)

# 3. Build and run
docker compose up --build

# 4. Open in browser
# Frontend: http://localhost
# API Docs: http://localhost/api/docs
# Health:   http://localhost/api/health
```

---

### Option 2 — Manual Setup

**Prerequisites:** Python 3.11+, Node.js 20+

#### Backend

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt')"

# Start the API
cd api
uvicorn main:app --reload --port 8000
```

#### Frontend

```bash
# In a new terminal
cd frontend
npm install
npm run dev

# Open http://localhost:5173
```

---

## 📦 Model Files

> ⚠️ The trained model is **not included in this repo** due to GitHub's 100MB file limit.

To get the model files, you have two options:

**Option A — Train it yourself (Google Colab)**

Follow the Day 1–3 notebooks. You'll need a Google account and ~4 hours of free GPU time.

Required files to place in `models/`:
```
models/
├── best_model.pt          (~760MB — DistilBERT checkpoint)
├── tfidf_vectorizer.pkl   (~2MB)
├── meta_scaler.pkl        (~1KB)
├── model_lr.pkl           (~400KB)
└── preprocessing.py       (~2KB)
```

**Option B — Contact the author**

Reach out via GitHub Issues to request a Google Drive link to the pre-trained model files.

---

## 🛠️ API Endpoints

Base URL (local): `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/health` | Model status + total predictions | — |
| `POST` | `/predict` | Predict from text | `{"text": "..."}` |
| `POST` | `/predict-realtime` | Lightweight live prediction | `{"text": "..."}` |
| `POST` | `/predict-url` | Scrape URL and predict | `{"url": "https://..."}` |
| `POST` | `/explain` | Predict + word-level signals | `{"text": "..."}` |
| `GET` | `/history` | Last N predictions | `?limit=20` |
| `GET` | `/stats` | Aggregate statistics | — |

### Example Request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "BREAKING: Government officials caught hiding alien contact from the public for decades!"}'
```

### Example Response

```json
{
  "label": "FAKE",
  "confidence": 0.9987,
  "fake_prob": 0.9987,
  "real_prob": 0.0013,
  "text_preview": "BREAKING: Government officials caught hiding alien contact...",
  "word_count": 14
}
```

---

## 🧪 Running Tests

```bash
cd fake-news-detector

# Run all 19 tests
pytest tests/test_api.py -v

# Expected output
# tests/test_api.py::test_health_returns_200         PASSED
# tests/test_api.py::test_predict_fake_news          PASSED
# tests/test_api.py::test_predict_real_news          PASSED
# tests/test_api.py::test_explain_returns_word_signals PASSED
# ... 19 passed
```

**Test coverage includes:**
- Health endpoint validation
- Fake/Real prediction correctness
- Input validation (too short, too long, empty, missing fields)
- Explain endpoint word signals
- History and stats endpoints
- URL validation

---

## 🗓️ 7-Day Build Log

| Day | Focus | Key Deliverable |
|-----|-------|----------------|
| **Day 1** | Data Collection & EDA | 39K article dataset cleaned, WordClouds, class distribution |
| **Day 2** | NLP Preprocessing | `preprocessing.py` module, TF-IDF features, BERT tokenization |
| **Day 3** | Model Training | DistilBERT fine-tuned — 99.9% accuracy, `best_model.pt` saved |
| **Day 4** | FastAPI Backend | 7 REST endpoints, SQLite history, word explanation |
| **Day 5** | React Frontend | Premium dark UI, Framer Motion, particle animations |
| **Day 6** | Testing & Refinement | 19 pytest tests, real-time analysis, edge case handling |
| **Day 7** | Docker & Deployment | Docker Compose, nginx, GitHub, live deployment |

---

## 🔍 How It Works

```
User Input (text / URL)
        │
        ▼
  Text Preprocessing
  (lowercase, remove URLs,
   special chars, whitespace)
        │
        ▼
  DistilBERT Tokenizer
  (max 512 tokens, truncation)
        │
        ▼
  Fine-tuned DistilBERT
  (66M parameters, 2-class head)
        │
        ▼
  Softmax → Probabilities
  [fake_prob, real_prob]
        │
        ▼
  Verdict + Confidence Score
  + Word Signals (via LR coefficients)
        │
        ▼
  Saved to SQLite → Returned to UI
```

---

## 🎨 Frontend Features

- **Loader Screen** — Matrix rain, spinning neural rings, progress bar on startup
- **Interactive Brain** — Canvas-based neural network that reacts to mouse movement
- **Particle Network** — 100 interconnected nodes with mouse repulsion
- **Real-time Analysis** — Textarea border turns red/green as you type (1.5s debounce)
- **4-Stage Animation** — Scanning → Feature Extraction → ML Model → Verdict
- **Results Dashboard** — Circular progress ring, donut chart, risk gauge, explainability bars
- **Sections** — Features, animated stat counters, How It Works, Testimonials carousel, Footer

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# Fork the repo, then:
git clone https://github.com/YOUR_USERNAME/fake-news-detector.git
cd fake-news-detector
git checkout -b feature/your-feature-name

# Make your changes, then:
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
# Open a Pull Request
```

**Ideas for contributions:**
- Multi-language support
- Browser extension
- Batch URL analysis
- Export predictions to CSV
- LIME/SHAP visual explanations

---

## 📝 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

```
MIT License — free to use, modify, and distribute with attribution.
```

---

## 👤 Author

**Soumajyoti Dhut**

[![GitHub](https://img.shields.io/badge/GitHub-SoumajyotiDhut-181717?style=flat-square&logo=github)](https://github.com/SoumajyotiDhut)

---

## ⭐ Star History

If this project helped you, please give it a ⭐ on GitHub — it helps others find it!

---

<div align="center">

**Built with ❤️ in 7 days**

*From raw CSV data → trained model → REST API → premium UI → Docker → GitHub*

</div>