var fs = require('fs');

describe("img2style", function(){
  var Img2style = require("../img2style");
  var target = __dirname+"/output.css";
  it("generates proper style file from image", function(next){
    var instance = new Img2style(__dirname+"/data/", "*.png");
    instance.generate(target, function(err){
      expect(err).toBeFalsy(err);
      var data = fs.readFileSync(target).toString();
      expect(data).toContain(".logo");
      expect(data).toContain("width: 245px");
      fs.unlinkSync(target);
      next();
    })
  })
})