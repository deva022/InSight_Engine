const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const SearchEngine = require('../utils/SearchEngin');

const searchEngine = new SearchEngine();

// Initialize search engine with existing documents
const initializeSearchEngine = async () => {
    const documents = await Document.find({});
    documents.forEach(doc => searchEngine.addDocument(doc));
};
initializeSearchEngine();

// Search endpoint
router.get('/', async (req, res) => {
    try {
        const { q, fuzzyThreshold = 2, prefixBoost = 1.5 } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        const results = searchEngine.search(q, {
            fuzzyThreshold: parseInt(fuzzyThreshold),
            prefixBoost: parseFloat(prefixBoost)
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add document endpoint
router.post('/', async (req, res) => {
    try {
        const document = new Document(req.body);
        await document.save();
        searchEngine.addDocument(document);
        res.status(201).json(document);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;