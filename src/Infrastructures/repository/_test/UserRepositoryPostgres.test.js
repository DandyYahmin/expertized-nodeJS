const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('verifyAvaliableUsername function', () => {
        it('should throw InvariantError when username not avaliable', async () => {
            await UsersTableTestHelper.addUser({username: 'dandy'})

            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

            await expect(userRepositoryPostgres.verifyAvailableUsername('dandy')).rejects.toThrowError(InvariantError)
        })

        it('should not throw InvariantError when username available', async () => {
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

            await expect(userRepositoryPostgres.verifyAvailableUsername('dandy')).resolves.not.toThrowError(InvariantError)
        })
    })

    describe('addUser function', () => {
        it('should persist register user', async () => {
            const registerUser = new RegisterUser({
                username: 'dandy',
                password: 'secret_password',
                fullname: 'Dandy Yahmin'
            })
            const fakeIdGenerator = () => '123'
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
            
            await userRepositoryPostgres.addUser(registerUser)

            const users = await UsersTableTestHelper.findUsersById('user-123')
            
            expect(users).toHaveLength(1)
        })
    
        it('should return registered user correctly', async () => {
            const registerUser = new RegisterUser({
                username: 'dandy',
                password: 'secret_password',
                fullname: 'Dandy Yahmin'
            })
            const fakeIdGenerator = () => '123'
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
            const registeredUser = await userRepositoryPostgres.addUser(registerUser)

            expect(registeredUser).toStrictEqual(new RegisteredUser({
                id: 'user-123',
                username: 'dandy',
                fullname: 'Dandy Yahmin'
            }))
        })
    })
})