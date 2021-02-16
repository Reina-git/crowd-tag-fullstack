const insertPhotos = `
INSERT INTO photos (id, collection_id, uploaded_at, image_url) VALUES ?

`;
module.exports = insertPhotos;
