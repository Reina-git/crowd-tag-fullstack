// The queue resource
const express = require("express");
const router = express.Router();
const validateJwt = require("../../utils/validateJwt");
const upload = require("../../upload");

// @route      POST api/v1/test-users
// @desc       Create a new test user in the test users resource
// @access     Private
router.post("/", validateJwt, (req, res) => {
   const userId = req.user.id;
   console.log("made it to test-users route");
   upload.single("profile-photo")(req, res, (err) => {
      console.log("request.file", req.file);
      if (!req.file && !err) {
         const errorMessage = "Please choose a file to upload.";
         return res.status(400).json({ uploadError: errorMessage });
      } else if (!req.file && err) {
         console.log("there is no file and there is an error");
         return res.status(400).json({ uploadError: err.message });
      } else {
         const profile = {
            handle: req.body.handle,
            profilePhotoUrl: req.file.location,
         };

         // make db query and isert this data
         // db.query(updateUser, provile)
         return res.status(200).json(profile);
      }
   });
});

module.exports = router;
