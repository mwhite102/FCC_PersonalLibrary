/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
  title: String,
  comments: [String]
});

// Supress deprecation warning in moongoose for useFindAndModify
mongoose.set('useFindAndModify', false);

var BookModel = mongoose.model('BookModel', bookSchema);

const MONGODB_CONNECTION_STRING = process.env.DB;

//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

mongoose.connect(process.env.DB, {useNewUrlParser: true}, () => {
  console.log('Connected to database');
});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BookModel.find({}).then(books => {
        var result = [];
        books.forEach(book => {
          result.push(
            {
              _id: book._id,
              title: book.title,
              commentcount: book.comments.length
            });
        });
        res.json(result);
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if (title) {
        //response will contain new book object including atleast _id and title
      const data = {
        title : title,
        comments: []
      }
      BookModel.create(data).then(book => {
        res.json(book);
      });
      } else {
        res.send('Please send a book title');
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      BookModel.deleteMany({}, function (err) {
        res.send('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookModel.findById(bookid, function(err, data) {
        if (err) {
          res.send('no book exists');
        }
        else {
          res.json(data);
        }
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      BookModel.findOneAndUpdate({_id: bookid}, { $push: {comments: comment}}, function(err, data){
        res.json(data);
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      BookModel.deleteOne({_id: bookid}, function(err){
        res.send('delete successful');
      });
    });
  
};
