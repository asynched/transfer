export const GITHUB_CLIENT_ID = import.meta.env.VITE_ENV_GITHUB_CLIENT_ID
export const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user`
