const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./models/post');
const postRoutes = require('./routes/posts')
const path = require('path');

//Connect to MongoDB cloud
mongoose.connect('mongodb+srv://User:Password01@cluster0-83jxn.mongodb.net/finalProject?retryWrites=true&w=majority',
 { useNewUrlParser: true, useUnifiedTopology: true })

 .then(()=>{
   console.log('Connected to Database');
 })
 .catch((error)=>{
  console.log(error);
 })

 app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/api/myRecipes',postRoutes);

module.exports = app;
