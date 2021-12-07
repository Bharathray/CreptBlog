//To make schema of all categories availabe.
//To do with the category page and display the image for category
const mongoose = require('mongoose');
 
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
});

module.exports = mongoose.model('Category', categorySchema);