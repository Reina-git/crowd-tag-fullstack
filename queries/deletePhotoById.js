const deletePhotoById = `
DELETE FROM
photos
WHERE
id = ?;
`;

module.exports = deletePhotoById;
