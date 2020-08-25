export {};
let users: Array<{ id: number; name: string; room: string }> = [];

const addUser = ({
  id,
  name,
  room,
}: {
  id: number;
  name: string;
  room: string;
}) => {
  //trim() willl remove all white space in a string
  if (!name || !room) {
    return new Error('name or room is missing.');
  }
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.name === name && user.room === room
  );
  if (existingUser) {
    return { error: 'This username is taken.' };
  }
  const user = { id, name, room };
  users.push(user);

  return { user };
};

const removeUser = (id: number) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id: number) =>
  users.find((user: { id: number }) => user.id === id);

const getUsersInRoom = (room: string) =>
  users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
