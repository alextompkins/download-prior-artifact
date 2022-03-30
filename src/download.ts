import fs from 'fs'
import https from 'https'
import unzipper from 'unzipper'

export async function downloadFile(
  url: string,
  path: string,
  token: string
): Promise<void> {
  const fileStream = fs.createWriteStream(path)

  return new Promise((resolve, reject) => {
    https.get(
      url,
      { headers: { Authorization: `token ${token}` } },
      (response) => {
        response.pipe(fileStream)
        response.on('error', reject)
        fileStream.on('finish', resolve)
      }
    )
  })
}

export async function unzipFile(src: string, dest: string): Promise<void> {
  const readStream = fs.createReadStream(src)

  return new Promise((resolve, reject) => {
    const parseStream = readStream.pipe(unzipper.Extract({ path: dest }))
    parseStream.on('error', reject)
    parseStream.on('finish', resolve)
  })
}

async function test(): Promise<void> {
  const ZIP_PATH = 'artifact.zip'

  try {
    await downloadFile(
      'https://api.github.com/repos/phocassoftware/fs-app/actions/artifacts/181787408/zip',
      ZIP_PATH,
      process.env.GITHUB_TOKEN_PSW || ''
    )

    await unzipFile(ZIP_PATH, 'temp')
  } catch (err) {
    console.error(err)
  }
}

test()
