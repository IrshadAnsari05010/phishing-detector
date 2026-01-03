from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
import torch

MODEL_PATH = "./model/distilbert_phishing"

tokenizer = DistilBertTokenizerFast.from_pretrained(MODEL_PATH)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)

model.eval()

texts = [
    "Your account has been compromised. Click here to verify immediately.",
    "Hi John, the meeting is scheduled for tomorrow at 10am."
]

inputs = tokenizer(texts, return_tensors="pt", padding=True, truncation=True)

with torch.no_grad():
    outputs = model(**inputs)
    predictions = torch.argmax(outputs.logits, dim=1)

for text, pred in zip(texts, predictions):
    print(f"{text}\n→ {'PHISHING' if pred.item() == 1 else 'SAFE'}\n")
