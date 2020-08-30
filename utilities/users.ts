export {};
import Joi from 'joi';
import axios from 'axios';
import { User, Users } from '../types/types';

const users: Users = [];

export const dataValidator = (name: string): void => {
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
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getGitAvatar = async (name: string) => {
    const gitUserPublic = await axios
        .get(`https://api.github.com/users/${name}`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((res: any) => {
            if (res.status === 200) {
                const avatar = res.data.avatar_url;
                return avatar;
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
            if (err.response.status === 404) {
                const avatar = `https://api.adorable.io/avatars/285/${name}@adorable.png`;
                return avatar;
            }
        });

    return gitUserPublic;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const addUser = ({ id, name, avatar }: User) => {
    const user = { id, name, avatar };
    users.push(user);

    return { user };
};

export const removeUser = (id: number): User | undefined => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
};

export const removeAllUsers = (): User[] => users.splice(0, users.length);

export const getUser = (id: number): User | undefined => users.find((user: { id: number }) => user.id === id);

export const getAllUsers = (): Array<User> => users;
