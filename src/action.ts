import * as core from '@actions/core'

export interface ActionConfig {
  name: string
  path: string
  repo: string
  commitHash: string
  token: string
  tempDir: string
}

export function getConfig(): ActionConfig {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    core.setFailed(
      'You must provide GITHUB_TOKEN as an env var to this action.'
    )
    throw Error('GitHub API token is missing')
  }

  const tempDir = process.env.RUNNER_TEMP

  if (!tempDir) {
    throw Error('RUNNER_TEMP is not available to this action.')
  }

  return {
    name: core.getInput('name', { required: true }),
    path: core.getInput('path', { required: true }),
    repo: core.getInput('repo', { required: true }),
    commitHash: core.getInput('commitHash', { required: false }),
    token,
    tempDir
  }
}
