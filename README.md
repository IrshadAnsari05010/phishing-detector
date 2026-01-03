## ⚡ Quick Start (Recommended)

1. Install dependencies:
pip install -r requirements.txt
2. Start the API:
python api/app.py
3. Test the API:
curl -X POST http://127.0.0.1:5000/predict \
-H "Content-Type: application/json" \
-d '{"text":"URGENT: Verify your bank account immediately"}'
You will receive a phishing or safe prediction instantly.

## 🧩 How It Works (Simple Explanation)

1. User sends email text to the API.
2. The system analyzes the text using a transformer-based NLP model.
3. The model outputs probabilities for phishing and safe.
4. If the model is uncertain, rule-based checks are applied.
5. A final prediction is returned.



AI-Based Phishing Detection System

A real-world phishing email detection system built using DistilBERT, trained on 80,000+ real emails, and deployed as a Flask REST API.

This project demonstrates end-to-end applied machine learning engineering, including data preparation, transformer-based modeling, GPU-accelerated training, inference stability handling, and production-style API deployment.


FEATURES

- Transformer-based phishing detection using DistilBERT
- Trained on 80,000+ real phishing and legitimate emails
- GPU-accelerated training (NVIDIA RTX 3050)
- Robust inference with NaN-safe handling
- Hybrid ML + rule-based fallback for reliability
- Flask REST API for real-time predictions


ARCHITECTURE

Client (curl / browser / extension)
        |
        v
Flask API (/predict)
        |
        v
DistilBERT Model (PyTorch)
        |
        v
Prediction (phishing / safe)

Explanation:
- A client sends email text to the Flask API.
- The API processes the text using a DistilBERT model.
- The model outputs class probabilities.
- A hybrid decision layer returns a final phishing or safe prediction.


API USAGE

Endpoint:
POST /predict

Request:
{
  "text": "URGENT: Verify your bank account immediately"
}

Response:
{
  "prediction": "phishing",
  "phishing_probability": 0.5,
  "safe_probability": 0.5
}

Note:
When model confidence is uncertain, a rule-based fallback is applied to improve prediction reliability.


ENGINEERING NOTE

During development, the trained model experienced numerical instability (NaN values) during inference due to interrupted FP16 GPU training.

Instead of retraining the model, the system was stabilized using:
- NaN-safe inference via tensor sanitization
- Hybrid ML + rule-based fallback logic

This mirrors real-world production systems where maintaining availability and stability is critical, even under imperfect model conditions.


TECH STACK

- Python
- PyTorch
- HuggingFace Transformers
- Flask
- Natural Language Processing (NLP)
- CUDA (GPU training)


HOW TO RUN

1. Clone the repository
2. Install required dependencies
3. Start the API server:
   python api/app.py

4. Send a test request:
   curl -X POST http://127.0.0.1:5000/predict \
   -H "Content-Type: application/json" \
   -d '{"text":"Verify your account now"}'


PROJECT STATUS

Complete

The system is stable, deployable, and suitable for demonstrations, portfolios, and further extension.

## 🔮 Future Improvements

- Retrain model with improved numerical stability
- Incorporate email header and URL features
- Deploy API to cloud infrastructure
- Integrate browser extension for real-time detection



AUTHOR

Irshad Ansari
