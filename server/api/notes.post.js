import jwt from 'jsonwebtoken'
import prisma from '~/server/utils/prisma.js'

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event)
    const token = cookies.NoteNestJWT

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No autorizado',
      })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    const newNote = await prisma.note.create({
      data: {
        text: '',
        title: '',
        userId: decodedToken.id,
      },
    })

    return newNote
  } catch (err) {
    console.log(err)
    throw createError({
      statusCode: 500,
      statusMessage: 'No se pudo crear la nota',
    })
  }
})