import * as core from '@actions/core'
import extract from 'extract-zip'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

export async function downloadFile(
  url: string,
  dest: string,
  token: string
): Promise<void> {
  const response = await fetch(url, {
    headers: { Authorization: `token ${token}` }
  })

  if (!response.ok || !response.body) {
    throw Error('GitHub API response was invalid')
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)

    response.body?.pipe(file)
    response.body?.on('error', reject)
    response.body?.on('finish', resolve)
  })
}

export async function unzipFile(src: string, dest: string): Promise<void> {
  const dir = path.join(path.resolve(), dest)
  core.info(`Absolute path to dest: ${dir}`)

  return extract(src, {
    dir,
    onEntry: (entry) =>
      core.info(
        `Extracting ${entry.fileName} (${(
          entry.uncompressedSize / 1000
        ).toFixed(1)}kB)`
      )
  })
}
