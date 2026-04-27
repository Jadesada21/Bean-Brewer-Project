import { describe, it, expect, vi, beforeEach } from "vitest"
import { Request, Response, NextFunction } from "express"
import { createUsers } from "../../controller/register.controller"

vi.mock('../../service/register.service', () => ({
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

const validBodies = [
    { case: 'valid username', body: { ...baseBody, username: 'testuser' } },
    { case: 'valid email', body: { ...baseBody, email: 'test@gmail.com' } },
    { case: 'valid password', body: { ...baseBody, password: '12345678a' } },
    { case: 'valid firstname', body: { ...baseBody, first_name: 'test' } },
    { case: 'valid lastname', body: { ...baseBody, last_name: 'user' } },
    { case: 'valid phone number', body: { ...baseBody, phone_num: '052-252-6262' } }
]

describe('register controller', () => {
    beforeEach(() => vi.clearAllMocks())

    it.each(validBodies)('should return 201 when $case', async ({ body }) => {
        const req = { body } as Request
        const res = mockRes()
        await createUsers(req, res, mockNext)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ newCustomer: expect.any(Object) })
        )
    })

    it('should call next with error when services throws', async () => {
        const { createUsersService } = await import('../../service/register.service.js')
        vi.mocked(createUsersService).mockRejectedValueOnce(new Error('DB Error'))

        const req = { body: baseBody } as Request
        const res = mockRes()
        await createUsers(req, res, mockNext)

        expect(mockNext).toHaveBeenCalledWith(expect.any(Error))
    })
})