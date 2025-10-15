import { prismaClient } from "../db/lib"
import { compare, hash } from "bcryptjs"
import type { User } from "@prisma/client"
import jwt from "jsonwebtoken"

export interface CreateUserPayload {
  firstName: string
  lastName?: string
  email: string
  password: string
}

export interface GetUserTokenPayload {
  email: string
  password: string
}

export default class UserService {
  public static async createUser(payload: CreateUserPayload): Promise<User> {
    const { firstName, lastName, email, password } = payload

    if (!firstName || !email || !password) {
      throw new Error("firstName, email and password are required")
    }

    const hashedPassword = await hash(password, 10) // increase rounds for production

    try {
      return await prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword
        }
      })
    } catch (err: any) {
      // handle unique constraint on email (Prisma error code P2002)
      if (err?.code === "P2002") {
        throw new Error("Email already in use")
      }
      throw err
    }
  }

  private static async getUserByEmail(email: string) {
    return await prismaClient.user.findUnique(({ where: { email } }))
  }

  public static async getUserToken(payload: GetUserTokenPayload): Promise<string> {
    const { password, email } = payload

    const user = await this.getUserByEmail(email)
    if (!user) {
      throw new Error("User doesn't exists!")
    }

    const isValid = await compare(password, user.password)
    if (!isValid) {
      throw new Error("Invalid credentials")
    }

    const secret = process.env.JWT_SECRET || "BapaStunning"
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not set")
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email
      },
      secret,
      {
        expiresIn: "1h"
      }
    )

    return token
  }
}