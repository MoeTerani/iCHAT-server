export {};
const Joi = require('joi');

let users: Array<{ id: number; name: string }> = [];

const validator = (name: string) => {
  /*   username is validated against the following rules:
    - is a required string
    -must contain only alphanumeric characters
    -at least 3 characters long but no more than 12
    -shouldn't already exist
    */
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(12).required(),
  });

  const { error } = schema.validate({ username: name });

  if (error) {
    throw new Error(error.message);
  }

  // Check if the userName exist
  name = name.trim().toLowerCase();
  const existingUser = users.find((user) => user.name === name);
  if (existingUser) {
    throw new Error('This username is taken.');
  }
};

const addUser = ({ id, name }: { id: number; name: string }) => {
  const user = { id, name };
  users.push(user);

  return { user };
};

const removeUser = (id: number) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const removeAllUsers = () => users.splice(0, users.length);

const getUser = (id: number) =>
  users.find((user: { id: number }) => user.id === id);

// const getAllUsers = () => users.filter((user) => user);
const getAllUsers = () => users;

module.exports = {
  validator,
  addUser,
  removeUser,
  removeAllUsers,
  getUser,
  getAllUsers,
};
