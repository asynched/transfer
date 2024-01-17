import { Elysia } from 'elysia'
import fs from 'node:fs/promises'
import { cron } from '@elysiajs/cron'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { staticPlugin } from '@elysiajs/static'
import { router as auth } from 'src/modules/auth'
import { router as files } from 'src/modules/files'
import { HttpException } from 'src/exceptions/http'
import { prisma } from 'src/services/prisma'

const app = new Elysia()

app
  .error({
    HTTP_EXCEPTION: HttpException,
  })
  .onError(({ code, error }) => {
    switch (code) {
      case 'HTTP_EXCEPTION':
        return error.intoResponse()
    }
  })
  .use(
    cron({
      pattern: '0 0 * * *',
      name: 'deleteFiles',
      async run() {
        console.log('Deleting files')

        const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24

        const files = await prisma.file.findMany({
          where: {
            createdAt: {
              lte: new Date(Date.now() - TWENTY_FOUR_HOURS),
            },
          },
        })

        await Promise.all(files.map((file) => fs.unlink(file.url)))

        const { count } = await prisma.file.deleteMany({
          where: {
            createdAt: {
              lte: new Date(Date.now() - TWENTY_FOUR_HOURS),
            },
          },
        })

        console.log(`Deleted ${count} files`)
      },
    })
  )
  .use(
    staticPlugin({
      prefix: '/static',
      assets: 'static',
    })
  )
  .use(swagger())
  .use(
    cors({
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
  )
  .use(auth)
  .use(files)

app.listen(
  {
    port: 3000,
    hostname: 'localhost',
  },
  (server) => {
    console.log(
      `Server is listening on http://${server.hostname}:${server.port}`
    )
  }
)
