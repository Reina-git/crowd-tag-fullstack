// Photos
const express = require("express");
const router = express.Router();
const db = require("../../db");
const validateJwtt = require("../../utils/validateJwtt");
const deleteAllTagsForPhoto = require("../../queries/deleteAllTagsForPhoto");
const deletePhotoById = require("../../queries/deletePhotoById");

// @route   Delete api/v1/adminAllCollections/:id
// @desc    Delete selectedUser
// @access  Private

router.delete("/:id", validateJwtt, async (req, res) => {
   console.log("looking for tag id", req.params);
   const id = req.params.id;

   await db
      .query(deleteAllTagsForPhoto, id)
      .then(() => {
         console.log("delete photo");
      })
      .catch((err) => {
         console.log(err);
         const dbError = `${err.code} ${err.sqlMessage}`;
         return res.status(500).json({ dbError });
      });

   await db
      .query(deletePhotoById, id)
      .then(() => {
         return res.status(200).json({ success: "photo deleted" });
      })
      .catch((err) => {
         console.log(err);
         const dbError = `${err.code} ${err.sqlMessage}`;
         return res.status(500).json({ dbError });
      });
});

module.exports = router;
