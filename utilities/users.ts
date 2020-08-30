export {};
const Joi = require('joi');
const axios = require('axios');

let users: Array<{ id: number; name: string }> = [];

const dataValidator = (name: string) => {
  /*   username is validated against the following rules:
    - is a required string
    -must contain only alphanumeric characters
    -at least 3 characters long but no more than 12
    -shouldn't already exist
    */
  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
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

// Get github avatar if exist else get random robot avatar from adorable API
const getGitAvatar = async (name: string) => {
  const gitUserPublic = await axios
    .get(`https://api.github.com/users/${name}`)
    .then((res: any) => {
      if (res.status === 200) {
        const avatar = res.data.avatar_url;
        return avatar;
      }
    })
    .catch((err: any) => {
      if (err.response.status === 404) {
        const avatar = `https://api.adorable.io/avatars/285/${name}@adorable.png`;
        return avatar;
      }
    });

  return gitUserPublic;
};

const addUser = ({
  id,
  name,
  avatar,
}: {
  id: number;
  name: string;
  avatar: string;
}) => {
  const user = { id, name, avatar };
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
  dataValidator,
  addUser,
  removeUser,
  removeAllUsers,
  getUser,
  getAllUsers,
  getGitAvatar,
};
