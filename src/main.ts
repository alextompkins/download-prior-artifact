import * as core from '@actions/core'
import * as github from '@actions/github'
import { downloadFile, unzipFile } from './download'
import { getConfig } from './action'

async function run(): Promise<void> {
  try {
    const { name, path, repo, token, tempDir } = getConfig()
    const octokit = github.getOctokit(token)

    const [owner, repoName] = repo.split('/')

    const res = await octokit.rest.actions.listArtifactsForRepo({
      owner,
      repo: repoName
    })

    if (res.status !== 200) {
      throw Error(`The github API returned a non-success code: ${res.status}`)
    }

    const artifacts = res.data.artifacts
    const matching = artifacts.find((artifact) => artifact.name === name)

    if (!matching) {
      throw Error(`No artifact found in ${repo} with name '${name}'`)
    }
    core.debug(`Found artifact.`)

    const zipDownloadPath = `${tempDir}/artifact.zip`

    core.debug(`Downloading artifact from ${matching.archive_download_url}...`)
    await downloadFile(matching.archive_download_url, zipDownloadPath, token)

    core.debug(`Unzipping artifact...`)
    await unzipFile(zipDownloadPath, path)

    core.debug(`Success.`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
