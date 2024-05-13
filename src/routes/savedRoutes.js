// Assuming Express and Mongoose are already set up
const express = require('express');
const router = express.Router();
const SavedItem = require('../models/savedItem');  

// Route to save an item to the saveditems collection
router.post('/save', async (req, res) => {
    const { itemId } = req.body;
    try {
        const savedItem = await SavedItem.findOneAndUpdate(
            {},
            { $addToSet: { items: itemId } },
            { new: true, upsert: true }
        );
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// To unsave an item from the saveditems collection
router.post('/unsave', async (req, res) => {
    const { itemId } = req.body;
    try {
        const savedItem = await SavedItem.findOneAndUpdate(
            {},
            { $pull: { items: itemId } },
            { new: true }
        );
        res.status(200).json(savedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// To retrieve the saved items from the saveditems collection
router.get('/saved', async (req, res) => {
    try {
        const savedItems = await SavedItem.findOne({}).populate('items');
        if (!savedItems) {
            return res.status(404).json({ message: 'No saved items found.' });
        }
        res.json(savedItems.items);
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.error('Error retrieving saved items:', err);
    }
});

module.exports = router;
