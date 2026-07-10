import { execSync } from 'node:child_process'

const trackedPaths = ['index.html', 'vercel.json', 'public/']

function git(command) {
  return execSync(`git ${command}`, { encoding: 'utf8' }).trim()
}

const dirty = git(`status --porcelain -- ${trackedPaths.join(' ')}`)
if (dirty) {
  console.error('\nDeploy blocked: commit site assets before deploying.')
  console.error('Vercel only ships tracked files from git.\n')
  console.error(dirty)
  console.error('\nRun: git add index.html vercel.json public/ && git commit -m "your message"\n')
  process.exit(1)
}

console.log('Deploy check passed: index.html, vercel.json, and public/ are committed.')
