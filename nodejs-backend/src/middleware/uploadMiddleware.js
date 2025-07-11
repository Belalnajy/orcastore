const multer = require('multer');
const path = require('path');

// Set storage engine
// On serverless platforms like Vercel, the filesystem is read-only.
// We must use memoryStorage to avoid crashes. File uploads will be handled in memory.
const storage = multer.memoryStorage();

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('image'); // 'image' is the field name from the form

// Check file type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

module.exports = upload;
