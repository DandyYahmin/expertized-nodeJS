const ClientError = require('../ClientError')

describe('clientError', () => {
    it('should throw error when directly use it', () => {
        expect(() => new ClientError('')).toThrowError('cannot instantiate abstract class')
    })
})