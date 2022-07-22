import * as core from '@actions/core'
import * as github from '@actions/github'
import { downloadFile, unzipFile } from './download'
import { getConfig } from './action'

async function run(): Promise<void> {
  try {
    const { name, path, repo, commitHash, token, tempDir } = getConfig()
    const octokit = github.getOctokit(token)

    const [owner, repoName] = repo.split('/')

    const res = await octokit.rest.actions.listArtifactsForRepo({
      owner,
      repo: repoName
    })

    if (res.status !== 200) {
      throw Error(`The github API returned a non-success code: ${res.status}`)
    }

    let artifacts = res.data.artifacts
    if (commitHash) {
      artifacts = artifacts.filter((artifact) =>
        artifact.workflow_run?.head_sha?.startsWith(commitHash)
      )
    }
    const matching = artifacts.find((artifact) => artifact.name === name)

    if (!matching) {
      throw Error(`No artifact found in ${repo} with name '${name}'`)
    }
    core.info(`Found artifact.`)

    const zipDownloadPath = `${tempDir}/artifact.zip`

    core.info(`Downloading artifact from ${matching.archive_download_url}...`)
    await downloadFile(matching.archive_download_url, zipDownloadPath, token)

    core.info(`Unzipping artifact ${zipDownloadPath} to ${path}...`)
    await unzipFile(zipDownloadPath, path)

    core.info(`Success.`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
