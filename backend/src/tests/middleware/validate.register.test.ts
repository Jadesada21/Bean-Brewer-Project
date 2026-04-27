import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { validate } from '../../middleware/validate'
import { registerSchema } from '../../Schemas/register.schema'

const mockRes = {} as Response
const mockNext = vi.fn()

const baseBody = {
    username: 'testuser',
    password: 'password123456',
    email: 'test@gmail.com',
    first_name: 'test',
    last_name: 'user',
    phone_num: '052-252-5251'
}

const invalidBodies = [
    { case: 'missing username', body: { ...baseBody, username: '' } },
    { case: 'username to short', body: { ...baseBody, username: 'asd' } },
    { case: 'username to long', body: { ...baseBody, username: 'a'.repeat(50) } },
    { case: 'username special characters', body: { ...baseBody, username: 'test@test' } },
    { case: 'email invalid format', body: { ...baseBody, email: 'dawdawdawda.com' } },
    { case: 'missing password', body: { ...baseBody, password: '' } },
    { case: 'password to short', body: { ...baseBody, password: '1234a' } },
    { case: 'password no characters', body: { ...baseBody, password: '123456789' } },
    { case: 'phone number have characters', body: { ...baseBody, phone_num: '231awe252' } },
    { case: 'firstname have number', body: { ...baseBody, first_name: 'test1' } },
    { case: 'lastname have number', body: { ...baseBody, last_name: 'user1' } }
]

describe('validate middleware', () => {
    beforeEach(() => vi.clearAllMocks())

    it.each(invalidBodies)('should return 400 when $case', async ({ body }) => {
        const req = { body } as Request
        validate(registerSchema)(req, mockRes, mockNext)

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400 })
        )
    })

    it('should  call next() without error when valid input', () => {
        const req = { body: baseBody } as Request
        validate(registerSchema)(req, mockRes, mockNext)

        expect(mockNext).toHaveBeenCalledWith()
    })

    it('should call next with error when non-ZodError thrown', () => {
        const badSchema = { parse: () => { throw new Error('unexpected') } } as any
        const req = { body: badSchema } as Request
        validate(badSchema)(req, mockRes, mockNext)

        expect(mockNext).toHaveBeenCalledWith(expect.any(Error))
    })
})