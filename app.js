var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var fss = require('fs');
var url = require('url');
var path = require("path");
imag_data = '';
var myJson = {}


http.createServer(function (req, res) {
    
  if (req.url == '/upload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

      //res.writeHead(200, {'Content-Type': 'text/html'});
      //res.write("User ID : " + fields.userID[0] + "<br>");
      //res.write( "User Password : " + fields.password[0] + "<br>");
      //res.write('File uploaded <br>');

      myJson.id = fields.userID[0];
      myJson.password =  fields.password[0];

      console.log("Successful!");
  
      var newpath = __dirname+ '\\image\\'+files.filetoupload[0].originalFilename
      var uploaded_img_path = 'image/'+files.filetoupload[0].originalFilename;
      myJson.img = uploaded_img_path;
      //res.write(`<a href="${uploaded_img_path}"> ${'image/'+files.filetoupload[0].originalFilename} </a> `)

      var oldpath = files.filetoupload[0].filepath

      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
       // res.write('<br> <br> File uploaded and moved! <br> <br>');
      });

                // read image file
  fss.readFile(newpath, (err, data)=>{
    // error handle
    if(err) {
      console.log("First Error");
        throw err;
    } 

    // get image file extension name
    const extensionName = path.extname(newpath);
    
    // convert image file to base64-encoded string
    const base64Image = Buffer.from(data, 'binary').toString('base64');
    
    // combine all strings
    const base64ImageStr = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
    console.log("image reached")
    imag_data = base64ImageStr;
    res.write(JSON.stringify(myJson))
    //res.write(`<img src="${imag_data}" width="200px" >`)
    res.end();
})
    });


  }else if(req.url == '/'){

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="upload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="text" value="hello bro" name="userID"><br>');
    res.write('<input type="text" value="123456789" name="password"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();

  } else {

    	// Parsing the URL
	const request = url.parse(req.url, true);

	// Extracting the path of file
	const action = request.pathname;

	// Path Refinements
	const filePath = path.join(__dirname,
		action).split("%20").join(" ");

	// Checking if the path exists
	fs.exists(filePath, function (exists) {

		if (!exists) {
			res.writeHead(404, {
				"Content-Type": "text/plain"
			});
			res.end("404 Not Found Par");
			return;
		}

		// Extracting file extension
		const ext = path.extname(action);

		// Setting default Content-Type
		const contentType = "text/plain";

		// Setting the headers
		res.writeHead(200, {
			"Content-Type": contentType
		});

		// Reading the file
		fs.readFile(filePath,
			function (err, content) {
				// Serving the image
				res.end(content);
			});
	});
  }
      
	
}).listen(8080);