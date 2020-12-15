// The memory-cards resouce
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectAllCollections = require("../../queries/selectAllCollections");

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
         const camelCaseCollections = memoryCards.map((memoryCard) => {
            return {
               id: memoryCard.id,
               imagery: memoryCard.imagery,
               answer: memoryCard.answer,
               userId: memoryCard.user_id,
               createdAt: memoryCard.created_at,
               nextAttemptAt: memoryCard.nextAttempt_at,
               lastAttemptAt: memoryCard.lastAttempt_at,
               totalSuccessfulAttempts: memoryCard.total_successful_attempts,
               level: memoryCard.level,
            };
         });
         res.json(camelCaseMemoryCards);
      })
      .catch((err) => {
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
