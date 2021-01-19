const selectAdminCollections = `
    SELECT
        photos.id AS photo_id,
        collections.name AS collection_name,
        photos.image_url AS Image_url,
        tags.name AS tag_name,
        tags.id AS tag_id,
        xref_tag_photo.user_id AS user_created_tag,
        users.institution_name,
        collections.id AS collection_id,
        uploaded_at,
        collections.created_at AS collection_created_at,
        users.id AS user_id

        FROM photos
        INNER JOIN
        collections ON  collections.id = collection_id
        INNER JOIN users on users.id = user_id
        LEFT JOIN
        xref_tag_photo ON photos.id = photo_id
        LEFT JOIN
        tags ON tags.id = tag_id

    WHERE users.id = ?;
    AND  
        xref_tag_photo.user_id = ?
    `;
module.exports = selectAdminCollections;
