const mongoose = require('mongoose');

// Defining the schema for saved items
const savedItemSchema = new mongoose.Schema({
    items: [{ 
        type: mongoose.Schema.Types.ObjectId, // Define the type as ObjectId to reference another document
        ref: 'Item' // Explicitly specifying the item collection that objectID refers to
    }] 
}, { 
    collection: 'saveditems' // COllection to use for this model
});  

const SavedItem = mongoose.model('SavedItem', savedItemSchema); // Create a model from the schema

module.exports = SavedItem;
