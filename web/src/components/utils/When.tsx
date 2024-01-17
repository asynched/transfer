import { ReactNode } from 'react'

type WhenProps<T> = {
  value: T | null | undefined
  fallback?: ReactNode
  children: (value: T) => React.ReactNode
}

export default function When<T>({ value, fallback, children }: WhenProps<T>) {
  if (value == null || value === undefined) {
    return fallback ?? null
  }

  return children(value)
}
