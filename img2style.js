var glob = require("glob");
var fs = require("fs");
var _ = require("underscore");
var path = require("path");
var im = require("imagemagick");
require("shelljs/global");
var template = fs.readFileSync(__dirname+"/img-template.css").toString();
var async = require("async");

module.exports = function(srcFolder, matchPattern){
  this.srcFolder = srcFolder;
  this.matchPattern = matchPattern;
}

module.exports.prototype.generate = function(target, callback) {
  glob(this.srcFolder+"/**/"+this.matchPattern, function(err, files){
    if(err) return callback(err);
    var fileContents = "";
    async.map(files, function(file, next){
      im.identify(file, function(err, features){
        if (err) return next(err);
        // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
        var data = template.replace("{{name}}", path.basename(file, path.extname(file)));
        data = data.replace("{{width}}", features.width);
        data = data.replace("{{height}}", features.height);
        data = data.replace("{{path}}", path.relative(path.dirname(target), file));
        fileContents += data+"\n";
        next(err, features);
      });
    }, function(err){
      if(err) return callback(err);
      fs.writeFileSync(target,fileContents);
      callback(err);
    });
  });
}