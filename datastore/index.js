const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var newPath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(newPath, text, (err) => {
      if (err) {
        throw ('error writing counter');
      }
      items[id] = text;
      callback(null, { id, text });
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (files.length === 0) {
      callback(null, []);
    } else {

      var data = _.map(files, (file) => {
        var newPath = path.join(exports.dataDir, id);
        // fs.readFile(newPath);
        return {
          id: path.basename(newPath),
          text: path.basename(newPath)
        };
      });
      callback(null, data);
    }
  });
};

// todos.readAll((err, todoList) => {
//   expect(err).to.be.null;
//   expect(todoList.length).to.equal(0);
//   done();
// }

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
