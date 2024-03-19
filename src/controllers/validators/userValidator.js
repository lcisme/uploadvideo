const Ajv = require("ajv");
const ajv = new Ajv();

ajv.addKeyword({
  async: true,
});

const userSchema = {
  $async: true,
  type: "object",
  properties: {
    email: {
      type: "string",
      maxLength: 50,
      pattern: "^[^s@]+@[^s@]+.[^s@]+$",
    },
    password: { type: "string", maxLength: 50, minLength: 8 },
    username: { type: "string" },
  },
  additionalProperties: false,
};

const userUpdateSchema = {
  $async: true,
  type: "object",
  properties: {
    email: {
      type: "string",
      maxLength: 50,
      pattern: "^[^s@]+@[^s@]+.[^s@]+$",
    },
    password: { type: "string", maxLength: 50, minLength: 8 },
    username: { type: "string" },
    role: { type: "string" },
    status: { type: "number" },
  },
  additionalProperties: false,
};

const SearchAll = {
  $async: true,
  type: "object",
  properties: {
    q: { type: "string" },
    limit: {
      type: "string",
      pattern: /^[1-9]\d*$/.toString().slice(1, -1),
    },
    page: {
      type: "string",
      pattern: /^[1-9]\d*$/.toString().slice(1, -1),
    },
    orderField: { type: "string" },
    orderType: { type: "string" },
    select: {
      anyOf: [
        { type: "string" },
        {
          type: "array",
          items: { type: "string" },
          minItems: 2,
        },
      ],
    },
  },
  additionalProperties: false,
};

const userById = {
  $async: true,
  type: "object",
  properties: {
    userId: {
      type: "string",
      pattern: /^[1-9]\d*$/.toString().slice(1, -1),
    },
    username:  {
      type: "string",
    },
    password:  {
      type: "string",
    }
  },
  additionalProperties: false,
};

const fileById = {
  $async: true,
  type: "object",
  properties: {
    fileById: {
      type: "string",
      pattern: /^[1-9]\d*$/.toString().slice(1, -1),
    },
  },
  additionalProperties: false,
};

const validate = ajv.compile(userSchema);
const validateUpdate = ajv.compile(userUpdateSchema);
const validateSearch = ajv.compile(SearchAll);
const validateUserById = ajv.compile(userById);
const validateFileById = ajv.compile(fileById);

module.exports = {
  validate,
  validateUpdate,
  validateSearch,
  validateUserById,
};
