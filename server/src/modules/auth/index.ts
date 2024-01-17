import { Elysia, t } from 'elysia'
import { HttpException } from 'src/exceptions/http'
import { authenticated, jwt } from 'src/middlewares/jwt'
import { githubAuth } from 'src/services/github'
import { prisma } from 'src/services/prisma'

export const router = new Elysia({
  prefix: '/auth',
})

router
  .use(jwt)
  .get(
    '/github',
    async (ctx) => {
      const token = await githubAuth.getAccessToken(ctx.query.code)

      if (!token) {
        throw new HttpException('Invalid code', 400)
      }

      const profile = await githubAuth.getProfile(token)

      let user = await prisma.user.findUnique({
        where: {
          provider_providerId_email: {
            email: profile.email,
            provider: 'github',
            providerId: profile.id.toString(),
          },
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.email,
            name: profile.name,
            provider: 'github',
            providerId: profile.id.toString(),
          },
        })
      }

      const jwt = await ctx.jwt.sign({
        id: user.id,
        role: 'user',
      })

      return {
        token: jwt,
      }
    },
    {
      query: t.Object({
        code: t.String(),
      }),
      response: t.Object({
        token: t.String(),
      }),
    }
  )
  .get(
    '/profile',
    async (ctx) => {
      const auth = await authenticated(ctx)

      const user = await prisma.user.findUnique({
        where: {
          id: auth.id,
        },
      })

      if (!user) {
        throw new HttpException('User not found', 404)
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      response: t.Object({
        id: t.Number(),
        name: t.String(),
        email: t.String(),
        createdAt: t.Date(),
        updatedAt: t.Date(),
      }),
    }
  )
