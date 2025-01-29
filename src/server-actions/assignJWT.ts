"use server"

import jwt from "jsonwebtoken"

export const assignJWT = async (email: string | null, schools: string[]| undefined) => {
    const token = jwt.sign({ email, schools  }, process.env.JWT_SECRET || "default", {
        expiresIn: '1h',
    });

    return token
}