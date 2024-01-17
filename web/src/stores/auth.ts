import { createStore } from 'src/hooks/useStore'
import { type Profile } from 'src/services/api/auth'

export const auth = createStore<Profile | null>(null)
