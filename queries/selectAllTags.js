// const selectAllTags = `
// SELECT *
// FROM users
// WHERE users.id = ?
// `;

const selectAllTags = `
SELECT
photos.id AS photo_id,
 tags.name AS tag_name,
 tags.id AS tag_id,
 xref_tag_photo.user_id AS user_created_tag,
 xref_tag_photo.id AS xref_id,
 users.id AS user_institution_id

FROM
     photos
 INNER JOIN
     collections
 ON
     collections.id = collection_id
 INNER JOIN
     users
 on
     users.id = user_id
 LEFT JOIN
     xref_tag_photo
 ON
     photos.id = photo_id
 LEFT JOIN
     tags
 ON tags.id = tag_id

WHERE xref_tag_photo.user_id = ?
AND photos.id = ?
`;
module.exports = selectAllTags;
