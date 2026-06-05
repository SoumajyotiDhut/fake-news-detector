import os
import urllib.request

HF_REPO = os.environ.get("HF_REPO", "YOUR_HF_USERNAME/fake-news-detector-distilbert")
MODEL_DIR = os.environ.get("MODEL_DIR", "/app/models")

FILES = [
    "best_model.pt",
    "tfidf_vectorizer.pkl",
    "meta_scaler.pkl",
    "model_lr.pkl",
    "preprocessing.py",
]

BASE_URL = f"https://huggingface.co/{HF_REPO}/resolve/main"

def download_models():
    os.makedirs(MODEL_DIR, exist_ok=True)

    for filename in FILES:
        dest = os.path.join(MODEL_DIR, filename)
        if os.path.exists(dest):
            print(f"✓ {filename} already exists, skipping")
            continue

        url = f"{BASE_URL}/{filename}"
        print(f"Downloading {filename} from HuggingFace...")
        try:
            urllib.request.urlretrieve(url, dest)
            size_mb = os.path.getsize(dest) / (1024 * 1024)
            print(f"✓ {filename} downloaded ({size_mb:.1f} MB)")
        except Exception as e:
            print(f"✗ Failed to download {filename}: {e}")
            raise

if __name__ == "__main__":
    download_models()
    print("All model files ready.")