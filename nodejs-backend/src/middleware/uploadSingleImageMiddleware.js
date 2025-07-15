const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "orcastore",
    format: async (req, file) => "jpg", // supports promises as well
    public_id: (req, file) => file.fieldname + '-' + Date.now(),
  },
});

// Helper function to check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Initialize upload middleware for a single file
const uploadSingleImage = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('image'); // 'image' is the field name for the single category image

module.exports = uploadSingleImage;
