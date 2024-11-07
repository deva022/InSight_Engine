const Trie = require('./Trie');

class SearchEngine {
  constructor() {
      this.documents = new Map(); // documentId -> document
      this.invertedIndex = new Map(); // term -> {documentId -> frequency}
      this.documentVectors = new Map(); // documentId -> TF-IDF vector
      this.trie = new Trie();
      this.documentCount = 0;
  }

  // Calculate Levenshtein distance for fuzzy search
  levenshteinDistance(str1, str2) {
      const m = str1.length;
      const n = str2.length;
      const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;

      for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
              if (str1[i - 1] === str2[j - 1]) {
                  dp[i][j] = dp[i - 1][j - 1];
              } else {
                  dp[i][j] = Math.min(
                      dp[i - 1][j - 1], // substitution
                      dp[i - 1][j],     // deletion
                      dp[i][j - 1]      // insertion
                  ) + 1;
              }
          }
      }
      return dp[m][n];
  }

  // Preprocess and index a document
  addDocument(document) {
      this.documentCount++;
      this.documents.set(document._id.toString(), document);
      
      // Tokenize content
      const terms = document.content.toLowerCase()
          .split(/[\s.,!?;:()\[\]{}"']+/)
          .filter(term => term.length > 0);

      // Build inverted index and add to trie
      const termFrequencies = new Map();
      terms.forEach(term => {
          // Update term frequencies
          termFrequencies.set(term, (termFrequencies.get(term) || 0) + 1);
          
          // Update inverted index
          if (!this.invertedIndex.has(term)) {
              this.invertedIndex.set(term, new Map());
          }
          this.invertedIndex.get(term).set(document._id.toString(), 
              (this.invertedIndex.get(term).get(document._id.toString()) || 0) + 1);
          
          // Add to trie for prefix search
          this.trie.insert(term, document._id.toString());
      });

      // Calculate TF-IDF vector
      const vector = new Map();
      termFrequencies.forEach((freq, term) => {
          const tf = freq / terms.length;
          const df = this.invertedIndex.get(term).size;
          const idf = Math.log(this.documentCount / df);
          vector.set(term, tf * idf);
      });
      this.documentVectors.set(document._id.toString(), vector);
  }

  // Calculate cosine similarity between query and document
  cosineSimilarity(queryVector, documentVector) {
      let dotProduct = 0;
      let queryMagnitude = 0;
      let documentMagnitude = 0;

      queryVector.forEach((queryWeight, term) => {
          if (documentVector.has(term)) {
              dotProduct += queryWeight * documentVector.get(term);
          }
          queryMagnitude += queryWeight * queryWeight;
      });

      documentVector.forEach(weight => {
          documentMagnitude += weight * weight;
      });

      if (queryMagnitude === 0 || documentMagnitude === 0) return 0;
      return dotProduct / (Math.sqrt(queryMagnitude) * Math.sqrt(documentMagnitude));
  }

  // Perform search with multiple strategies
  search(query, options = { fuzzyThreshold: 2, prefixBoost: 1.5 }) {
      const queryTerms = query.toLowerCase().split(/\s+/);
      const scores = new Map();
      
      // TF-IDF scoring
      const queryVector = new Map();
      queryTerms.forEach(term => {
          if (this.invertedIndex.has(term)) {
              const df = this.invertedIndex.get(term).size;
              const idf = Math.log(this.documentCount / df);
              queryVector.set(term, idf);
          }
      });

      this.documentVectors.forEach((docVector, docId) => {
          const similarity = this.cosineSimilarity(queryVector, docVector);
          scores.set(docId, similarity);
      });

      // Prefix matching
      queryTerms.forEach(term => {
          const prefixMatches = this.trie.search(term);
          prefixMatches.forEach(docId => {
              scores.set(docId, (scores.get(docId) || 0) + options.prefixBoost);
          });
      });

      // Fuzzy matching
      this.invertedIndex.forEach((docs, indexTerm) => {
          queryTerms.forEach(queryTerm => {
              if (this.levenshteinDistance(queryTerm, indexTerm) <= options.fuzzyThreshold) {
                  docs.forEach((_, docId) => {
                      scores.set(docId, (scores.get(docId) || 0) + 0.5);
                  });
              }
          });
      });

      // Sort and return results
      return Array.from(scores.entries())
          .filter(([_, score]) => score > 0)
          .sort(([, a], [, b]) => b - a)
          .map(([docId]) => this.documents.get(docId));
  }
}

module.exports = SearchEngine;