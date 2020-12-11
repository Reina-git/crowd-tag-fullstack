const collections_schema = {
  id: String,
  name: String,
  userId: String,
  createdAt: Number,
  institutionName: String,
};

const photo_schema = {
  id: String,
  collectionId: String,
  uploadedAt: Number,
  fileName: String,
};

const user_schema = {
  userId: String,
  email: String,
  password: String,
  createdAt: Number,
  institutionName: String,
};

const tag_schema = {
  id: String,
  name: String,
};

const xref_tag_photo = {
  id: String,
  tagId: String,
  photoId: String,
  userId: String,
};
