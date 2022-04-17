const CopyPlugin = require("copy-webpack-plugin")

// noinspection JSUnusedGlobalSymbols
module.exports = {
  reactStrictMode: true,
  target: "serverless",
  redirects: async function() {
    return [
      {
        source: '/lts',
        destination: '/langtime/sc',
        permanent: true,
      }
    ]
  }
}
