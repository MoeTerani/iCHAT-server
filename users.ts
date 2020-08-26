export { };
let users: Array<{ id: number; name: string; }> = [];

const addUser = ({
  id,
  name,
}: {
  id: number;
  name: string;
}) => {

  if (!name) {
    return new Error('userName is missing.');
  }
  name = name.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.name === name
  );
  if (existingUser) {
    return { error: 'This username is taken.' };
  }
  const user = { id, name };
  users.push(user);

  return { user };
};

const removeUser = (id: number) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id: number) =>
  users.find((user: { id: number }) => user.id === id);

const getUsersInRoom = () => users.filter((user) => user);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
