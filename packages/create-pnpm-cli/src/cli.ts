import { version } from '../package.json'
import { PACKAGE_CHOICES, PACKAGE_MAP, TEMPLATE_PATH } from './constants'
import { PACKAGE_ENUM } from './types'
import { handleError } from './utils'
import { Separator, checkbox, input, select } from '@inquirer/prompts'
import { exec, spawn } from 'child_process'
import { program } from 'commander'
import glob from 'fast-glob'
import fse from 'fs-extra'
import packageManagerInstall from 'package-manager-install'
import path from 'path'

// 作者推荐以单文件组织cli https://github.com/tj/commander.js/issues/983

export const cli = program

cli.name('create-pnpm-cli').version(version)

cli
  .command('create', { isDefault: true })
  .description('create pnpm cli') // 单独使用description才使命令参数生效
  .action(async () => {
    // 选择模板
    const names = await glob(`**`, {
      deep: 1,
      cwd: TEMPLATE_PATH,
      onlyFiles: false,
    })

    const template = await select({
      message: '请选择模板',
      choices: names.map((item) => ({ name: item, value: item })),
    })

    // 输入包名
    const name = await input({
      message: '请输入包名',
      default: template,
    })

    // 创建文件夹 拷贝文件
    fse.mkdir(name).catch((err) => handleError(err, '创建文件夹错误'))

    fse
      .copy(path.join(TEMPLATE_PATH, template), name)
      .catch((err) => handleError(err, '拷贝文件错误'))

    // 选择包 安装包
    // const packages = await checkbox<PACKAGE_ENUM>({
    //   message: '请选择需要的包',
    //   choices: PACKAGE_CHOICES,
    // })

    packageManagerInstall({ cwd: name })
  })

cli.parse()