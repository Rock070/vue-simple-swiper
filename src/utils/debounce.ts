/* eslint-disable @typescript-eslint/no-unsafe-argument */
const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  timeout = 33.34,
) => {
  let timer: ReturnType<typeof setTimeout> | null

  return ((...args: any[]) => {
    if (timer != null)
      clearTimeout(timer)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    timer = setTimeout(() => fn(...args), timeout)
  }) as T
}

export default debounce
