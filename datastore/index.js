const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(function(err, id) {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, err => {
      if (err) {
        throw `error writing file with id: ${id}`;
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = callback => {
  var data = [];
  fs.readdir(`${exports.dataDir}`, (err, files) => {
    if (err) {
      throw "error";
    } else {
      if (files.length === 0) {
        return callback(null, []);
      } 
    }

    files.forEach( (fileName) => {
      let id = fileName.slice(0,-4)
      exports.readOne(id, (err, fileData) => {
        data.push(fileData);

        if (data.length === files.length) {
          callback(null, data);

        }
      })
    });
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, text) => {
    if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, oldText)=> {
    if (!oldText) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, err => {
        callback(null, { id, text });
      }); 
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, err => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    // report an error if item not found
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
