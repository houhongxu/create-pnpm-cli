import { execSync } from 'child_process'
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
 * 从 Git 仓库拉取模板
 * @param repoUrl 仓库地址，支持格式：
 * - https://github.com/owner/repo (完整 Git URL)
 * - git@github.com:owner/repo.git (SSH URL)
 * @param templateName 模板名称，将从仓库的 templates/{templateName} 目录获取
 * @returns 模板的临时目录路径（指向 templates/{templateName}）
 */
export async function fetchTemplateFromRepo(
  repoUrl: string,
  templateName: string,
): Promise<string> {
  const tempDir = getTempDir()
  const [gitRepoUrl] = repoUrl.split('#') // 忽略分支，固定使用 main
  const repoTempPath = path.join(
    tempDir,
    gitRepoUrl.split('/').pop()?.replace('.git', '') || 'unknown',
  )
  const templateTempPath = path.join(repoTempPath, 'templates', templateName)

  // 确保临时目录存在
  await fse.ensureDir(tempDir)

  // 如果仓库目录已存在，先删除
  if (await fse.pathExists(repoTempPath)) {
    await fse.remove(repoTempPath)
  }

  try {
    // 执行 git clone
    cloneRepository(gitRepoUrl, repoTempPath)

    // 检查模板目录是否存在
    if (!(await fse.pathExists(templateTempPath))) {
      throw new Error(
        `模板目录不存在: templates/${templateName}，请检查仓库中是否存在该模板`,
      )
    }

    return templateTempPath
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    throw new Error(`从仓库拉取模板失败: ${repoUrl}。错误信息: ${errorMessage}`)
  }
}
