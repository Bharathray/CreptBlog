const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload'); //To upload image file
const session = require('express-session');  //To handle user sessions(store data for a specific user.) eg: a cart items are specific to a user.So, separate user data. Another eg: whether a user is in the logged in state 
const flash = require('connect-flash');  //To display flash(pop up) messages

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);


app.use(session({
  secret: 'WritingBlogSecretSession',  //To protect session data we need to encrypt with this key
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/articleRoutes.js')
app.use('/', routes);

app.listen(port, ()=> console.log(`Listening to port ${port}`));