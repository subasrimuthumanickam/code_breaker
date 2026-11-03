
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Loads a route file and always returns a usable router function.
// Accepts: module.exports = router | { router } | { default: router }
// If the file exports anything else, it prints WHICH file is wrong and stops.
function loadRouter(file) {
  let mod;
  try {
    mod = require(file);
  } catch (err) {
    console.error(`\n[ROUTE LOAD ERROR] Could not require "${file}"`);
    throw err;
  }

  if (typeof mod === "function") return mod;
  if (mod && typeof mod.router === "function") return mod.router;
  if (mod && typeof mod.default === "function") return mod.default;

  console.error(`\n[ROUTE EXPORT ERROR] "${file}" does not export a router.`);
  console.error("  It exported:", typeof mod, mod && Object.keys(mod));
  console.error("  Fix: the last line of that file must be:  module.exports = router;\n");
  process.exit(1);
}

const gameRoutes = loadRouter("./routes/gameRoutes");
const statsRoutes = loadRouter("./routes/StatsRoutes");
const settingsRoutes = loadRouter("./routes/SettingsRoutes");
const authRoutes = loadRouter("./routes/authRoutes");
const wordScrambleRoutes = loadRouter("./routes/Wordscrambleroutes");
const registerRoundRoutes = require("./routes/wordscrambleRoundFlow"); // a function you call
const puzzleRoutes = loadRouter("./routes/puzzleRoutes");
const wordscrambleCoinsRoutes = loadRouter("./routes/WordscrambleCoinsRoutes");
const playerRoutes = loadRouter("./routes/playerRoutes");
const braintwistRoutes = loadRouter("./routes/braintwistRoutes");
const braintwistMapRoutes = loadRouter("./routes/Braintwistmaproutes");
const wsProfileRoutes = loadRouter("./routes/wsProfileRoutes");
const progressRoutes = loadRouter("./routes/progress");
const skipRoutes = loadRouter("./routes/Skiproutes");

if (typeof registerRoundRoutes !== "function") {
  console.error("[ROUTE EXPORT ERROR] wordscrambleRoundFlow must export a function.");
  process.exit(1);
}

const LAST_LEVEL = 43; // <-- Brain Twist now has levels 2-43

// Brain Twist levels 2-43
const levelRoutes = [];
for (let n = 2; n <= LAST_LEVEL; n++) {
  const file =
    n === 35
      ? "./routes/BrainTwistLevel35Routes"
      : `./routes/Braintwistlevel${n}routes`;
  levelRoutes.push([n, loadRouter(file)]);
}

const app = express();

app.use(cors());
app.use(express.json());

console.log("RUNNING FILE:", __filename);

// Log every incoming request
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.originalUrl);
  next();
});

// General health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Code Breaker API is running" });
});

// Brain Twist health check
app.get("/api/braintwist/health", (req, res) => {
  res.json({ success: true, game: "Brain Twist", totalLevels: LAST_LEVEL });
});

// Brain Twist levels (keep before the generic Brain Twist routes)
for (const [n, router] of levelRoutes) {
  app.use(`/api/braintwist/level${n}`, router);
}

// Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
app.use("/api/braintwist/map", braintwistMapRoutes);

// Brain Twist routes - keep before generic /api routes
app.use("/api/braintwist", braintwistRoutes);

// Existing API routes
app.use("/api", gameRoutes);
app.use("/api", statsRoutes);
app.use("/api", settingsRoutes);
app.use("/api", authRoutes);

// Word Scramble coins - keep before general Word Scramble routes
app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// Register Word Scramble round-flow handlers
registerRoundRoutes(wordScrambleRoutes);

app.use("/api/wordscramble", wordScrambleRoutes);
app.use("/api/wordscramble", wsProfileRoutes);

app.use("/api", progressRoutes);
app.use("/api/wordscramble", puzzleRoutes);
app.use("/api", playerRoutes);
app.use("/api/skip", skipRoutes);

// 404 handler - no route matched
app.use((req, res) => {
  console.log("404 NOT MATCHED:", req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    error: `No route: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("[API ERROR]", req.method, req.originalUrl, err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Code Breaker API listening on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Brain Twist: http://localhost:${PORT}/api/braintwist/health`);
});