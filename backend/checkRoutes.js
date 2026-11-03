const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "src", "routes");

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".js")) continue;
  try {
    const m = require(path.join(dir, file));
    if (typeof m !== "function") {
      console.log("BAD  ", file, "-> exports", Object.keys(m || {}));
    }
  } catch (e) {
    console.log("ERROR", file, "->", e.message);
  }
}
console.log("done");