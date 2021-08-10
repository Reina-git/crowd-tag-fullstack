const deleteAllTagsForCollection = `
DELETE FROM
photos
WHERE
id = (?);
`;

module.exports = deleteAllTagsForCollection;
