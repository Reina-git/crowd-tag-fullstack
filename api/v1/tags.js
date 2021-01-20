// The memory-cards resouce
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAllTags = require("../../queries/selectAllTags");
const uniqBy = require("lodash/uniqBy");
const validateJwt = require("../../utils/validatejwt");
const insertTag = require("../../queries/insertTag");
const insertXref = require("../../queries/insertXref");

router.get("/", validateJwt, (req, res) => {
   const userId = req.user.id;
   //    console.log("user id", userId);
   const photoId = req.query.photoIdFromCollection;
   //    console.log("photo id", req.query.photoIdFromCollection);
   //    console.log("selectAllTags", selectAllTags);
   db.query(selectAllTags, [userId, photoId])
      .then((tags) => {
         const allTagsForPhoto = tags.map((tag) => {
            return {
               photoId: tag.photo_id,
               name: tag.tag_name,
               userId: tag.user_created_tag,
               id: tag.tag_id,
               xrefId: tag.xref_id,
            };
         });

         res.json(allTagsForPhoto);
         //  console.log("allTagsForPhoto", allTagsForPhoto);
      })
      .catch((err) => {
         console.log(err);
         return res.status(400).json(err);
      });
});

// @route   Post api/v1/tags
// @desc    Post all tags for a user
// @access  Private

// router.put("/", validateJwt, (req, res) => {
//     const user = req.user;
//     db.query(insertTag, insertXref,)

router.post("/", async (req, res) => {
   console.log("req.body from tag post", req.body);
   const tagForTags = {
      id: req.body.id,
      name: req.body.name,
   };
   const tagForXref = {
      id: req.body.xref_id,
      tag_id: req.body.id,
      photo_id: req.body.photo_id,
      user_id: req.body.user_id,
   };

   await db
      .query(insertTag, tagForTags)
      .then((tag) => {
         console.log("insertTag", tag);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
   await db
      .query(insertXref, tagForXref)
      .then((tag) => {
         console.log("insertXref", tag);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
