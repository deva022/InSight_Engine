class TrieNode {
  constructor() {
      this.children = new Map();
      this.isEndOfWord = false;
      this.documentIds = new Set();
  }
}

class Trie {
  constructor() {
      this.root = new TrieNode();
  }

  insert(word, documentId) {
      let node = this.root;
      for (let char of word.toLowerCase()) {
          if (!node.children.has(char)) {
              node.children.set(char, new TrieNode());
          }
          node = node.children.get(char);
      }
      node.isEndOfWord = true;
      node.documentIds.add(documentId);
  }

  search(prefix) {
      let node = this.root;
      for (let char of prefix.toLowerCase()) {
          if (!node.children.has(char)) {
              return new Set();
          }
          node = node.children.get(char);
      }
      return this.collectAllDocuments(node);
  }

  collectAllDocuments(node) {
      let documents = new Set();
      if (node.isEndOfWord) {
          node.documentIds.forEach(id => documents.add(id));
      }
      for (let child of node.children.values()) {
          const childDocs = this.collectAllDocuments(child);
          childDocs.forEach(id => documents.add(id));
      }
      return documents;
  }
}

module.exports = Trie;
