// The memory-cards resouce
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAllTags = require("../../queries/selectAllTags");
const uniqBy = require("lodash/uniqBy");
const validateJwt = require("../../utils/validatejwt");

router.get("/", validateJwt, (req, res) => {
   const userId = req.user.id;
   console.log("user id", userId);
   const photoId = req.query.photoIdFromCollection;
   console.log("photo id", req.query.photoIdFromCollection);
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
         console.log("allTagsForPhoto", allTagsForPhoto);
      })
      .catch((err) => {
         console.log(err);
         return res.status(400).json(err);
      });
});

//  const camelCaseCollections = collections.map((collection) => {
//     return {
//        photoId: collection.photo_id,
//        tagName: collection.tag_name,
//        userCreatedTag: collection.user_created_tag,
//        tagId: collection.tag_id,
//        xrefId: collection.xref_id,
//     };
//  });
//  console.log("camelCaseCollections", photosWithTags);
//  const photosWithTags = uniqBy(camelCaseCollections, "photoId").map(
//     (photo) => {
//        return {
//           id: photo.photoId,
//           tags: camelCaseCollections.map((camelCaseCollection) => {
//              return {
//                 id: camelCaseCollection.tagId,
//                 userID: camelCaseCollection.userCreatedTag,
//                 name: camelCaseCollection.tagName,
//                 xrefId: camelCaseCollection.xrefId,
//              };
//           }),
//        };
//     }
//  );
//  const uniqCollectionPhotos = uniqBy(collectionPhotos, "id");
//  return {
//     ...collection,
//     photos: uniqCollectionPhotos,
//  };
//  console.log("photosWithTags", photosWithTags);
//  res.json(photosWithTags);
//   })
//   .catch((err) => {
//      console.log(err);
//      res.status(400).json(err);
//   });
// });

module.exports = router;
