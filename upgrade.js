const fs = require("fs")

fs.copyFileSync(
  "../lexurgy/build/distributions/lexurgy.js",
  "lib/lexurgy.js"
)
fs.copyFileSync(
  "../lexurgy/build/distributions/lexurgy.js.map",
  "lib/lexurgy.js.map"
)
