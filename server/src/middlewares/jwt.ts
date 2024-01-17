import { t, type Context } from 'elysia'
import { jwt as jwtModule } from '@elysiajs/jwt'
import { HttpException } from 'src/exceptions/http'

export const jwt = jwtModule({
  secret: process.env.JWT_SECRET!,
  exp: '1d',
  schema: t.Object({
    id: t.Number(),
    role: t.Literal('user'),
  }),
})

export const authenticated = async (ctx: Context<any, any, any>) => {
  const auth = ctx.headers.authorization

  if (!auth || !auth.startsWith('Bearer ')) {
    throw new HttpException('Unauthorized', 401)
  }

  const token = auth.slice(7, auth.length)

  const data = await (ctx as any).jwt.verify(token)

  if (!data) {
    throw new HttpException('Unauthorized', 401)
  }

  return data as { id: number; role: 'user' }
}
