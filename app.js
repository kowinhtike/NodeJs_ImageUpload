var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var url = require('url');

http.createServer(function (req, res) {
    
  if (req.url == '/upload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write("User ID : " + fields.userID[0] + "<br>");
      res.write( "User Password : " + fields.password[0] + "<br>");
      res.write('File uploaded <br>');
      console.log("Successful!");
      res.write(__dirname+ '\\upload\\'+files.filetoupload[0].originalFilename);

      var newpath = __dirname+ '\\upload\\'+files.filetoupload[0].originalFilename
      var oldpath = files.filetoupload[0].filepath
    
      fs.rename(oldpath, newpath, function (err) {
    
        if (err) throw err;
        res.write('File uploaded and moved!');
      });

      res.end();
    });


  }else if(req.url == '/image'){
    res.write("Hi")
    res.end()
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="upload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="text" value="hello bro" name="userID"><br>');
    res.write('<input type="text" value="123456789" name="password"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);