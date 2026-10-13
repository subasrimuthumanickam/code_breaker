

// import React, {
//   useEffect,
//   useState,
// } from "react";

// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   SafeAreaView,
//   ActivityIndicator,
// } from "react-native";

// import {
//   fetchRoundResults,
//   RoundResults,
// } from "../api/Wordscrambleapi";

// interface RoundCompleteScreenProps {
//   roundId: number;
//   playerName: string;
//   myAnswer?: string;

//   // Backend may return boolean, number (1/0), or string ("1"/"0")
//   myIsCorrect?: boolean | number | string;

//   onNextRound: (isCorrect: boolean) => void;
// }

// const MEDALS = [
//   "🥇",
//   "🥈",
//   "🥉",
// ];

// const RoundCompleteScreen: React.FC<
//   RoundCompleteScreenProps
// > = ({
//   roundId,
//   playerName,
//   myAnswer = "",
//   myIsCorrect = false,
//   onNextRound,
// }) => {
//   const [
//     results,
//     setResults,
//   ] = useState<RoundResults | null>(null);

//   useEffect(() => {
//     let mounted = true;

//     fetchRoundResults(
//       String(roundId)
//     )
//       .then((data) => {
//         if (mounted) {
//           setResults(data);
//         }
//       })
//       .catch((error) => {
//         console.warn(
//           "Round results failed:",
//           error
//         );
//       });

//     return () => {
//       mounted = false;
//     };
//   }, [roundId]);

//   /* =================================================
//      LOADING
//   ================================================= */

//   if (!results) {
//     return (
//       <SafeAreaView
//         style={styles.container}
//       >
//         <View
//           style={
//             styles.loadingContainer
//           }
//         >
//           <ActivityIndicator
//             size="large"
//             color="#6C5CE7"
//           />

//           <Text
//             style={
//               styles.loadingText
//             }
//           >
//             Loading results...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }



//   const myResult =
//     results.answers.find(
//       (item) =>
//         item.player_name ===
//         playerName
//     );



//   const answerToShow =
//     myAnswer ||
//     myResult?.answer ||
//     "";

  

//   const normalizeIsCorrect = (
//     value: unknown
//   ): boolean => {
//     if (
//       value === true ||
//       value === 1 ||
//       value === "1" ||
//       value === "true"
//     ) {
//       return true;
//     }

//     return false;
//   };

//   const correctToShow =
//     normalizeIsCorrect(myIsCorrect) ||
//     normalizeIsCorrect(
//       myResult?.is_correct
//     );

//   /* =================================================
//      CORRECT WORD
//   ================================================= */

//   const correctWord =
//     results.word || "";

//   /* =================================================
//      PLAYER STANDING
//   ================================================= */

//   const myStanding =
//     results.standings.find(
//       (player) =>
//         player.player_name ===
//         playerName
//     );

//   const myScore =
//     myStanding?.score || 0;

//   /* =================================================
//      BUTTON LABEL
//   ================================================= */

//   const nextButtonLabel =
//     correctToShow
//       ? "Next Round"
//       : "Try Again";

//   return (
//     <SafeAreaView
//       style={styles.container}
//     >
//       <View
//         style={styles.content}
//       >

//         {/* =================================================
//             ROUND INFO
//         ================================================= */}

//         <Text
//           style={styles.roundText}
//         >
//           ROUND {results.roundNumber} /{" "}
//           {results.totalRounds}
//         </Text>

//         <Text
//           style={styles.title}
//         >
//           Round Complete!
//         </Text>

//         {/* =================================================
//             YOUR ANSWER
//         ================================================= */}

//         <View
//           style={styles.answerCard}
//         >
//           <Text
//             style={
//               styles.sectionTitle
//             }
//           >
//             YOUR ANSWER
//           </Text>

//           <View
//             style={
//               styles.answerBox
//             }
//           >
//             <Text
//               style={[
//                 styles.answerText,
//                 correctToShow
//                   ? styles.correctAnswer
//                   : styles.wrongAnswer,
//               ]}
//             >
//               {answerToShow ||
//                 "No answer"}
//             </Text>
//           </View>

//           {/* RESULT */}

//           <View
//             style={[
//               styles.resultBadge,
//               correctToShow
//                 ? styles.correctBadge
//                 : styles.wrongBadge,
//             ]}
//           >
//             <Text
//               style={
//                 styles.resultText
//               }
//             >
//               {correctToShow
//                 ? "✓ Correct Answer"
//                 : "✕ Wrong Answer"}
//             </Text>
//           </View>

//           {/* CORRECT WORD */}

//           {!correctToShow && (
//             <View
//               style={
//                 styles.correctWordBox
//               }
//             >
//               <Text
//                 style={
//                   styles.correctWordLabel
//                 }
//               >
//                 CORRECT ANSWER
//               </Text>

//               <Text
//                 style={
//                   styles.correctWord
//                 }
//               >
//                 {correctWord}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* =================================================
//             ROUND RESULTS
//         ================================================= */}

//         <View
//           style={styles.playersCard}
//         >
//           <Text
//             style={
//               styles.playersTitle
//             }
//           >
//             Round Results
//           </Text>

//           {results.answers.map(
//             (item, index) => {

//               // IMPORTANT:
//               // MySQL can return 1/0 instead
//               // of true/false.
//               const itemIsCorrect =
//                 normalizeIsCorrect(
//                   item.is_correct
//                 );

//               return (
//                 <View
//                   key={`${item.player_name}-${index}`}
//                   style={
//                     styles.playerRow
//                   }
//                 >
//                   <View
//                     style={
//                       styles.playerLeft
//                     }
//                   >
//                     <Text
//                       style={
//                         styles.medal
//                       }
//                     >
//                       {MEDALS[
//                         index
//                       ] ||
//                         `${index + 1}.`}
//                     </Text>

//                     <Text
//                       style={
//                         styles.playerName
//                       }
//                     >
//                       {item.player_name}
//                     </Text>
//                   </View>

//                   <View
//                     style={
//                       styles.playerRight
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.playerResult,

//                         itemIsCorrect
//                           ? styles.correctPoints
//                           : styles.zeroPoints,
//                       ]}
//                     >
//                       {itemIsCorrect
//                         ? `+${item.points}`
//                         : "0"}
//                     </Text>
//                   </View>
//                 </View>
//               );
//             }
//           )}
//         </View>

//         {/* =================================================
//             SCORE
//         ================================================= */}

//         <View
//           style={styles.scoreCard}
//         >
//           <Text
//             style={
//               styles.scoreLabel
//             }
//           >
//             YOUR SCORE
//           </Text>

//           <Text
//             style={styles.score}
//           >
//             {myScore}
//           </Text>
//         </View>

//         {/* =================================================
//             NEXT ROUND / TRY AGAIN
//         ================================================= */}

//         <Pressable
//           style={[
//             styles.nextButton,
//             !correctToShow &&
//               styles.tryAgainButton,
//           ]}
//           onPress={() =>
//             onNextRound(
//               correctToShow
//             )
//           }
//         >
//           <Text
//             style={
//               styles.nextButtonText
//             }
//           >
//             {nextButtonLabel}
//           </Text>
//         </Pressable>

//       </View>
//     </SafeAreaView>
//   );
// };

// /* =====================================================
//    STYLES
// ===================================================== */

// const styles =
//   StyleSheet.create({

//     container: {
//       flex: 1,
//       backgroundColor:
//         "#F7F7FB",
//     },

//     content: {
//       flex: 1,
//       padding: 20,
//     },

//     loadingContainer: {
//       flex: 1,
//       alignItems:
//         "center",
//       justifyContent:
//         "center",
//     },

//     loadingText: {
//       marginTop: 12,
//       fontSize: 15,
//       color: "#777",
//     },

//     roundText: {
//       textAlign:
//         "center",
//       fontSize: 14,
//       fontWeight:
//         "800",
//       color:
//         "#6C5CE7",
//       marginTop: 10,
//     },

//     title: {
//       textAlign:
//         "center",
//       fontSize: 28,
//       fontWeight:
//         "800",
//       color:
//         "#1E1B2E",
//       marginTop: 8,
//       marginBottom: 22,
//     },

//     /* =================================================
//        ANSWER CARD
//     ================================================= */

//     answerCard: {
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 20,
//       padding: 20,
//       borderWidth: 1,
//       borderColor:
//         "#E8E6F0",
//     },

//     sectionTitle: {
//       textAlign:
//         "center",
//       fontSize: 13,
//       fontWeight:
//         "800",
//       color:
//         "#777",
//       marginBottom: 14,
//     },

//     answerBox: {
//       minHeight: 60,
//       borderRadius: 14,
//       backgroundColor:
//         "#F7F7FB",
//       borderWidth: 1,
//       borderColor:
//         "#E5E2EE",
//       alignItems:
//         "center",
//       justifyContent:
//         "center",
//       paddingHorizontal: 15,
//     },

//     answerText: {
//       fontSize: 25,
//       fontWeight:
//         "900",
//       letterSpacing: 4,
//     },

//     correctAnswer: {
//       color:
//         "#22C55E",
//     },

//     wrongAnswer: {
//       color:
//         "#EF4444",
//     },

//     resultBadge: {
//       alignSelf:
//         "center",
//       marginTop: 15,
//       paddingHorizontal: 18,
//       paddingVertical: 9,
//       borderRadius: 20,
//     },

//     correctBadge: {
//       backgroundColor:
//         "#DCFCE7",
//     },

//     wrongBadge: {
//       backgroundColor:
//         "#FEE2E2",
//     },

//     resultText: {
//       fontSize: 14,
//       fontWeight:
//         "800",
//       color:
//         "#333",
//     },

//     correctWordBox: {
//       marginTop: 18,
//       alignItems:
//         "center",
//       paddingTop: 15,
//       borderTopWidth: 1,
//       borderTopColor:
//         "#EEEEF3",
//     },

//     correctWordLabel: {
//       fontSize: 11,
//       fontWeight:
//         "800",
//       color:
//         "#888",
//     },

//     correctWord: {
//       marginTop: 5,
//       fontSize: 22,
//       fontWeight:
//         "900",
//       color:
//         "#6C5CE7",
//       letterSpacing: 2,
//     },

//     /* =================================================
//        PLAYERS
//     ================================================= */

//     playersCard: {
//       marginTop: 18,
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 18,
//       padding: 18,
//       borderWidth: 1,
//       borderColor:
//         "#E8E6F0",
//     },

//     playersTitle: {
//       fontSize: 17,
//       fontWeight:
//         "800",
//       color:
//         "#1E1B2E",
//       marginBottom: 10,
//     },

//     playerRow: {
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       justifyContent:
//         "space-between",
//       paddingVertical: 11,
//       borderBottomWidth: 1,
//       borderBottomColor:
//         "#F0EFF5",
//     },

//     playerLeft: {
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//     },

//     medal: {
//       width: 32,
//       fontSize: 18,
//     },

//     playerName: {
//       fontSize: 15,
//       fontWeight:
//         "700",
//       color:
//         "#333",
//     },

//     playerRight: {
//       alignItems:
//         "flex-end",
//     },

//     playerResult: {
//       fontSize: 15,
//       fontWeight:
//         "900",
//     },

//     correctPoints: {
//       color:
//         "#22C55E",
//     },

//     zeroPoints: {
//       color:
//         "#999",
//     },

//     /* =================================================
//        SCORE
//     ================================================= */

//     scoreCard: {
//       marginTop: 16,
//       backgroundColor:
//         "#FFFFFF",
//       borderRadius: 16,
//       padding: 15,
//       alignItems:
//         "center",
//       borderWidth: 1,
//       borderColor:
//         "#E8E6F0",
//     },

//     scoreLabel: {
//       fontSize: 12,
//       fontWeight:
//         "800",
//       color:
//         "#777",
//     },

//     score: {
//       fontSize: 28,
//       fontWeight:
//         "900",
//       color:
//         "#6C5CE7",
//       marginTop: 2,
//     },

//     /* =================================================
//        NEXT / TRY AGAIN
//     ================================================= */

//     nextButton: {
//       marginTop: 16,
//       height: 52,
//       borderRadius: 15,
//       backgroundColor:
//         "#6C5CE7",
//       alignItems:
//         "center",
//       justifyContent:
//         "center",
//     },

//     tryAgainButton: {
//       backgroundColor:
//         "#EF4444",
//     },

//     nextButtonText: {
//       color:
//         "#FFFFFF",
//       fontSize: 16,
//       fontWeight:
//         "900",
//     },

//   });

// export default RoundCompleteScreen;
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView, ActivityIndicator, ScrollView } from "react-native";

import { fetchRoundResults, RoundResults } from "../api/Wordscrambleapi";

interface RoundCompleteScreenProps {
  roundId: number;
  playerName: string;
  myAnswer?: string;
  // Backend may return boolean, number (1/0), or string ("1"/"0")
  myIsCorrect?: boolean | number | string;
  onNextRound: (isCorrect: boolean) => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];

// MySQL can return 1/0 instead of true/false
const normalizeIsCorrect = (value: unknown): boolean =>
  value === true || value === 1 || value === "1" || value === "true";

type PlayerRound = {
  player_name: string;
  points: number; // total points this player earned in this round
  words: string[]; // every correct word this player found
  anyCorrect: boolean;
};

const RoundCompleteScreen: React.FC<RoundCompleteScreenProps> = ({
  roundId,
  playerName,
  myAnswer = "",
  myIsCorrect = false,
  onNextRound,
}) => {
  const [results, setResults] = useState<RoundResults | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    setResults(null);
    setFailed(false);

    fetchRoundResults(String(roundId))
      .then((data) => mounted && setResults(data))
      .catch((error) => {
        console.warn("Round results failed:", error);
        if (mounted) setFailed(true);
      });

    return () => {
      mounted = false;
    };
  }, [roundId]);

  // Backend sends one row per submitted word -> group them per player.
  const players: PlayerRound[] = useMemo(() => {
    if (!results) return [];
    const map = new Map<string, PlayerRound>();
    (results.answers ?? []).forEach((row: any) => {
      const name = String(row.player_name);
      const entry = map.get(name) ?? { player_name: name, points: 0, words: [], anyCorrect: false };
      if (normalizeIsCorrect(row.is_correct)) {
        entry.anyCorrect = true;
        entry.points += Number(row.points) || 0;
        const w = String(row.answer ?? "").trim();
        if (w && !entry.words.includes(w)) entry.words.push(w);
      }
      map.set(name, entry);
    });
    return Array.from(map.values()).sort((a, b) => b.points - a.points);
  }, [results]);

  if (failed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Couldn't load the results.</Text>
          <Pressable style={[styles.nextButton, { paddingHorizontal: 28 }]} onPress={() => onNextRound(normalizeIsCorrect(myIsCorrect))}>
            <Text style={styles.nextButtonText}>Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!results) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C5CE7" />
          <Text style={styles.loadingText}>Loading results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const me = players.find((p) => p.player_name === playerName);
  const correctToShow = normalizeIsCorrect(myIsCorrect) || !!me?.anyCorrect;

  // words I found: from the DB rows first, else from the prop the game screen sent
  const myWords: string[] =
    me && me.words.length > 0
      ? me.words
      : myAnswer
      ? myAnswer.split(",").map((w) => w.trim()).filter(Boolean)
      : [];

  const myStanding = results.standings?.find((p: any) => p.player_name === playerName);
  const myScore = myStanding?.score || 0;
  const roundPoints = me?.points ?? 0;

  const nextButtonLabel = correctToShow ? "Next Round" : "Try Again";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.roundText}>
          ROUND {results.roundNumber} / {results.totalRounds}
        </Text>
        <Text style={styles.title}>Round Complete!</Text>

        {/* ---------- my words ---------- */}
        <View style={styles.answerCard}>
          <Text style={styles.sectionTitle}>{myWords.length > 1 ? "YOUR WORDS" : "YOUR ANSWER"}</Text>

          {myWords.length > 0 ? (
            <View style={styles.chipRow}>
              {myWords.map((w) => (
                <View key={w} style={[styles.chip, correctToShow ? styles.chipOk : styles.chipBad]}>
                  <Text style={[styles.chipText, correctToShow ? styles.correctAnswer : styles.wrongAnswer]}>{w}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.answerBox}>
              <Text style={[styles.answerText, styles.wrongAnswer]}>No answer</Text>
            </View>
          )}

          <View style={[styles.resultBadge, correctToShow ? styles.correctBadge : styles.wrongBadge]}>
            <Text style={styles.resultText}>
              {correctToShow ? `✓ Correct  •  +${roundPoints} pts` : "✕ Wrong Answer"}
            </Text>
          </View>

          {!correctToShow && !!results.word && (
            <View style={styles.correctWordBox}>
              <Text style={styles.correctWordLabel}>CORRECT ANSWER</Text>
              <Text style={styles.correctWord}>{results.word}</Text>
            </View>
          )}
        </View>

        {/* ---------- leaderboard for this round (one row per player) ---------- */}
        <View style={styles.playersCard}>
          <Text style={styles.playersTitle}>Round Results</Text>
          {players.length === 0 ? (
            <Text style={styles.emptyText}>No answers submitted yet.</Text>
          ) : (
            players.map((p, index) => {
              const isMe = p.player_name === playerName;
              return (
                <View key={p.player_name} style={[styles.playerRow, isMe && styles.playerRowMe]}>
                  <View style={styles.playerLeft}>
                    <Text style={styles.medal}>{MEDALS[index] || `${index + 1}.`}</Text>
                    <View>
                      <Text style={styles.playerName}>
                        {p.player_name}
                        {isMe ? "  (you)" : ""}
                      </Text>
                      <Text style={styles.playerSub}>
                        {p.words.length} word{p.words.length === 1 ? "" : "s"} found
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.playerResult, p.anyCorrect ? styles.correctPoints : styles.zeroPoints]}>
                    {p.anyCorrect ? `+${p.points}` : "0"}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* ---------- total score ---------- */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>YOUR SCORE</Text>
          <Text style={styles.score}>{myScore}</Text>
        </View>

        <Pressable
          style={[styles.nextButton, !correctToShow && styles.tryAgainButton]}
          onPress={() => onNextRound(correctToShow)}
        >
          <Text style={styles.nextButtonText}>{nextButtonLabel}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7FB" },
  content: { padding: 20, paddingBottom: 32 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 12, fontSize: 15, color: "#777" },

  roundText: { textAlign: "center", fontSize: 14, fontWeight: "800", color: "#6C5CE7", marginTop: 10 },
  title: { textAlign: "center", fontSize: 28, fontWeight: "800", color: "#1E1B2E", marginTop: 8, marginBottom: 22 },

  answerCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: "#E8E6F0" },
  sectionTitle: { textAlign: "center", fontSize: 13, fontWeight: "800", color: "#777", marginBottom: 14 },
  answerBox: {
    minHeight: 60,
    borderRadius: 14,
    backgroundColor: "#F7F7FB",
    borderWidth: 1,
    borderColor: "#E5E2EE",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  answerText: { fontSize: 25, fontWeight: "900", letterSpacing: 4 },
  correctAnswer: { color: "#22C55E" },
  wrongAnswer: { color: "#EF4444" },

  chipRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  chip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1 },
  chipOk: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
  chipBad: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
  chipText: { fontSize: 20, fontWeight: "900", letterSpacing: 3 },

  resultBadge: { alignSelf: "center", marginTop: 15, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20 },
  correctBadge: { backgroundColor: "#DCFCE7" },
  wrongBadge: { backgroundColor: "#FEE2E2" },
  resultText: { fontSize: 14, fontWeight: "800", color: "#333" },

  correctWordBox: { marginTop: 18, alignItems: "center", paddingTop: 15, borderTopWidth: 1, borderTopColor: "#EEEEF3" },
  correctWordLabel: { fontSize: 11, fontWeight: "800", color: "#888" },
  correctWord: { marginTop: 5, fontSize: 22, fontWeight: "900", color: "#6C5CE7", letterSpacing: 2 },

  playersCard: { marginTop: 18, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, borderWidth: 1, borderColor: "#E8E6F0" },
  playersTitle: { fontSize: 17, fontWeight: "800", color: "#1E1B2E", marginBottom: 10 },
  emptyText: { color: "#999", fontSize: 14, paddingVertical: 8 },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EFF5",
  },
  playerRowMe: { backgroundColor: "#F5F3FF", borderRadius: 12 },
  playerLeft: { flexDirection: "row", alignItems: "center" },
  medal: { width: 32, fontSize: 18 },
  playerName: { fontSize: 15, fontWeight: "700", color: "#333" },
  playerSub: { fontSize: 12, color: "#999", marginTop: 1 },
  playerResult: { fontSize: 15, fontWeight: "900" },
  correctPoints: { color: "#22C55E" },
  zeroPoints: { color: "#999" },

  scoreCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E6F0",
  },
  scoreLabel: { fontSize: 12, fontWeight: "800", color: "#777" },
  score: { fontSize: 28, fontWeight: "900", color: "#6C5CE7", marginTop: 2 },

  nextButton: { marginTop: 16, height: 52, borderRadius: 15, backgroundColor: "#6C5CE7", alignItems: "center", justifyContent: "center" },
  tryAgainButton: { backgroundColor: "#EF4444" },
  nextButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
});

export default RoundCompleteScreen;
