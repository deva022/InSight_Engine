# Advanced Search Engine

A comprehensive search engine that leverages advanced techniques like TF-IDF scoring, prefix search, and fuzzy matching to provide highly relevant and personalized search results.

## Key Features

- **TF-IDF Scoring**: Utilizes term frequency-inverse document frequency (TF-IDF) to rank search results by relevance.
- **Prefix Search**: Supports prefix-based search for fast, responsive lookups.
- **Fuzzy Matching**: Implements Levenshtein distance to handle typos and misspellings.
- **Efficient Indexing**: Employs a Trie data structure to index terms and documents for quick retrieval.
- **Real-time Updates**: Automatically indexes new documents as they are added to the database.

## Demo

![Search Engine Demo](https://github.com/deva022/InSight_Engine/blob/main/backend/Screenshot%202024-11-07%20172920.png)


## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (v4.4.0 or higher)

### Installation

1. Clone the repository:
```
git clone https://github.com/deva022/InSight_Engine.git
```
2. Install dependencies:
```
cd advanced-search-engine
cd backend
npm install
cd ../frontend
npm install
```
3. Set up the database:

- Ensure MongoDB is running locally or remotely.
- Create a new database named `searchengine` in MongoDB Compass or the MongoDB shell.
- Create a new collection named `documents` in the `searchengine` database.

4. Start the application:

# In one terminal window
```
cd backend
node server.js
```
# In another terminal window
```
cd frontend
npm start
```
5. Open your web browser and navigate to `http://localhost:3000` to access the search engine.

## Usage

1. Enter a search query in the search bar.
2. The search engine will display the most relevant results based on TF-IDF scoring, prefix matching, and fuzzy matching.
3. You can adjust the `fuzzyThreshold` and `prefixBoost` parameters in the search query to fine-tune the search results.
4. To add a new document to the search index, send a POST request to the `/api/search` endpoint with the document data.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

