// The memory-cards resouce
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAllCollections = require("../../queries/selectAllCollections");
const groupBy = require("lodash/groupBy");
const { v4: getUuid } = require("uuid");
const uniqBy = require("lodash/uniqBy");

router.get("/", (req, res) => {
   console.log(req.query);
   const { searchTerm, order } = req.query;
   let constructedSearchTerm;
   if (searchTerm === "" || searchTerm === undefined) {
      constructedSearchTerm = "%%";
   } else {
      constructedSearchTerm = `%${searchTerm}%`;
   }
   console.log(constructedSearchTerm);
   /* https://www.npmjs.com/package/mysql#escaping-query-values */
   db.query(selectAllCollections, [
      constructedSearchTerm,
      constructedSearchTerm,
      { toSqlString: () => order },
   ])
      .then((collections) => {
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
            "institutionId"
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
         //  console.log(unfinishedCollections);
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
                        tags: [],
                     };
                  });

               return {
                  ...collection,
                  photos: collectionPhotos,
               };
            }
         );
         const testCollectionPhotosTags = collectionsWithPhotos.map(
            (testPhotoTag) => {
               const test2Tags = testPhotoTag.photos.map((test2tag) => {
                  console.log(test2tag.id);
               });
            }
         );

         const collectionsWithPhotosAndTags = collectionsWithPhotos.map(
            (collectionWithPhotoAndTag) => {
               const collectionPhotosTags = collectionWithPhotoAndTag.photos.map(
                  (collectionPhotoTag) => {
                     const photoTags = camelCaseCollections
                        .filter((camelCaseCollection) => {
                           return (
                              camelCaseCollection.photoId ===
                              collectionPhotoTag.id
                           );
                        })
                        .map((photoTag) => {
                           return {
                              id: photoTag.tagId,
                              userID: photoTag.userCreatedTag,
                              name: photoTag.tagName,
                           };
                        });

                     return {
                        ...collectionPhotoTag,
                        tags: photoTags,
                     };
                  }
               );
               return collectionPhotosTags;
            }
         );

         //      const collectionsWithPhotosAndTags = collectionsWithPhotos.map(
         //         (collectionWithPhotoAndTag) => {
         // const CollectionsPhotosTags = collectionWithPhotoAndTag.photos.map((collectionPhotoTag) => {
         //     const photoTags = camelCaseCollections
         //               .filter((camelCaseCollection) => {
         //                  const photo = collectionPhotoTag.photos;
         //                   console.log(collectionPhotoTag.id);
         //                  return (
         //                     camelCaseCollection.photoId ===
         //                     collectionPhotoTag.id
         //                  );
         //               })
         //               .map((photoTag) => {
         //                  return {
         //                     id: photoTag.tagId,
         //                     userID: photoTag.userCreatedTag,
         //                     name: photoTag.tagName,
         //                  };
         //               });
         //            return {
         //               ...collectionPhotoTag,
         //               tags: photoTags,
         //            };
         //         }

         //  })

         //      );

         res.json(collectionsWithPhotosAndTags);
         //  console.log(unfinishedCollections);
         //  res.json(unfinishedCollections);
         //  res.json(collectionsWithPhotosAndTags);
         //  console.log(camelCaseCollections);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
