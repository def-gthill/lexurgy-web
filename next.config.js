// noinspection JSUnusedGlobalSymbols
module.exports = {
  reactStrictMode: true,
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
