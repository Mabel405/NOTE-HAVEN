import jwt from 'jsonwebtoken'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = await getRouterParam(event, 'id')

    const cookies = parseCookies(event)
    const token = cookies.NoteNestJWT

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authorized to update',
      })
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

    const noteTryingToDelete = await prisma.note.findUnique({
      where: { id: Number(id) },
    })

    if (!noteTryingToDelete) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Note does not exist',
      })
    }

    if (noteTryingToDelete.userId !== decodedToken.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Does not have permission to delete note',
      })
    }

    await prisma.note.delete({
      where: { id: Number(id) },
    })

    return { success: true }  // ← antes hacía console.log(body) que no existe
  } catch (err) {
    console.log(err)
    throw err
  }
})