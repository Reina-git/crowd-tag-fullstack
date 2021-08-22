// uploading photos from computer---not just a url
const express = require("express");
const router = express.Router();
const validateJwtt = require("../../utils/validateJwtt");
const upload = "../../upload";
//@route POST api/v1/s3photos
//@desc    add photos from computer
// @access  private

router.post("/", validateJwtt, (req, res) => {
   const userId = req.user.id;
   // console.log("made it to test users route");
   upload.single("profile-photo")(req, res, (err) => {});
});
module.exports = router;
