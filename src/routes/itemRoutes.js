const express = require('express');
const router = express.Router();
const Item = require('../models/item'); 

// Add new item
router.post('/', async (req, res) => {
    const newItem = new Item(req.body);
    try {
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Get all items like a catalogue, with sorting
router.get('/', async (req, res) => {
    const pageSize = 8; // Number of items per page
    const page = parseInt(req.query.page) || 1; // Current page number
    const sort = req.query.sort; // Sorting parameter

    let sortOptions = {};
    if (sort === 'asc') {
        sortOptions.price = 1; // Ascending by price
    } else if (sort === 'desc') {
        sortOptions.price = -1; // Descending by price
    } // No sort option leads to default

    try {
        const items = await Item.find()
                                .sort(sortOptions)
                                .skip((page - 1) * pageSize)
                                .limit(pageSize);
        const totalItems = await Item.countDocuments();
        res.json({
            items: items,
            currentPage: page,
            totalPages: Math.ceil(totalItems / pageSize),
            totalItems: totalItems
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve items", error: err.message });
    }
});

// Search items by name
router.get('/search', async (req, res) => {
    const query = req.query.name; // Get the search term from query parameters
    try {
        const items = await Item.find({ name: new RegExp(query, 'i') }); // Case-insensitive search
        res.json(items);
    } catch (err) {
        console.error('Error during search:', err);
        res.status(500).json({ message: "Failed to retrieve items", error: err.message });
    }
});

// Update an item
router.put('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an item
router.delete('/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
