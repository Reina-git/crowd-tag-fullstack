const NestedollectionsSchema = [
  {
    id: String,
    name: String,
    userId: String,
    createdAt: String,
    photos: [
      {
        id: String,
        uploadedAt: Number,
        fileName: String,
        url: String,
        tags: [
          {
            id: String,
            name: String,
            userId: String, // who assigned this tag to this photo
          },
        ],
      },
    ],
  },
];
