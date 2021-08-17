// The admin collection resouce
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
const updateCollection = require("../../queries/updateCollection");
// const { getPhotoName } = require("../../utils/helpers");
const deletePhotoById = require("../../queries/deletePhotoById");
const deleteAllTagsForPhoto = require("../../queries/deleteAllTagsForPhoto");
const deleteAllTagsForCollection = require("../../queries/deleteAllTagsForCollection");
const { get } = require("lodash");

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
                     const url = collectionPhoto.photoUrl;
                     const splitUrl = url.split("/");
                     const reverseSplitUrl = splitUrl.reverse();
                     const photoName = reverseSplitUrl[0];
                     return {
                        id: collectionPhoto.photoId,
                        collectionID: collectionPhoto.collectionId,
                        uploadedAt: collectionPhoto.photoUploadedAt,
                        fileName: photoName,
                        // fileName: getPhotoName(collectionPhoto.photoUrl),
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
   // console.log("photos", req.body.photos);
   const collectionWithPhotos = [...req.body.photos];
   // console.log("collections with photos", collectionWithPhotos);
   const photos = collectionWithPhotos.map((photo) => {
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
      .query(insertPhotos, [photos])
      .then((photos) => {
         console.log("insertPhoto", photos);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

// updating already existing collection

router.put("/", async (req, res) => {
   // console.log("req.body from update collection", req.body);
   // console.log("params", req.params);
   const collectionId = req.body.id;
   // console.log("collectionID", collectionId);
   const collectionName = req.body.name;

   // console.log("photos", req.body.photos);
   const collectionPhotos = [...req.body.photos];
   // console.log("collections with photos", collectionWithPhotos);
   const photos = collectionPhotos
      .filter((newPhotos) => {
         return newPhotos.dbAction === "add";
      })
      .map((photo) => {
         return [photo.id, photo.collectionID, photo.uploadedAt, photo.url];
      });
   console.log("photos", photos);

   if (photos.length === 0) {
      console.log("there are no new photos");
      await db
         .query(updateCollection, [collectionName, collectionId])
         .then((dbRes) => {
            console.log("update collection", dbRes);
            return res.status(200).json({ success: "collection updated" });
         })
         .catch((err) => {
            console.log(err);
            res.status(400).json(err);
         });
   } else {
      console.log("I have new photos to add");
      await db
         .query(updateCollection, [collectionName, collectionId])
         .then((dbRes) => {
            console.log("update collection", dbRes);
            return res.status(200).json({ success: "collection updated" });
         })
         .catch((err) => {
            console.log(err);
            res.status(400).json(err);
         });
      await db
         .query(insertPhotos, [photos])
         .then((photos) => {
            console.log("insertPhoto", photos);
         })
         .catch((err) => {
            console.log(err);
            res.status(400).json(err);
         });
   }
});

// @route   Delete api/v1/adminAllCollections/:id
// Delete all tags for all photo ids
// delete all photos for collection id
// delete collection

// @desc    Delete selectedCollection
// @access  Private

router.delete("/:id", validateJwt, (req, res) => {
   // console.log("looking for collection", req.params);
   const id = req.params;
   console.log("delete tags with the photo ids:", id);
   db.query(deleteAllTagsForCollection, id)
      .then(() => {
         console.log("delete tags");
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
