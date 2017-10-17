const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 5000;

// Set Multer Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    // renames file
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  // verifies true file identity
  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// EJS middleware
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('./public'));

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('../public/views/index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('../public/views/index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('../public/views/index', {
          msg: 'File Uploaded!',
          file: '../uploads/' + req.file.filename
        });
      }
    }
  });
});

app.listen(port, () => console.log('Server listening on port: ' + port));
