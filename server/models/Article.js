const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  email: {
    type: String,
    required: 'This field is required.'
  },
  contents: {
    type: String,
    required: 'This field is required.'
  },
  category: {
    type: String,
    enum: ['Marketing', 'JEE', 'WebDev', 'AppDev', 'Career'],
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  }, 
});

//Index: Default index is _id.
//An index is a performance optimisation feature that enables data to be accessed faster.
// Without indexes, MongoDB must perform a collection scan(scan all the documents)
//Here,we use compound index
//Compound index : A single index structure holds references to multiple fields within a collection’s documents. 
//When you create a compound index, 1 Index will hold multiple fields.
// To index a field that contains a string ,include the field and specify the string literal "text" in the index document.
articleSchema.index({ name: 'text', description: 'text' });  
//We have a search bar.In it ,if we want to search then we don't want to search by id(Users don't type id!!).They type text.So, in mongodb also ,we need to search through the documents by text in name and description.If any matches,we can show it. 

module.exports = mongoose.model('Article', articleSchema);