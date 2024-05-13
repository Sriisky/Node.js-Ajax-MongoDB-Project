const mongoose = require('mongoose');

// Define the item schema
const itemSchema = new mongoose.Schema({
    sku: Number,
    name: String,
    type: String,
    price: Number,
    upc: String,
    category: [{
        id: String,
        name: String
    }],
    shipping: Number,
    description: String,
    manufacturer: String,
    model: String,
    url: String,
    image: { type: String, default: '' }
});

// Index on the price field to optimize search and sorting operations involving the price
itemSchema.index({ price: 1 }); 

const Item = mongoose.model('Item', itemSchema); // Model based on the item schema

// Exporting the model to be used in other parts of the application
module.exports = Item;
