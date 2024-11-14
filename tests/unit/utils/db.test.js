import { expect, jest } from "@jest/globals";
const dbName = "testDB";

jest.unstable_mockModule("mongodb", () => ({
  __esModule: true,
  ObjectId: {
    createFromHexString: jest.fn(),
  },
}));

jest.unstable_mockModule("../../../src/constants/constants.js", () => ({
  __esModule: true,
  DB_NAME: dbName,
}));

const { ObjectId } = await import("mongodb");
const { deleteEntity, getEntity, updateEntity, createEntity } = await import(
  "../../../src/utils/db"
);

describe("deleteEntity", () => {
  let mockClient;
  const entityId = "66b7b0de3777d91847358fc1";
  const collectionName = "collection";

  beforeEach(() => {
    mockClient = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      deleteOne: jest.fn(),
      findOne: jest.fn(),
    };

    ObjectId.createFromHexString.mockImplementation((id) => ({ _id: id }));
  });

  it("should be called with the correct parameters", async () => {
    await deleteEntity(entityId, mockClient, collectionName);
    expect(mockClient.db).toHaveBeenCalledWith(dbName);
    expect(mockClient.collection).toHaveBeenCalledWith(collectionName);
    const objectId = mockClient.deleteOne.mock.calls[0][0];
    expect(objectId._id._id.toString()).toBe(entityId);
  });
});

describe("getEntity", () => {
  let mockClient;
  const entityId = "66b7b0de3777d91847358fc1";
  const collectionName = "collection";

  beforeEach(() => {
    mockClient = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn(),
    };

    ObjectId.createFromHexString.mockImplementation((id) => ({ _id: id }));
  });

  it("should be called with the correct parameters - no fieldProjection", async () => {
    await getEntity(entityId, mockClient, collectionName);
    expect(mockClient.db).toHaveBeenCalledWith(dbName);
    expect(mockClient.collection).toHaveBeenCalledWith(collectionName);
    const [objectId, fieldProjection] = mockClient.findOne.mock.calls[0];
    expect(objectId._id._id.toString()).toBe(entityId);
    expect(fieldProjection).toEqual({});
  });

  it("should be called with the correct parameters - fieldProjection present", async () => {
    const projection = { name: 1 };
    await getEntity(entityId, mockClient, collectionName, projection);
    expect(mockClient.db).toHaveBeenCalledWith(dbName);
    expect(mockClient.collection).toHaveBeenCalledWith(collectionName);
    const [objectId, fieldProjection] = mockClient.findOne.mock.calls[0];
    expect(objectId._id._id.toString()).toBe(entityId);
    expect(JSON.stringify(fieldProjection)).toEqual(JSON.stringify(projection));
  });
});

describe("updateEntity", () => {
  let mockClient;
  const entityId = "66b7b0de3777d91847358fc1";
  const collectionName = "collection";
  const updatedEntity = { name: "update" };

  beforeEach(() => {
    mockClient = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      updateOne: jest.fn(),
    };

    ObjectId.createFromHexString.mockImplementation((id) => ({ _id: id }));
  });

  it("should return modifiedCount when update is successful", async () => {
    const modifiedCount = 1;
    mockClient.updateOne.mockResolvedValue({ modifiedCount });

    const result = await updateEntity(
      entityId,
      updatedEntity,
      mockClient,
      collectionName
    );

    expect(mockClient.db).toHaveBeenCalledWith(dbName);
    expect(mockClient.collection).toHaveBeenCalledWith(collectionName);
    const [filter, _] = mockClient.updateOne.mock.calls[0];
    expect(filter._id._id.toString()).toBe(entityId);
    expect(result).toBe(modifiedCount);
  });

  it("should return 0 if no documents are modified or upserted", async () => {
    mockClient.updateOne.mockResolvedValue({
      modifiedCount: 0,
      upsertedCount: 0,
    });

    const result = await updateEntity(
      entityId,
      updatedEntity,
      mockClient,
      collectionName
    );

    expect(result).toBe(0);
  });

  it("should return upsertedCount if an upsert occurs", async () => {
    const upsertedCount = 1;
    mockClient.updateOne.mockResolvedValue({ modifiedCount: 0, upsertedCount });

    const result = await updateEntity(
      entityId,
      updatedEntity,
      mockClient,
      collectionName
    );

    expect(result).toBe(upsertedCount);
  });

  it("should set updatedAt before updating the entity", async () => {
    const upsertedCount = 1;
    mockClient.updateOne.mockResolvedValue({ modifiedCount: 0, upsertedCount });

    const result = await updateEntity(
      entityId,
      updatedEntity,
      mockClient,
      collectionName
    );
    const [_, update] = mockClient.updateOne.mock.calls[0];

    expect(update).toEqual({
      $set: { ...updatedEntity, updatedAt: expect.any(Date) },
    });
    expect(result).toBe(upsertedCount);
  });
});

describe("createEntity", () => {
  let mockClient;
  const collectionName = "collection";
  const newEntity = { name: "name" };
  const entityId = "66b7b0de3777d91847358fc1";

  beforeEach(() => {
    mockClient = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      insertOne: jest.fn(),
    };
  });

  it("should be called with the correct parameters", async () => {
    mockClient.insertOne.mockResolvedValue({ insertedId: entityId });
    const result = await createEntity(newEntity, mockClient, collectionName);
    expect(mockClient.db).toHaveBeenCalledWith(dbName);
    expect(mockClient.collection).toHaveBeenCalledWith(collectionName);
    expect(mockClient.insertOne).toHaveBeenCalledWith({
      ...newEntity,
      createdAt: expect.any(Date),
    });
    expect(result).toBe(entityId);
  });
});
