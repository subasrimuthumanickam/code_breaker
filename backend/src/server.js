// // // // // // require("dotenv").config();
// // // // // // const express = require("express");
// // // // // // const cors = require("cors");
// // // // // // const gameRoutes = require("./routes/gameRoutes");

// // // // // // const app = express();
// // // // // // app.use(cors());
// // // // // // app.use(express.json());

// // // // // // app.use("/api", gameRoutes);

// // // // // // app.get("/api/health", (req, res) => res.json({ ok: true }));

// // // // // // // Basic error handler so unexpected DB/etc errors return JSON instead of HTML
// // // // // // app.use((err, req, res, next) => {
// // // // // //   console.error(err);
// // // // // //   res.status(500).json({ error: "Internal server error" });
// // // // // // });

// // // // // // const PORT = process.env.PORT || 4000;
// // // // // // app.listen(PORT, () => {
// // // // // //   console.log(`Code Breaker API listening on http://localhost:${PORT}`);
// // // // // // });
// // // // // require("dotenv").config();
// // // // // const express = require("express");
// // // // // const cors = require("cors");
// // // // // const gameRoutes = require("./routes/gameRoutes");
// // // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // // const settingsRoutes = require("./routes/SettingsRoutes");

// // // // // const app = express();
// // // // // app.use(cors());
// // // // // app.use(express.json());

// // // // // app.use("/api", gameRoutes);
// // // // // app.use("/api", statsRoutes);
// // // // // app.use("/api", settingsRoutes);

// // // // // app.get("/api/health", (req, res) => res.json({ ok: true }));

// // // // // // Basic error handler so unexpected DB/etc errors return JSON instead of HTML
// // // // // app.use((err, req, res, next) => {
// // // // //   console.error(err);
// // // // //   res.status(500).json({ error: "Internal server error" });
// // // // // });

// // // // // const PORT = process.env.PORT || 4000;
// // // // // app.listen(PORT, () => {
// // // // //   console.log(`Code Breaker API listening on http://localhost:${PORT}`);
// // // // // });
// // // // require("dotenv").config();
// // // // const express = require("express");
// // // // const cors = require("cors");
// // // // const gameRoutes = require("./routes/gameRoutes");
// // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // const authRoutes = require("./routes/authRoutes");
// // // // // const wordScrambleRoutes = require("./src/routes/Wordscrambleroutes");
// // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes"); 
// // // // const puzzleRoutes = require("./routes/puzzleRoutes");        
// // // // const app = express();
// // // // app.use(cors());
// // // // app.use(express.json());

// // // // app.use("/api", gameRoutes);
// // // // app.use("/api", statsRoutes);
// // // // app.use("/api", settingsRoutes);
// // // // app.use("/api", authRoutes);

// // // // app.get("/api/health", (req, res) => res.json({ ok: true }));
// // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));
// // // // app.use("/api", require("./routes/progress")); // adjust prefix to match your existing routes
// // // // // Basic error handler so unexpected DB/etc errors return JSON instead of HTML
// // // // app.use("/api/wordscramble", puzzleRoutes);
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

// // // const app = express();
// // // app.use(cors());
// // // app.use(express.json());

// // // app.use("/api", gameRoutes);
// // // app.use("/api", statsRoutes);
// // // app.use("/api", settingsRoutes);
// // // app.use("/api", authRoutes);

// // // app.get("/api/health", (req, res) => res.json({ ok: true }));

// // // // IMPORTANT: register the lock-protected round routes (start/next-round/retry)
// // // // onto the SAME router before it's mounted. The plain start/next-round/retry
// // // // handlers that used to live inside Wordscrambleroutes.js have been removed
// // // // from that file — this is now the ONLY place those three routes are defined.
// // // registerRoundRoutes(wordScrambleRoutes);

// // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));
// // // app.use("/api", require("./routes/progress")); // adjust prefix to match your existing routes
// // // app.use("/api/wordscramble", puzzleRoutes);

// // // // NOTE: wordscrambleroutes.addition.js is intentionally NOT mounted anymore.
// // // // It pointed at a Mongoose `Round` model that is a separate, unlocked round
// // // // system (the actual source of the two-different-rounds bug) and duplicated
// // // // paths this app doesn't use. Delete that file and delete
// // // // controllers/wordScrambleController.js + models/Round.js if nothing else
// // // // references them.

// // // // Basic error handler so unexpected DB/etc errors return JSON instead of HTML
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
// // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow"); // NEW: lock-safe start/next-round/retry
// // const puzzleRoutes = require("./routes/puzzleRoutes");

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // app.use("/api", gameRoutes);
// // app.use("/api", statsRoutes);
// // app.use("/api", settingsRoutes);
// // app.use("/api", authRoutes);

// // app.get("/api/health", (req, res) => res.json({ ok: true }));


// // registerRoundRoutes(wordScrambleRoutes);

// // app.use("/api/wordscramble", wordScrambleRoutes);
// // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));
// // app.use("/api", require("./routes/progress")); // adjust prefix to match your existing routes
// // app.use("/api/wordscramble", puzzleRoutes);


// // app.use((err, req, res, next) => {
// //   console.error(err);
// //   res.status(500).json({ error: "Internal server error" });
// // });

// // const PORT = process.env.PORT || 4000;
// // app.listen(PORT, () => {
// //   console.log(`Code Breaker API listening on http://localhost:${PORT}`);
// // });
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const gameRoutes = require("./routes/gameRoutes");
// const statsRoutes = require("./routes/StatsRoutes");
// const settingsRoutes = require("./routes/SettingsRoutes");
// const authRoutes = require("./routes/authRoutes");
// const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// const registerRoundRoutes = require("./routes/wordscrambleRoundFlow"); // NEW: lock-safe start/next-round/retry
// const puzzleRoutes = require("./routes/puzzleRoutes");
// const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes"); // NEW: coins
// const playerRoutes = require("./routes/playerRoutes");
// const registerRoutes = require("./routes/registerRoutes");
// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api", gameRoutes);
// app.use("/api", statsRoutes);
// app.use("/api", settingsRoutes);
// app.use("/api", authRoutes);

// app.get("/api/health", (req, res) => res.json({ ok: true }));

// // NEW: coins must be mounted BEFORE the other /api/wordscramble routes
// app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// registerRoundRoutes(wordScrambleRoutes);

// app.use("/api/wordscramble", wordScrambleRoutes);
// app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));
// app.use("/api", require("./routes/progress")); // adjust prefix to match your existing routes
// app.use("/api/wordscramble", puzzleRoutes);
// app.use("/api", playerRoutes);
// app.use("/api/skip", require("./routes/Skiproutes"));
// app.use("/api", registerRoutes);
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: "Internal server error" });
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Code Breaker API listening on http://localhost:${PORT}`);
// });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");
const statsRoutes = require("./routes/StatsRoutes");
const settingsRoutes = require("./routes/SettingsRoutes");
const authRoutes = require("./routes/authRoutes");
const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
const registerRoundRoutes = require("./routes/wordscrambleRoundFlow"); // NEW: lock-safe start/next-round/retry
const puzzleRoutes = require("./routes/puzzleRoutes");
const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes"); // NEW: coins
const playerRoutes = require("./routes/playerRoutes");
// REMOVED: const registerRoutes = require("./routes/registerRoutes");
const app = express();
app.use(cors());
app.use(express.json());

// DEBUG: shows which server.js file is actually running
console.log("RUNNING FILE:", __filename);

// DEBUG: logs every request that reaches this server
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.originalUrl);
  next();
});

app.use("/api", gameRoutes);
app.use("/api", statsRoutes);
app.use("/api", settingsRoutes);
app.use("/api", authRoutes); // login, guest, register are all in here

app.get("/api/health", (req, res) => res.json({ ok: true }));

// NEW: coins must be mounted BEFORE the other /api/wordscramble routes
app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

registerRoundRoutes(wordScrambleRoutes);

app.use("/api/wordscramble", wordScrambleRoutes);
app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));
app.use("/api", require("./routes/progress")); // adjust prefix to match your existing routes
app.use("/api/wordscramble", puzzleRoutes);
app.use("/api", playerRoutes);
app.use("/api/skip", require("./routes/Skiproutes"));
// REMOVED: app.use("/api", registerRoutes);

// DEBUG: any request that matched no route above ends up here
app.use((req, res) => {
  console.log("404 NOT MATCHED:", req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    error: `No route: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Code Breaker API listening on http://localhost:${PORT}`);
});