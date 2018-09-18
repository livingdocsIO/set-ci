#!/usr/bin/env node
const ci = require('env-ci')
const path = require('path')
const fs = require('fs')
const packageFile = path.resolve('./package.json')
const packageJson = require(packageFile)
const keyName = process.argv.slice(2)[0] || 'ci'
packageJson[keyName] = ci()
fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2))
console.log(JSON.stringify(packageJson[keyName], null, 2))
