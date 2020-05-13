const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    title: {type:String, required: true},
    intro: {type:String, required: true},
    recipe: {type:String, required: true},
    likes: {type:Number, default:0},
    date: Date,
    comments: [String],
    image: String
  }
);

module.exports = mongoose.model('Post', PostSchema);
