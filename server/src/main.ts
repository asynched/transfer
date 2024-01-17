import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { staticPlugin } from '@elysiajs/static'
import { router as auth } from 'src/modules/auth'
import { router as files } from 'src/modules/files'
import { HttpException } from 'src/exceptions/http'

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
