import { execSync } from 'child_process'
import glob from 'fast-glob'
import fse from 'fs-extra'
import os from 'os'
import path from 'path'
import { exit } from 'process'

export function handleError(err: unknown, message: string) {
  console.log(message + '：', err)

  exit(1)
}

// 获取临时目录路径
export function getTempDir(): string {
  return path.join(os.tmpdir(), 'repositories')
}

/**
 * 执行 git clone 命令
 * @param repoUrl 仓库 URL
 * @param targetPath 目标路径
 */
function cloneRepository(repoUrl: string, targetPath: string): void {
  // 确保 URL 以 .git 结尾
  const gitRepoUrl = repoUrl.endsWith('.git') ? repoUrl : `${repoUrl}.git`

  // 直接 clone 整个仓库（浅克隆）
  execSync(
    `git clone --depth 1 --branch main "${gitRepoUrl}" "${targetPath}"`,
    {
      stdio: 'inherit',
    },
  )
}

/**
 * 获取仓库的临时目录路径
 * @param repoUrl 仓库地址
 * @returns 仓库的临时目录路径
 */
function getRepoTempPath(repoUrl: string): string {
  const tempDir = getTempDir()
  const [gitRepoUrl] = repoUrl.split('#') // 忽略分支，固定使用 main
  return path.join(
    tempDir,
    gitRepoUrl.split('/').pop()?.replace('.git', '') || 'unknown',
  )
}

/**
 * 拉取仓库到临时目录
 * @param repoUrl 仓库地址
 * @returns 仓库的临时目录路径
 */
export async function fetchRepository(repoUrl: string): Promise<string> {
  const repoTempPath = getRepoTempPath(repoUrl)

  // 确保临时目录存在
  await fse.ensureDir(path.dirname(repoTempPath))

  // 如果仓库目录已存在，先删除
  if (await fse.pathExists(repoTempPath)) {
    await fse.remove(repoTempPath)
  }

  try {
    const [gitRepoUrl] = repoUrl.split('#')
    // 执行 git clone
    cloneRepository(gitRepoUrl, repoTempPath)
    return repoTempPath
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    throw new Error(`从仓库拉取失败: ${repoUrl}。错误信息: ${errorMessage}`)
  }
}

/**
 * 从仓库的 templates 目录读取模板列表
 * @param repoTempPath 仓库的临时目录路径
 * @returns 模板名称列表
 */
export async function getTemplateNames(
  repoTempPath: string,
): Promise<string[]> {
  const templatesPath = path.join(repoTempPath, 'templates')

  if (!(await fse.pathExists(templatesPath))) {
    throw new Error('仓库中不存在 templates 目录')
  }

  const names = await glob(`**`, {
    deep: 1,
    cwd: templatesPath,
    onlyFiles: false,
  })

  return names
}

/**
 * 获取模板的完整路径
 * @param repoTempPath 仓库的临时目录路径
 * @param templateName 模板名称
 * @returns 模板的完整路径
 */
export function getTemplatePath(
  repoTempPath: string,
  templateName: string,
): string {
  return path.join(repoTempPath, 'templates', templateName)
}
