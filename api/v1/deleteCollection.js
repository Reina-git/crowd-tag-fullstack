const express = require("express");
const router = express.Router();
const db = require("../../db");
const validateJwt = require("../../utils/validatejwt");
const deleteAllTagsForCollection = require("../../queries/deleteAllTagsForCollection");
const toJson = require("../../crowd-tag-fullstack/utils/helpers");

router.delete("/", validateJwt, (req, res) => {
   console.log("looking for collection", req.params);

   const ids = req.params;
   // console.log("ids", allIds);
   console.log("res", res.params);

   // const idString = JSON.stringify(allIds);
   // console.log("idString", idString);

   // const idSplit = idString.split(":");
   // const firstId = idSplit[1];

   // console.log("first Id", firstId);

   db.query(deleteAllTagsForCollection, ids)
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
