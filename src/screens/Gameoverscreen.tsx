// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import { fetchFinalStandings, FinalStandings } from "../api/Wordscrambleapi";

// interface GameOverScreenProps {
//   roomCode: string;
//   playerName: string;
//   onRematch: () => void;
//   onHome: () => void;
// }

// const PODIUM_COLORS = ["#F5C518", "#C0C0C0", "#CD7F32"];

// const GameOverScreen: React.FC<GameOverScreenProps> = ({
//   roomCode,
//   playerName,
//   onRematch,
//   onHome,
// }) => {
//   const [data, setData] = useState<FinalStandings | null>(null);

//   useEffect(() => {
//     fetchFinalStandings(roomCode)
//       .then(setData)
//       .catch((err) => console.warn("Final standings failed:", err));
//   }, [roomCode]);

//   if (!data) {
//     return (
//       <LinearGradient colors={["#0B1020", "#141B36", "#0B1020"]} style={[styles.flex, styles.center]}>
//         <Text style={styles.loadingText}>Loading results…</Text>
//       </LinearGradient>
//     );
//   }

//   const winner = data.standings[0];
//   const myRank = data.standings.findIndex((s) => s.player_name === playerName) + 1;
//   const myScore = data.standings.find((s) => s.player_name === playerName)?.score ?? 0;
//   const top3 = data.standings.slice(0, 3);

//   return (
//     <LinearGradient colors={["#0B1020", "#241B36", "#0B1020"]} style={styles.flex}>
//       <SafeAreaView style={styles.flex}>
//         <StatusBar barStyle="light-content" backgroundColor="#0B1020" />

//         <View style={styles.header}>
//           <Ionicons name="trophy" size={44} color="#F5C518" />
//           <Text style={styles.title}>Game Over!</Text>
//           {winner && <Text style={styles.winnerText}>{winner.player_name} Wins!</Text>}
//         </View>

//         {/* Podium */}
//         <View style={styles.podiumRow}>
//           {top3.map((p, i) => (
//             <View key={p.player_name} style={styles.podiumItem}>
//               <View
//                 style={[
//                   styles.podiumAvatar,
//                   { backgroundColor: PODIUM_COLORS[i], width: i === 0 ? 56 : 46, height: i === 0 ? 56 : 46 },
//                 ]}
//               >
//                 <Text style={styles.podiumRank}>{i + 1}</Text>
//               </View>
//               <Text style={styles.podiumName}>{p.player_name}</Text>
//               <Text style={styles.podiumScore}>{p.score}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Stats row */}
//         <View style={styles.statsRow}>
//           {data.fastestAnswer && (
//             <View style={styles.statCard}>
//               <Text style={styles.statLabel}>Fastest Answer</Text>
//               <Text style={styles.statValue}>
//                 {data.fastestAnswer.best_time.toFixed(1)}s
//               </Text>
//             </View>
//           )}
//           <View style={styles.statCard}>
//             <Text style={styles.statLabel}>Total Rounds</Text>
//             <Text style={styles.statValue}>{data.totalRounds}</Text>
//           </View>
//           <View style={styles.statCard}>
//             <Text style={styles.statLabel}>Your Rank</Text>
//             <Text style={styles.statValue}>#{myRank || "-"}</Text>
//           </View>
//         </View>

//         <View style={styles.myScoreCard}>
//           <Ionicons name="star" size={18} color="#F5C518" />
//           <Text style={styles.myScoreLabel}>Your Score</Text>
//           <Text style={styles.myScoreValue}>{myScore}</Text>
//         </View>

//         <View style={styles.buttonRow}>
//           <TouchableOpacity style={styles.rematchButton} activeOpacity={0.88} onPress={onRematch}>
//             <Ionicons name="refresh" size={16} color="#FFFFFF" />
//             <Text style={styles.rematchButtonText}>Rematch</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.homeButton} activeOpacity={0.85} onPress={onHome}>
//             <Ionicons name="home" size={16} color="#FFFFFF" />
//             <Text style={styles.homeButtonText}>Home</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// export default GameOverScreen;

// const styles = StyleSheet.create({
//   flex: { flex: 1 },
//   center: { justifyContent: "center", alignItems: "center" },
//   loadingText: { color: "#9AA5C0" },
//   header: { alignItems: "center", marginTop: 30, marginBottom: 24, gap: 6 },
//   title: { color: "#FFFFFF", fontSize: 22, fontWeight: "800" },
//   winnerText: { color: "#F5C518", fontSize: 14, fontWeight: "700" },
//   podiumRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "flex-end",
//     gap: 18,
//     marginBottom: 24,
//   },
//   podiumItem: { alignItems: "center", gap: 6 },
//   podiumAvatar: { borderRadius: 100, justifyContent: "center", alignItems: "center" },
//   podiumRank: { color: "#0B1020", fontWeight: "800", fontSize: 16 },
//   podiumName: { color: "#E2E8F5", fontWeight: "700", fontSize: 12.5 },
//   podiumScore: { color: "#9AA5C0", fontSize: 11 },
//   statsRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginHorizontal: 22,
//     marginBottom: 18,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: "#141B36",
//     borderRadius: 14,
//     paddingVertical: 14,
//     alignItems: "center",
//     gap: 4,
//   },
//   statLabel: { color: "#9AA5C0", fontSize: 10.5, textAlign: "center" },
//   statValue: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
//   myScoreCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     backgroundColor: "#141B36",
//     marginHorizontal: 22,
//     padding: 16,
//     borderRadius: 14,
//   },
//   myScoreLabel: { color: "#9AA5C0", fontSize: 13 },
//   myScoreValue: { color: "#F5C518", fontWeight: "800", fontSize: 16 },
//   buttonRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginHorizontal: 22,
//     marginTop: "auto",
//     marginBottom: 30,
//   },
//   rematchButton: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 8,
//     height: 52,
//     borderRadius: 14,
//     backgroundColor: "#5B3FD6",
//   },
//   rematchButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
//   homeButton: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 8,
//     height: 52,
//     borderRadius: 14,
//     backgroundColor: "#141B36",
//     borderWidth: 1,
//     borderColor: "#1E2A4D",
//   },
//   homeButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
// });
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { fetchFinalStandings } from "../api/Wordscrambleapi";

/* =========================================================
   TYPES
========================================================= */

interface StandingPlayer {
  player_name: string;
  score: number;
}

interface FastestAnswer {
  player_name?: string;
  best_time: number;
}

interface FinalStandings {
  standings: StandingPlayer[];
  fastestAnswer?: FastestAnswer | null;
  totalRounds: number;
}

/* =========================================================
   PROPS
========================================================= */

interface GameOverScreenProps {
  roomCode: string;
  playerName: string;
  onRematch: () => void;
  onHome: () => void;
}

/* =========================================================
   CONSTANTS
========================================================= */

const PODIUM_COLORS = [
  "#F5C518",
  "#C0C0C0",
  "#CD7F32",
];

/* =========================================================
   COMPONENT
========================================================= */

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  roomCode,
  playerName,
  onRematch,
  onHome,
}) => {
  const [data, setData] = useState<FinalStandings | null>(null);

  /* =======================================================
     LOAD FINAL STANDINGS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    fetchFinalStandings(roomCode)
      .then((result) => {
        if (!mounted) return;

        setData(result as FinalStandings);
      })
      .catch((err: unknown) => {
        console.warn(
          "Final standings failed:",
          err
        );
      });

    return () => {
      mounted = false;
    };
  }, [roomCode]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (!data) {
    return (
      <LinearGradient
        colors={[
          "#0B1020",
          "#141B36",
          "#0B1020",
        ]}
        style={[
          styles.flex,
          styles.center,
        ]}
      >
        <Text style={styles.loadingText}>
          Loading results…
        </Text>
      </LinearGradient>
    );
  }

  /* =======================================================
     PLAYER DATA
  ======================================================= */

  const winner: StandingPlayer | undefined =
    data.standings[0];

  const myRank: number =
    data.standings.findIndex(
      (player: StandingPlayer) =>
        player.player_name === playerName
    ) + 1;

  const myPlayer: StandingPlayer | undefined =
    data.standings.find(
      (player: StandingPlayer) =>
        player.player_name === playerName
    );

  const myScore: number =
    Number(myPlayer?.score ?? 0);

  const top3: StandingPlayer[] =
    data.standings.slice(0, 3);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <LinearGradient
      colors={[
        "#0B1020",
        "#241B36",
        "#0B1020",
      ]}
      style={styles.flex}
    >
      <SafeAreaView style={styles.flex}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0B1020"
        />

        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <Ionicons
            name="trophy"
            size={44}
            color="#F5C518"
          />

          <Text style={styles.title}>
            Game Over!
          </Text>

          {winner && (
            <Text style={styles.winnerText}>
              {winner.player_name} Wins!
            </Text>
          )}
        </View>

        {/* =================================================
            PODIUM
        ================================================= */}

        <View style={styles.podiumRow}>
          {top3.map(
            (
              player: StandingPlayer,
              index: number
            ) => (
              <View
                key={`${player.player_name}-${index}`}
                style={styles.podiumItem}
              >
                <View
                  style={[
                    styles.podiumAvatar,
                    {
                      backgroundColor:
                        PODIUM_COLORS[index],

                      width:
                        index === 0
                          ? 56
                          : 46,

                      height:
                        index === 0
                          ? 56
                          : 46,
                    },
                  ]}
                >
                  <Text style={styles.podiumRank}>
                    {index + 1}
                  </Text>
                </View>

                <Text
                  style={styles.podiumName}
                  numberOfLines={1}
                >
                  {player.player_name}
                </Text>

                <Text style={styles.podiumScore}>
                  {player.score}
                </Text>
              </View>
            )
          )}
        </View>

        {/* =================================================
            STATS
        ================================================= */}

        <View style={styles.statsRow}>
          {data.fastestAnswer && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>
                Fastest Answer
              </Text>

              <Text style={styles.statValue}>
                {Number(
                  data.fastestAnswer.best_time
                ).toFixed(1)}
                s
              </Text>
            </View>
          )}

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>
              Total Rounds
            </Text>

            <Text style={styles.statValue}>
              {data.totalRounds}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>
              Your Rank
            </Text>

            <Text style={styles.statValue}>
              #{myRank || "-"}
            </Text>
          </View>
        </View>

        {/* =================================================
            MY SCORE
        ================================================= */}

        <View style={styles.myScoreCard}>
          <Ionicons
            name="star"
            size={18}
            color="#F5C518"
          />

          <Text style={styles.myScoreLabel}>
            Your Score
          </Text>

          <Text style={styles.myScoreValue}>
            {myScore}
          </Text>
        </View>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.rematchButton}
            activeOpacity={0.88}
            onPress={onRematch}
          >
            <Ionicons
              name="refresh"
              size={16}
              color="#FFFFFF"
            />

            <Text style={styles.rematchButtonText}>
              Rematch
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            activeOpacity={0.85}
            onPress={onHome}
          >
            <Ionicons
              name="home"
              size={16}
              color="#FFFFFF"
            />

            <Text style={styles.homeButtonText}>
              Home
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default GameOverScreen;

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#9AA5C0",
  },

  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 24,
    gap: 6,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  winnerText: {
    color: "#F5C518",
    fontSize: 14,
    fontWeight: "700",
  },

  podiumRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 18,
    marginBottom: 24,
  },

  podiumItem: {
    alignItems: "center",
    gap: 6,
    maxWidth: 100,
  },

  podiumAvatar: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  podiumRank: {
    color: "#0B1020",
    fontWeight: "800",
    fontSize: 16,
  },

  podiumName: {
    color: "#E2E8F5",
    fontWeight: "700",
    fontSize: 12.5,
    maxWidth: 90,
  },

  podiumScore: {
    color: "#9AA5C0",
    fontSize: 11,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 22,
    marginBottom: 18,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#141B36",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
  },

  statLabel: {
    color: "#9AA5C0",
    fontSize: 10.5,
    textAlign: "center",
  },

  statValue: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },

  myScoreCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#141B36",
    marginHorizontal: 22,
    padding: 16,
    borderRadius: 14,
  },

  myScoreLabel: {
    color: "#9AA5C0",
    fontSize: 13,
  },

  myScoreValue: {
    color: "#F5C518",
    fontWeight: "800",
    fontSize: 16,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 22,
    marginTop: "auto",
    marginBottom: 30,
  },

  rematchButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#5B3FD6",
  },

  rematchButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },

  homeButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#141B36",
    borderWidth: 1,
    borderColor: "#1E2A4D",
  },

  homeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});