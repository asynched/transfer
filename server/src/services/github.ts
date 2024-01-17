type AccessTokenResponse = {
  access_token: string
}

type EmailResponse = Array<{
  email: string
  primary: boolean
  verified: boolean
  visibility: 'public' | 'private'
}>

type ProfileResponse = {
  id: number
  login: string
  url: string
  name: string
  email: string
}

export class GithubAuthService {
  async getAccessToken(code: string) {
    try {
      const url = new URL('https://github.com/login/oauth/access_token')

      url.searchParams.append('client_id', process.env.GITHUB_CLIENT_ID!)
      url.searchParams.append(
        'client_secret',
        process.env.GITHUB_CLIENT_SECRET!
      )
      url.searchParams.append('code', code)
      url.searchParams.append('scope', 'user')

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const data = (await response.json()) as AccessTokenResponse

      return data.access_token
    } catch (err) {
      console.error(err)
      return null
    }
  }

  async getEmail(token: string) {
    const response = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${token}`,
      },
    })

    const data = (await response.json()) as EmailResponse

    return data.find((email) => email.primary && email.verified)?.email
  }

  async getProfile(token: string) {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
      },
    })

    const data = (await response.json()) as ProfileResponse

    if (!data.email) {
      const primaryEmail = await this.getEmail(token)

      if (primaryEmail) {
        data.email = primaryEmail
      }
    }

    return data
  }
}

export const githubAuth = new GithubAuthService()
