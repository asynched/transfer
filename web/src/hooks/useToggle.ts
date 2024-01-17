import { useState } from 'react'

export function useToggle(initial = false) {
  const [state, setState] = useState(initial)

  const toggle = () => setState((state) => !state)

  return [state, toggle] as const
}
