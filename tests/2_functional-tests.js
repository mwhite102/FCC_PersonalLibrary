/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
 /*
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  */
  /*
  * ----[END of EXAMPLE TEST]----
  */

  // variable for holding a valid _id value
  var _id;

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Moby Dick'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.property(res.body, '_id', 'Books in array should contain _id');
          // Save id for use later
          _id = res.body._id;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Please send a book title');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });            
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/IdThatDoesNotExist')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
        });
        done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/' + _id) // Use _id we saved from post
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.property(res.body, '_id', 'Books in array should contain _id');
          assert.isArray(res.body.comments)
        });
        done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/' + _id) // Use _id we saved from post
        .send({comment: 'Hello World!'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.property(res.body, '_id', 'Books in array should contain _id');
          assert.isArray(res.body.comments);
          assert.equal(res.body.comments[0], 'Hello World!');
        });
        done();
      });
      
    });

    suite ('DELETE /api/books/ => delete all books', function(){

      test('Test DELETE /api/books/', function(done){
        chai.request(server)
        .delete('/api/books/')
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'complete delete successful');
        });
        done();
      });
      
    });

  });

});
