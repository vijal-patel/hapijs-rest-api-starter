import { ObjectId } from "mongodb";
import { DB_NAME } from "../constants/constants.js";

export const createEntity = async (entity, dbClient, collection) => {
  entity.createdAt = new Date();
  const res = await dbClient
    .db(DB_NAME)
    .collection(collection)
    .insertOne(entity);
  return res.insertedId;
};

export const getEntity = async (
  entityId,
  dbClient,
  collection,
  fieldProjection = {}
) => {
  const query = { _id: ObjectId.createFromHexString(entityId) };
  return await dbClient
    .db(DB_NAME)
    .collection(collection)
    .findOne(query, fieldProjection);
};

export const updateEntity = async (
  entityId,
  updatedEntity,
  dbClient,
  collection
) => {
  updatedEntity.updatedAt = new Date();
  const filter = { _id: ObjectId.createFromHexString(entityId) };
  const res = await dbClient
    .db(DB_NAME)
    .collection(collection)
    .updateOne(filter, { $set: updatedEntity });
  if (res.modifiedCount) {
    return res.modifiedCount;
  } else if (res.upsertedCount) {
    return res.upsertedCount;
  } else {
    return 0;
  }
};

export const deleteEntity = async (entityId, dbClient, collection) => {
  const filter = { _id: ObjectId.createFromHexString(entityId) };
  await dbClient.db(DB_NAME).collection(collection).deleteOne(filter);
};
