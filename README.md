# AI-Based Phishing Detection System 🔐

An AI-powered cybersecurity project designed to detect phishing attacks using Natural Language Processing (NLP) and a Transformer-based deep learning model. This system classifies suspicious text (emails or messages) as **Phishing** or **Legitimate**, helping mitigate social-engineering threats.

---

## 📌 Problem Statement

Phishing is one of the most common cybersecurity threats, where attackers use deceptive messages to trick users into revealing sensitive information. Traditional rule-based detection systems often fail to detect sophisticated phishing attacks that mimic legitimate communication.

---

## 💡 Solution Overview

This project implements an **AI-driven phishing detection system** using a fine-tuned **DistilBERT** model. The system analyzes textual content and predicts whether it is phishing or legitimate, along with a confidence score. A web-based interface allows users to test messages in real time.

---

## 🏗️ System Architecture

User (Web UI)
↓
React Frontend (Vite + Tailwind)
↓
Flask REST API
↓
DistilBERT NLP Model
↓
Prediction Result (Label + Confidence)

yaml
Copy code

---

## 🔐 Cybersecurity Focus

- Detects **social engineering and phishing attacks**
- Uses **AI/NLP** for intelligent threat detection
- Implements **secure API communication**
- Designed following **secure software development practices**

---

## 🧠 Machine Learning Model

- **Model:** DistilBERT (fine-tuned)
- **Type:** Transformer-based NLP classification model
- **Framework:** PyTorch
- **Task:** Binary classification (Phishing / Legitimate)
- **Output:** Prediction label with confidence score

---

## 🌐 Web Application

- **Frontend:** React (Builder.io), Vite, Tailwind CSS
- **Backend:** Flask REST API
- **Features:**
  - Text input for analysis
  - Real-time phishing prediction
  - Confidence score display

---

## 🛠️ Tech Stack

**Cybersecurity & AI:**
- Phishing Detection
- NLP (Natural Language Processing)
- Transformer Models (DistilBERT)

**Backend:**
- Python
- Flask
- REST APIs

**Frontend:**
- React
- Vite
- Tailwind CSS

**Tools & Platforms:**
- Git
- GitHub

---

## 🚀 How to Run the Project Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/IrshadAnsari05010/phishing-detector.git
cd phishing-detector
2️⃣ Run Backend (Flask API)
bash
Copy code
cd backend/api
pip install -r ../requirements.txt
python app.py
Backend will start at:

arduino
Copy code
http://localhost:8000
3️⃣ Run Frontend (React App)
bash
Copy code
cd frontend
npm install
npm run dev
Frontend will start at:

arduino
Copy code
http://localhost:8080
🧪 Testing
API tested using browser, curl, and Postman

Frontend-backend communication verified via browser network inspection

Model predictions tested using real phishing samples

⚠️ Dataset Notice
Due to GitHub file size limitations, datasets are not included in this repository.

Public datasets used for training and testing include:

Enron Spam Dataset

CEAS 2008 Dataset

Nazario Phishing Corpus

📈 Future Enhancements
URL-based phishing detection

Email header and attachment analysis

Integration with SOC/SIEM systems

Improved model explainability

🎓 Academic Context
This project was developed as part of academic coursework in Cybersecurity, focusing on real-world threat detection using Artificial Intelligence.

👨‍💻 Author
Irshad Ansari
Cybersecurity Undergraduate
📍 Ahmedabad, India

🔗 GitHub: https://github.com/IrshadAnsari05010
