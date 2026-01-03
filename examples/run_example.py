import requests

url = "http://127.0.0.1:5000/predict"

data = {
    "text": "URGENT: Verify your bank account immediately"
}

response = requests.post(url, json=data)

print("Response:")
print(response.json())
