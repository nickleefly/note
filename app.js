
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var NoteProvider = require('./noteprovider').NoteProvider;

var app = express();

// all environments
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var options = {
  host: 'ds041208.mongolab.com',
  port: 41208,
  db: 'heroku_app17679066',
  username: "heroku_app17679066",
  password: "18di99eo9f9q90eohc8bc3ecbf"
};

var noteProvider = new NoteProvider(options);

app.get('/', function(req, res){
  noteProvider.findAll(function(error, notes){
    res.render('index', {
      title: 'Notes',
      notes: notes
    });
  });
});

app.get('/note/new', function(req, res) {
  res.render('note_new', {
    title: 'New Note'
  });
});

//save new note
app.post('/note/new', function(req, res){
  noteProvider.save({
    title: req.param('title'),
    name: req.param('name')
  }, function( error, docs) {
    res.redirect('/');
  });
});

//update an note
app.get('/note/:id/edit', function(req, res) {
  noteProvider.findById(req.param('_id'), function(error, note) {
    res.render('note_edit',
    { 
      note: note
    });
  });
});

//save updated note
app.post('/note/:id/edit', function(req, res) {
  noteProvider.update(req.param('_id'),{
    title: req.param('title'),
    name: req.param('name')
  }, function(error, docs) {
    res.redirect('/')
  });
});

//delete an note
app.post('/note/:id/delete', function(req, res) {
  noteProvider.delete(req.param('_id'), function(error, docs) {
    res.redirect('/')
  });
});

app.listen(3000);
console.log('Express server listening on port 3000');
