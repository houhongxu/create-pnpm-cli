import { exit } from 'process'

export function handleError(err: unknown, message: string) {
  console.log(message + '：', err)

  exit(1)
}
