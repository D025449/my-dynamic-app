const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const decompress = require("decompress");
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use((req, res, next) => {
  console.log(`Request received at ${new Date()}`);
  next();

});


app.get('/', async(req, res) => {
try
{
  const fpath = path.join(__dirname, 'public', '/index.html');
  res.sendFile(fpath);

}
catch(err) {
  console.log(err.message); 
}
});


app.get('/greet/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hello, ${name}!`);
});


// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null,Date.now() + '-' + file.originalname); // Rename the file to include the timestamp
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  // req.file contains the uploaded file details
  // req.body contains other form data if any

  var fext = path.extname(req.file.originalname);
  const fname = req.file.path;

  fext = fext.trim().toLowerCase();
  if (fext === '.zip'){
    decompress(fname, "uploads")
        .then((files) => {
          console.log(files);
        })
        .catch((error) => {
          console.log(error);
        });

  }






  console.log( path.extname(req.file.originalname));
  res.send('File uploaded successfully');
});





app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});