import pandas as pd

def prepare_file(path, label):
    df = pd.read_csv(path)

    # Combine subject + body if both exist
    if "subject" in df.columns and "body" in df.columns:
        df["text"] = df["subject"].fillna("") + " " + df["body"].fillna("")
    elif "body" in df.columns:
        df["text"] = df["body"].fillna("")
    else:
        raise ValueError(f"No usable text column in {path}")

    df = df[["text"]]
    df["label"] = label
    return df


# ✅ Legitimate emails
enron = prepare_file("../archive/Enron.csv", 0)
spamassassin = prepare_file("../archive/SpamAssasin.csv", 0)

# 🚨 Phishing emails
nazario = prepare_file("../archive/Nazario.csv", 1)
nigerian = prepare_file("../archive/Nigerian_Fraud.csv", 1)
ling = prepare_file("../archive/Ling.csv", 1)
ceas = prepare_file("../archive/CEAS_08.csv", 1)

# 🔗 Combine all datasets
final_df = pd.concat(
    [enron, spamassassin, nazario, nigerian, ling, ceas],
    ignore_index=True
)

# 🧹 Clean
final_df["text"] = final_df["text"].astype(str)
final_df = final_df.dropna()
final_df = final_df.sample(frac=1).reset_index(drop=True)

# 💾 Save final dataset
final_df.to_csv("phishing_emails.csv", index=False)

print("✅ Dataset created successfully!")
print("Dataset size:", final_df.shape)
