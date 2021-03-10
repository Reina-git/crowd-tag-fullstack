const deleteAllTagsForPhoto = `
DELETE FROM
xref_tag_photo
WHERE
photo_id = ?;
`;

module.exports = deleteAllTagsForPhoto;
