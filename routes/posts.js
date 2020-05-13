const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/post')
const multer = require('multer');
const router = express.Router();
const MIME_TYPES = {
  'image/png' : 'png',
  'image/jpg' : 'jpg',
  'image/jpeg' : 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    const isValid = MIME_TYPES[file.mimetype];
    let error = new Error('Invalid Image');
    if(isValid){
      error = null;
    }
    cb(error, "images");
   },
   filename: (req, file, cb)=> {
     const name = file.originalname.toLowerCase().split(' ').join('-');
     const ext = MIME_TYPES[file.mimetype];
     cb(null, name + '-' + Date.now() + '.' + ext);
   }
})

//Get Posts from Database
router.get('',(req, res, next) => {
  Post.find()
  .then((posts) => {
    res.status(200).json({
      message: 'Posts Fetched successfully',
      posts: posts
    })
  })
  .catch((err)=>{
    res.status(500).json({error:err});
  })
})


//Add a post to database
router.post('', multer({storage:storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    intro: req.body.intro,
    recipe: req.body.recipe,
    date: new Date(),
    likes: 0,
  })
  if (req.file) {
    post.image = url + '/images/' + req.file.filename
  } else {
    post.image = url + '/images/no-image-available.png'
  }

  post.save()
  .then((post)=>{
    res.status(201).json({
      message: 'Post Added Successfully',
      post: post
      })
  })
  .catch((err)=>{
    res.status(500).json({error:err});
  })
})


//Delete a post from database
router.delete('/:postid', (req, res, next) => {
  Post.deleteOne({_id:req.params.postid})
  .then(() => {
    res.status(200).json({message:'Post deleted successfully'})
  })
  .catch((err)=>{
    res.status(500).json({error:err});
  })
})


//Get a specific post
router.get('/:postid', (req, res, next) => {
  Post.findById({_id:req.params.postid})
  .then((post) => {
    res.status(200).json(post);
  })
  .catch((err)=>{
    res.status(500).json({error:err});
  })
})


//Edit
router.put('/:postid', multer({storage:storage}).single("image"), (req, res, next) => {
  //Json send data
  const post = new Post({
    _id: req.body._id,
    title: req.body.title,
    intro: req.body.intro,
    recipe: req.body.recipe,
    date: new Date(),
    likes: req.body.likes,
    comments: req.body.comments
  })

  //sending file
  if(req.file) {
    Post.find({_id:req.params.postid}).then((postData) => {
      post.comments = postData.comments;
      post.likes = postData.likes;

      //update image
      const url = req.protocol + '://' +req.get('host');
      post.image = url + '/images/' + req.file.filename
      Post.updateOne({_id:req.params.postid}, post).then(result => {
        res.status(200).json({message:'Post updated successfully', post:result})
      })
    })
  }
  //send Json data
  else {
    Post.updateOne({_id:req.params.postid}, post)
    .then((post) => {
      res.status(200).json({message:'Post updated successfully', post:post})
    })
    .catch((err)=>{
      res.status(500).json({error:err});
    })
  }
})


module.exports = router;
