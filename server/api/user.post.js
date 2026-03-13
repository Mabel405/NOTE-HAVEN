import bcrypt from 'bcryptjs'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import prisma from '~/server/utils/prisma.js'

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
        minLength: 7,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
    ) {
      throw createError({
        statusCode: 400,
        message: 'La contraseña debe tener mínimo 7 caracteres.',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(body.password, salt)

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: passwordHash,
        salt: salt,
      },
    })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
    setCookie(event, 'NoteNestJWT', token)

    return { data: 'success!' }
  } catch (error) {
    console.log(error.code)

    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        message: 'Ya existe una cuenta con este correo.',
      })
    }

    throw error
  }
})