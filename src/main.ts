import * as core from '@actions/core'
import * as github from '@actions/github'
import { getConfig } from './action'
import { downloadFile, unzipFile } from './download'

const ARTIFACT_DOWNLOAD_PATH = 'temp/artifact.zip'

async function run(): Promise<void> {
  try {
    const { name, path, owner, repo, token } = getConfig()
    const octokit = github.getOctokit(token)

    const res = await octokit.rest.actions.listArtifactsForRepo({
      owner,
      repo
    })

    if (res.status !== 200) {
      throw Error(`The github API returned a non-success code: ${res.status}`)
    }

    const artifacts = res.data.artifacts
    const matching = artifacts.find((artifact) => artifact.name === name)

    if (!matching) {
      throw Error(`No artifact found in ${owner}/${repo} with name '${name}'`)
    }

    await downloadFile(
      matching.archive_download_url,
      ARTIFACT_DOWNLOAD_PATH,
      token
    )
    await unzipFile(ARTIFACT_DOWNLOAD_PATH, path)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
