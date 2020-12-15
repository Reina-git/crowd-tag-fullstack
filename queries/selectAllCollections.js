const selectAllCollections = `
    SELECT
        photos.id AS photo_id
        collections.name AS collections_name
        photos.image_url AS Image_url
        xref_tag_photo.user_id AS user_created_tag
        users.institution_name

        FROM photos
        INNER JOIN
        collections ON  collections.id = collection_id
        INNER JOIN users on users.id = user_id
        LEFT JOIN
        xref_tag_photo ON photos.id = photo_id
        LEFT JOIN
        tags ON tags.id = tag_id

    WHERE (collection_name LIKE ? OR  users.institution_name LIKE ?)
    `;
module.exports = selectAllCollections;
