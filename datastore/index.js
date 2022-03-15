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
      console.log('here');
      var data = _.map(files, (file) => {
        var newPath = path.join(exports.dataDir, file);
        // fs.readFile(newPath);
        return {
          id: path.basename(newPath, '.txt'),
          text: path.basename(newPath, '.txt')
        };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var newPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(newPath, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      text = text.toString();
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var newPath = path.join(exports.dataDir, `${id}.txt`);

  if (fs.existsSync(newPath)) {
    fs.writeFile(newPath, text, (err) => {
      if (err) {
        throw err;
      } else {
        callback(null, { id, text });
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
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
