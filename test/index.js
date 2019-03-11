const assert = require('assert')
const fs = require('fs')
const path = require('path')
const ci = require('env-ci')
const execSync = require('child_process').execSync
const ciScript = path.join(__dirname, '../index.js')

const readPackage = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))
execSync('npm init -y', {cwd: __dirname})

execSync(`node ${ciScript}`, {cwd: __dirname})
assert.equal(typeof readPackage().ci, 'object')
assert.equal(typeof readPackage().ci.isCi, 'boolean')

execSync(`node ${ciScript} customKey`, {cwd: __dirname})
assert.equal(typeof readPackage().customKey, 'object')
assert.equal(typeof readPackage().customKey.isCi, 'boolean')

const expectedVars = readPackage().customKey
delete expectedVars.date
assert.equal(JSON.stringify(ci({cwd: __dirname})), JSON.stringify(expectedVars))

const droneEnvs = {
  CI: 'drone',
  DRONE: 'true',
  DRONE_ARCH: 'amd64',
  DRONE_REPO: 'livingdocsIO/set-ci',
  DRONE_REPO_OWNER: 'livingdocsIO',
  DRONE_REPO_NAME: 'set-ci',
  DRONE_REPO_SCM: 'https://github.com/livingdocsIO/set-ci.git',
  DRONE_REPO_LINK: 'https://github.com/livingdocsIO/set-ci',
  DRONE_REPO_BRANCH: 'master',
  DRONE_REPO_PRIVATE: 'false',
  DRONE_REMOTE_URL: 'https://github.com/livingdocsIO/set-ci.git',
  DRONE_COMMIT_SHA: '0ffa90db60889e35cf67958eaa0aec7eb8cd12b1',
  DRONE_COMMIT_REF: 'commit ref',
  DRONE_COMMIT_BRANCH: 'master',
  DRONE_BUILD_NUMBER: '87',
  DRONE_BUILD_EVENT: 'pull_request',
  DRONE_JOB_NUMBER: '2',
  DRONE_BRANCH: 'some-commit-branch',
  DRONE_TAG: 'some-commit-tag',
  DRONE_PULL_REQUEST: '4234'
}

execSync(`node ${ciScript} ci`, {
  cwd: __dirname,
  env: Object.assign({}, process.env, droneEnvs)
})

const pkg = readPackage()
assert.equal(typeof pkg.ci, 'object')
assert.equal(pkg.ci.isCi, true)
assert.equal(pkg.ci.name, 'Drone')
assert.equal(pkg.ci.service, 'drone')
assert.equal(pkg.ci.commit, '0ffa90db60889e35cf67958eaa0aec7eb8cd12b1')
assert.equal(pkg.ci.tag, 'some-commit-tag')
assert.equal(pkg.ci.build, '87')
assert.equal(pkg.ci.branch, 'some-commit-branch')
assert.equal(pkg.ci.job, '2')
assert.equal(pkg.ci.pr, '4234')
assert.equal(pkg.ci.isPr, true)
assert.equal(pkg.ci.slug, 'livingdocsIO/set-ci')

process.stdout.write('How it looks:')
require('../index.js')
