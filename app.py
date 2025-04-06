from google import genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("API_KEY"))

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    query = request.args.get("query")

    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=f"Do not give answer more than the url. Create a github api url to fetch repo, limit to 10 query per page, limit the result to only coded program, add multiple query describing this same topic: '{query}'"
    )
    text = (str(response.text)).strip('`').strip()
    print(text)
    
    data = {
        "url": text
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)