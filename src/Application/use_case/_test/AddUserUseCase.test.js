const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser')
const UserRepository = require('../../../Domains/users/UserRepository')
const PasswordHash = require('../../security/PasswordHash')
const AddUseCase = require('../AddUserUseCase')

describe('AddUserUseCase', () => {
    it('should orchestrating the add user action correctly', async () => {
        const useCasePayload ={
            username: 'dandy',
            password: 'secret',
            fullname: 'Dandy Yahmin'
        }
        const mockRegistereduser = new RegisteredUser({
            id: 'user-123',
            username: useCasePayload.username,
            fullname: useCasePayload.fullname
        })
        const mockUserRepository = new UserRepository()
        const mockPasswordHash = new PasswordHash()

        mockUserRepository.verifyAvailableUsername = jest.fn().mockImplementation(() => Promise.resolve())
        mockPasswordHash.hash = jest.fn().mockImplementation(() => Promise.resolve('encrypted_password'))
        mockUserRepository.addUser = jest.fn().mockImplementation(() => Promise.resolve(mockRegistereduser))

        const getUserUseCase = new AddUseCase({
            userRepository: mockUserRepository,
            passwordHash: mockPasswordHash
        })
        const registeredUser = await getUserUseCase.execute(useCasePayload)

        expect(registeredUser).toStrictEqual(new RegisteredUser({
            id: 'user-123',
            username: useCasePayload.username,
            fullname: useCasePayload.fullname
        }))
        expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username)
        expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password)
        expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
            username: useCasePayload.username,
            password: 'encrypted_password',
            fullname: useCasePayload.fullname
        }))
    })
})