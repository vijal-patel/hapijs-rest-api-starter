import { it, jest } from "@jest/globals";
import { BadRequestError } from "../../../src/models/errors";
import { DB_NAME } from "../../../src/constants/constants";

jest.unstable_mockModule("crypto", () => ({
  __esModule: true,
  randomBytes: jest.fn(),
}));

jest.unstable_mockModule("../../../src/services/auth-service", () => ({
  __esModule: true,
  hashPassword: jest.fn(),
}));

jest.unstable_mockModule("../../../src/utils/db", () => ({
  __esModule: true,
  getEntity: jest.fn(),
  deleteEntity: jest.fn(),
  updateEntity: jest.fn(),
  createEntity: jest.fn(),
}));

const { randomBytes } = await import("crypto");
const { createUser, updateUser, deleteUser, getUser, getUserByEmail } =
  await import("../../../src/services/user-service");
const { hashPassword } = await import("../../../src/services/auth-service");
const { getEntity, deleteEntity, updateEntity, createEntity } = await import(
  "../../../src/utils/db"
);
const mockClient = {
  db: jest.fn().mockReturnThis(),
  collection: jest.fn().mockReturnThis(),
  deleteOne: jest.fn(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
};
const entityId = "66b7b0de3777d91847358fc1";

describe("createUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user when valid data is provided", async () => {
    hashPassword.mockReturnValue("hashedPassword123");
    randomBytes.mockReturnValue(Buffer.from("123456"));
    const validUser = {
      firstName: "first name",
      lastName: "last name",
      email: "test@test.com",
      password: "Password123",
      captchaToken: "123  ",
    };
    mockClient.insertOne.mockResolvedValue({
      insertedId: "newUserId",
    });

    const result = await createUser(validUser, mockClient);
    expect(mockClient.db).toHaveBeenCalledWith(DB_NAME);
    expect(mockClient.collection).toHaveBeenCalledWith("user");
    expect(mockClient.insertOne).toHaveBeenCalledWith({
      ...validUser,
      password: "hashedPassword123",
      createdAt: expect.any(Date),
      verificationCode: expect.any(String),
      emailConfirmed: false,
    });
    expect(result).toBe("newUserId");
  });

  it("should throw BadRequestError if first name is invalid", async () => {
    const user = {
      firstName: "",
      lastName: "last name",
      email: "test@test.com",
      password: "Password123",
    };
    await expect(createUser(user, mockClient)).rejects.toBeInstanceOf(
      BadRequestError
    );
    expect(mockClient.db().collection().insertOne).not.toHaveBeenCalled();
  });

  it("should throw BadRequestError if last name is invalid", async () => {
    const user = {
      firstName: "123",
      lastName: "",
      email: "test@test.com",
      password: "Password123",
    };
    await expect(createUser(user, mockClient)).rejects.toBeInstanceOf(
      BadRequestError
    );
    expect(mockClient.db().collection().insertOne).not.toHaveBeenCalled();
  });

  it("should throw BadRequestError if email is invalid", async () => {
    const user = {
      firstName: "",
      lastName: "last name",
      email: "test@",
      password: "Password123",
    };
    await expect(createUser(user, mockClient)).rejects.toBeInstanceOf(
      BadRequestError
    );
    expect(mockClient.db().collection().insertOne).not.toHaveBeenCalled();
  });

  it("should throw BadRequestError if password is invalid", async () => {
    const user = {
      firstName: "",
      lastName: "last name",
      email: "test@",
      password: "1",
    };
    await expect(createUser(user, mockClient)).rejects.toBeInstanceOf(
      BadRequestError
    );
    expect(mockClient.db().collection().insertOne).not.toHaveBeenCalled();
  });
});

describe("updateUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a user when valid data is provided", async () => {
    const validUser = {
      firstName: "first name",
      lastName: "last name",
    };
    updateEntity.mockResolvedValue(1);

    const result = await updateUser(entityId, validUser, mockClient);
    expect(updateEntity).toHaveBeenCalledWith(
      entityId,
      validUser,
      mockClient,
      "user"
    );
    expect(result).toBe(1);
  });

  it("should throw BadRequestError if first name is invalid", async () => {
    const user = {
      firstName: "",
      lastName: "last name",
      email: "test@test.com",
      password: "Password123",
    };
    await expect(updateUser(entityId, user, mockClient)).rejects.toBeInstanceOf(
      BadRequestError
    );
    expect(updateEntity).not.toHaveBeenCalled();
  });

  it("should throw BadRequestError if last name is invalid", async () => {
    const user = {
      firstName: "123",
      lastName: "",
      email: "test@test.com",
      password: "Password123",
    };
    await expect(updateUser(entityId, user, mockClient)).rejects.toBeInstanceOf(
      BadRequestError
    );
    expect(updateEntity).not.toHaveBeenCalled();
  });

  it("should throw BadRequestError if email is invalid", async () => {
    const user = {
      firstName: "",
      lastName: "last name",
      email: "test@",
      password: "Password123",
    };
    await expect(updateUser(entityId, user, mockClient)).rejects.toBeInstanceOf(
      BadRequestError
    );
    expect(updateEntity).not.toHaveBeenCalled();
  });

  it("should throw BadRequestError if password is invalid", async () => {
    const user = {
      firstName: "",
      lastName: "last name",
      email: "test@",
      password: "1",
    };
    await expect(updateUser(entityId, user, mockClient)).rejects.toBeInstanceOf(
      BadRequestError
    );
    expect(updateEntity).not.toHaveBeenCalled();
  });
});

describe("deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a user", async () => {
    await deleteUser(entityId, mockClient);
    expect(deleteEntity).toHaveBeenCalledWith(entityId, mockClient, "user");
  });
});

describe("getUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get a user", async () => {
    await getUser(entityId, mockClient);
    expect(getEntity).toHaveBeenCalledWith(entityId, mockClient, "user", {
      projection: { password: 0, verificationCode: 0 },
    });
  });
});

describe("getUserByEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get a user without auth info", async () => {
    const email = "test@test.com";
    await getUserByEmail(email, mockClient);
    expect(mockClient.db).toHaveBeenCalledWith(DB_NAME);
    expect(mockClient.collection).toHaveBeenCalledWith("user");
    // const [objectId, fieldProjection] = mockClient.findOne.mock.calls[0];

    expect(mockClient.findOne).toHaveBeenCalledWith(
      { email },
      {
        projection: { password: 0, verificationCode: 0 },
      }
    );
  });

  it("should get a user with auth info", async () => {
    const email = "test@test.com";
    await getUserByEmail(email, mockClient, true);
    expect(mockClient.db).toHaveBeenCalledWith(DB_NAME);
    expect(mockClient.collection).toHaveBeenCalledWith("user");
    expect(mockClient.findOne).toHaveBeenCalledWith({ email }, {});
  });
});
