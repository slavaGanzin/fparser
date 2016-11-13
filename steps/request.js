needle = promisify('needle')

module.exports = ({
  method, url, data
} = options) =>
  needle.request(method, url, data, options)

  
