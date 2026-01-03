import os
import torch
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# ------------------------
# Basic Flask setup
# ------------------------
app = Flask(__name__)

# ------------------------
# Simple manual CORS (NO flask-cors needed)
# ------------------------
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

# ------------------------
# Load ML model
# ------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(
    BASE_DIR, "..", "..", "training", "model", "distilbert_phishing"
)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print("🔄 Loading phishing detection model...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.to(DEVICE)
model.eval()
print("✅ Model loaded")

# ------------------------
# Health check
# ------------------------
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "Phishing Detection API is running"})

# ------------------------
# Prediction endpoint
# ------------------------
@app.route("/api/predict", methods=["POST", "OPTIONS"])
def predict():
    # Handle CORS preflight
    if request.method == "OPTIONS":
        return jsonify({}), 200

    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data["text"]

    # Tokenize input
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    )
    inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

    # Inference
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)
        confidence, predicted_class = torch.max(probs, dim=1)

    label = "phishing" if predicted_class.item() == 1 else "legitimate"

    return jsonify({
        "label": label,
        "confidence": round(confidence.item(), 4)
    })

# ------------------------
# Run server
# ------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
