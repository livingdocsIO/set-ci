#!/usr/bin/env node
const ci = require('env-ci')
const path = require('path')
const fs = require('fs')
const packageFile = path.resolve('./package.json')
const packageJson = require(packageFile)
const keyName = process.argv.slice(2)[0] || 'ci'
const ciVars = ci()
ciVars.date = new Date().toISOString()
packageJson[keyName] = ciVars
fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2))
process.stdout.write(JSON.stringify(packageJson[keyName], null, 2))
