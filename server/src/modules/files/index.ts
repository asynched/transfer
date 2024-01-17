import { Elysia, t } from 'elysia'
import path from 'node:path'
import fs from 'node:fs/promises'
import { HttpException } from 'src/exceptions/http'
import { authenticated, jwt } from 'src/middlewares/jwt'
import { prisma } from 'src/services/prisma'

export const router = new Elysia({
  prefix: '/files',
}).use(jwt)

const fileSchema = t.Object({
  id: t.String(),
  name: t.String(),
  url: t.String(),
  userId: t.Number(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
})

router.get(
  '/',
  async (ctx) => {
    const auth = await authenticated(ctx)

    const files = await prisma.file.findMany({
      where: {
        userId: auth.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return files
  },
  {
    response: t.Array(fileSchema),
    headers: t.Object({
      authorization: t.String(),
    }),
  }
)

router.get(
  '/:id',
  async (ctx) => {
    const file = await prisma.file.findUnique({
      where: {
        id: ctx.params.id,
      },
    })

    if (!file) {
      throw new HttpException('File not found', 404)
    }

    return file
  },
  {
    response: fileSchema,
  }
)

const FIFTY_MEGABYTES = 50 * 1024 * 1024

router.post(
  '/',
  async (ctx) => {
    const auth = await authenticated(ctx)

    const filename = `${crypto.randomUUID()}_${ctx.body.file.name.replaceAll(
      ' ',
      '_'
    )}`

    const filePath = path.join('static', 'files', filename)

    await Bun.write(filePath, await ctx.body.file.arrayBuffer())

    const entry = await prisma.file.create({
      data: {
        name: ctx.body.filename,
        url: filePath,
        userId: auth.id,
      },
    })

    return entry
  },
  {
    response: t.Object({
      id: t.String(),
      name: t.String(),
      url: t.String(),
      userId: t.Number(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
    }),
    headers: t.Object({
      authorization: t.String(),
    }),
    body: t.Object({
      filename: t.String(),
      file: t.File({
        maxSize: FIFTY_MEGABYTES,
      }),
    }),
  }
)

router.delete('/:id', async (ctx) => {
  const auth = await authenticated(ctx)

  const file = await prisma.file.findUnique({
    where: {
      id: ctx.params.id,
    },
  })

  if (!file) {
    throw new HttpException('File not found', 404)
  }

  if (file.userId !== auth.id) {
    throw new HttpException('File not found', 404)
  }

  await fs.unlink(file.url)

  await prisma.file.delete({
    where: {
      id: ctx.params.id,
    },
  })

  ctx.set.status = 204
})

router.get('/count', async (ctx) => {
  const auth = await authenticated(ctx)

  const count = await prisma.file.count({
    where: {
      userId: auth.id,
    },
  })

  return {
    count,
  }
})
