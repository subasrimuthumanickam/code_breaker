
// // // // require("dotenv").config();
// // // // const express = require("express");
// // // // const cors = require("cors");
// // // // const gameRoutes = require("./routes/gameRoutes");
// // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // const authRoutes = require("./routes/authRoutes");
// // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow"); // NEW: lock-safe start/next-round/retry
// // // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes"); // NEW: coins
// // // // const playerRoutes = require("./routes/playerRoutes");
// // // // // REMOVED: const registerRoutes = require("./routes/registerRoutes");
// // // // const app = express();
// // // // app.use(cors());
// // // // app.use(express.json());

// // // // // DEBUG: shows which server.js file is actually running
// // // // console.log("RUNNING FILE:", __filename);

// // // // // DEBUG: logs every request that reaches this server
// // // // app.use((req, res, next) => {
// // // //   console.log("REQ:", req.method, req.originalUrl);
// // // //   next();
// // // // });

// // // // app.use("/api", gameRoutes);
// // // // app.use("/api", statsRoutes);
// // // // app.use("/api", settingsRoutes);
// // // // app.use("/api", authRoutes); // login, guest, register are all in here

// // // // app.get("/api/health", (req, res) => res.json({ ok: true }));

// // // // // NEW: coins must be mounted BEFORE the other /api/wordscramble routes
// // // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // registerRoundRoutes(wordScrambleRoutes);

// // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));
// // // // app.use("/api", require("./routes/progress")); // adjust prefix to match your existing routes
// // // // app.use("/api/wordscramble", puzzleRoutes);
// // // // app.use("/api", playerRoutes);
// // // // app.use("/api/skip", require("./routes/Skiproutes"));
// // // // // REMOVED: app.use("/api", registerRoutes);

// // // // // DEBUG: any request that matched no route above ends up here
// // // // app.use((req, res) => {
// // // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);
// // // //   res.status(404).json({
// // // //     success: false,
// // // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // // //   });
// // // // });

// // // // app.use((err, req, res, next) => {
// // // //   console.error(err);
// // // //   res.status(500).json({ error: "Internal server error" });
// // // // });

// // // // const PORT = process.env.PORT || 4000;
// // // // app.listen(PORT, () => {
// // // //   console.log(`Code Breaker API listening on http://localhost:${PORT}`);
// // // // });
// // // require("dotenv").config();
// // // const express = require("express");
// // // const cors = require("cors");
// // // const gameRoutes = require("./routes/gameRoutes");
// // // const statsRoutes = require("./routes/StatsRoutes");
// // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // const authRoutes = require("./routes/authRoutes");
// // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow"); // NEW: lock-safe start/next-round/retry
// // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes"); // NEW: coins
// // // const playerRoutes = require("./routes/playerRoutes");
// // // const braintwistRoutes = require("./routes/braintwistRoutes"); // NEW: Brain Twist game
// // // // REMOVED: const registerRoutes = require("./routes/registerRoutes");
// // // const app = express();
// // // app.use(cors());
// // // app.use(express.json());

// // // // DEBUG: shows which server.js file is actually running
// // // console.log("RUNNING FILE:", __filename);

// // // // DEBUG: logs every request that reaches this server
// // // app.use((req, res, next) => {
// // //   console.log("REQ:", req.method, req.originalUrl);
// // //   next();
// // // });

// // // // NEW: Brain Twist (must be BEFORE the generic /api routes)
// // // app.use("/api/braintwist", braintwistRoutes);

// // // app.use("/api", gameRoutes);
// // // app.use("/api", statsRoutes);
// // // app.use("/api", settingsRoutes);
// // // app.use("/api", authRoutes); // login, guest, register are all in here

// // // app.get("/api/health", (req, res) => res.json({ ok: true }));

// // // // NEW: coins must be mounted BEFORE the other /api/wordscramble routes
// // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // registerRoundRoutes(wordScrambleRoutes);

// // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));
// // // app.use("/api", require("./routes/progress")); // adjust prefix to match your existing routes
// // // app.use("/api/wordscramble", puzzleRoutes);
// // // app.use("/api", playerRoutes);
// // // app.use("/api/skip", require("./routes/Skiproutes"));
// // // // REMOVED: app.use("/api", registerRoutes);

// // // // DEBUG: any request that matched no route above ends up here
// // // app.use((req, res) => {
// // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);
// // //   res.status(404).json({
// // //     success: false,
// // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // //   });
// // // });

// // // app.use((err, req, res, next) => {
// // //   console.error(err);
// // //   res.status(500).json({ error: "Internal server error" });
// // // });

// // // const PORT = process.env.PORT || 4000;
// // // app.listen(PORT, () => {
// // //   console.log(`Code Breaker API listening on http://localhost:${PORT}`);
// // // });

// // require("dotenv").config();

// // const express = require("express");
// // const cors = require("cors");

// // const gameRoutes = require("./routes/gameRoutes");
// // const statsRoutes = require("./routes/StatsRoutes");
// // const settingsRoutes = require("./routes/SettingsRoutes");
// // const authRoutes = require("./routes/authRoutes");
// // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // const puzzleRoutes = require("./routes/puzzleRoutes");
// // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // const playerRoutes = require("./routes/playerRoutes");
// // const braintwistRoutes = require("./routes/braintwistRoutes");

// // const app = express();

// // app.use(cors());
// // app.use(express.json());

// // // Confirm which server.js file is running
// // console.log("RUNNING FILE:", __filename);

// // // Log every incoming request
// // app.use((req, res, next) => {
// //   console.log("REQ:", req.method, req.originalUrl);
// //   next();
// // });

// // // General health check
// // app.get("/api/health", (req, res) => {
// //   res.json({
// //     ok: true,
// //     message: "Code Breaker API is running",
// //   });
// // });

// // // Brain Twist health check
// // app.get("/api/braintwist/health", (req, res) => {
// //   res.json({
// //     success: true,
// //     game: "Brain Twist",
// //     totalLevels: 7,
// //   });
// // });

// // // Brain Twist routes — keep before generic /api routes
// // app.use("/api/braintwist", braintwistRoutes);

// // // Existing API routes
// // app.use("/api", gameRoutes);
// // app.use("/api", statsRoutes);
// // app.use("/api", settingsRoutes);
// // app.use("/api", authRoutes);

// // // Word Scramble coins — keep before general Word Scramble routes
// // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // Register Word Scramble round-flow handlers
// // registerRoundRoutes(wordScrambleRoutes);

// // app.use("/api/wordscramble", wordScrambleRoutes);
// // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // app.use("/api", require("./routes/progress"));
// // app.use("/api/wordscramble", puzzleRoutes);
// // app.use("/api", playerRoutes);
// // app.use("/api/skip", require("./routes/Skiproutes"));

// // // 404 handler — no route matched
// // app.use((req, res) => {
// //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// //   res.status(404).json({
// //     success: false,
// //     error: `No route: ${req.method} ${req.originalUrl}`,
// //   });
// // });

// // // Error handler
// // app.use((err, req, res, next) => {
// //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// //   if (res.headersSent) {
// //     return next(err);
// //   }

// //   res.status(err.status || 500).json({
// //     success: false,
// //     error: err.message || "Internal server error",
// //   });
// // });

// // const PORT = process.env.PORT || 4000;

// // app.listen(PORT, "0.0.0.0", () => {
// //   console.log(`Code Breaker API listening on port ${PORT}`);
// //   console.log(`Health: http://localhost:${PORT}/api/health`);
// //   console.log(
// //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// //   );
// // });
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const gameRoutes = require("./routes/gameRoutes");
// const statsRoutes = require("./routes/StatsRoutes");
// const settingsRoutes = require("./routes/SettingsRoutes");
// const authRoutes = require("./routes/authRoutes");
// const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// const puzzleRoutes = require("./routes/puzzleRoutes");
// const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// const playerRoutes = require("./routes/playerRoutes");
// const braintwistRoutes = require("./routes/braintwistRoutes");
// const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Confirm which server.js file is running
// console.log("RUNNING FILE:", __filename);

// // Log every incoming request
// app.use((req, res, next) => {
//   console.log("REQ:", req.method, req.originalUrl);
//   next();
// });

// // General health check
// app.get("/api/health", (req, res) => {
//   res.json({
//     ok: true,
//     message: "Code Breaker API is running",
//   });
// });

// // Brain Twist health check
// app.get("/api/braintwist/health", (req, res) => {
//   res.json({
//     success: true,
//     game: "Brain Twist",
//     totalLevels: 7,
//   });
// });

// // Brain Twist level 2 (own routes: /start, /action, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level2", braintwistLevel2Routes);

// // Brain Twist routes — keep before generic /api routes
// app.use("/api/braintwist", braintwistRoutes);

// // Existing API routes
// app.use("/api", gameRoutes);
// app.use("/api", statsRoutes);
// app.use("/api", settingsRoutes);
// app.use("/api", authRoutes);

// // Word Scramble coins — keep before general Word Scramble routes
// app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // Register Word Scramble round-flow handlers
// registerRoundRoutes(wordScrambleRoutes);

// app.use("/api/wordscramble", wordScrambleRoutes);
// app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// app.use("/api", require("./routes/progress"));
// app.use("/api/wordscramble", puzzleRoutes);
// app.use("/api", playerRoutes);
// app.use("/api/skip", require("./routes/Skiproutes"));

// // 404 handler — no route matched
// app.use((req, res) => {
//   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

//   res.status(404).json({
//     success: false,
//     error: `No route: ${req.method} ${req.originalUrl}`,
//   });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error("[API ERROR]", req.method, req.originalUrl, err);

//   if (res.headersSent) {
//     return next(err);
//   }

//   res.status(err.status || 500).json({
//     success: false,
//     error: err.message || "Internal server error",
//   });
// });

// const PORT = process.env.PORT || 4000;

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Code Breaker API listening on port ${PORT}`);
//   console.log(`Health: http://localhost:${PORT}/api/health`);
//   console.log(
//     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
//   );
// });
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const gameRoutes = require("./routes/gameRoutes");
const statsRoutes = require("./routes/StatsRoutes");
const settingsRoutes = require("./routes/SettingsRoutes");
const authRoutes = require("./routes/authRoutes");
const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
const puzzleRoutes = require("./routes/puzzleRoutes");
const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
const playerRoutes = require("./routes/playerRoutes");
const braintwistRoutes = require("./routes/braintwistRoutes");
const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
const braintwistMapRoutes = require("./routes/Braintwistmaproutes");

const app = express();

app.use(cors());
app.use(express.json());

// Confirm which server.js file is running
console.log("RUNNING FILE:", __filename);

// Log every incoming request
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.originalUrl);
  next();
});

// General health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Code Breaker API is running",
  });
});

// Brain Twist health check
app.get("/api/braintwist/health", (req, res) => {
  res.json({
    success: true,
    game: "Brain Twist",
    totalLevels: 7,
  });
});

// Brain Twist level 2 (own routes: /start, /action, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level2", braintwistLevel2Routes);

// Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/map", braintwistMapRoutes);

// Brain Twist routes — keep before generic /api routes
app.use("/api/braintwist", braintwistRoutes);

// Existing API routes
app.use("/api", gameRoutes);
app.use("/api", statsRoutes);
app.use("/api", settingsRoutes);
app.use("/api", authRoutes);

// Word Scramble coins — keep before general Word Scramble routes
app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// Register Word Scramble round-flow handlers
registerRoundRoutes(wordScrambleRoutes);

app.use("/api/wordscramble", wordScrambleRoutes);
app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

app.use("/api", require("./routes/progress"));
app.use("/api/wordscramble", puzzleRoutes);
app.use("/api", playerRoutes);
app.use("/api/skip", require("./routes/Skiproutes"));

// 404 handler — no route matched
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

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Code Breaker API listening on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(
    `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
  );
});
