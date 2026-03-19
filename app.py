from flask import Flask, render_template, request, jsonify
import pandas as pd
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load dataset
data = pd.read_csv("disaster_dataset_50.csv")

# Combine disaster type and document
data["content"] = data["disaster_type"] + " " + data["document"]

# Text preprocessing function
def preprocess(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text

data["content"] = data["content"].apply(preprocess)

# TF-IDF with bigrams for better matching
vectorizer = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1,2),      # captures phrases like "earthquake safety"
    max_df=0.9,
    min_df=1
)

tfidf_matrix = vectorizer.fit_transform(data["content"])


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/search", methods=["POST"])
def search():

    query = request.json["query"]

    # preprocess query
    query = preprocess(query)

    query_vector = vectorizer.transform([query])

    similarity = cosine_similarity(query_vector, tfidf_matrix).flatten()

    # get top ranked indexes
    ranked_indexes = similarity.argsort()[::-1]

    results = []

    for i in ranked_indexes[:3]:

        results.append({
            "disasterType": data.iloc[i]["disaster_type"],
            "information": data.iloc[i]["document"],
        })

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)