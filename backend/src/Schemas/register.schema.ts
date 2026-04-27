import { z } from 'zod'

export const registerSchema = z.object({
    username: z.string()
        .min(4, "Username must be at least 4 characters")
        .max(40, "Username must be max 40 characters ")
        .regex(/^[a-zA-Z0-9]{4,40}$/, "Username must contain only letter and number"),

    email: z.email("Invalid email format"),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain at least one letter and one number"),

    phone_num: z.string()
        .transform(val => val.replace(/-/g, ''))
        .pipe(z.string().regex(/^\d{10}$/, "Phone number must be 10 digits")),

    first_name: z.string()
        .regex(/^[\p{L}\s]+$/u, "Firstname must contain only letter"),

    last_name: z.string()
        .regex(/^[\p{L}\s]+$/u, "Lastname must contain only letter"),
})

export type RegisterInput = z.infer<typeof registerSchema>