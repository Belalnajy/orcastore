const multer = require('multer');
const path = require('path');

// Set storage engine
// On serverless platforms like Vercel, the filesystem is read-only.
// We must use memoryStorage to avoid crashes. File uploads will be handled in memory.
const cloudinary = require('../config/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Set storage engine to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'orcastore',
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
    // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: resize images on upload
  },
});

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
