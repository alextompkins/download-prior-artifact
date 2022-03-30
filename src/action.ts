import * as core from '@actions/core'
import * as github from '@actions/github'

export interface ActionConfig {
  name: string
  path: string
  owner: string
  repo: string
  token: string
}

export function getConfig(): ActionConfig {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    core.setFailed(
      'You must provide GITHUB_TOKEN as an env var to this action.'
    )
    throw Error('GitHub API token is missing')
  }

  return {
    name: core.getInput('name', { required: true }),
    path: core.getInput('path', { required: true }),
    owner: core.getInput('owner') || github.context.repo.owner,
    repo: core.getInput('repo') || github.context.repo.repo,
    token
  }
}
