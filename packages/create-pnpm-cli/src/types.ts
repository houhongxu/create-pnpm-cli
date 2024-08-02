export enum PACKAGE_ENUM {
  'prettier' = 'prettier',
}

export type Choice<Value> = {
  name?: string
  value: Value
  short?: string
  disabled?: boolean | string
  checked?: boolean
  type?: never
}
