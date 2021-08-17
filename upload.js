// https://stackoverflow.com/q/40494050/6305196

require("dotenv").config();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: getUuid } = require("uuid"); // must be installed on the server!

const bucket = "crowdtag-demo";
// console.log("I am in upload.js");
// 5
const s3Config = new aws.S3({
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   bucket: bucket,
});
// console.log("s3Config", s3Config);
// 4
const getExtension = (filename) => {
   const index = filename.lastIndexOf(".");
   const ext = filename.slice(index);
   return ext;
};

// 3
const multerS3Config = multerS3({
   s3: s3Config,
   bucket: bucket,
   contentType: multerS3.AUTO_CONTENT_TYPE,
   key: function (req, file, cb) {
      // console.log(req.user); // can include the user's info in the filename!
      // const fileExt = getExtension(file.originalname);
      // const filename = `${file.fieldname}-${getUuid()}${fileExt}`;
      const fileExt = getExtension(file.originalname);
      const filename = `${file.originalname}`;
      // console.log("filename", filename);
      cb(null, filename);
   },
});
// console.log("multer s3config", multerS3Config);

// 2
const fileFilter = (req, file, cb) => {
   // console.log("The file is:", file);
   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      // console.log("this is a jpg or png");
      cb(null, true);
   } else {
      cb(new Error("File type must be .jpg or .png"));
      // console.log("this is not a jpg or png");
   }
};

// 1
const upload = multer({
   storage: multerS3Config,
   fileFilter: fileFilter,
   limits: {
      fileSize: 1024 * 1024 * 5, // less than 5 MB
   },
});

module.exports = upload;
