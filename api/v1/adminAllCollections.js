// The memory-cards resouce
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAdminCollections = require("../../queries/selectAdminCollections");
// const groupBy = require("lodash/groupBy");
// const { v4: getUuid } = require("uuid");
const uniqBy = require("lodash/uniqBy");
const validateJwt = require("../../utils/validatejwt");
const insertCollection = require("../../queries/insertCollection");
const insertPhotos = require("../../queries/insertPhotos");

router.get("/", validateJwt, (req, res) => {
   // console.log("I am in adminAllCollections");
   const user_id = req.user.id;
   // console.log("user.id", user_id);
   // /* https://www.npmjs.com/package/mysql#escaping-query-values */
   db.query(selectAdminCollections, user_id)
      .then((collections) => {
         // console.log(collections);
         const camelCaseCollections = collections.map((collection) => {
            return {
               institutionName: collection.institution_name,
               collectionName: collection.collection_name,
               photoId: collection.photo_id,
               photoUrl: collection.Image_url,
               tagName: collection.tag_name,
               userCreatedTag: collection.user_created_tag,
               collectionId: collection.collection_id,
               tagId: collection.tag_id,
               institutionId: "id" + collection.institution_name,
               photoUploadedAt: collection.uploaded_at,
               collectionCreatedAt: collection.collection_created_at,
               userId: collection.user_id,
            };
         });
         const unfinishedCollections = uniqBy(
            camelCaseCollections,
            "collectionId"
         ).map((collection) => {
            return {
               id: collection.collectionId,
               name: collection.collectionName,
               userId: collection.userId,
               createdAt: collection.collectionCreatedAt,
               institutionName: collection.institutionName,
               photos: [],
            };
         });
         const collectionsWithPhotos = unfinishedCollections.map(
            (collection) => {
               const collectionPhotos = camelCaseCollections
                  .filter((camelCaseCollection) => {
                     return camelCaseCollection.collectionId === collection.id;
                  })
                  .map((collectionPhoto) => {
                     return {
                        id: collectionPhoto.photoId,
                        collectionID: collectionPhoto.collectionId,
                        uploadedAt: collectionPhoto.photoUploadedAt,
                        fileName: "replaceMe", //write a function that gets the file name from the end of the URL
                        url: collectionPhoto.photoUrl,
                        tags: camelCaseCollections
                           .map((camelCaseCollection) => {
                              return {
                                 id: camelCaseCollection.tagId,
                                 userID: camelCaseCollection.userCreatedTag,
                                 name: camelCaseCollection.tagName,
                                 photoId: camelCaseCollection.photoId,
                              };
                           })
                           .filter((tag) => {
                              return (
                                 collectionPhoto.photoId === tag.photoId &&
                                 tag.id !== null
                              );
                           }),
                     };
                  });
               const uniqCollectionPhotos = uniqBy(collectionPhotos, "id");
               return {
                  ...collection,
                  photos: uniqCollectionPhotos,
               };
            }
         );
         res.json(collectionsWithPhotos);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

router.post("/", async (req, res) => {
   // console.log("req.body from add collection", req.body);
   const collection = {
      id: req.body.id,
      name: req.body.name,
      user_id: req.body.userId,
      created_at: req.body.createdAt,
   };

   console.log("photos", req.body.photos);
   const collectionWithPhotos = [...req.body.photos];
   // console.log("collections with photos", collectionWithPhotos);
   const photos = collectionWithPhotos.map((photo) => {
      // console.log("collection ID", photo.id);
      // const photoArray = [
      //    photo.id,
      //    photo.collectionID,
      //    photo.uploadedAt,
      //    photo.url,
      // ];
      return [photo.id, photo.collectionID, photo.uploadedAt, photo.url];
   });
   console.log("photos", photos);

   await db
      .query(insertCollection, collection)
      .then((collection) => {
         console.log("insertCollection", collection);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
   await db
      .query(insertPhotos, photos)
      .then((photos) => {
         console.log("insertPhoto", photos);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
