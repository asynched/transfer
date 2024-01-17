import { useSyncExternalStore } from 'react'

export type Subscriber<T> = (value: T) => unknown

export type Store<T> = {
  get: () => T
  set: (value: T) => void
  update: (updater: (value: T) => T) => void
  subscribe: (subscriber: Subscriber<T>) => () => void
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial

  const listeners = new Set<Subscriber<T>>()

  const get = () => state

  const set = (value: T) => {
    state = value
    listeners.forEach((subscriber) => subscriber(state))
  }

  const update = (fn: (value: T) => T) => set(fn(state))

  const subscribe = (subscriber: Subscriber<T>) => {
    listeners.add(subscriber)
    return () => listeners.delete(subscriber)
  }

  return {
    get,
    set,
    update,
    subscribe,
  }
}

export function useStore<T>(store: Store<T>) {
  return useSyncExternalStore(store.subscribe, store.get)
}
