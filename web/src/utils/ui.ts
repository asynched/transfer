export interface PreventDefault {
  preventDefault(): void
}

export function preventDefault<E extends PreventDefault>(
  fn?: (event: E) => unknown
) {
  return (event: E) => {
    event.preventDefault()
    fn?.(event)
  }
}
