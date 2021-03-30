const deleteAllTagsForCollection = `
DELETE FROM
xref_tag_photo
WHERE
photo_id in (?);
`;

module.exports = deleteAllTagsForCollection;
