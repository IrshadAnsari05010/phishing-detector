import sys
import requests

API_URL = "http://127.0.0.1:5000/predict"

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python cli.py \"email text here\"")
        sys.exit(1)

    text = " ".join(sys.argv[1:])

    response = requests.post(
        API_URL,
        json={"text": text}
    )

    if response.status_code != 200:
        print("Error:", response.text)
        sys.exit(1)

    print(response.json())

if __name__ == "__main__":
    main()
