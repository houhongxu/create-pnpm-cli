import { version } from '../package.json'
import { TEMPLATE_REPO_URL } from './constants'
import {
  handleError,
  fetchRepository,
  getTemplateNames,
  getTemplatePath,
} from './utils'
import { input, select } from '@inquirer/prompts'
import { program } from 'commander'
import fse from 'fs-extra'
import packageManagerInstall from 'package-manager-install'
import path from 'path'

// 作者推荐以单文件组织cli https://github.com/tj/commander.js/issues/983

export const cli = program

cli.name('create-pnpm-cli').version(version)

cli
  .command('create', { isDefault: true })
  .description('create pnpm cli') // 单独使用description才使命令参数生效
  .argument('[path]', 'path to mkdir', './')
  .action(async (targetPath) => {
    // 从仓库拉取模板
    console.log('正在从仓库拉取模板...')
    let repoTempPath: string
    try {
      repoTempPath = await fetchRepository(TEMPLATE_REPO_URL)
    } catch (err) {
      handleError(err, '拉取仓库失败')
      return // 这行不会执行，因为 handleError 会 exit，但 TypeScript 需要它
    }

    // 从仓库读取模板列表
    let names: string[]
    try {
      names = await getTemplateNames(repoTempPath)
    } catch (err) {
      handleError(err, '读取模板列表失败')
      return
    }

    if (names.length === 0) {
      handleError(new Error('未找到任何模板'), '模板列表为空')
      return
    }

    // 选择模板
    const template = await select({
      message: '请选择模板',
      choices: names.map((item) => ({ name: item, value: item })),
    })

    // 输入包名
    const name = await input({
      message: '请输入包名',
      default: template,
    })

    // 创建目标文件夹并拷贝文件
    const target = path.join(targetPath, name)
    const templateTempPath = getTemplatePath(repoTempPath, template)

    await fse
      .ensureDir(target)
      .catch((err) => handleError(err, '创建文件夹失败'))

    console.log('正在拷贝文件...')
    await fse
      .copy(templateTempPath, target)
      .catch((err) => handleError(err, '拷贝文件错误'))

    // 选择包 安装包
    // const packages = await checkbox<PACKAGE_ENUM>({
    //   message: '请选择需要的包',
    //   choices: PACKAGE_CHOICES,
    // })

    await packageManagerInstall({ cwd: target })
  })

cli.parse()
