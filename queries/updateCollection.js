const updateCollection = `
UPDATE
    collections
SET 
    name = ?
WHERE
    id = ?;
`;
module.exports = updateCollection;
