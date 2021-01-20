const deleteXrefById = `
DELETE FROM
xref_tag_photo
WHERE
id = ?;
`;

module.exports = deleteXrefById;
