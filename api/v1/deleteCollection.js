const express = require("express");
const router = express.Router();
const db = require("../../db");
const validateJwt = require("../../utils/validatejwt");
const deleteAllTagsForCollection = require("../../queries/deleteAllTagsForCollection");

router.delete("/:id", validateJwt, (req, res) => {
   console.log("looking for collection", req.params);
   const id = req.params;

   db.query(deleteAllTagsForCollection, id)
      .then(() => {
         console.log("delete photo");
      })
      .catch((err) => {
         console.log(err);
         const dbError = `${err.code} ${err.sqlMessage}`;
         return res.status(500).json({ dbError });
      });

   // await db
   //    .query(deletePhotoById, id)
   //    .then(() => {
   //       return res.status(200).json({ success: "photo deleted" });
   //    })
   //    .catch((err) => {
   //       console.log(err);
   //       const dbError = `${err.code} ${err.sqlMessage}`;
   //       return res.status(500).json({ dbError });
   //    });
});

module.exports = router;
