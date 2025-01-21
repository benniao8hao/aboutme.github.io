'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://localhost:9530"'//'"http://www.0898so.com"'//'"http://localhost:1477"'//'"https://mockapi.eolinker.com/RXWsdzsa51be8f236959e0f2152380a34938508a76d3e0c"'//末尾不带/
})
