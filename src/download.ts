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
    throw Error('Response was invalid')
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)

    response.body?.pipe(file)
    response.body?.on('error', reject)
    response.body?.on('finish', resolve)
  })
}

export async function unzipFile(src: string, dest: string): Promise<void> {
  return extract(src, { dir: dest })
}

async function test(): Promise<void> {
  const ZIP_PATH = 'artifact.zip'

  try {
    await downloadFile(
      'https://api.github.com/repos/phocassoftware/fs-app/actions/artifacts/181787408/zip',
      ZIP_PATH,
      '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'
    )

    await unzipFile(ZIP_PATH, path.join(path.resolve(), 'temp'))
  } catch (err) {
    console.error(err)
  }
}

test()
