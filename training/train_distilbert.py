import pandas as pd
import torch
print("CUDA available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("Using GPU:", torch.cuda.get_device_name(0))

from datasets import Dataset
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    Trainer,
    TrainingArguments
)

# Load dataset
df = pd.read_csv("../data/phishing_emails.csv")

# Convert to HuggingFace Dataset
dataset = Dataset.from_pandas(df)

# Train-test split
dataset = dataset.train_test_split(test_size=0.2)

tokenizer = DistilBertTokenizerFast.from_pretrained(
    "distilbert-base-uncased"
)

def tokenize(batch):
    return tokenizer(
        batch["text"],
        truncation=True,
        padding="max_length",
        max_length=128
    )

dataset = dataset.map(tokenize, batched=True)
dataset = dataset.rename_column("label", "labels")
dataset.set_format("torch", columns=["input_ids", "attention_mask", "labels"])

model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=2
)

training_args = TrainingArguments(
    output_dir="./model",

    # 🔥 Laptop-safe batch
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    gradient_accumulation_steps=2,

    # ⏱️ Train in short, safe runs
    num_train_epochs=1,

    # 🎯 Optimizer
    learning_rate=2e-5,

    # 🚀 Performance
    dataloader_num_workers=0,

    # 📊 Logging
    logging_steps=100,

    # 💾 CHECKPOINTS (IMPORTANT)
    save_strategy="steps",      # save by steps
    save_steps=1000,            # every 1000 steps (~12–15 min)
    save_total_limit=3,         # keep only last 3 checkpoints

    report_to="none"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"]
)

trainer.train()

# Save model
model.save_pretrained("model/distilbert_phishing")
tokenizer.save_pretrained("model/distilbert_phishing")

print("✅ DistilBERT training completed!")
