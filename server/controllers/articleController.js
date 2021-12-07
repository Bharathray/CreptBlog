// href="/submit-article" to submit the articles.

require('../models/dbConnection');
const Category = require('../models/Category');
const Article = require('../models/Article');
 

//To display the home page
exports.homepage = async(req, res) => {
 
  try {
    const limitNumber = 3;
    const categories = await Category.find({}).limit(5);
    const latest = await Article.find({}).sort({_id: -1}).limit(limitNumber);  //Sort by id in the descending order.positive one represents the ascending order, while the negative one represents the descending order.
    const JEE = await Article.find({ 'category': 'JEE' }).limit(limitNumber);
    const WebDev = await Article.find({ 'category': 'WebDev' }).limit(limitNumber);
    const Marketing = await Article.find({ 'category': 'Marketing' }).limit(limitNumber);

    const blog = { latest, JEE, WebDev, Marketing }; //So, we can send all the categories in a group rather than individual.

    res.render('home', { title: 'Crept Blog - Home', categories, blog } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}


exports.about = async(req, res) => {
try{
 res.render('about');
}
catch(error){
  res.status(500).send({message:error||"Error occured"});
}
}


exports.contact= async(req, res) => {
try{
  res.render('contact');
}
  catch(error){
    res.status(500).send({message:error||"Error occured"});
  }
 }
 

exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 4;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Writing Blog - Categories', categories } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 
  

/**
 * GET /categories/:id  id-> handles category(app,web dev ) requests.
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Article.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Writing Blog - Categories', categoryById } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /Article/:id     id->handles article id(a article in web or app dev) requests.
 * Article 
*/
exports.exploreArticle = async(req, res) => {
  try {
    let articleId = req.params.id;
    const article = await Article.findById(articleId);
    res.render('article', { title: 'Writing Blog - Article', article } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * POST /search
 * Search 
*/
exports.searchArticle = async(req, res) => {
  //For this ,reason we had compound text index
  try {
    let searchTerm = req.body.searchTerm;
   // $text performs a text search on the content of the fields indexed with a text index.
  // In the $search field, specify a string of words that the $text operator parses and uses to query the document
   //By default,mongodb does not distinguish between characters that contain diacritical marks and their non-marked counterpart, such as é, ê, and e.So, make it true.
    let article = await Article.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Writing Blog - Search', article } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const article = await Article.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Writing Blog - Explore Latest', article } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


 
/**
 * GET /explore-random
 * Explore Random as JSON
*/

exports.exploreRandom = async(req, res) => {
  try {
    let count = await Article.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    //query all the matching records but just get one. This is what findOne() does without any criteria given.Use skip() to "skip" to the desired match and return that.
    //exec() returns a promise which u can it with then() method.
    let article = await Article.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Writing Blog - Explore Latest', article } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-Article
 * Submit Article
*/
exports.submitArticle = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors'); // req.flash to display a popup message
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-Article', { title: 'Writing Blog - Submit Article', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-Article
 * Submit Article
*/ 
exports.submitArticleOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/img/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })

    }

    const newArticle = new Article({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      contents: req.body.contents,
      category: req.body.category,
      image: newImageName
    });
    
    await newArticle.save();

    req.flash('infoSubmit', 'Article has been added.')
    res.redirect('/submit-Article');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-Article');
  }
}




// Delete Article
// async function deleteArticle(){
//   try {
//     await Article.deleteOne({ name: 'New Article From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteArticle();


// Update Article
// async function updateArticle(){
//   try {
//     const res = await Article.updateOne({ name: 'New Article' }, { name: 'New Article Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateArticle();


/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "JEE",
//         "image": "JEE-blog.jpg"
//       },
//       {
//         "name": "webdev",
//         "image": "webdev-blog.jpg"
//       }, 
//       {
//         "name": "Marketing",
//         "image": "Marketing-blog.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-blog.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-blog.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-blog.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


// async function insertDymmyArticleData(){
//   try {
//     await Article.insertMany([
//       { 
//         "name": "Article Name Goes Here",
//         "description": `Article Description Goes Here`,
//         "email": "Articleemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "webdev", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "Article Name Goes Here",
//         "description": `Article Description Goes Here`,
//         "email": "Articleemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "webdev", 
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyArticleData();

