const {
    dataValidator,
    addUser,
    removeUser,
    getUser,
    getAllUsers,
    getGitAvatar,
    removeAllUsers,
} = require('../utilities/users');

describe('Users module', () => {
    beforeEach(() => {
        removeAllUsers();
    });

    describe('validator function', () => {
        test.only('it accepts correct formated names', () => {
            expect(() => dataValidator('Erik')).not.toThrow();
        });
        test.only('it throws Error if input is empty', () => {
            expect(() => dataValidator('')).toThrow('"username" is not allowed to be empty');
        });
        test.only('it throws error if name is too short', () => {
            expect(() => dataValidator('A')).toThrow(`"username" length must be at least 3 characters long`);
        });
        test.only('it throws error if name is too long', () => {
            expect(() => dataValidator('123456789000987654321')).toThrow(
                `"username" length must be less than or equal to 20 characters long`,
            );
        });
        test.only('it throws error if name already exists', () => {
            addUser({ id: 1, name: 'moe', avatar: 'url' });
            expect(() => dataValidator('moe')).toThrow('This username is taken.');
        });
    });

    describe('addUser function', () => {
        test.only('it should correctly add user', () => {
            addUser({ id: 1, name: 'moe', avatar: 'url' });
            expect(getAllUsers()).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'moe' })]));
        });
    });

    describe('getAllUsers function', () => {
        test.only('it should correctly return all users', () => {
            addUser({ id: 1, name: 'NICK', avatar: 'url' });
            addUser({ id: 2, name: 'neda', avatar: 'url' });
            expect(getAllUsers()).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'NICK' })]));
            expect(getAllUsers()).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'neda' })]));
        });
    });

    describe('removeUser function', () => {
        test.only('it should correctly remove user', () => {
            addUser({ id: 1, name: 'NICK', avatar: 'url' });
            addUser({ id: 2, name: 'neda', avatar: 'url' });
            expect(getAllUsers()).toHaveLength(2);
            removeUser(1);
            expect(getAllUsers()).toHaveLength(1);
        });
    });

    describe('getUser function', () => {
        test.only('it should get the correct user', () => {
            addUser({ id: 1, name: 'NICK', avatar: 'url' });
            addUser({ id: 2, name: 'neda', avatar: 'url' });
            const user = getUser(2);
            expect(user).toMatchObject({ name: 'neda', id: 2, avatar: 'url' });
        });
    });

    describe('clearUsers function', () => {
        test.only('it should clear all users', () => {
            addUser({ id: 1, name: 'NICK', avatar: 'url' });
            addUser({ id: 2, name: 'neda', avatar: 'url' });
            addUser({ id: 3, name: 'Moe', avatar: 'url' });
            expect(getAllUsers()).toHaveLength(3);
            removeAllUsers();
            expect(getAllUsers()).toHaveLength(0);
        });
    });
});
