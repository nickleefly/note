var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

NoteProvider = function(options) {
  var _parent = this;
  this.db = new Db(options.db, new Server(options.host, options.port, {safe: false}, {auto_reconnect: true}, {}));
  // this.db.open(function(){});
  this.db.open(function(err) {
    _parent.db.authenticate(
      options.username, 
      options.password, 
      function(err) {
            if (err) {
               console.log(err);
            }
        }
    );
});
};

NoteProvider.prototype.getCollection= function(callback) {
  this.db.collection('note', function(error, note_collection) {
    if( error ) callback(error);
    else callback(null, note_collection);
  });
};

//find all note
NoteProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, note_collection) {
    if( error ) callback(error)
    else {
      note_collection.find().toArray(function(error, results) {
        if( error ) callback(error)
        else callback(null, results)
      });
    }
  });
};

//save new note
NoteProvider.prototype.save = function(notes, callback) {
  this.getCollection(function(error, note_collection) {
    if( error ) callback(error)
    else {
      if( typeof(notes.length)=="undefined")
        notes = [notes];

      for( var i =0;i< notes.length;i++ ) {
        note = notes[i];
        note.created_at = new Date();
      }

      note_collection.insert(notes, function() {
        callback(null, notes);
      });
    }
  });
};

//find an note by ID
NoteProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, note_collection) {
    if( error ) callback(error)
    else {
      note_collection.findOne({_id: note_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
    }
  });
};

// update an note
NoteProvider.prototype.update = function(noteId, notes, callback) {
  this.getCollection(function(error, note_collection) {
    if( error ) callback(error);
    else {
      note_collection.update(
        {_id: note_collection.db.bson_serializer.ObjectID.createFromHexString(noteId)},
        notes,
        function(error, notes) {
                if(error) callback(error);
                else callback(null, notes);
        }
      );
    }
  });
};

//delete note
NoteProvider.prototype.delete = function(noteId, callback) {
  this.getCollection(function(error, note_collection) {
    if(error) callback(error);
    else {
      note_collection.remove(
        {_id: note_collection.db.bson_serializer.ObjectID.createFromHexString(noteId)},
        function(error, note){
          if(error) callback(error);
          else callback(null, note)
        });
      }
  });
};

exports.NoteProvider = NoteProvider;