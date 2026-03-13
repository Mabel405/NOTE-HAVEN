import bcrypt from 'bcryptjs'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!validator.isEmail(body.email)) {
      throw createError({
        statusCode: 400,
        message: 'Correo electrónico inválido.',
      })
    }

    if (
      !validator.isStrongPassword(body.password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
    ) {
      throw createError({
        statusCode: 400,
        message: 'La contraseña debe tener mínimo 8 caracteres.',
      })
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        message: 'Correo o contraseña incorrectos.',
      })
    }

    const isValid = await bcrypt.compare(body.password, user.password)

    if (!isValid) {
      throw createError({
        statusCode: 400,
        message: 'Correo o contraseña incorrectos.',
      })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
    setCookie(event, 'NoteNestJWT', token)

    return { data: 'success!' }
  } catch (error) {
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        message: 'Ya existe una cuenta con este correo.',
      })
    }

    throw error
  }
})