// utils/serializeDoc.js

const serializeDoc = (doc) => {
  if (!doc || typeof doc !== "object") return doc;

  const serialized = {};

  for (const key in doc) {
    const value = doc[key];

    if (value === null || value === undefined) {
      serialized[key] = value;
    } else if (typeof value === "object" && value._id) {
      // author 같은 하위 문서 직렬화
      serialized[key] = {
        ...value,
        _id: value._id.toString(),
      };
    } else if (value instanceof Date) {
      serialized[key] = value.toISOString();
    } else if (
      typeof value === "object" &&
      typeof value.toString === "function" &&
      value.constructor.name === "ObjectId"
    ) {
      serialized[key] = value.toString();
    } else {
      serialized[key] = value;
    }
  }

  if (doc._id && typeof doc._id.toString === "function") {
    serialized._id = doc._id.toString();
  }

  if (doc.createdAt instanceof Date) {
    serialized.createdAt = doc.createdAt.toISOString();
  }

  if (doc.updatedAt instanceof Date) {
    serialized.updatedAt = doc.updatedAt.toISOString();
  }

  return serialized;
};

const serializeDocs = (docs) => docs.map(serializeDoc);

module.exports = {
  serializeDoc,
  serializeDocs,
};
