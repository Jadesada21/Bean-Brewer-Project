import { describe, it, expect, vi, beforeEach } from "vitest"
import { Request, Response, NextFunction } from "express"
import { createUsers } from "../controller/register.controller"

vi.mock('../service/register.service', () => ({
    createUsersService: vi.fn().mockResolvedValue({
        id: 1,
        username: 'test',
        email: 'test@gmail.com',
        first_name: 'test',
        last_name: 'user',
        role: 'customer',
        phone_num: '062-242-6242'
    })
}))

const mockRes = () => {
    const res = {} as Response
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    return res
}

const mockNext = vi.fn() as unknown as NextFunction

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
    { case: 'missing password', body: { ...baseBody, password: '' } }
]

describe('register controller', () => {
    beforeEach(() => vi.clearAllMocks())

    it.each(invalidBodies)('should return 400 when $case', async ({ body }) => {
        const req = { body } as Request
        const res = mockRes()
        await createUsers(req, res, mockNext)

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({ statusCode: 400 })
        )
    })
})