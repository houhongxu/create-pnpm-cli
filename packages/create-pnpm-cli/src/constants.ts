import { Choice, PACKAGE_ENUM } from './types'
import path from 'path'

export const ROOT_PATH = path.join(__dirname, '..')

export const TEMPLATE_PATH = path.join(ROOT_PATH, 'template')

export const PACKAGE_CHOICES: Choice<PACKAGE_ENUM>[] = [
  PACKAGE_ENUM.prettier,
].map((item) => ({ name: item, value: item }))

export const PACKAGE_MAP: Record<
  PACKAGE_ENUM,
  { packages: string[]; options?: string[] }
> = {
  [PACKAGE_ENUM.prettier]: {
    packages: ['prettier', '@trivago/prettier-plugin-sort-imports'],
    options: ['--save-dev'],
  },
}
