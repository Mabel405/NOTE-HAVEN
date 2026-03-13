import jwt from 'jsonwebtoken'
import prisma from '~/server/utils/prisma.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const id = getRouterParam(event, 'id')
    const cookies = parseCookies(event)
    const token = cookies.NoteNestJWT

    if (!token) {
      throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const note = await prisma.note.findUnique({ where: { id: Number(id) } })

    if (!note) throw createError({ statusCode: 404, statusMessage: 'Nota no encontrada' })
    if (note.userId !== decodedToken.id) throw createError({ statusCode: 403, statusMessage: 'Sin permiso' })

    const updated = await prisma.note.update({
      where: { id: Number(id) },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.text !== undefined && { text: body.text }),
        ...(body.isFavorite !== undefined && { isFavorite: body.isFavorite }),
      },
    })

    return updated
  } catch (err) {
    console.log(err)
    throw err
  }
})