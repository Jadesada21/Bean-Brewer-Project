import { pool } from "../db/connectPostgre.repository"
import { AppError } from "../util/AppError"
import bcrypt from 'bcrypt'


import {
    UsersResponse
} from "../types/users.type"

import { RegisterInput } from "../Schemas/register.schema"

export const createUsersService = async (
    body: RegisterInput
): Promise<UsersResponse> => {

    const { username, password, email, first_name, last_name, phone_num } = body

    const hashedPassword = await bcrypt.hash(password, 10)


    const response = await pool.query(
        `insert into users
        (username , password ,email ,first_name , last_name ,role , phone_num)
        values($1,$2,$3,$4,$5,$6,$7)
        returning 
        id ,username  , email , first_name , last_name  , role , phone_num`,
        [username, hashedPassword, email, first_name, last_name, 'customer', phone_num]
    )

    return response.rows[0]
}