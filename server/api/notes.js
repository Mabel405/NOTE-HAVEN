import jwt from 'jsonwebtoken'
import prisma from '~/server/utils/prisma.js'

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event)
    const token = cookies.NoteNestJWT

    if (!token) {
      throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    const notes = await prisma.note.findMany({
      where: { userId: decodedToken.id },
      orderBy: [{ isFavorite: 'desc' }, { updatedAt: 'desc' }],
    })

    return notes
  } catch (err) {
    console.log(err)
    throw err
  }
})