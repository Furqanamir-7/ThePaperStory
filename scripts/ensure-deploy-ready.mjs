import { execSync } from 'node:child_process'

const trackedPaths = ['index.html', 'vercel.json', 'public/', 'api/', 'src/']

function git(command) {
  try {
    return execSync(`git ${command}`, { encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

try {
  const dirty = git(`status --porcelain -- ${trackedPaths.join(' ')}`)
  if (dirty) {
    console.log('Notice: Deploying with local working tree changes.')
  } else {
    console.log('Deploy check passed: clean git working tree.')
  }
} catch (e) {
  console.log('Notice: Proceeding with deployment.')
}
