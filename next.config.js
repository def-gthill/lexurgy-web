const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  reactStrictMode: true,
  target: "serverless",
  // Garbage solution to obvious flaw in NextJS,
  // https://github.com/vercel/next.js/issues/8251#issuecomment-854148718
  webpack: function (config, { dev, isServer }) {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    // copy files you're interested in
    if (!dev) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [{ from: "files", to: "files" }],
        })
      )
    }

    return config
  },
}
