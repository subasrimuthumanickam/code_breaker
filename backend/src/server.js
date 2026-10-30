
// // // // // // // // // // // // require("dotenv").config();

// // // // // // // // // // // // const express = require("express");
// // // // // // // // // // // // const cors = require("cors");

// // // // // // // // // // // // const gameRoutes = require("./routes/gameRoutes");
// // // // // // // // // // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // // // // // // // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // // // // // // // // // const authRoutes = require("./routes/authRoutes");
// // // // // // // // // // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // // // // // // // // // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // // // // // // // // // // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // // // // // // // // // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // // // // // // // // // // // const playerRoutes = require("./routes/playerRoutes");
// // // // // // // // // // // // const braintwistRoutes = require("./routes/braintwistRoutes");
// // // // // // // // // // // // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // // // // // // // // // // // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // // // // // // // // // // // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // // // // // // // // // // // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // // // // // // // // // // // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // // // // // // // // // // // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // // // // // // // // // // // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // // // // // // // // // // // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // // // // // // // // // // // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // // // // // // // // // // // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // // // // // // // // // // // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // // // // // // // // // // // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // // // // // // // // // // // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes"); // NEW
// // // // // // // // // // // // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // // // // // // // // // // // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // // // // // // // // // // // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // // // // // // // // // // // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // // // // // // // // // // // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // // // // // // // // // // // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // // // // // // // // // // // const app = express();

// // // // // // // // // // // // app.use(cors());
// // // // // // // // // // // // app.use(express.json());

// // // // // // // // // // // // // Confirm which server.js file is running
// // // // // // // // // // // // console.log("RUNNING FILE:", __filename);

// // // // // // // // // // // // // Log every incoming request
// // // // // // // // // // // // app.use((req, res, next) => {
// // // // // // // // // // // //   console.log("REQ:", req.method, req.originalUrl);
// // // // // // // // // // // //   next();
// // // // // // // // // // // // });

// // // // // // // // // // // // // General health check
// // // // // // // // // // // // app.get("/api/health", (req, res) => {
// // // // // // // // // // // //   res.json({
// // // // // // // // // // // //     ok: true,
// // // // // // // // // // // //     message: "Code Breaker API is running",
// // // // // // // // // // // //   });
// // // // // // // // // // // // });

// // // // // // // // // // // // // Brain Twist health check
// // // // // // // // // // // // app.get("/api/braintwist/health", (req, res) => {
// // // // // // // // // // // //   res.json({
// // // // // // // // // // // //     success: true,
// // // // // // // // // // // //     game: "Brain Twist",
// // // // // // // // // // // //     totalLevels: 20,
// // // // // // // // // // // //   });
// // // // // // // // // // // // });


// // // // // // // // // // // // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // // // // // // // // // // // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // // // // // // // // // // // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // // // // // // // // // // // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // // // // // // // // // // // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // // // // // // // // // // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // // // // // // // // // // // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // // // // // // // // // // // Brain Twist level 8 - find the parrot in the dark room
// // // // // // // // // // // // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // // // // // // // // // // // Brain Twist level 9 - help the dog find the bone (maze)
// // // // // // // // // // // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // // // // // // // // // // // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // // // // // // // // // // // Brain Twist level 11 - farmer's sheep riddle
// // // // // // // // // // // // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // // // // // // // // // // // Brain Twist level 12 - she is late for school, tap the calendar
// // // // // // // // // // // // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // // // // // // // // // // // Brain Twist level 13 (NEW)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // // // // // // // // // // // Brain Twist level 14 - put the giraffe into the fridge
// // // // // // // // // // // // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // // // // // // // // // // // Brain Twist level 15 - open the vault
// // // // // // // // // // // // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // // // // // // // // // // // Brain Twist level 16 - pizza liar
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // // // // // // // // // // // Brain Twist level 17 - what is the hidden number?
// // // // // // // // // // // // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // // // // // // // // // // // Brain Twist level 18 - arrange the letters (COASTER)
// // // // // // // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // // // // // // // // // // // Brain Twist level 19 - number pattern (the answer is 4)
// // // // // // // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // // // // // // // // // // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // // app.use("/api/braintwist/map", braintwistMapRoutes);

// // // // // // // // // // // // // Brain Twist routes — keep before generic /api routes
// // // // // // // // // // // // app.use("/api/braintwist", braintwistRoutes);

// // // // // // // // // // // // // Existing API routes
// // // // // // // // // // // // app.use("/api", gameRoutes);
// // // // // // // // // // // // app.use("/api", statsRoutes);
// // // // // // // // // // // // app.use("/api", settingsRoutes);
// // // // // // // // // // // // app.use("/api", authRoutes);

// // // // // // // // // // // // // Word Scramble coins — keep before general Word Scramble routes
// // // // // // // // // // // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // // // // // // // // // // Register Word Scramble round-flow handlers
// // // // // // // // // // // // registerRoundRoutes(wordScrambleRoutes);

// // // // // // // // // // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // // // // // // // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // // // // // // // // // // // app.use("/api", require("./routes/progress"));
// // // // // // // // // // // // app.use("/api/wordscramble", puzzleRoutes);
// // // // // // // // // // // // app.use("/api", playerRoutes);
// // // // // // // // // // // // app.use("/api/skip", require("./routes/Skiproutes"));

// // // // // // // // // // // // // 404 handler — no route matched
// // // // // // // // // // // // app.use((req, res) => {
// // // // // // // // // // // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// // // // // // // // // // // //   res.status(404).json({
// // // // // // // // // // // //     success: false,
// // // // // // // // // // // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // // // // // // // // // // //   });
// // // // // // // // // // // // });

// // // // // // // // // // // // // Error handler
// // // // // // // // // // // // app.use((err, req, res, next) => {
// // // // // // // // // // // //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// // // // // // // // // // // //   if (res.headersSent) {
// // // // // // // // // // // //     return next(err);
// // // // // // // // // // // //   }

// // // // // // // // // // // //   res.status(err.status || 500).json({
// // // // // // // // // // // //     success: false,
// // // // // // // // // // // //     error: err.message || "Internal server error",
// // // // // // // // // // // //   });
// // // // // // // // // // // // });

// // // // // // // // // // // // const PORT = process.env.PORT || 4000;

// // // // // // // // // // // // app.listen(PORT, "0.0.0.0", () => {
// // // // // // // // // // // //   console.log(`Code Breaker API listening on port ${PORT}`);
// // // // // // // // // // // //   console.log(`Health: http://localhost:${PORT}/api/health`);
// // // // // // // // // // // //   console.log(
// // // // // // // // // // // //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// // // // // // // // // // // //   );
// // // // // // // // // // // // });
// // // // // // // // // // // require("dotenv").config();

// // // // // // // // // // // const express = require("express");
// // // // // // // // // // // const cors = require("cors");

// // // // // // // // // // // const gameRoutes = require("./routes/gameRoutes");
// // // // // // // // // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // // // // // // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // // // // // // // // const authRoutes = require("./routes/authRoutes");
// // // // // // // // // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // // // // // // // // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // // // // // // // // // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // // // // // // // // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // // // // // // // // // // const playerRoutes = require("./routes/playerRoutes");
// // // // // // // // // // // const braintwistRoutes = require("./routes/braintwistRoutes");
// // // // // // // // // // // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // // // // // // // // // // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // // // // // // // // // // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // // // // // // // // // // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // // // // // // // // // // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // // // // // // // // // // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // // // // // // // // // // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // // // // // // // // // // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // // // // // // // // // // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // // // // // // // // // // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // // // // // // // // // // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // // // // // // // // // // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // // // // // // // // // // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes"); // NEW
// // // // // // // // // // // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // // // // // // // // // // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // // // // // // // // // // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // // // // // // // // // // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // // // // // // // // // // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // // // // // // // // // // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // // // // // // // // // // const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes"); // NEW
// // // // // // // // // // // const app = express();

// // // // // // // // // // // app.use(cors());
// // // // // // // // // // // app.use(express.json());

// // // // // // // // // // // // Confirm which server.js file is running
// // // // // // // // // // // console.log("RUNNING FILE:", __filename);

// // // // // // // // // // // // Log every incoming request
// // // // // // // // // // // app.use((req, res, next) => {
// // // // // // // // // // //   console.log("REQ:", req.method, req.originalUrl);
// // // // // // // // // // //   next();
// // // // // // // // // // // });

// // // // // // // // // // // // General health check
// // // // // // // // // // // app.get("/api/health", (req, res) => {
// // // // // // // // // // //   res.json({
// // // // // // // // // // //     ok: true,
// // // // // // // // // // //     message: "Code Breaker API is running",
// // // // // // // // // // //   });
// // // // // // // // // // // });

// // // // // // // // // // // // Brain Twist health check
// // // // // // // // // // // app.get("/api/braintwist/health", (req, res) => {
// // // // // // // // // // //   res.json({
// // // // // // // // // // //     success: true,
// // // // // // // // // // //     game: "Brain Twist",
// // // // // // // // // // //     totalLevels: 20,
// // // // // // // // // // //   });
// // // // // // // // // // // });


// // // // // // // // // // // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // // // // // // // // // // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // // // // // // // // // // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // // // // // // // // // // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // // // // // // // // // // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // // // // // // // // // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // // // // // // // // // // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // // // // // // // // // // Brain Twist level 8 - find the parrot in the dark room
// // // // // // // // // // // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // // // // // // // // // // Brain Twist level 9 - help the dog find the bone (maze)
// // // // // // // // // // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // // // // // // // // // // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // // // // // // // // // // Brain Twist level 11 - farmer's sheep riddle
// // // // // // // // // // // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // // // // // // // // // // Brain Twist level 12 - she is late for school, tap the calendar
// // // // // // // // // // // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // // // // // // // // // // Brain Twist level 13 (NEW)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // // // // // // // // // // Brain Twist level 14 - put the giraffe into the fridge
// // // // // // // // // // // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // // // // // // // // // // Brain Twist level 15 - open the vault
// // // // // // // // // // // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // // // // // // // // // // Brain Twist level 16 - pizza liar
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // // // // // // // // // // Brain Twist level 17 - what is the hidden number?
// // // // // // // // // // // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // // // // // // // // // // Brain Twist level 18 - arrange the letters (COASTER)
// // // // // // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // // // // // // // // // // Brain Twist level 19 - number pattern (the answer is 4)
// // // // // // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // // // // // // // // // // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // // // // // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // // // // // // // // // // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // // app.use("/api/braintwist/map", braintwistMapRoutes);

// // // // // // // // // // // // Brain Twist routes — keep before generic /api routes
// // // // // // // // // // // app.use("/api/braintwist", braintwistRoutes);

// // // // // // // // // // // // Existing API routes
// // // // // // // // // // // app.use("/api", gameRoutes);
// // // // // // // // // // // app.use("/api", statsRoutes);
// // // // // // // // // // // app.use("/api", settingsRoutes);
// // // // // // // // // // // app.use("/api", authRoutes);

// // // // // // // // // // // // Word Scramble coins — keep before general Word Scramble routes
// // // // // // // // // // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // // // // // // // // // Register Word Scramble round-flow handlers
// // // // // // // // // // // registerRoundRoutes(wordScrambleRoutes);

// // // // // // // // // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // // // // // // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // // // // // // // // // // app.use("/api", require("./routes/progress"));
// // // // // // // // // // // app.use("/api/wordscramble", puzzleRoutes);
// // // // // // // // // // // app.use("/api", playerRoutes);
// // // // // // // // // // // app.use("/api/skip", require("./routes/Skiproutes"));

// // // // // // // // // // // // 404 handler — no route matched
// // // // // // // // // // // app.use((req, res) => {
// // // // // // // // // // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// // // // // // // // // // //   res.status(404).json({
// // // // // // // // // // //     success: false,
// // // // // // // // // // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // // // // // // // // // //   });
// // // // // // // // // // // });

// // // // // // // // // // // // Error handler
// // // // // // // // // // // app.use((err, req, res, next) => {
// // // // // // // // // // //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// // // // // // // // // // //   if (res.headersSent) {
// // // // // // // // // // //     return next(err);
// // // // // // // // // // //   }

// // // // // // // // // // //   res.status(err.status || 500).json({
// // // // // // // // // // //     success: false,
// // // // // // // // // // //     error: err.message || "Internal server error",
// // // // // // // // // // //   });
// // // // // // // // // // // });

// // // // // // // // // // // const PORT = process.env.PORT || 4000;

// // // // // // // // // // // app.listen(PORT, "0.0.0.0", () => {
// // // // // // // // // // //   console.log(`Code Breaker API listening on port ${PORT}`);
// // // // // // // // // // //   console.log(`Health: http://localhost:${PORT}/api/health`);
// // // // // // // // // // //   console.log(
// // // // // // // // // // //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// // // // // // // // // // //   );
// // // // // // // // // // // });
// // // // // // // // // // require("dotenv").config();

// // // // // // // // // // const express = require("express");
// // // // // // // // // // const cors = require("cors");

// // // // // // // // // // const gameRoutes = require("./routes/gameRoutes");
// // // // // // // // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // // // // // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // // // // // // // const authRoutes = require("./routes/authRoutes");
// // // // // // // // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // // // // // // // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // // // // // // // // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // // // // // // // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // // // // // // // // // const playerRoutes = require("./routes/playerRoutes");
// // // // // // // // // // const braintwistRoutes = require("./routes/braintwistRoutes");
// // // // // // // // // // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // // // // // // // // // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // // // // // // // // // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // // // // // // // // // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // // // // // // // // // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // // // // // // // // // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // // // // // // // // // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // // // // // // // // // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // // // // // // // // // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // // // // // // // // // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // // // // // // // // // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // // // // // // // // // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // // // // // // // // // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
// // // // // // // // // // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // // // // // // // // // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // // // // // // // // // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // // // // // // // // // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // // // // // // // // // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // // // // // // // // // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // // // // // // // // // const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
// // // // // // // // // // const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes"); // NEW
// // // // // // // // // // const app = express();

// // // // // // // // // // app.use(cors());
// // // // // // // // // // app.use(express.json());

// // // // // // // // // // // Confirm which server.js file is running
// // // // // // // // // // console.log("RUNNING FILE:", __filename);

// // // // // // // // // // // Log every incoming request
// // // // // // // // // // app.use((req, res, next) => {
// // // // // // // // // //   console.log("REQ:", req.method, req.originalUrl);
// // // // // // // // // //   next();
// // // // // // // // // // });

// // // // // // // // // // // General health check
// // // // // // // // // // app.get("/api/health", (req, res) => {
// // // // // // // // // //   res.json({
// // // // // // // // // //     ok: true,
// // // // // // // // // //     message: "Code Breaker API is running",
// // // // // // // // // //   });
// // // // // // // // // // });

// // // // // // // // // // // Brain Twist health check
// // // // // // // // // // app.get("/api/braintwist/health", (req, res) => {
// // // // // // // // // //   res.json({
// // // // // // // // // //     success: true,
// // // // // // // // // //     game: "Brain Twist",
// // // // // // // // // //     totalLevels: 21,
// // // // // // // // // //   });
// // // // // // // // // // });


// // // // // // // // // // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // // // // // // // // // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // // // // // // // // // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // // // // // // // // // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // // // // // // // // // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // // // // // // // // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // // // // // // // // // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // // // // // // // // // Brain Twist level 8 - find the parrot in the dark room
// // // // // // // // // // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // // // // // // // // // Brain Twist level 9 - help the dog find the bone (maze)
// // // // // // // // // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // // // // // // // // // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // // // // // // // // // Brain Twist level 11 - farmer's sheep riddle
// // // // // // // // // // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // // // // // // // // // Brain Twist level 12 - she is late for school, tap the calendar
// // // // // // // // // // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // // // // // // // // // Brain Twist level 13
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // // // // // // // // // Brain Twist level 14 - put the giraffe into the fridge
// // // // // // // // // // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // // // // // // // // // Brain Twist level 15 - open the vault
// // // // // // // // // // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // // // // // // // // // Brain Twist level 16 - pizza liar
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // // // // // // // // // Brain Twist level 17 - what is the hidden number?
// // // // // // // // // // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // // // // // // // // // Brain Twist level 18 - arrange the letters (COASTER)
// // // // // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // // // // // // // // // Brain Twist level 19 - number pattern (the answer is 4)
// // // // // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // // // // // // // // // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // // // // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // // // // // // // // // // Brain Twist level 21 - add any 4 numbers to make 200 (NEW)
// // // // // // // // // // // (/start, /action, /hint, /skip, /status/:playerId)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/level21", braintwistLevel21Routes);

// // // // // // // // // // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // // app.use("/api/braintwist/map", braintwistMapRoutes);

// // // // // // // // // // // Brain Twist routes — keep before generic /api routes
// // // // // // // // // // app.use("/api/braintwist", braintwistRoutes);

// // // // // // // // // // // Existing API routes
// // // // // // // // // // app.use("/api", gameRoutes);
// // // // // // // // // // app.use("/api", statsRoutes);
// // // // // // // // // // app.use("/api", settingsRoutes);
// // // // // // // // // // app.use("/api", authRoutes);

// // // // // // // // // // // Word Scramble coins — keep before general Word Scramble routes
// // // // // // // // // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // // // // // // // // Register Word Scramble round-flow handlers
// // // // // // // // // // registerRoundRoutes(wordScrambleRoutes);

// // // // // // // // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // // // // // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // // // // // // // // // app.use("/api", require("./routes/progress"));
// // // // // // // // // // app.use("/api/wordscramble", puzzleRoutes);
// // // // // // // // // // app.use("/api", playerRoutes);
// // // // // // // // // // app.use("/api/skip", require("./routes/Skiproutes"));

// // // // // // // // // // // 404 handler — no route matched
// // // // // // // // // // app.use((req, res) => {
// // // // // // // // // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// // // // // // // // // //   res.status(404).json({
// // // // // // // // // //     success: false,
// // // // // // // // // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // // // // // // // // //   });
// // // // // // // // // // });

// // // // // // // // // // // Error handler
// // // // // // // // // // app.use((err, req, res, next) => {
// // // // // // // // // //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// // // // // // // // // //   if (res.headersSent) {
// // // // // // // // // //     return next(err);
// // // // // // // // // //   }

// // // // // // // // // //   res.status(err.status || 500).json({
// // // // // // // // // //     success: false,
// // // // // // // // // //     error: err.message || "Internal server error",
// // // // // // // // // //   });
// // // // // // // // // // });

// // // // // // // // // // const PORT = process.env.PORT || 4000;

// // // // // // // // // // app.listen(PORT, "0.0.0.0", () => {
// // // // // // // // // //   console.log(`Code Breaker API listening on port ${PORT}`);
// // // // // // // // // //   console.log(`Health: http://localhost:${PORT}/api/health`);
// // // // // // // // // //   console.log(
// // // // // // // // // //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// // // // // // // // // //   );
// // // // // // // // // // });
// // // // // // // // // require("dotenv").config();

// // // // // // // // // const express = require("express");
// // // // // // // // // const cors = require("cors");

// // // // // // // // // const gameRoutes = require("./routes/gameRoutes");
// // // // // // // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // // // // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // // // // // // const authRoutes = require("./routes/authRoutes");
// // // // // // // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // // // // // // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // // // // // // // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // // // // // // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // // // // // // // // const playerRoutes = require("./routes/playerRoutes");
// // // // // // // // // const braintwistRoutes = require("./routes/braintwistRoutes");
// // // // // // // // // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // // // // // // // // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // // // // // // // // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // // // // // // // // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // // // // // // // // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // // // // // // // // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // // // // // // // // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // // // // // // // // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // // // // // // // // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // // // // // // // // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // // // // // // // // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // // // // // // // // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // // // // // // // // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
// // // // // // // // // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // // // // // // // // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // // // // // // // // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // // // // // // // // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // // // // // // // // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // // // // // // // // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // // // // // // // // const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
// // // // // // // // // const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes");
// // // // // // // // // const braintwistLevel22Routes = require("./routes/Braintwistlevel22routes"); // NEW
// // // // // // // // // const app = express();

// // // // // // // // // app.use(cors());
// // // // // // // // // app.use(express.json());

// // // // // // // // // // Confirm which server.js file is running
// // // // // // // // // console.log("RUNNING FILE:", __filename);

// // // // // // // // // // Log every incoming request
// // // // // // // // // app.use((req, res, next) => {
// // // // // // // // //   console.log("REQ:", req.method, req.originalUrl);
// // // // // // // // //   next();
// // // // // // // // // });

// // // // // // // // // // General health check
// // // // // // // // // app.get("/api/health", (req, res) => {
// // // // // // // // //   res.json({
// // // // // // // // //     ok: true,
// // // // // // // // //     message: "Code Breaker API is running",
// // // // // // // // //   });
// // // // // // // // // });

// // // // // // // // // // Brain Twist health check
// // // // // // // // // app.get("/api/braintwist/health", (req, res) => {
// // // // // // // // //   res.json({
// // // // // // // // //     success: true,
// // // // // // // // //     game: "Brain Twist",
// // // // // // // // //     totalLevels: 22,
// // // // // // // // //   });
// // // // // // // // // });


// // // // // // // // // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // // // // // // // // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // // // // // // // // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // // // // // // // // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // // // // // // // // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // // // // // // // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // // // // // // // // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // // // // // // // // Brain Twist level 8 - find the parrot in the dark room
// // // // // // // // // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // // // // // // // // Brain Twist level 9 - help the dog find the bone (maze)
// // // // // // // // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // // // // // // // // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // // // // // // // // Brain Twist level 11 - farmer's sheep riddle
// // // // // // // // // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // // // // // // // // Brain Twist level 12 - she is late for school, tap the calendar
// // // // // // // // // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // // // // // // // // Brain Twist level 13
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // // // // // // // // Brain Twist level 14 - put the giraffe into the fridge
// // // // // // // // // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // // // // // // // // Brain Twist level 15 - open the vault
// // // // // // // // // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // // // // // // // // Brain Twist level 16 - pizza liar
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // // // // // // // // Brain Twist level 17 - what is the hidden number?
// // // // // // // // // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // // // // // // // // Brain Twist level 18 - arrange the letters (COASTER)
// // // // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // // // // // // // // Brain Twist level 19 - number pattern (the answer is 4)
// // // // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // // // // // // // // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // // // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // // // // // // // // // Brain Twist level 21 - add any 4 numbers to make 200
// // // // // // // // // // (/start, /action, /hint, /skip, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level21", braintwistLevel21Routes);

// // // // // // // // // // Brain Twist level 22 - thief & police chase (the answer is 4:30 PM) (NEW)
// // // // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/level22", braintwistLevel22Routes);

// // // // // // // // // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // // app.use("/api/braintwist/map", braintwistMapRoutes);

// // // // // // // // // // Brain Twist routes — keep before generic /api routes
// // // // // // // // // app.use("/api/braintwist", braintwistRoutes);

// // // // // // // // // // Existing API routes
// // // // // // // // // app.use("/api", gameRoutes);
// // // // // // // // // app.use("/api", statsRoutes);
// // // // // // // // // app.use("/api", settingsRoutes);
// // // // // // // // // app.use("/api", authRoutes);

// // // // // // // // // // Word Scramble coins — keep before general Word Scramble routes
// // // // // // // // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // // // // // // // Register Word Scramble round-flow handlers
// // // // // // // // // registerRoundRoutes(wordScrambleRoutes);

// // // // // // // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // // // // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // // // // // // // // app.use("/api", require("./routes/progress"));
// // // // // // // // // app.use("/api/wordscramble", puzzleRoutes);
// // // // // // // // // app.use("/api", playerRoutes);
// // // // // // // // // app.use("/api/skip", require("./routes/Skiproutes"));

// // // // // // // // // // 404 handler — no route matched
// // // // // // // // // app.use((req, res) => {
// // // // // // // // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// // // // // // // // //   res.status(404).json({
// // // // // // // // //     success: false,
// // // // // // // // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // // // // // // // //   });
// // // // // // // // // });

// // // // // // // // // // Error handler
// // // // // // // // // app.use((err, req, res, next) => {
// // // // // // // // //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// // // // // // // // //   if (res.headersSent) {
// // // // // // // // //     return next(err);
// // // // // // // // //   }

// // // // // // // // //   res.status(err.status || 500).json({
// // // // // // // // //     success: false,
// // // // // // // // //     error: err.message || "Internal server error",
// // // // // // // // //   });
// // // // // // // // // });

// // // // // // // // // const PORT = process.env.PORT || 4000;

// // // // // // // // // app.listen(PORT, "0.0.0.0", () => {
// // // // // // // // //   console.log(`Code Breaker API listening on port ${PORT}`);
// // // // // // // // //   console.log(`Health: http://localhost:${PORT}/api/health`);
// // // // // // // // //   console.log(
// // // // // // // // //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// // // // // // // // //   );
// // // // // // // // // });
// // // // // // // // require("dotenv").config();

// // // // // // // // const express = require("express");
// // // // // // // // const cors = require("cors");

// // // // // // // // const gameRoutes = require("./routes/gameRoutes");
// // // // // // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // // // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // // // // // const authRoutes = require("./routes/authRoutes");
// // // // // // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // // // // // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // // // // // // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // // // // // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // // // // // // // const playerRoutes = require("./routes/playerRoutes");
// // // // // // // // const braintwistRoutes = require("./routes/braintwistRoutes");
// // // // // // // // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // // // // // // // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // // // // // // // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // // // // // // // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // // // // // // // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // // // // // // // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // // // // // // // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // // // // // // // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // // // // // // // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // // // // // // // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // // // // // // // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // // // // // // // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // // // // // // // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
// // // // // // // // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // // // // // // // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // // // // // // // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // // // // // // // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // // // // // // // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // // // // // // // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // // // // // // // const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
// // // // // // // // const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes");
// // // // // // // // const braintwistLevel22Routes = require("./routes/Braintwistlevel22routes");
// // // // // // // // const braintwistLevel23Routes = require("./routes/Braintwistlevel23routes"); // NEW
// // // // // // // // const app = express();

// // // // // // // // app.use(cors());
// // // // // // // // app.use(express.json());

// // // // // // // // // Confirm which server.js file is running
// // // // // // // // console.log("RUNNING FILE:", __filename);

// // // // // // // // // Log every incoming request
// // // // // // // // app.use((req, res, next) => {
// // // // // // // //   console.log("REQ:", req.method, req.originalUrl);
// // // // // // // //   next();
// // // // // // // // });

// // // // // // // // // General health check
// // // // // // // // app.get("/api/health", (req, res) => {
// // // // // // // //   res.json({
// // // // // // // //     ok: true,
// // // // // // // //     message: "Code Breaker API is running",
// // // // // // // //   });
// // // // // // // // });

// // // // // // // // // Brain Twist health check
// // // // // // // // app.get("/api/braintwist/health", (req, res) => {
// // // // // // // //   res.json({
// // // // // // // //     success: true,
// // // // // // // //     game: "Brain Twist",
// // // // // // // //     totalLevels: 23,
// // // // // // // //   });
// // // // // // // // });


// // // // // // // // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // // // // // // // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // // // // // // // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // // // // // // // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // // // // // // // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // // // // // // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // // // // // // // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // // // // // // // Brain Twist level 8 - find the parrot in the dark room
// // // // // // // // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // // // // // // // Brain Twist level 9 - help the dog find the bone (maze)
// // // // // // // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // // // // // // // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // // // // // // // Brain Twist level 11 - farmer's sheep riddle
// // // // // // // // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // // // // // // // Brain Twist level 12 - she is late for school, tap the calendar
// // // // // // // // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // // // // // // // Brain Twist level 13
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // // // // // // // Brain Twist level 14 - put the giraffe into the fridge
// // // // // // // // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // // // // // // // Brain Twist level 15 - open the vault
// // // // // // // // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // // // // // // // Brain Twist level 16 - pizza liar
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // // // // // // // Brain Twist level 17 - what is the hidden number?
// // // // // // // // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // // // // // // // Brain Twist level 18 - arrange the letters (COASTER)
// // // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // // // // // // // Brain Twist level 19 - number pattern (the answer is 4)
// // // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // // // // // // // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // // // // // // // // Brain Twist level 21 - add any 4 numbers to make 200
// // // // // // // // // (/start, /action, /hint, /skip, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level21", braintwistLevel21Routes);

// // // // // // // // // Brain Twist level 22 - thief & police chase (the answer is 4:30 PM) (NEW)
// // // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level22", braintwistLevel22Routes);

// // // // // // // // // Brain Twist level 23 - tap the emoji faces in order (NEW)
// // // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/level23", braintwistLevel23Routes);

// // // // // // // // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // // // // // // // keep before the generic Brain Twist routes
// // // // // // // // app.use("/api/braintwist/map", braintwistMapRoutes);

// // // // // // // // // Brain Twist routes — keep before generic /api routes
// // // // // // // // app.use("/api/braintwist", braintwistRoutes);

// // // // // // // // // Existing API routes
// // // // // // // // app.use("/api", gameRoutes);
// // // // // // // // app.use("/api", statsRoutes);
// // // // // // // // app.use("/api", settingsRoutes);
// // // // // // // // app.use("/api", authRoutes);

// // // // // // // // // Word Scramble coins — keep before general Word Scramble routes
// // // // // // // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // // // // // // Register Word Scramble round-flow handlers
// // // // // // // // registerRoundRoutes(wordScrambleRoutes);

// // // // // // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // // // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // // // // // // // app.use("/api", require("./routes/progress"));
// // // // // // // // app.use("/api/wordscramble", puzzleRoutes);
// // // // // // // // app.use("/api", playerRoutes);
// // // // // // // // app.use("/api/skip", require("./routes/Skiproutes"));

// // // // // // // // // 404 handler — no route matched
// // // // // // // // app.use((req, res) => {
// // // // // // // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// // // // // // // //   res.status(404).json({
// // // // // // // //     success: false,
// // // // // // // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // // // // // // //   });
// // // // // // // // });

// // // // // // // // // Error handler
// // // // // // // // app.use((err, req, res, next) => {
// // // // // // // //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// // // // // // // //   if (res.headersSent) {
// // // // // // // //     return next(err);
// // // // // // // //   }

// // // // // // // //   res.status(err.status || 500).json({
// // // // // // // //     success: false,
// // // // // // // //     error: err.message || "Internal server error",
// // // // // // // //   });
// // // // // // // // });

// // // // // // // // const PORT = process.env.PORT || 4000;

// // // // // // // // app.listen(PORT, "0.0.0.0", () => {
// // // // // // // //   console.log(`Code Breaker API listening on port ${PORT}`);
// // // // // // // //   console.log(`Health: http://localhost:${PORT}/api/health`);
// // // // // // // //   console.log(
// // // // // // // //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// // // // // // // //   );
// // // // // // // // });
// // // // // // // require("dotenv").config();

// // // // // // // const express = require("express");
// // // // // // // const cors = require("cors");

// // // // // // // const gameRoutes = require("./routes/gameRoutes");
// // // // // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // // // // const authRoutes = require("./routes/authRoutes");
// // // // // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // // // // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // // // // // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // // // // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // // // // // // const playerRoutes = require("./routes/playerRoutes");
// // // // // // // const braintwistRoutes = require("./routes/braintwistRoutes");
// // // // // // // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // // // // // // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // // // // // // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // // // // // // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // // // // // // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // // // // // // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // // // // // // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // // // // // // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // // // // // // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // // // // // // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // // // // // // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // // // // // // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // // // // // // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
// // // // // // // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // // // // // // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // // // // // // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // // // // // // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // // // // // // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // // // // // // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // // // // // // const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
// // // // // // // const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes");
// // // // // // // const braintwistLevel22Routes = require("./routes/Braintwistlevel22routes");
// // // // // // // const braintwistLevel23Routes = require("./routes/Braintwistlevel23routes");
// // // // // // // const braintwistLevel24Routes = require("./routes/Braintwistlevel24routes"); // NEW
// // // // // // // const app = express();

// // // // // // // app.use(cors());
// // // // // // // app.use(express.json());

// // // // // // // // Confirm which server.js file is running
// // // // // // // console.log("RUNNING FILE:", __filename);

// // // // // // // // Log every incoming request
// // // // // // // app.use((req, res, next) => {
// // // // // // //   console.log("REQ:", req.method, req.originalUrl);
// // // // // // //   next();
// // // // // // // });

// // // // // // // // General health check
// // // // // // // app.get("/api/health", (req, res) => {
// // // // // // //   res.json({
// // // // // // //     ok: true,
// // // // // // //     message: "Code Breaker API is running",
// // // // // // //   });
// // // // // // // });

// // // // // // // // Brain Twist health check
// // // // // // // app.get("/api/braintwist/health", (req, res) => {
// // // // // // //   res.json({
// // // // // // //     success: true,
// // // // // // //     game: "Brain Twist",
// // // // // // //     totalLevels: 24,
// // // // // // //   });
// // // // // // // });


// // // // // // // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // // // // // // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // // // // // // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // // // // // // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // // // // // // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // // // // // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // // // // // // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // // // // // // Brain Twist level 8 - find the parrot in the dark room
// // // // // // // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // // // // // // Brain Twist level 9 - help the dog find the bone (maze)
// // // // // // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // // // // // // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // // // // // // Brain Twist level 11 - farmer's sheep riddle
// // // // // // // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // // // // // // Brain Twist level 12 - she is late for school, tap the calendar
// // // // // // // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // // // // // // Brain Twist level 13
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // // // // // // Brain Twist level 14 - put the giraffe into the fridge
// // // // // // // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // // // // // // Brain Twist level 15 - open the vault
// // // // // // // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // // // // // // Brain Twist level 16 - pizza liar
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // // // // // // Brain Twist level 17 - what is the hidden number?
// // // // // // // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // // // // // // Brain Twist level 18 - arrange the letters (COASTER)
// // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // // // // // // Brain Twist level 19 - number pattern (the answer is 4)
// // // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // // // // // // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // // // // // // // Brain Twist level 21 - add any 4 numbers to make 200
// // // // // // // // (/start, /action, /hint, /skip, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level21", braintwistLevel21Routes);

// // // // // // // // Brain Twist level 22 - thief & police chase (the answer is 4:30 PM)
// // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level22", braintwistLevel22Routes);

// // // // // // // // Brain Twist level 23 - tap the emoji faces in order
// // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level23", braintwistLevel23Routes);

// // // // // // // // Brain Twist level 24 - younger sister's age (the answer is C: 18 years) (NEW)
// // // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/level24", braintwistLevel24Routes);

// // // // // // // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // // // // // // keep before the generic Brain Twist routes
// // // // // // // app.use("/api/braintwist/map", braintwistMapRoutes);

// // // // // // // // Brain Twist routes — keep before generic /api routes
// // // // // // // app.use("/api/braintwist", braintwistRoutes);

// // // // // // // // Existing API routes
// // // // // // // app.use("/api", gameRoutes);
// // // // // // // app.use("/api", statsRoutes);
// // // // // // // app.use("/api", settingsRoutes);
// // // // // // // app.use("/api", authRoutes);

// // // // // // // // Word Scramble coins — keep before general Word Scramble routes
// // // // // // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // // // // // Register Word Scramble round-flow handlers
// // // // // // // registerRoundRoutes(wordScrambleRoutes);

// // // // // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // // // // // // app.use("/api", require("./routes/progress"));
// // // // // // // app.use("/api/wordscramble", puzzleRoutes);
// // // // // // // app.use("/api", playerRoutes);
// // // // // // // app.use("/api/skip", require("./routes/Skiproutes"));

// // // // // // // // 404 handler — no route matched
// // // // // // // app.use((req, res) => {
// // // // // // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// // // // // // //   res.status(404).json({
// // // // // // //     success: false,
// // // // // // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // // // // // //   });
// // // // // // // });

// // // // // // // // Error handler
// // // // // // // app.use((err, req, res, next) => {
// // // // // // //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// // // // // // //   if (res.headersSent) {
// // // // // // //     return next(err);
// // // // // // //   }

// // // // // // //   res.status(err.status || 500).json({
// // // // // // //     success: false,
// // // // // // //     error: err.message || "Internal server error",
// // // // // // //   });
// // // // // // // });

// // // // // // // const PORT = process.env.PORT || 4000;

// // // // // // // app.listen(PORT, "0.0.0.0", () => {
// // // // // // //   console.log(`Code Breaker API listening on port ${PORT}`);
// // // // // // //   console.log(`Health: http://localhost:${PORT}/api/health`);
// // // // // // //   console.log(
// // // // // // //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// // // // // // //   );
// // // // // // // });
// // // // // // require("dotenv").config();

// // // // // // const express = require("express");
// // // // // // const cors = require("cors");

// // // // // // const gameRoutes = require("./routes/gameRoutes");
// // // // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // // // const authRoutes = require("./routes/authRoutes");
// // // // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // // // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // // // // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // // // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // // // // // const playerRoutes = require("./routes/playerRoutes");
// // // // // // const braintwistRoutes = require("./routes/braintwistRoutes");
// // // // // // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // // // // // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // // // // // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // // // // // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // // // // // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // // // // // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // // // // // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // // // // // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // // // // // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // // // // // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // // // // // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // // // // // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // // // // // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
// // // // // // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // // // // // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // // // // // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // // // // // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // // // // // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // // // // // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // // // // // const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
// // // // // // const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes");
// // // // // // const braintwistLevel22Routes = require("./routes/Braintwistlevel22routes");
// // // // // // const braintwistLevel23Routes = require("./routes/Braintwistlevel23routes");
// // // // // // const braintwistLevel24Routes = require("./routes/Braintwistlevel24routes");
// // // // // // const braintwistLevel25Routes = require("./routes/Braintwistlevel25routes"); // NEW
// // // // // // const app = express();

// // // // // // app.use(cors());
// // // // // // app.use(express.json());

// // // // // // // Confirm which server.js file is running
// // // // // // console.log("RUNNING FILE:", __filename);

// // // // // // // Log every incoming request
// // // // // // app.use((req, res, next) => {
// // // // // //   console.log("REQ:", req.method, req.originalUrl);
// // // // // //   next();
// // // // // // });

// // // // // // // General health check
// // // // // // app.get("/api/health", (req, res) => {
// // // // // //   res.json({
// // // // // //     ok: true,
// // // // // //     message: "Code Breaker API is running",
// // // // // //   });
// // // // // // });

// // // // // // // Brain Twist health check
// // // // // // app.get("/api/braintwist/health", (req, res) => {
// // // // // //   res.json({
// // // // // //     success: true,
// // // // // //     game: "Brain Twist",
// // // // // //     totalLevels: 25,
// // // // // //   });
// // // // // // });


// // // // // // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // // // // // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // // // // // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // // // // // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // // // // // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // // // // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // // // // // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // // // // // Brain Twist level 8 - find the parrot in the dark room
// // // // // // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // // // // // Brain Twist level 9 - help the dog find the bone (maze)
// // // // // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // // // // // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // // // // // Brain Twist level 11 - farmer's sheep riddle
// // // // // // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // // // // // Brain Twist level 12 - she is late for school, tap the calendar
// // // // // // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // // // // // Brain Twist level 13
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // // // // // Brain Twist level 14 - put the giraffe into the fridge
// // // // // // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // // // // // Brain Twist level 15 - open the vault
// // // // // // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // // // // // Brain Twist level 16 - pizza liar
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // // // // // Brain Twist level 17 - what is the hidden number?
// // // // // // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // // // // // Brain Twist level 18 - arrange the letters (COASTER)
// // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // // // // // Brain Twist level 19 - number pattern (the answer is 4)
// // // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // // // // // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // // // // // // Brain Twist level 21 - add any 4 numbers to make 200
// // // // // // // (/start, /action, /hint, /skip, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level21", braintwistLevel21Routes);

// // // // // // // Brain Twist level 22 - thief & police chase (the answer is 4:30 PM)
// // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level22", braintwistLevel22Routes);

// // // // // // // Brain Twist level 23 - tap the emoji faces in order
// // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level23", braintwistLevel23Routes);

// // // // // // // Brain Twist level 24 - younger sister's age (the answer is C: 18 years)
// // // // // // // (/start, /answer, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level24", braintwistLevel24Routes);

// // // // // // // Brain Twist level 25 - save Tung Tung Tung Sahur (drag the police van beside the door) (NEW)
// // // // // // // (/start, /action, /skip, /status/:playerId)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/level25", braintwistLevel25Routes);

// // // // // // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // // // // // keep before the generic Brain Twist routes
// // // // // // app.use("/api/braintwist/map", braintwistMapRoutes);

// // // // // // // Brain Twist routes — keep before generic /api routes
// // // // // // app.use("/api/braintwist", braintwistRoutes);

// // // // // // // Existing API routes
// // // // // // app.use("/api", gameRoutes);
// // // // // // app.use("/api", statsRoutes);
// // // // // // app.use("/api", settingsRoutes);
// // // // // // app.use("/api", authRoutes);

// // // // // // // Word Scramble coins — keep before general Word Scramble routes
// // // // // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // // // // Register Word Scramble round-flow handlers
// // // // // // registerRoundRoutes(wordScrambleRoutes);

// // // // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // // // // // app.use("/api", require("./routes/progress"));
// // // // // // app.use("/api/wordscramble", puzzleRoutes);
// // // // // // app.use("/api", playerRoutes);
// // // // // // app.use("/api/skip", require("./routes/Skiproutes"));

// // // // // // // 404 handler — no route matched
// // // // // // app.use((req, res) => {
// // // // // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// // // // // //   res.status(404).json({
// // // // // //     success: false,
// // // // // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // // // // //   });
// // // // // // });

// // // // // // // Error handler
// // // // // // app.use((err, req, res, next) => {
// // // // // //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// // // // // //   if (res.headersSent) {
// // // // // //     return next(err);
// // // // // //   }

// // // // // //   res.status(err.status || 500).json({
// // // // // //     success: false,
// // // // // //     error: err.message || "Internal server error",
// // // // // //   });
// // // // // // });

// // // // // // const PORT = process.env.PORT || 4000;

// // // // // // app.listen(PORT, "0.0.0.0", () => {
// // // // // //   console.log(`Code Breaker API listening on port ${PORT}`);
// // // // // //   console.log(`Health: http://localhost:${PORT}/api/health`);
// // // // // //   console.log(
// // // // // //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// // // // // //   );
// // // // // // });
// // // // // require("dotenv").config();

// // // // // const express = require("express");
// // // // // const cors = require("cors");

// // // // // const gameRoutes = require("./routes/gameRoutes");
// // // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // // const authRoutes = require("./routes/authRoutes");
// // // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // // // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // // // // const playerRoutes = require("./routes/playerRoutes");
// // // // // const braintwistRoutes = require("./routes/braintwistRoutes");
// // // // // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // // // // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // // // // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // // // // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // // // // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // // // // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // // // // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // // // // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // // // // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // // // // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // // // // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // // // // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // // // // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
// // // // // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // // // // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // // // // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // // // // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // // // // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // // // // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // // // // const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
// // // // // const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes");
// // // // // const braintwistLevel22Routes = require("./routes/Braintwistlevel22routes");
// // // // // const braintwistLevel23Routes = require("./routes/Braintwistlevel23routes");
// // // // // const braintwistLevel24Routes = require("./routes/Braintwistlevel24routes");
// // // // // const braintwistLevel25Routes = require("./routes/Braintwistlevel25routes");
// // // // // const braintwistLevel26Routes = require("./routes/Braintwistlevel26routes"); // NEW
// // // // // const app = express();

// // // // // app.use(cors());
// // // // // app.use(express.json());

// // // // // // Confirm which server.js file is running
// // // // // console.log("RUNNING FILE:", __filename);

// // // // // // Log every incoming request
// // // // // app.use((req, res, next) => {
// // // // //   console.log("REQ:", req.method, req.originalUrl);
// // // // //   next();
// // // // // });

// // // // // // General health check
// // // // // app.get("/api/health", (req, res) => {
// // // // //   res.json({
// // // // //     ok: true,
// // // // //     message: "Code Breaker API is running",
// // // // //   });
// // // // // });

// // // // // // Brain Twist health check
// // // // // app.get("/api/braintwist/health", (req, res) => {
// // // // //   res.json({
// // // // //     success: true,
// // // // //     game: "Brain Twist",
// // // // //     totalLevels: 26,
// // // // //   });
// // // // // });


// // // // // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // // // // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // // // // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // // // // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // // // // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // // // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // // // // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // // // // Brain Twist level 8 - find the parrot in the dark room
// // // // // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // // // // Brain Twist level 9 - help the dog find the bone (maze)
// // // // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // // // // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // // // // Brain Twist level 11 - farmer's sheep riddle
// // // // // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // // // // Brain Twist level 12 - she is late for school, tap the calendar
// // // // // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // // // // Brain Twist level 13
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // // // // Brain Twist level 14 - put the giraffe into the fridge
// // // // // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // // // // Brain Twist level 15 - open the vault
// // // // // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // // // // Brain Twist level 16 - pizza liar
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // // // // Brain Twist level 17 - what is the hidden number?
// // // // // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // // // // Brain Twist level 18 - arrange the letters (COASTER)
// // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // // // // Brain Twist level 19 - number pattern (the answer is 4)
// // // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // // // // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // // // // // (/start, /answer, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // // // // // Brain Twist level 21 - add any 4 numbers to make 200
// // // // // // (/start, /action, /hint, /skip, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level21", braintwistLevel21Routes);

// // // // // // Brain Twist level 22 - thief & police chase (the answer is 4:30 PM)
// // // // // // (/start, /answer, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level22", braintwistLevel22Routes);

// // // // // // Brain Twist level 23 - tap the emoji faces in order
// // // // // // (/start, /answer, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level23", braintwistLevel23Routes);

// // // // // // Brain Twist level 24 - younger sister's age (the answer is C: 18 years)
// // // // // // (/start, /answer, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level24", braintwistLevel24Routes);

// // // // // // Brain Twist level 25 - save Tung Tung Tung Sahur (drag the police van beside the door)
// // // // // // (/start, /action, /skip, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level25", braintwistLevel25Routes);

// // // // // // Brain Twist level 26 - wake up the cat (drag the clouds away, the sun shows) (NEW)
// // // // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/level26", braintwistLevel26Routes);

// // // // // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // // // // keep before the generic Brain Twist routes
// // // // // app.use("/api/braintwist/map", braintwistMapRoutes);

// // // // // // Brain Twist routes — keep before generic /api routes
// // // // // app.use("/api/braintwist", braintwistRoutes);

// // // // // // Existing API routes
// // // // // app.use("/api", gameRoutes);
// // // // // app.use("/api", statsRoutes);
// // // // // app.use("/api", settingsRoutes);
// // // // // app.use("/api", authRoutes);

// // // // // // Word Scramble coins — keep before general Word Scramble routes
// // // // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // // // Register Word Scramble round-flow handlers
// // // // // registerRoundRoutes(wordScrambleRoutes);

// // // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // // // // app.use("/api", require("./routes/progress"));
// // // // // app.use("/api/wordscramble", puzzleRoutes);
// // // // // app.use("/api", playerRoutes);
// // // // // app.use("/api/skip", require("./routes/Skiproutes"));

// // // // // // 404 handler — no route matched
// // // // // app.use((req, res) => {
// // // // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// // // // //   res.status(404).json({
// // // // //     success: false,
// // // // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // // // //   });
// // // // // });

// // // // // // Error handler
// // // // // app.use((err, req, res, next) => {
// // // // //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// // // // //   if (res.headersSent) {
// // // // //     return next(err);
// // // // //   }

// // // // //   res.status(err.status || 500).json({
// // // // //     success: false,
// // // // //     error: err.message || "Internal server error",
// // // // //   });
// // // // // });

// // // // // const PORT = process.env.PORT || 4000;

// // // // // app.listen(PORT, "0.0.0.0", () => {
// // // // //   console.log(`Code Breaker API listening on port ${PORT}`);
// // // // //   console.log(`Health: http://localhost:${PORT}/api/health`);
// // // // //   console.log(
// // // // //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// // // // //   );
// // // // // });
// // // // require("dotenv").config();

// // // // const express = require("express");
// // // // const cors = require("cors");

// // // // const gameRoutes = require("./routes/gameRoutes");
// // // // const statsRoutes = require("./routes/StatsRoutes");
// // // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // // const authRoutes = require("./routes/authRoutes");
// // // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // // // const playerRoutes = require("./routes/playerRoutes");
// // // // const braintwistRoutes = require("./routes/braintwistRoutes");
// // // // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // // // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // // // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // // // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // // // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // // // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // // // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // // // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // // // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // // // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // // // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // // // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // // // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
// // // // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // // // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // // // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // // // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // // // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // // // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // // // const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
// // // // const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes");
// // // // const braintwistLevel22Routes = require("./routes/Braintwistlevel22routes");
// // // // const braintwistLevel23Routes = require("./routes/Braintwistlevel23routes");
// // // // const braintwistLevel24Routes = require("./routes/Braintwistlevel24routes");
// // // // const braintwistLevel25Routes = require("./routes/Braintwistlevel25routes");
// // // // const braintwistLevel26Routes = require("./routes/Braintwistlevel26routes");
// // // // const braintwistLevel27Routes = require("./routes/Braintwistlevel27routes"); // NEW
// // // // const app = express();

// // // // app.use(cors());
// // // // app.use(express.json());

// // // // // Confirm which server.js file is running
// // // // console.log("RUNNING FILE:", __filename);

// // // // // Log every incoming request
// // // // app.use((req, res, next) => {
// // // //   console.log("REQ:", req.method, req.originalUrl);
// // // //   next();
// // // // });

// // // // // General health check
// // // // app.get("/api/health", (req, res) => {
// // // //   res.json({
// // // //     ok: true,
// // // //     message: "Code Breaker API is running",
// // // //   });
// // // // });

// // // // // Brain Twist health check
// // // // app.get("/api/braintwist/health", (req, res) => {
// // // //   res.json({
// // // //     success: true,
// // // //     game: "Brain Twist",
// // // //     totalLevels: 27,
// // // //   });
// // // // });


// // // // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // // // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // // // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // // // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // // // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // // // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // // // Brain Twist level 8 - find the parrot in the dark room
// // // // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // // // Brain Twist level 9 - help the dog find the bone (maze)
// // // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // // // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // // // Brain Twist level 11 - farmer's sheep riddle
// // // // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // // // Brain Twist level 12 - she is late for school, tap the calendar
// // // // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // // // Brain Twist level 13
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // // // Brain Twist level 14 - put the giraffe into the fridge
// // // // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // // // Brain Twist level 15 - open the vault
// // // // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // // // Brain Twist level 16 - pizza liar
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // // // Brain Twist level 17 - what is the hidden number?
// // // // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // // // Brain Twist level 18 - arrange the letters (COASTER)
// // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // // // Brain Twist level 19 - number pattern (the answer is 4)
// // // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // // // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // // // // (/start, /answer, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // // // // Brain Twist level 21 - add any 4 numbers to make 200
// // // // // (/start, /action, /hint, /skip, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level21", braintwistLevel21Routes);

// // // // // Brain Twist level 22 - thief & police chase (the answer is 4:30 PM)
// // // // // (/start, /answer, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level22", braintwistLevel22Routes);

// // // // // Brain Twist level 23 - tap the emoji faces in order
// // // // // (/start, /answer, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level23", braintwistLevel23Routes);

// // // // // Brain Twist level 24 - younger sister's age (the answer is C: 18 years)
// // // // // (/start, /answer, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level24", braintwistLevel24Routes);

// // // // // Brain Twist level 25 - save Tung Tung Tung Sahur (drag the police van beside the door)
// // // // // (/start, /action, /skip, /status/:playerId)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level25", braintwistLevel25Routes);

// // // // // Brain Twist level 26 - wake up the cat (drag the clouds away, the sun shows)
// // // // // (/start, /finish, /hint, /skip, /reward)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level26", braintwistLevel26Routes);

// // // // // Brain Twist level 27 - what number is missing? (1 3 5 / 2 4 ?, the answer is 6) (NEW)
// // // // // (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level27Db.js)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/level27", braintwistLevel27Routes);

// // // // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // // // keep before the generic Brain Twist routes
// // // // app.use("/api/braintwist/map", braintwistMapRoutes);

// // // // // Brain Twist routes — keep before generic /api routes
// // // // app.use("/api/braintwist", braintwistRoutes);

// // // // // Existing API routes
// // // // app.use("/api", gameRoutes);
// // // // app.use("/api", statsRoutes);
// // // // app.use("/api", settingsRoutes);
// // // // app.use("/api", authRoutes);

// // // // // Word Scramble coins — keep before general Word Scramble routes
// // // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // // Register Word Scramble round-flow handlers
// // // // registerRoundRoutes(wordScrambleRoutes);

// // // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // // // app.use("/api", require("./routes/progress"));
// // // // app.use("/api/wordscramble", puzzleRoutes);
// // // // app.use("/api", playerRoutes);
// // // // app.use("/api/skip", require("./routes/Skiproutes"));

// // // // // 404 handler — no route matched
// // // // app.use((req, res) => {
// // // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// // // //   res.status(404).json({
// // // //     success: false,
// // // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // // //   });
// // // // });

// // // // // Error handler
// // // // app.use((err, req, res, next) => {
// // // //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// // // //   if (res.headersSent) {
// // // //     return next(err);
// // // //   }

// // // //   res.status(err.status || 500).json({
// // // //     success: false,
// // // //     error: err.message || "Internal server error",
// // // //   });
// // // // });

// // // // const PORT = process.env.PORT || 4000;

// // // // app.listen(PORT, "0.0.0.0", () => {
// // // //   console.log(`Code Breaker API listening on port ${PORT}`);
// // // //   console.log(`Health: http://localhost:${PORT}/api/health`);
// // // //   console.log(
// // // //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// // // //   );
// // // // });
// // // require("dotenv").config();

// // // const express = require("express");
// // // const cors = require("cors");

// // // const gameRoutes = require("./routes/gameRoutes");
// // // const statsRoutes = require("./routes/StatsRoutes");
// // // const settingsRoutes = require("./routes/SettingsRoutes");
// // // const authRoutes = require("./routes/authRoutes");
// // // const wordScrambleRoutes = require("./routes/Wordscrambleroutes");
// // // const registerRoundRoutes = require("./routes/wordscrambleRoundFlow");
// // // const puzzleRoutes = require("./routes/puzzleRoutes");
// // // const wordscrambleCoinsRoutes = require("./routes/WordscrambleCoinsRoutes");
// // // const playerRoutes = require("./routes/playerRoutes");
// // // const braintwistRoutes = require("./routes/braintwistRoutes");
// // // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
// // // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // // const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
// // // const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes");
// // // const braintwistLevel22Routes = require("./routes/Braintwistlevel22routes");
// // // const braintwistLevel23Routes = require("./routes/Braintwistlevel23routes");
// // // const braintwistLevel24Routes = require("./routes/Braintwistlevel24routes");
// // // const braintwistLevel25Routes = require("./routes/Braintwistlevel25routes");
// // // const braintwistLevel26Routes = require("./routes/Braintwistlevel26routes");
// // // const braintwistLevel27Routes = require("./routes/Braintwistlevel27routes");
// // // const braintwistLevel28Routes = require("./routes/Braintwistlevel28routes"); // NEW
// // // const app = express();

// // // app.use(cors());
// // // app.use(express.json());

// // // // Confirm which server.js file is running
// // // console.log("RUNNING FILE:", __filename);

// // // // Log every incoming request
// // // app.use((req, res, next) => {
// // //   console.log("REQ:", req.method, req.originalUrl);
// // //   next();
// // // });

// // // // General health check
// // // app.get("/api/health", (req, res) => {
// // //   res.json({
// // //     ok: true,
// // //     message: "Code Breaker API is running",
// // //   });
// // // });

// // // // Brain Twist health check
// // // app.get("/api/braintwist/health", (req, res) => {
// // //   res.json({
// // //     success: true,
// // //     game: "Brain Twist",
// // //     totalLevels: 28,
// // //   });
// // // });


// // // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // // Brain Twist level 8 - find the parrot in the dark room
// // // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // // Brain Twist level 9 - help the dog find the bone (maze)
// // // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // // Brain Twist level 11 - farmer's sheep riddle
// // // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // // Brain Twist level 12 - she is late for school, tap the calendar
// // // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // // Brain Twist level 13
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // // Brain Twist level 14 - put the giraffe into the fridge
// // // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // // Brain Twist level 15 - open the vault
// // // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // // Brain Twist level 16 - pizza liar
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // // Brain Twist level 17 - what is the hidden number?
// // // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // // Brain Twist level 18 - arrange the letters (COASTER)
// // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // // Brain Twist level 19 - number pattern (the answer is 4)
// // // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // // // (/start, /answer, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // // // Brain Twist level 21 - add any 4 numbers to make 200
// // // // (/start, /action, /hint, /skip, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level21", braintwistLevel21Routes);

// // // // Brain Twist level 22 - thief & police chase (the answer is 4:30 PM)
// // // // (/start, /answer, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level22", braintwistLevel22Routes);

// // // // Brain Twist level 23 - tap the emoji faces in order
// // // // (/start, /answer, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level23", braintwistLevel23Routes);

// // // // Brain Twist level 24 - younger sister's age (the answer is C: 18 years)
// // // // (/start, /answer, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level24", braintwistLevel24Routes);

// // // // Brain Twist level 25 - save Tung Tung Tung Sahur (drag the police van beside the door)
// // // // (/start, /action, /skip, /status/:playerId)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level25", braintwistLevel25Routes);

// // // // Brain Twist level 26 - wake up the cat (drag the clouds away, the sun shows)
// // // // (/start, /finish, /hint, /skip, /reward)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level26", braintwistLevel26Routes);

// // // // Brain Twist level 27 - what is missing? (1 3 5 / 2 4 ?, the answer is R)
// // // // (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level27Db.js)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level27", braintwistLevel27Routes);

// // // // Brain Twist level 28 - guess the word (cracked egg) (NEW)
// // // // (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level28Db.js)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/level28", braintwistLevel28Routes);

// // // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // // keep before the generic Brain Twist routes
// // // app.use("/api/braintwist/map", braintwistMapRoutes);

// // // // Brain Twist routes — keep before generic /api routes
// // // app.use("/api/braintwist", braintwistRoutes);

// // // // Existing API routes
// // // app.use("/api", gameRoutes);
// // // app.use("/api", statsRoutes);
// // // app.use("/api", settingsRoutes);
// // // app.use("/api", authRoutes);

// // // // Word Scramble coins — keep before general Word Scramble routes
// // // app.use("/api/wordscramble/coins", wordscrambleCoinsRoutes);

// // // // Register Word Scramble round-flow handlers
// // // registerRoundRoutes(wordScrambleRoutes);

// // // app.use("/api/wordscramble", wordScrambleRoutes);
// // // app.use("/api/wordscramble", require("./routes/wsProfileRoutes"));

// // // app.use("/api", require("./routes/progress"));
// // // app.use("/api/wordscramble", puzzleRoutes);
// // // app.use("/api", playerRoutes);
// // // app.use("/api/skip", require("./routes/Skiproutes"));

// // // // 404 handler — no route matched
// // // app.use((req, res) => {
// // //   console.log("404 NOT MATCHED:", req.method, req.originalUrl);

// // //   res.status(404).json({
// // //     success: false,
// // //     error: `No route: ${req.method} ${req.originalUrl}`,
// // //   });
// // // });

// // // // Error handler
// // // app.use((err, req, res, next) => {
// // //   console.error("[API ERROR]", req.method, req.originalUrl, err);

// // //   if (res.headersSent) {
// // //     return next(err);
// // //   }

// // //   res.status(err.status || 500).json({
// // //     success: false,
// // //     error: err.message || "Internal server error",
// // //   });
// // // });

// // // const PORT = process.env.PORT || 4000;

// // // app.listen(PORT, "0.0.0.0", () => {
// // //   console.log(`Code Breaker API listening on port ${PORT}`);
// // //   console.log(`Health: http://localhost:${PORT}/api/health`);
// // //   console.log(
// // //     `Brain Twist: http://localhost:${PORT}/api/braintwist/health`
// // //   );
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
// // const braintwistLevel2Routes = require("./routes/Braintwistlevel2routes");
// // const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// // const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// // const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// // const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// // const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// // const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// // const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// // const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// // const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// // const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// // const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// // const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
// // const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// // const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// // const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// // const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// // const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// // const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// // const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
// // const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes");
// // const braintwistLevel22Routes = require("./routes/Braintwistlevel22routes");
// // const braintwistLevel23Routes = require("./routes/Braintwistlevel23routes");
// // const braintwistLevel24Routes = require("./routes/Braintwistlevel24routes");
// // const braintwistLevel25Routes = require("./routes/Braintwistlevel25routes");
// // const braintwistLevel26Routes = require("./routes/Braintwistlevel26routes");
// // const braintwistLevel27Routes = require("./routes/Braintwistlevel27routes");
// // const braintwistLevel28Routes = require("./routes/Braintwistlevel28routes");
// // const braintwistLevel29Routes = require("./routes/Braintwistlevel29routes"); // NEW
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
// //     totalLevels: 29,
// //   });
// // });


// // app.use("/api/braintwist/level2", braintwistLevel2Routes);


// // app.use("/api/braintwist/level3", braintwistLevel3Routes);


// // app.use("/api/braintwist/level4", braintwistLevel4Routes);


// // app.use("/api/braintwist/level5", braintwistLevel5Routes);
// // app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// // app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // // Brain Twist level 8 - find the parrot in the dark room
// // // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // // Brain Twist level 9 - help the dog find the bone (maze)
// // // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level9", braintwistLevel9Routes);
// // app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // // Brain Twist level 11 - farmer's sheep riddle
// // // (/start, /answer, /hint, /skip, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // // Brain Twist level 12 - she is late for school, tap the calendar
// // // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // // Brain Twist level 13
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // // Brain Twist level 14 - put the giraffe into the fridge
// // // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // // Brain Twist level 15 - open the vault
// // // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // // Brain Twist level 16 - pizza liar
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // // Brain Twist level 17 - what is the hidden number?
// // // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // // Brain Twist level 18 - arrange the letters (COASTER)
// // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // // Brain Twist level 19 - number pattern (the answer is 4)
// // // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // // (/start, /answer, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // // Brain Twist level 21 - add any 4 numbers to make 200
// // // (/start, /action, /hint, /skip, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level21", braintwistLevel21Routes);

// // // Brain Twist level 22 - thief & police chase (the answer is 4:30 PM)
// // // (/start, /answer, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level22", braintwistLevel22Routes);

// // // Brain Twist level 23 - tap the emoji faces in order
// // // (/start, /answer, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level23", braintwistLevel23Routes);

// // // Brain Twist level 24 - younger sister's age (the answer is C: 18 years)
// // // (/start, /answer, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level24", braintwistLevel24Routes);

// // // Brain Twist level 25 - save Tung Tung Tung Sahur (drag the police van beside the door)
// // // (/start, /action, /skip, /status/:playerId)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level25", braintwistLevel25Routes);

// // // Brain Twist level 26 - wake up the cat (drag the clouds away, the sun shows)
// // // (/start, /finish, /hint, /skip, /reward)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level26", braintwistLevel26Routes);

// // // Brain Twist level 27 - what is missing? (1 3 5 / 2 4 ?, the answer is R)
// // // (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level27Db.js)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level27", braintwistLevel27Routes);

// // // Brain Twist level 28 - guess the word (cracked egg)
// // // (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level28Db.js)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level28", braintwistLevel28Routes);

// // // Brain Twist level 29 - car parking spot number (16 06 68 88 ? 98, the answer is 87) (NEW)
// // // (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level29Db.js)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/level29", braintwistLevel29Routes);

// // // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // // keep before the generic Brain Twist routes
// // app.use("/api/braintwist/map", braintwistMapRoutes);

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
// const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
// const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
// const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
// const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
// const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
// const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
// const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
// const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
// const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
// const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
// const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
// const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
// const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
// const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
// const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
// const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
// const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
// const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
// const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
// const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes");
// const braintwistLevel22Routes = require("./routes/Braintwistlevel22routes");
// const braintwistLevel23Routes = require("./routes/Braintwistlevel23routes");
// const braintwistLevel24Routes = require("./routes/Braintwistlevel24routes");
// const braintwistLevel25Routes = require("./routes/Braintwistlevel25routes");
// const braintwistLevel26Routes = require("./routes/Braintwistlevel26routes");
// const braintwistLevel27Routes = require("./routes/Braintwistlevel27routes");
// const braintwistLevel28Routes = require("./routes/Braintwistlevel28routes");
// const braintwistLevel29Routes = require("./routes/Braintwistlevel29routes");
// const braintwistLevel30Routes = require("./routes/Braintwistlevel30routes"); // NEW
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
//     totalLevels: 30,
//   });
// });


// app.use("/api/braintwist/level2", braintwistLevel2Routes);


// app.use("/api/braintwist/level3", braintwistLevel3Routes);


// app.use("/api/braintwist/level4", braintwistLevel4Routes);


// app.use("/api/braintwist/level5", braintwistLevel5Routes);
// app.use("/api/braintwist/level6", braintwistLevel6Routes);

// // Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
// app.use("/api/braintwist/level7", braintwistLevel7Routes);

// // Brain Twist level 8 - find the parrot in the dark room
// // (/start, /look, /hint, /skip, /reward, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level8", braintwistLevel8Routes);

// // Brain Twist level 9 - help the dog find the bone (maze)
// // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level9", braintwistLevel9Routes);
// app.use("/api/braintwist/level10", braintwistLevel10Routes);

// // Brain Twist level 11 - farmer's sheep riddle
// // (/start, /answer, /hint, /skip, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level11", braintwistLevel11Routes);

// // Brain Twist level 12 - she is late for school, tap the calendar
// // (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level12", braintwistLevel12Routes);

// // Brain Twist level 13
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level13", braintwistLevel13Routes);

// // Brain Twist level 14 - put the giraffe into the fridge
// // (/start, /action, /hint, /skip, /reward, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level14", braintwistLevel14Routes);

// // Brain Twist level 15 - open the vault
// // (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level15", braintwistLevel15Routes);

// // Brain Twist level 16 - pizza liar
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level16", braintwistLevel16Routes);

// // Brain Twist level 17 - what is the hidden number?
// // (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level17", braintwistLevel17Routes);

// // Brain Twist level 18 - arrange the letters (COASTER)
// // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level18", braintwistLevel18Routes);

// // Brain Twist level 19 - number pattern (the answer is 4)
// // (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level19", braintwistLevel19Routes);

// // Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// // (/start, /answer, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level20", braintwistLevel20Routes);

// // Brain Twist level 21 - add any 4 numbers to make 200
// // (/start, /action, /hint, /skip, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level21", braintwistLevel21Routes);

// // Brain Twist level 22 - thief & police chase (the answer is 4:30 PM)
// // (/start, /answer, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level22", braintwistLevel22Routes);

// // Brain Twist level 23 - tap the emoji faces in order
// // (/start, /answer, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level23", braintwistLevel23Routes);

// // Brain Twist level 24 - younger sister's age (the answer is C: 18 years)
// // (/start, /answer, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level24", braintwistLevel24Routes);

// // Brain Twist level 25 - save Tung Tung Tung Sahur (drag the police van beside the door)
// // (/start, /action, /skip, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level25", braintwistLevel25Routes);

// // Brain Twist level 26 - wake up the cat (drag the clouds away, the sun shows)
// // (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level26", braintwistLevel26Routes);

// // Brain Twist level 27 - what is missing? (1 3 5 / 2 4 ?, the answer is R)
// // (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level27Db.js)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level27", braintwistLevel27Routes);

// // Brain Twist level 28 - guess the word (cracked egg)
// // (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level28Db.js)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level28", braintwistLevel28Routes);

// // Brain Twist level 29 - car parking spot number (16 06 68 88 ? 98, the answer is 87)
// // (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level29Db.js)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level29", braintwistLevel29Routes);

// // Brain Twist level 30 (NEW)
// // (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level30Db.js)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/level30", braintwistLevel30Routes);

// // Brain Twist level map (/:playerId, /:playerId/open, /:playerId/complete)
// // keep before the generic Brain Twist routes
// app.use("/api/braintwist/map", braintwistMapRoutes);

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
const braintwistLevel3Routes = require("./routes/Braintwistlevel3routes");
const braintwistLevel4Routes = require("./routes/Braintwistlevel4routes");
const braintwistLevel5Routes = require("./routes/Braintwistlevel5routes");
const braintwistMapRoutes = require("./routes/Braintwistmaproutes");
const braintwistLevel6Routes = require("./routes/Braintwistlevel6routes");
const braintwistLevel7Routes = require("./routes/Braintwistlevel7routes");
const braintwistLevel8Routes = require("./routes/Braintwistlevel8routes");
const braintwistLevel9Routes = require("./routes/Braintwistlevel9routes");
const braintwistLevel10Routes = require("./routes/Braintwistlevel10routes");
const braintwistLevel11Routes = require("./routes/Braintwistlevel11routes");
const braintwistLevel12Routes = require("./routes/Braintwistlevel12routes");
const braintwistLevel13Routes = require("./routes/Braintwistlevel13routes");
const braintwistLevel14Routes = require("./routes/Braintwistlevel14routes");
const braintwistLevel15Routes = require("./routes/Braintwistlevel15routes");
const braintwistLevel16Routes = require("./routes/Braintwistlevel16routes");
const braintwistLevel17Routes = require("./routes/Braintwistlevel17routes");
const braintwistLevel18Routes = require("./routes/Braintwistlevel18routes");
const braintwistLevel19Routes = require("./routes/Braintwistlevel19routes");
const braintwistLevel20Routes = require("./routes/Braintwistlevel20routes");
const braintwistLevel21Routes = require("./routes/Braintwistlevel21routes");
const braintwistLevel22Routes = require("./routes/Braintwistlevel22routes");
const braintwistLevel23Routes = require("./routes/Braintwistlevel23routes");
const braintwistLevel24Routes = require("./routes/Braintwistlevel24routes");
const braintwistLevel25Routes = require("./routes/Braintwistlevel25routes");
const braintwistLevel26Routes = require("./routes/Braintwistlevel26routes");
const braintwistLevel27Routes = require("./routes/Braintwistlevel27routes");
const braintwistLevel28Routes = require("./routes/Braintwistlevel28routes");
const braintwistLevel29Routes = require("./routes/Braintwistlevel29routes");
const braintwistLevel30Routes = require("./routes/Braintwistlevel30routes");
const braintwistLevel31Routes = require("./routes/Braintwistlevel31routes"); // NEW
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
    totalLevels: 31,
  });
});


app.use("/api/braintwist/level2", braintwistLevel2Routes);


app.use("/api/braintwist/level3", braintwistLevel3Routes);


app.use("/api/braintwist/level4", braintwistLevel4Routes);


app.use("/api/braintwist/level5", braintwistLevel5Routes);
app.use("/api/braintwist/level6", braintwistLevel6Routes);

// Brain Twist level 7 - sleepy baby (/start, /action, /hint, /status/:playerId)
app.use("/api/braintwist/level7", braintwistLevel7Routes);

// Brain Twist level 8 - find the parrot in the dark room
// (/start, /look, /hint, /skip, /reward, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level8", braintwistLevel8Routes);

// Brain Twist level 9 - help the dog find the bone (maze)
// (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level9", braintwistLevel9Routes);
app.use("/api/braintwist/level10", braintwistLevel10Routes);

// Brain Twist level 11 - farmer's sheep riddle
// (/start, /answer, /hint, /skip, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level11", braintwistLevel11Routes);

// Brain Twist level 12 - she is late for school, tap the calendar
// (/start, /tap, /hint, /skip, /reward, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level12", braintwistLevel12Routes);

// Brain Twist level 13
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level13", braintwistLevel13Routes);

// Brain Twist level 14 - put the giraffe into the fridge
// (/start, /action, /hint, /skip, /reward, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level14", braintwistLevel14Routes);

// Brain Twist level 15 - open the vault
// (/start, /move, /tap, /enter, /hint, /skip, /reward, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level15", braintwistLevel15Routes);

// Brain Twist level 16 - pizza liar
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level16", braintwistLevel16Routes);

// Brain Twist level 17 - what is the hidden number?
// (/start, /reveal, /answer, /hint, /skip, /reward, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level17", braintwistLevel17Routes);

// Brain Twist level 18 - arrange the letters (COASTER)
// (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level18", braintwistLevel18Routes);

// Brain Twist level 19 - number pattern (the answer is 4)
// (/start, /answer, /hint, /skip, /reward, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level19", braintwistLevel19Routes);

// Brain Twist level 20 - clock strikes puzzle (the answer is 11)
// (/start, /answer, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level20", braintwistLevel20Routes);

// Brain Twist level 21 - add any 4 numbers to make 200
// (/start, /action, /hint, /skip, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level21", braintwistLevel21Routes);

// Brain Twist level 22 - thief & police chase (the answer is 4:30 PM)
// (/start, /answer, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level22", braintwistLevel22Routes);

// Brain Twist level 23 - tap the emoji faces in order
// (/start, /answer, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level23", braintwistLevel23Routes);

// Brain Twist level 24 - younger sister's age (the answer is C: 18 years)
// (/start, /answer, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level24", braintwistLevel24Routes);

// Brain Twist level 25 - save Tung Tung Tung Sahur (drag the police van beside the door)
// (/start, /action, /skip, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level25", braintwistLevel25Routes);

// Brain Twist level 26 - wake up the cat (drag the clouds away, the sun shows)
// (/start, /finish, /hint, /skip, /reward, /status/:playerId)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level26", braintwistLevel26Routes);

// Brain Twist level 27 - what is missing? (1 3 5 / 2 4 ?, the answer is R)
// (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level27Db.js)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level27", braintwistLevel27Routes);

// Brain Twist level 28 - guess the word (cracked egg)
// (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level28Db.js)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level28", braintwistLevel28Routes);

// Brain Twist level 29 - car parking spot number (16 06 68 88 ? 98, the answer is 87)
// (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level29Db.js)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level29", braintwistLevel29Routes);

// Brain Twist level 30
// (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level30Db.js)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level30", braintwistLevel30Routes);

// Brain Twist level 31 - find the mistake (the double "the", the answer is "the")
// (/start, /answer, /hint, /skip, /reward) - saved in SQL (data/level31Db.js)
// keep before the generic Brain Twist routes
app.use("/api/braintwist/level31", braintwistLevel31Routes);

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