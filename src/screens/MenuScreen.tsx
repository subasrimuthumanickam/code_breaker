// // // // // // // // // // // import React from "react";
// // // // // // // // // // // import {
// // // // // // // // // // //   View,
// // // // // // // // // // //   Text,
// // // // // // // // // // //   StyleSheet,
// // // // // // // // // // //   ScrollView,
// // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // //   SafeAreaView,
// // // // // // // // // // //   StatusBar,
// // // // // // // // // // // } from "react-native";
// // // // // // // // // // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// // // // // // // // // // // import { useNavigation } from "@react-navigation/native";

// // // // // // // // // // // type GameItem = {
// // // // // // // // // // //   id: string;
// // // // // // // // // // //   title: string;
// // // // // // // // // // //   subtitle: string;
// // // // // // // // // // //   icon: React.ReactNode;
// // // // // // // // // // //   iconBg: string;
// // // // // // // // // // //   route?: string;
// // // // // // // // // // //   ready: boolean;
// // // // // // // // // // // };

// // // // // // // // // // // const GAMES: GameItem[] = [
// // // // // // // // // // //   {
// // // // // // // // // // //     id: "word-cipher",
// // // // // // // // // // //     title: "Word Cipher",
// // // // // // // // // // //     subtitle: "Decode a hidden word",
// // // // // // // // // // //     icon: <Text style={styles.aaIcon}>Aa</Text>,
// // // // // // // // // // //     iconBg: "#5B3FD6",
// // // // // // // // // // //     route: "WordCipherIntro",
// // // // // // // // // // //     ready: false,
// // // // // // // // // // //   },
// // // // // // // // // // //   {
// // // // // // // // // // //     id: "code-breaker",
// // // // // // // // // // //     title: "Code Breaker",
// // // // // // // // // // //     subtitle: "Find the secret code",
// // // // // // // // // // //     icon: <Ionicons name="lock-closed" size={22} color="#4D9DFF" />,
// // // // // // // // // // //     iconBg: "#12243F",
// // // // // // // // // // //     route: "Difficulty", // un existing Code Breaker entry screen
// // // // // // // // // // //     ready: true,
// // // // // // // // // // //   },
// // // // // // // // // // //   {
// // // // // // // // // // //     id: "memory-grid",
// // // // // // // // // // //     title: "Memory Grid",
// // // // // // // // // // //     subtitle: "Remember & recall",
// // // // // // // // // // //     icon: <Ionicons name="grid" size={22} color="#2BE58B" />,
// // // // // // // // // // //     iconBg: "#0F2A22",
// // // // // // // // // // //     route: "MemoryGrid",
// // // // // // // // // // //     ready: false,
// // // // // // // // // // //   },
// // // // // // // // // // //   {
// // // // // // // // // // //     id: "pattern-hacker",
// // // // // // // // // // //     title: "Pattern Hacker",
// // // // // // // // // // //     subtitle: "Find the missing pattern",
// // // // // // // // // // //     icon: (
// // // // // // // // // // //       <MaterialCommunityIcons name="graph-outline" size={22} color="#4D9DFF" />
// // // // // // // // // // //     ),
// // // // // // // // // // //     iconBg: "#12243F",
// // // // // // // // // // //     route: "PatternHacker",
// // // // // // // // // // //     ready: false,
// // // // // // // // // // //   },
// // // // // // // // // // //   {
// // // // // // // // // // //     id: "clue-hunt",
// // // // // // // // // // //     title: "Clue Hunt",
// // // // // // // // // // //     subtitle: "Solve clues to unlock code",
// // // // // // // // // // //     icon: <Ionicons name="search" size={22} color="#4D9DFF" />,
// // // // // // // // // // //     iconBg: "#12243F",
// // // // // // // // // // //     route: "ClueHunt",
// // // // // // // // // // //     ready: false,
// // // // // // // // // // //   },
// // // // // // // // // // // ];

// // // // // // // // // // // export default function HomeScreen() {
// // // // // // // // // // //   const navigation = useNavigation<any>();
// // // // // // // // // // //   const [activeTab, setActiveTab] = React.useState("home");

// // // // // // // // // // //   const openGame = (game: GameItem) => {
// // // // // // // // // // //     if (game.ready && game.route) {
// // // // // // // // // // //       navigation.navigate(game.route);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <SafeAreaView style={styles.safe}>
// // // // // // // // // // //       <StatusBar barStyle="light-content" backgroundColor="#05070F" />

// // // // // // // // // // //       <ScrollView
// // // // // // // // // // //         contentContainerStyle={styles.scroll}
// // // // // // // // // // //         showsVerticalScrollIndicator={false}
// // // // // // // // // // //       >
// // // // // // // // // // //         {/* Header */}
// // // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // // //           <View style={styles.brainWrap}>
// // // // // // // // // // //             <MaterialCommunityIcons name="brain" size={40} color="#4D9DFF" />
// // // // // // // // // // //           </View>

// // // // // // // // // // //           <View style={styles.titleFrame}>
// // // // // // // // // // //             <Text style={styles.title}>CYBER MIND</Text>
// // // // // // // // // // //           </View>

// // // // // // // // // // //           <Text style={styles.tagline}>THINK · SOLVE · UNLOCK</Text>
// // // // // // // // // // //         </View>

// // // // // // // // // // //         {/* Game list */}
// // // // // // // // // // //         <View style={styles.list}>
// // // // // // // // // // //           {GAMES.map((game, index) => {
// // // // // // // // // // //             const isFeatured = index === 0;
// // // // // // // // // // //             return (
// // // // // // // // // // //               <TouchableOpacity
// // // // // // // // // // //                 key={game.id}
// // // // // // // // // // //                 activeOpacity={0.85}
// // // // // // // // // // //                 onPress={() => openGame(game)}
// // // // // // // // // // //                 style={[
// // // // // // // // // // //                   styles.card,
// // // // // // // // // // //                   isFeatured && styles.cardFeatured,
// // // // // // // // // // //                   !game.ready && styles.cardLocked,
// // // // // // // // // // //                 ]}
// // // // // // // // // // //               >
// // // // // // // // // // //                 <View style={[styles.iconBox, { backgroundColor: game.iconBg }]}>
// // // // // // // // // // //                   {game.icon}
// // // // // // // // // // //                 </View>

// // // // // // // // // // //                 <View style={styles.cardText}>
// // // // // // // // // // //                   <Text style={styles.cardTitle}>{game.title}</Text>
// // // // // // // // // // //                   <Text style={styles.cardSubtitle}>{game.subtitle}</Text>
// // // // // // // // // // //                 </View>

// // // // // // // // // // //                 {game.ready ? (
// // // // // // // // // // //                   <Ionicons name="chevron-forward" size={20} color="#6E7A90" />
// // // // // // // // // // //                 ) : (
// // // // // // // // // // //                   <Text style={styles.soon}>Soon</Text>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // //             );
// // // // // // // // // // //           })}
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </ScrollView>

// // // // // // // // // // //       {/* Bottom tabs */}
// // // // // // // // // // //       <View style={styles.tabBar}>
// // // // // // // // // // //         {[
// // // // // // // // // // //           { key: "home", label: "Home", icon: "home" },
// // // // // // // // // // //           { key: "games", label: "Games", icon: "game-controller" },
// // // // // // // // // // //           { key: "profile", label: "Profile", icon: "person" },
// // // // // // // // // // //         ].map((tab) => {
// // // // // // // // // // //           const active = activeTab === tab.key;
// // // // // // // // // // //           return (
// // // // // // // // // // //             <TouchableOpacity
// // // // // // // // // // //               key={tab.key}
// // // // // // // // // // //               style={styles.tabItem}
// // // // // // // // // // //               onPress={() => setActiveTab(tab.key)}
// // // // // // // // // // //               activeOpacity={0.8}
// // // // // // // // // // //             >
// // // // // // // // // // //               <Ionicons
// // // // // // // // // // //                 name={tab.icon as any}
// // // // // // // // // // //                 size={22}
// // // // // // // // // // //                 color={active ? "#4D9DFF" : "#5A6478"}
// // // // // // // // // // //               />
// // // // // // // // // // //               <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
// // // // // // // // // // //                 {tab.label}
// // // // // // // // // // //               </Text>
// // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // //           );
// // // // // // // // // // //         })}
// // // // // // // // // // //       </View>
// // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // //   );
// // // // // // // // // // // }

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   safe: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     backgroundColor: "#05070F",
// // // // // // // // // // //   },
// // // // // // // // // // //   scroll: {
// // // // // // // // // // //     paddingHorizontal: 18,
// // // // // // // // // // //     paddingBottom: 24,
// // // // // // // // // // //   },

// // // // // // // // // // //   header: {
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     paddingTop: 18,
// // // // // // // // // // //     paddingBottom: 26,
// // // // // // // // // // //   },
// // // // // // // // // // //   brainWrap: {
// // // // // // // // // // //     marginBottom: 10,
// // // // // // // // // // //   },
// // // // // // // // // // //   titleFrame: {
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: "#1C3A66",
// // // // // // // // // // //     borderRadius: 6,
// // // // // // // // // // //     paddingHorizontal: 22,
// // // // // // // // // // //     paddingVertical: 8,
// // // // // // // // // // //     backgroundColor: "#081324",
// // // // // // // // // // //   },
// // // // // // // // // // //   title: {
// // // // // // // // // // //     fontSize: 30,
// // // // // // // // // // //     fontWeight: "800",
// // // // // // // // // // //     letterSpacing: 3,
// // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // //   },
// // // // // // // // // // //   tagline: {
// // // // // // // // // // //     marginTop: 12,
// // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // //     letterSpacing: 2.5,
// // // // // // // // // // //     color: "#6E7A90",
// // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // //   },

// // // // // // // // // // //   list: {
// // // // // // // // // // //     gap: 14,
// // // // // // // // // // //   },
// // // // // // // // // // //   card: {
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     backgroundColor: "#0A1020",
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: "#17233B",
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     paddingVertical: 16,
// // // // // // // // // // //     paddingHorizontal: 14,
// // // // // // // // // // //   },
// // // // // // // // // // //   cardFeatured: {
// // // // // // // // // // //     borderColor: "#5B3FD6",
// // // // // // // // // // //     backgroundColor: "#0D1330",
// // // // // // // // // // //   },
// // // // // // // // // // //   cardLocked: {
// // // // // // // // // // //     opacity: 0.55,
// // // // // // // // // // //   },
// // // // // // // // // // //   iconBox: {
// // // // // // // // // // //     width: 44,
// // // // // // // // // // //     height: 44,
// // // // // // // // // // //     borderRadius: 10,
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     justifyContent: "center",
// // // // // // // // // // //     marginRight: 14,
// // // // // // // // // // //   },
// // // // // // // // // // //   aaIcon: {
// // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // //     fontSize: 17,
// // // // // // // // // // //     fontWeight: "700",
// // // // // // // // // // //   },
// // // // // // // // // // //   cardText: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //   },
// // // // // // // // // // //   cardTitle: {
// // // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: "700",
// // // // // // // // // // //     marginBottom: 3,
// // // // // // // // // // //   },
// // // // // // // // // // //   cardSubtitle: {
// // // // // // // // // // //     color: "#7A879C",
// // // // // // // // // // //     fontSize: 12.5,
// // // // // // // // // // //   },
// // // // // // // // // // //   soon: {
// // // // // // // // // // //     color: "#5A6478",
// // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // //   },

// // // // // // // // // // //   tabBar: {
// // // // // // // // // // //     flexDirection: "row",
// // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // //     borderTopColor: "#131C30",
// // // // // // // // // // //     backgroundColor: "#070B16",
// // // // // // // // // // //     paddingVertical: 10,
// // // // // // // // // // //   },
// // // // // // // // // // //   tabItem: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     alignItems: "center",
// // // // // // // // // // //     gap: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   tabLabel: {
// // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // //     color: "#5A6478",
// // // // // // // // // // //     fontWeight: "600",
// // // // // // // // // // //   },
// // // // // // // // // // //   tabLabelActive: {
// // // // // // // // // // //     color: "#4D9DFF",
// // // // // // // // // // //   },
// // // // // // // // // // // });
// // // // // // // // // // import React from "react";
// // // // // // // // // // import {
// // // // // // // // // //   View,
// // // // // // // // // //   Text,
// // // // // // // // // //   StyleSheet,
// // // // // // // // // //   ScrollView,
// // // // // // // // // //   TouchableOpacity,
// // // // // // // // // //   SafeAreaView,
// // // // // // // // // //   StatusBar,
// // // // // // // // // // } from "react-native";
// // // // // // // // // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// // // // // // // // // // import { useNavigation } from "@react-navigation/native";

// // // // // // // // // // type GameItem = {
// // // // // // // // // //   id: string;
// // // // // // // // // //   title: string;
// // // // // // // // // //   subtitle: string;
// // // // // // // // // //   icon: React.ReactNode;
// // // // // // // // // //   iconBg: string;
// // // // // // // // // //   route?: string;
// // // // // // // // // //   ready: boolean;
// // // // // // // // // // };

// // // // // // // // // // const GAMES: GameItem[] = [
// // // // // // // // // //   {
// // // // // // // // // //     id: "word-cipher",
// // // // // // // // // //     title: "Word Cipher",
// // // // // // // // // //     subtitle: "Decode a hidden word",
// // // // // // // // // //     icon: (
// // // // // // // // // //       <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "700" }}>
// // // // // // // // // //         Aa
// // // // // // // // // //       </Text>
// // // // // // // // // //     ),
// // // // // // // // // //     iconBg: "#5B3FD6",
// // // // // // // // // //     route: "WordCipherIntro",
// // // // // // // // // //     ready: false,
// // // // // // // // // //   },
// // // // // // // // // //   {
// // // // // // // // // //     id: "code-breaker",
// // // // // // // // // //     title: "Code Breaker",
// // // // // // // // // //     subtitle: "Find the secret code",
// // // // // // // // // //     icon: <Ionicons name="lock-closed" size={22} color="#4D9DFF" />,
// // // // // // // // // //     iconBg: "#12243F",
// // // // // // // // // //     route: "Difficulty", // un existing Code Breaker entry screen
// // // // // // // // // //     ready: true,
// // // // // // // // // //   },
// // // // // // // // // //   {
// // // // // // // // // //     id: "memory-grid",
// // // // // // // // // //     title: "Memory Grid",
// // // // // // // // // //     subtitle: "Remember & recall",
// // // // // // // // // //     icon: <Ionicons name="grid" size={22} color="#2BE58B" />,
// // // // // // // // // //     iconBg: "#0F2A22",
// // // // // // // // // //     route: "MemoryGrid",
// // // // // // // // // //     ready: false,
// // // // // // // // // //   },
// // // // // // // // // //   {
// // // // // // // // // //     id: "pattern-hacker",
// // // // // // // // // //     title: "Pattern Hacker",
// // // // // // // // // //     subtitle: "Find the missing pattern",
// // // // // // // // // //     icon: (
// // // // // // // // // //       <MaterialCommunityIcons name="graph-outline" size={22} color="#4D9DFF" />
// // // // // // // // // //     ),
// // // // // // // // // //     iconBg: "#12243F",
// // // // // // // // // //     route: "PatternHacker",
// // // // // // // // // //     ready: false,
// // // // // // // // // //   },
// // // // // // // // // //   {
// // // // // // // // // //     id: "clue-hunt",
// // // // // // // // // //     title: "Clue Hunt",
// // // // // // // // // //     subtitle: "Solve clues to unlock code",
// // // // // // // // // //     icon: <Ionicons name="search" size={22} color="#4D9DFF" />,
// // // // // // // // // //     iconBg: "#12243F",
// // // // // // // // // //     route: "ClueHunt",
// // // // // // // // // //     ready: false,
// // // // // // // // // //   },
// // // // // // // // // // ];

// // // // // // // // // // export default function MenuScreen() {
// // // // // // // // // //   const navigation = useNavigation<any>();
// // // // // // // // // //   const [activeTab, setActiveTab] = React.useState("home");

// // // // // // // // // //   const openGame = (game: GameItem) => {
// // // // // // // // // //     if (game.ready && game.route) {
// // // // // // // // // //       navigation.navigate(game.route);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   return (
// // // // // // // // // //     <SafeAreaView style={styles.safe}>
// // // // // // // // // //       <StatusBar barStyle="light-content" backgroundColor="#05070F" />

// // // // // // // // // //       <ScrollView
// // // // // // // // // //         contentContainerStyle={styles.scroll}
// // // // // // // // // //         showsVerticalScrollIndicator={false}
// // // // // // // // // //       >
// // // // // // // // // //         {/* Header */}
// // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // //           <View style={styles.brainWrap}>
// // // // // // // // // //             <MaterialCommunityIcons name="brain" size={40} color="#4D9DFF" />
// // // // // // // // // //           </View>

// // // // // // // // // //           <View style={styles.titleFrame}>
// // // // // // // // // //             <Text style={styles.title}>CYBER MIND</Text>
// // // // // // // // // //           </View>

// // // // // // // // // //           <Text style={styles.tagline}>THINK · SOLVE · UNLOCK</Text>
// // // // // // // // // //         </View>

// // // // // // // // // //         {/* Game list */}
// // // // // // // // // //         <View style={styles.list}>
// // // // // // // // // //           {GAMES.map((game, index) => {
// // // // // // // // // //             const isFeatured = index === 0;
// // // // // // // // // //             return (
// // // // // // // // // //               <TouchableOpacity
// // // // // // // // // //                 key={game.id}
// // // // // // // // // //                 activeOpacity={0.85}
// // // // // // // // // //                 onPress={() => openGame(game)}
// // // // // // // // // //                 style={[
// // // // // // // // // //                   styles.card,
// // // // // // // // // //                   isFeatured && styles.cardFeatured,
// // // // // // // // // //                   !game.ready && styles.cardLocked,
// // // // // // // // // //                 ]}
// // // // // // // // // //               >
// // // // // // // // // //                 <View style={[styles.iconBox, { backgroundColor: game.iconBg }]}>
// // // // // // // // // //                   {game.icon}
// // // // // // // // // //                 </View>

// // // // // // // // // //                 <View style={styles.cardText}>
// // // // // // // // // //                   <Text style={styles.cardTitle}>{game.title}</Text>
// // // // // // // // // //                   <Text style={styles.cardSubtitle}>{game.subtitle}</Text>
// // // // // // // // // //                 </View>

// // // // // // // // // //                 {game.ready ? (
// // // // // // // // // //                   <Ionicons name="chevron-forward" size={20} color="#6E7A90" />
// // // // // // // // // //                 ) : (
// // // // // // // // // //                   <Text style={styles.soon}>Soon</Text>
// // // // // // // // // //                 )}
// // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // //             );
// // // // // // // // // //           })}
// // // // // // // // // //         </View>
// // // // // // // // // //       </ScrollView>

// // // // // // // // // //       {/* Bottom tabs */}
// // // // // // // // // //       <View style={styles.tabBar}>
// // // // // // // // // //         {[
// // // // // // // // // //           { key: "home", label: "Home", icon: "home" },
// // // // // // // // // //           { key: "games", label: "Games", icon: "game-controller" },
// // // // // // // // // //           { key: "profile", label: "Profile", icon: "person" },
// // // // // // // // // //         ].map((tab) => {
// // // // // // // // // //           const active = activeTab === tab.key;
// // // // // // // // // //           return (
// // // // // // // // // //             <TouchableOpacity
// // // // // // // // // //               key={tab.key}
// // // // // // // // // //               style={styles.tabItem}
// // // // // // // // // //               onPress={() => setActiveTab(tab.key)}
// // // // // // // // // //               activeOpacity={0.8}
// // // // // // // // // //             >
// // // // // // // // // //               <Ionicons
// // // // // // // // // //                 name={tab.icon as any}
// // // // // // // // // //                 size={22}
// // // // // // // // // //                 color={active ? "#4D9DFF" : "#5A6478"}
// // // // // // // // // //               />
// // // // // // // // // //               <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
// // // // // // // // // //                 {tab.label}
// // // // // // // // // //               </Text>
// // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // //           );
// // // // // // // // // //         })}
// // // // // // // // // //       </View>
// // // // // // // // // //     </SafeAreaView>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //   safe: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     backgroundColor: "#05070F",
// // // // // // // // // //   },
// // // // // // // // // //   scroll: {
// // // // // // // // // //     paddingHorizontal: 18,
// // // // // // // // // //     paddingBottom: 24,
// // // // // // // // // //   },

// // // // // // // // // //   header: {
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     paddingTop: 18,
// // // // // // // // // //     paddingBottom: 26,
// // // // // // // // // //   },
// // // // // // // // // //   brainWrap: {
// // // // // // // // // //     marginBottom: 10,
// // // // // // // // // //   },
// // // // // // // // // //   titleFrame: {
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: "#1C3A66",
// // // // // // // // // //     borderRadius: 6,
// // // // // // // // // //     paddingHorizontal: 22,
// // // // // // // // // //     paddingVertical: 8,
// // // // // // // // // //     backgroundColor: "#081324",
// // // // // // // // // //   },
// // // // // // // // // //   title: {
// // // // // // // // // //     fontSize: 30,
// // // // // // // // // //     fontWeight: "800",
// // // // // // // // // //     letterSpacing: 3,
// // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // //   },
// // // // // // // // // //   tagline: {
// // // // // // // // // //     marginTop: 12,
// // // // // // // // // //     fontSize: 11,
// // // // // // // // // //     letterSpacing: 2.5,
// // // // // // // // // //     color: "#6E7A90",
// // // // // // // // // //     fontWeight: "600",
// // // // // // // // // //   },

// // // // // // // // // //   list: {
// // // // // // // // // //     gap: 14,
// // // // // // // // // //   },
// // // // // // // // // //   card: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     backgroundColor: "#0A1020",
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: "#17233B",
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     paddingVertical: 16,
// // // // // // // // // //     paddingHorizontal: 14,
// // // // // // // // // //   },
// // // // // // // // // //   cardFeatured: {
// // // // // // // // // //     borderColor: "#5B3FD6",
// // // // // // // // // //     backgroundColor: "#0D1330",
// // // // // // // // // //   },
// // // // // // // // // //   cardLocked: {
// // // // // // // // // //     opacity: 0.55,
// // // // // // // // // //   },
// // // // // // // // // //   iconBox: {
// // // // // // // // // //     width: 44,
// // // // // // // // // //     height: 44,
// // // // // // // // // //     borderRadius: 10,
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     justifyContent: "center",
// // // // // // // // // //     marginRight: 14,
// // // // // // // // // //   },
// // // // // // // // // //   cardText: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //   },
// // // // // // // // // //   cardTitle: {
// // // // // // // // // //     color: "#FFFFFF",
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: "700",
// // // // // // // // // //     marginBottom: 3,
// // // // // // // // // //   },
// // // // // // // // // //   cardSubtitle: {
// // // // // // // // // //     color: "#7A879C",
// // // // // // // // // //     fontSize: 12.5,
// // // // // // // // // //   },
// // // // // // // // // //   soon: {
// // // // // // // // // //     color: "#5A6478",
// // // // // // // // // //     fontSize: 11,
// // // // // // // // // //     fontWeight: "600",
// // // // // // // // // //   },

// // // // // // // // // //   tabBar: {
// // // // // // // // // //     flexDirection: "row",
// // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // //     borderTopColor: "#131C30",
// // // // // // // // // //     backgroundColor: "#070B16",
// // // // // // // // // //     paddingVertical: 10,
// // // // // // // // // //   },
// // // // // // // // // //   tabItem: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     alignItems: "center",
// // // // // // // // // //     gap: 4,
// // // // // // // // // //   },
// // // // // // // // // //   tabLabel: {
// // // // // // // // // //     fontSize: 11,
// // // // // // // // // //     color: "#5A6478",
// // // // // // // // // //     fontWeight: "600",
// // // // // // // // // //   },
// // // // // // // // // //   tabLabelActive: {
// // // // // // // // // //     color: "#4D9DFF",
// // // // // // // // // //   },
// // // // // // // // // // });
// // // // // // // // // import React from "react";
// // // // // // // // // import {
// // // // // // // // //   View,
// // // // // // // // //   Text,
// // // // // // // // //   StyleSheet,
// // // // // // // // //   ScrollView,
// // // // // // // // //   TouchableOpacity,
// // // // // // // // //   SafeAreaView,
// // // // // // // // //   StatusBar,
// // // // // // // // //   Alert,
// // // // // // // // // } from "react-native";
// // // // // // // // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// // // // // // // // // type GameId =
// // // // // // // // //   | "word-cipher"
// // // // // // // // //   | "code-breaker"
// // // // // // // // //   | "memory-grid"
// // // // // // // // //   | "pattern-hacker"
// // // // // // // // //   | "clue-hunt";

// // // // // // // // // type GameItem = {
// // // // // // // // //   id: GameId;
// // // // // // // // //   title: string;
// // // // // // // // //   subtitle: string;
// // // // // // // // //   icon: React.ReactNode;
// // // // // // // // //   iconBg: string;
// // // // // // // // //   ready: boolean;
// // // // // // // // // };

// // // // // // // // // const GAMES: GameItem[] = [
// // // // // // // // //   {
// // // // // // // // //     id: "word-cipher",
// // // // // // // // //     title: "Word Cipher",
// // // // // // // // //     subtitle: "Decode a hidden word",
// // // // // // // // //     icon: (
// // // // // // // // //       <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "700" }}>
// // // // // // // // //         Aa
// // // // // // // // //       </Text>
// // // // // // // // //     ),
// // // // // // // // //     iconBg: "#5B3FD6",
// // // // // // // // //     ready: false,
// // // // // // // // //   },
// // // // // // // // //   {
// // // // // // // // //     id: "code-breaker",
// // // // // // // // //     title: "Code Breaker",
// // // // // // // // //     subtitle: "Find the secret code",
// // // // // // // // //     icon: <Ionicons name="lock-closed" size={22} color="#4D9DFF" />,
// // // // // // // // //     iconBg: "#12243F",
// // // // // // // // //     ready: true,
// // // // // // // // //   },
// // // // // // // // //   {
// // // // // // // // //     id: "memory-grid",
// // // // // // // // //     title: "Memory Grid",
// // // // // // // // //     subtitle: "Remember & recall",
// // // // // // // // //     icon: <Ionicons name="grid" size={22} color="#2BE58B" />,
// // // // // // // // //     iconBg: "#0F2A22",
// // // // // // // // //     ready: false,
// // // // // // // // //   },
// // // // // // // // //   {
// // // // // // // // //     id: "pattern-hacker",
// // // // // // // // //     title: "Pattern Hacker",
// // // // // // // // //     subtitle: "Find the missing pattern",
// // // // // // // // //     icon: (
// // // // // // // // //       <MaterialCommunityIcons name="graph-outline" size={22} color="#4D9DFF" />
// // // // // // // // //     ),
// // // // // // // // //     iconBg: "#12243F",
// // // // // // // // //     ready: false,
// // // // // // // // //   },
// // // // // // // // //   {
// // // // // // // // //     id: "clue-hunt",
// // // // // // // // //     title: "Clue Hunt",
// // // // // // // // //     subtitle: "Solve clues to unlock code",
// // // // // // // // //     icon: <Ionicons name="search" size={22} color="#4D9DFF" />,
// // // // // // // // //     iconBg: "#12243F",
// // // // // // // // //     ready: false,
// // // // // // // // //   },
// // // // // // // // // ];

// // // // // // // // // type Props = {
// // // // // // // // //   onSelectGame: (id: GameId) => void;
// // // // // // // // // };

// // // // // // // // // export default function MenuScreen({ onSelectGame }: Props) {
// // // // // // // // //   const [activeTab, setActiveTab] = React.useState("home");

// // // // // // // // //   const openGame = (game: GameItem) => {
// // // // // // // // //     if (game.ready) {
// // // // // // // // //       onSelectGame(game.id);
// // // // // // // // //     } else {
// // // // // // // // //       Alert.alert("Coming soon", `${game.title} is not ready yet.`);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <SafeAreaView style={styles.safe}>
// // // // // // // // //       <StatusBar barStyle="light-content" backgroundColor="#05070F" />

// // // // // // // // //       <ScrollView
// // // // // // // // //         contentContainerStyle={styles.scroll}
// // // // // // // // //         showsVerticalScrollIndicator={false}
// // // // // // // // //       >
// // // // // // // // //         {/* Header */}
// // // // // // // // //         <View style={styles.header}>
// // // // // // // // //           <View style={styles.brainWrap}>
// // // // // // // // //             <MaterialCommunityIcons name="brain" size={40} color="#4D9DFF" />
// // // // // // // // //           </View>

// // // // // // // // //           <View style={styles.titleFrame}>
// // // // // // // // //             <Text style={styles.title}>CYBER MIND</Text>
// // // // // // // // //           </View>

// // // // // // // // //           <Text style={styles.tagline}>THINK · SOLVE · UNLOCK</Text>
// // // // // // // // //         </View>

// // // // // // // // //         {/* Game list */}
// // // // // // // // //         <View style={styles.list}>
// // // // // // // // //           {GAMES.map((game, index) => {
// // // // // // // // //             const isFeatured = index === 0;
// // // // // // // // //             return (
// // // // // // // // //               <TouchableOpacity
// // // // // // // // //                 key={game.id}
// // // // // // // // //                 activeOpacity={0.85}
// // // // // // // // //                 onPress={() => openGame(game)}
// // // // // // // // //                 style={[
// // // // // // // // //                   styles.card,
// // // // // // // // //                   isFeatured && styles.cardFeatured,
// // // // // // // // //                   !game.ready && styles.cardLocked,
// // // // // // // // //                 ]}
// // // // // // // // //               >
// // // // // // // // //                 <View style={[styles.iconBox, { backgroundColor: game.iconBg }]}>
// // // // // // // // //                   {game.icon}
// // // // // // // // //                 </View>

// // // // // // // // //                 <View style={styles.cardText}>
// // // // // // // // //                   <Text style={styles.cardTitle}>{game.title}</Text>
// // // // // // // // //                   <Text style={styles.cardSubtitle}>{game.subtitle}</Text>
// // // // // // // // //                 </View>

// // // // // // // // //                 {game.ready ? (
// // // // // // // // //                   <Ionicons name="chevron-forward" size={20} color="#6E7A90" />
// // // // // // // // //                 ) : (
// // // // // // // // //                   <Text style={styles.soon}>Soon</Text>
// // // // // // // // //                 )}
// // // // // // // // //               </TouchableOpacity>
// // // // // // // // //             );
// // // // // // // // //           })}
// // // // // // // // //         </View>
// // // // // // // // //       </ScrollView>

// // // // // // // // //       {/* Bottom tabs */}
// // // // // // // // //       <View style={styles.tabBar}>
// // // // // // // // //         {[
// // // // // // // // //           { key: "home", label: "Home", icon: "home" },
// // // // // // // // //           { key: "games", label: "Games", icon: "game-controller" },
// // // // // // // // //           { key: "profile", label: "Profile", icon: "person" },
// // // // // // // // //         ].map((tab) => {
// // // // // // // // //           const active = activeTab === tab.key;
// // // // // // // // //           return (
// // // // // // // // //             <TouchableOpacity
// // // // // // // // //               key={tab.key}
// // // // // // // // //               style={styles.tabItem}
// // // // // // // // //               onPress={() => setActiveTab(tab.key)}
// // // // // // // // //               activeOpacity={0.8}
// // // // // // // // //             >
// // // // // // // // //               <Ionicons
// // // // // // // // //                 name={tab.icon as any}
// // // // // // // // //                 size={22}
// // // // // // // // //                 color={active ? "#4D9DFF" : "#5A6478"}
// // // // // // // // //               />
// // // // // // // // //               <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
// // // // // // // // //                 {tab.label}
// // // // // // // // //               </Text>
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //           );
// // // // // // // // //         })}
// // // // // // // // //       </View>
// // // // // // // // //     </SafeAreaView>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   safe: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     backgroundColor: "#05070F",
// // // // // // // // //   },
// // // // // // // // //   scroll: {
// // // // // // // // //     paddingHorizontal: 18,
// // // // // // // // //     paddingBottom: 24,
// // // // // // // // //   },

// // // // // // // // //   header: {
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     paddingTop: 18,
// // // // // // // // //     paddingBottom: 26,
// // // // // // // // //   },
// // // // // // // // //   brainWrap: {
// // // // // // // // //     marginBottom: 10,
// // // // // // // // //   },
// // // // // // // // //   titleFrame: {
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#1C3A66",
// // // // // // // // //     borderRadius: 6,
// // // // // // // // //     paddingHorizontal: 22,
// // // // // // // // //     paddingVertical: 8,
// // // // // // // // //     backgroundColor: "#081324",
// // // // // // // // //   },
// // // // // // // // //   title: {
// // // // // // // // //     fontSize: 30,
// // // // // // // // //     fontWeight: "800",
// // // // // // // // //     letterSpacing: 3,
// // // // // // // // //     color: "#FFFFFF",
// // // // // // // // //   },
// // // // // // // // //   tagline: {
// // // // // // // // //     marginTop: 12,
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     letterSpacing: 2.5,
// // // // // // // // //     color: "#6E7A90",
// // // // // // // // //     fontWeight: "600",
// // // // // // // // //   },

// // // // // // // // //   list: {
// // // // // // // // //     gap: 14,
// // // // // // // // //   },
// // // // // // // // //   card: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     backgroundColor: "#0A1020",
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: "#17233B",
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     paddingVertical: 16,
// // // // // // // // //     paddingHorizontal: 14,
// // // // // // // // //   },
// // // // // // // // //   cardFeatured: {
// // // // // // // // //     borderColor: "#5B3FD6",
// // // // // // // // //     backgroundColor: "#0D1330",
// // // // // // // // //   },
// // // // // // // // //   cardLocked: {
// // // // // // // // //     opacity: 0.55,
// // // // // // // // //   },
// // // // // // // // //   iconBox: {
// // // // // // // // //     width: 44,
// // // // // // // // //     height: 44,
// // // // // // // // //     borderRadius: 10,
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     justifyContent: "center",
// // // // // // // // //     marginRight: 14,
// // // // // // // // //   },
// // // // // // // // //   cardText: {
// // // // // // // // //     flex: 1,
// // // // // // // // //   },
// // // // // // // // //   cardTitle: {
// // // // // // // // //     color: "#FFFFFF",
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: "700",
// // // // // // // // //     marginBottom: 3,
// // // // // // // // //   },
// // // // // // // // //   cardSubtitle: {
// // // // // // // // //     color: "#7A879C",
// // // // // // // // //     fontSize: 12.5,
// // // // // // // // //   },
// // // // // // // // //   soon: {
// // // // // // // // //     color: "#5A6478",
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     fontWeight: "600",
// // // // // // // // //   },

// // // // // // // // //   tabBar: {
// // // // // // // // //     flexDirection: "row",
// // // // // // // // //     borderTopWidth: 1,
// // // // // // // // //     borderTopColor: "#131C30",
// // // // // // // // //     backgroundColor: "#070B16",
// // // // // // // // //     paddingVertical: 10,
// // // // // // // // //   },
// // // // // // // // //   tabItem: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     alignItems: "center",
// // // // // // // // //     gap: 4,
// // // // // // // // //   },
// // // // // // // // //   tabLabel: {
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     color: "#5A6478",
// // // // // // // // //     fontWeight: "600",
// // // // // // // // //   },
// // // // // // // // //   tabLabelActive: {
// // // // // // // // //     color: "#4D9DFF",
// // // // // // // // //   },
// // // // // // // // // });
// // // // // // // // import React from "react";
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   StyleSheet,
// // // // // // // //   ScrollView,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   SafeAreaView,
// // // // // // // //   StatusBar,
// // // // // // // //   Alert,
// // // // // // // // } from "react-native";
// // // // // // // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// // // // // // // // type GameId =
// // // // // // // //   | "word-cipher"
// // // // // // // //   | "code-breaker"
// // // // // // // //   | "memory-grid"
// // // // // // // //   | "pattern-hacker"
// // // // // // // //   | "clue-hunt";

// // // // // // // // type GameItem = {
// // // // // // // //   id: GameId;
// // // // // // // //   title: string;
// // // // // // // //   subtitle: string;
// // // // // // // //   icon: React.ReactNode;
// // // // // // // //   iconBg: string;
// // // // // // // //   ready: boolean;
// // // // // // // // };

// // // // // // // // const GAMES: GameItem[] = [
// // // // // // // //   {
// // // // // // // //     id: "word-cipher",
// // // // // // // //     title: "Word Cipher",
// // // // // // // //     subtitle: "Decode a hidden word",
// // // // // // // //     icon: (
// // // // // // // //       <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "700" }}>
// // // // // // // //         Aa
// // // // // // // //       </Text>
// // // // // // // //     ),
// // // // // // // //     iconBg: "#5B3FD6",
// // // // // // // //     ready: false,
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: "code-breaker",
// // // // // // // //     title: "Code Breaker",
// // // // // // // //     subtitle: "Find the secret code",
// // // // // // // //     icon: <Ionicons name="lock-closed" size={22} color="#4D9DFF" />,
// // // // // // // //     iconBg: "#12243F",
// // // // // // // //     ready: true,
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: "memory-grid",
// // // // // // // //     title: "Memory Grid",
// // // // // // // //     subtitle: "Remember & recall",
// // // // // // // //     icon: <Ionicons name="grid" size={22} color="#2BE58B" />,
// // // // // // // //     iconBg: "#0F2A22",
// // // // // // // //     ready: false,
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: "pattern-hacker",
// // // // // // // //     title: "Pattern Hacker",
// // // // // // // //     subtitle: "Find the missing pattern",
// // // // // // // //     icon: (
// // // // // // // //       <MaterialCommunityIcons name="graph-outline" size={22} color="#4D9DFF" />
// // // // // // // //     ),
// // // // // // // //     iconBg: "#12243F",
// // // // // // // //     ready: false,
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: "clue-hunt",
// // // // // // // //     title: "Clue Hunt",
// // // // // // // //     subtitle: "Solve clues to unlock code",
// // // // // // // //     icon: <Ionicons name="search" size={22} color="#4D9DFF" />,
// // // // // // // //     iconBg: "#12243F",
// // // // // // // //     ready: false,
// // // // // // // //   },
// // // // // // // // ];

// // // // // // // // type Props = {
// // // // // // // //   onSelectGame: (id: GameId) => void;
// // // // // // // // };

// // // // // // // // export default function MenuScreen({ onSelectGame }: Props) {
// // // // // // // //   const [activeTab, setActiveTab] = React.useState("home");

// // // // // // // //   const openGame = (game: GameItem) => {
// // // // // // // //     if (game.ready) {
// // // // // // // //       onSelectGame(game.id);
// // // // // // // //     } else {
// // // // // // // //       Alert.alert("Coming soon", `${game.title} is not ready yet.`);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <SafeAreaView style={styles.safe}>
// // // // // // // //       <StatusBar barStyle="light-content" backgroundColor="#05070F" />

// // // // // // // //       <ScrollView
// // // // // // // //         contentContainerStyle={styles.scroll}
// // // // // // // //         showsVerticalScrollIndicator={false}
// // // // // // // //       >
// // // // // // // //         {/* Header */}
// // // // // // // //         <View style={styles.header}>
// // // // // // // //           <View style={styles.brainWrap}>
// // // // // // // //             <MaterialCommunityIcons name="brain" size={40} color="#4D9DFF" />
// // // // // // // //           </View>

// // // // // // // //           <View style={styles.titleFrame}>
// // // // // // // //             <Text style={styles.title}>CYBER MIND</Text>
// // // // // // // //           </View>

// // // // // // // //           <Text style={styles.tagline}>THINK · SOLVE · UNLOCK</Text>
// // // // // // // //         </View>

// // // // // // // //         {/* Game list */}
// // // // // // // //         <View style={styles.list}>
// // // // // // // //           {GAMES.map((game, index) => {
// // // // // // // //             const isFeatured = index === 0;
// // // // // // // //             return (
// // // // // // // //               <TouchableOpacity
// // // // // // // //                 key={game.id}
// // // // // // // //                 activeOpacity={0.85}
// // // // // // // //                 onPress={() => openGame(game)}
// // // // // // // //                 style={[
// // // // // // // //                   styles.card,
// // // // // // // //                   isFeatured && styles.cardFeatured,
// // // // // // // //                   !game.ready && styles.cardLocked,
// // // // // // // //                 ]}
// // // // // // // //               >
// // // // // // // //                 <View style={[styles.iconBox, { backgroundColor: game.iconBg }]}>
// // // // // // // //                   {game.icon}
// // // // // // // //                 </View>

// // // // // // // //                 <View style={styles.cardText}>
// // // // // // // //                   <Text style={styles.cardTitle}>{game.title}</Text>
// // // // // // // //                   <Text style={styles.cardSubtitle}>{game.subtitle}</Text>
// // // // // // // //                 </View>

// // // // // // // //                 {game.ready ? (
// // // // // // // //                   <Ionicons name="chevron-forward" size={20} color="#6E7A90" />
// // // // // // // //                 ) : (
// // // // // // // //                   <Text style={styles.soon}>Soon</Text>
// // // // // // // //                 )}
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             );
// // // // // // // //           })}
// // // // // // // //         </View>
// // // // // // // //       </ScrollView>

// // // // // // // //       {/* Bottom tabs */}
// // // // // // // //       <View style={styles.tabBar}>
// // // // // // // //         {[
// // // // // // // //           { key: "home", label: "Home", icon: "home" },
// // // // // // // //           { key: "games", label: "Games", icon: "game-controller" },
// // // // // // // //           { key: "profile", label: "Profile", icon: "person" },
// // // // // // // //         ].map((tab) => {
// // // // // // // //           const active = activeTab === tab.key;
// // // // // // // //           return (
// // // // // // // //             <TouchableOpacity
// // // // // // // //               key={tab.key}
// // // // // // // //               style={styles.tabItem}
// // // // // // // //               onPress={() => setActiveTab(tab.key)}
// // // // // // // //               activeOpacity={0.8}
// // // // // // // //             >
// // // // // // // //               <Ionicons
// // // // // // // //                 name={tab.icon as any}
// // // // // // // //                 size={22}
// // // // // // // //                 color={active ? "#4D9DFF" : "#5A6478"}
// // // // // // // //               />
// // // // // // // //               <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
// // // // // // // //                 {tab.label}
// // // // // // // //               </Text>
// // // // // // // //             </TouchableOpacity>
// // // // // // // //           );
// // // // // // // //         })}
// // // // // // // //       </View>
// // // // // // // //     </SafeAreaView>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   safe: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: "#05070F",
// // // // // // // //   },
// // // // // // // //   scroll: {
// // // // // // // //     paddingHorizontal: 18,
// // // // // // // //     paddingBottom: 24,
// // // // // // // //   },

// // // // // // // //   header: {
// // // // // // // //     alignItems: "center",
// // // // // // // //     paddingTop: 18,
// // // // // // // //     paddingBottom: 26,
// // // // // // // //   },
// // // // // // // //   brainWrap: {
// // // // // // // //     marginBottom: 10,
// // // // // // // //   },
// // // // // // // //   titleFrame: {
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#1C3A66",
// // // // // // // //     borderRadius: 6,
// // // // // // // //     paddingHorizontal: 22,
// // // // // // // //     paddingVertical: 8,
// // // // // // // //     backgroundColor: "#081324",
// // // // // // // //   },
// // // // // // // //   title: {
// // // // // // // //     fontSize: 30,
// // // // // // // //     fontWeight: "800",
// // // // // // // //     letterSpacing: 3,
// // // // // // // //     color: "#FFFFFF",
// // // // // // // //   },
// // // // // // // //   tagline: {
// // // // // // // //     marginTop: 12,
// // // // // // // //     fontSize: 11,
// // // // // // // //     letterSpacing: 2.5,
// // // // // // // //     color: "#6E7A90",
// // // // // // // //     fontWeight: "600",
// // // // // // // //   },

// // // // // // // //   list: {
// // // // // // // //     gap: 14,
// // // // // // // //   },
// // // // // // // //   card: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     alignItems: "center",
// // // // // // // //     backgroundColor: "#0A1020",
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: "#17233B",
// // // // // // // //     borderRadius: 12,
// // // // // // // //     paddingVertical: 16,
// // // // // // // //     paddingHorizontal: 14,
// // // // // // // //   },
// // // // // // // //   cardFeatured: {
// // // // // // // //     borderColor: "#5B3FD6",
// // // // // // // //     backgroundColor: "#0D1330",
// // // // // // // //   },
// // // // // // // //   cardLocked: {
// // // // // // // //     opacity: 0.55,
// // // // // // // //   },
// // // // // // // //   iconBox: {
// // // // // // // //     width: 44,
// // // // // // // //     height: 44,
// // // // // // // //     borderRadius: 10,
// // // // // // // //     alignItems: "center",
// // // // // // // //     justifyContent: "center",
// // // // // // // //     marginRight: 14,
// // // // // // // //   },
// // // // // // // //   cardText: {
// // // // // // // //     flex: 1,
// // // // // // // //   },
// // // // // // // //   cardTitle: {
// // // // // // // //     color: "#FFFFFF",
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: "700",
// // // // // // // //     marginBottom: 3,
// // // // // // // //   },
// // // // // // // //   cardSubtitle: {
// // // // // // // //     color: "#7A879C",
// // // // // // // //     fontSize: 12.5,
// // // // // // // //   },
// // // // // // // //   soon: {
// // // // // // // //     color: "#5A6478",
// // // // // // // //     fontSize: 11,
// // // // // // // //     fontWeight: "600",
// // // // // // // //   },

// // // // // // // //   tabBar: {
// // // // // // // //     flexDirection: "row",
// // // // // // // //     borderTopWidth: 1,
// // // // // // // //     borderTopColor: "#131C30",
// // // // // // // //     backgroundColor: "#070B16",
// // // // // // // //     paddingVertical: 10,
// // // // // // // //   },
// // // // // // // //   tabItem: {
// // // // // // // //     flex: 1,
// // // // // // // //     alignItems: "center",
// // // // // // // //     gap: 4,
// // // // // // // //   },
// // // // // // // //   tabLabel: {
// // // // // // // //     fontSize: 11,
// // // // // // // //     color: "#5A6478",
// // // // // // // //     fontWeight: "600",
// // // // // // // //   },
// // // // // // // //   tabLabelActive: {
// // // // // // // //     color: "#4D9DFF",
// // // // // // // //   },
// // // // // // // // });
// // // // // // // import React from "react";
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   StyleSheet,
// // // // // // //   ScrollView,
// // // // // // //   TouchableOpacity,
// // // // // // //   SafeAreaView,
// // // // // // //   StatusBar,
// // // // // // //   Alert,
// // // // // // // } from "react-native";
// // // // // // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// // // // // // // type GameId =
// // // // // // //   | "word-cipher"
// // // // // // //   | "code-breaker"
// // // // // // //   | "memory-grid"
// // // // // // //   | "pattern-hacker"
// // // // // // //   | "word-scramble";   // 👈 clue-hunt renamed to word-scramble

// // // // // // // type GameItem = {
// // // // // // //   id: GameId;
// // // // // // //   title: string;
// // // // // // //   subtitle: string;
// // // // // // //   icon: React.ReactNode;
// // // // // // //   iconBg: string;
// // // // // // //   ready: boolean;
// // // // // // // };

// // // // // // // const GAMES: GameItem[] = [
// // // // // // //   {
// // // // // // //     id: "word-cipher",
// // // // // // //     title: "Word Cipher",
// // // // // // //     subtitle: "Decode a hidden word",
// // // // // // //     icon: (
// // // // // // //       <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "700" }}>
// // // // // // //         Aa
// // // // // // //       </Text>
// // // // // // //     ),
// // // // // // //     iconBg: "#5B3FD6",
// // // // // // //     ready: false,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: "code-breaker",
// // // // // // //     title: "Code Breaker",
// // // // // // //     subtitle: "Find the secret code",
// // // // // // //     icon: <Ionicons name="lock-closed" size={22} color="#4D9DFF" />,
// // // // // // //     iconBg: "#12243F",
// // // // // // //     ready: true,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: "memory-grid",
// // // // // // //     title: "Memory Grid",
// // // // // // //     subtitle: "Remember & recall",
// // // // // // //     icon: <Ionicons name="grid" size={22} color="#2BE58B" />,
// // // // // // //     iconBg: "#0F2A22",
// // // // // // //     ready: false,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: "pattern-hacker",
// // // // // // //     title: "Pattern Hacker",
// // // // // // //     subtitle: "Find the missing pattern",
// // // // // // //     icon: (
// // // // // // //       <MaterialCommunityIcons name="graph-outline" size={22} color="#4D9DFF" />
// // // // // // //     ),
// // // // // // //     iconBg: "#12243F",
// // // // // // //     ready: false,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     // 👇 Clue Hunt replaced with Word Scramble, marked ready
// // // // // // //     id: "word-scramble",
// // // // // // //     title: "Word Scramble",
// // // // // // //     subtitle: "Unscramble words with friends",
// // // // // // //     icon: <MaterialCommunityIcons name="shuffle-variant" size={22} color="#FFC94D" />,
// // // // // // //     iconBg: "#3A2F0F",
// // // // // // //     ready: true,
// // // // // // //   },
// // // // // // // ];

// // // // // // // type Props = {
// // // // // // //   onSelectGame: (id: GameId) => void;
// // // // // // // };

// // // // // // // export default function MenuScreen({ onSelectGame }: Props) {
// // // // // // //   const [activeTab, setActiveTab] = React.useState("home");

// // // // // // //   const openGame = (game: GameItem) => {
// // // // // // //     if (game.ready) {
// // // // // // //       onSelectGame(game.id);
// // // // // // //     } else {
// // // // // // //       Alert.alert("Coming soon", `${game.title} is not ready yet.`);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <SafeAreaView style={styles.safe}>
// // // // // // //       <StatusBar barStyle="light-content" backgroundColor="#05070F" />

// // // // // // //       <ScrollView
// // // // // // //         contentContainerStyle={styles.scroll}
// // // // // // //         showsVerticalScrollIndicator={false}
// // // // // // //       >
// // // // // // //         {/* Header */}
// // // // // // //         <View style={styles.header}>
// // // // // // //           <View style={styles.brainWrap}>
// // // // // // //             <MaterialCommunityIcons name="brain" size={40} color="#4D9DFF" />
// // // // // // //           </View>

// // // // // // //           <View style={styles.titleFrame}>
// // // // // // //             <Text style={styles.title}>CYBER MIND</Text>
// // // // // // //           </View>

// // // // // // //           <Text style={styles.tagline}>THINK · SOLVE · UNLOCK</Text>
// // // // // // //         </View>

// // // // // // //         {/* Game list */}
// // // // // // //         <View style={styles.list}>
// // // // // // //           {GAMES.map((game, index) => {
// // // // // // //             const isFeatured = index === 0;
// // // // // // //             return (
// // // // // // //               <TouchableOpacity
// // // // // // //                 key={game.id}
// // // // // // //                 activeOpacity={0.85}
// // // // // // //                 onPress={() => openGame(game)}
// // // // // // //                 style={[
// // // // // // //                   styles.card,
// // // // // // //                   isFeatured && styles.cardFeatured,
// // // // // // //                   !game.ready && styles.cardLocked,
// // // // // // //                 ]}
// // // // // // //               >
// // // // // // //                 <View style={[styles.iconBox, { backgroundColor: game.iconBg }]}>
// // // // // // //                   {game.icon}
// // // // // // //                 </View>

// // // // // // //                 <View style={styles.cardText}>
// // // // // // //                   <Text style={styles.cardTitle}>{game.title}</Text>
// // // // // // //                   <Text style={styles.cardSubtitle}>{game.subtitle}</Text>
// // // // // // //                 </View>

// // // // // // //                 {game.ready ? (
// // // // // // //                   <Ionicons name="chevron-forward" size={20} color="#6E7A90" />
// // // // // // //                 ) : (
// // // // // // //                   <Text style={styles.soon}>Soon</Text>
// // // // // // //                 )}
// // // // // // //               </TouchableOpacity>
// // // // // // //             );
// // // // // // //           })}
// // // // // // //         </View>
// // // // // // //       </ScrollView>

// // // // // // //       {/* Bottom tabs */}
// // // // // // //       <View style={styles.tabBar}>
// // // // // // //         {[
// // // // // // //           { key: "home", label: "Home", icon: "home" },
// // // // // // //           { key: "games", label: "Games", icon: "game-controller" },
// // // // // // //           { key: "profile", label: "Profile", icon: "person" },
// // // // // // //         ].map((tab) => {
// // // // // // //           const active = activeTab === tab.key;
// // // // // // //           return (
// // // // // // //             <TouchableOpacity
// // // // // // //               key={tab.key}
// // // // // // //               style={styles.tabItem}
// // // // // // //               onPress={() => setActiveTab(tab.key)}
// // // // // // //               activeOpacity={0.8}
// // // // // // //             >
// // // // // // //               <Ionicons
// // // // // // //                 name={tab.icon as any}
// // // // // // //                 size={22}
// // // // // // //                 color={active ? "#4D9DFF" : "#5A6478"}
// // // // // // //               />
// // // // // // //               <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
// // // // // // //                 {tab.label}
// // // // // // //               </Text>
// // // // // // //             </TouchableOpacity>
// // // // // // //           );
// // // // // // //         })}
// // // // // // //       </View>
// // // // // // //     </SafeAreaView>
// // // // // // //   );
// // // // // // // }

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   safe: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: "#05070F",
// // // // // // //   },
// // // // // // //   scroll: {
// // // // // // //     paddingHorizontal: 18,
// // // // // // //     paddingBottom: 24,
// // // // // // //   },

// // // // // // //   header: {
// // // // // // //     alignItems: "center",
// // // // // // //     paddingTop: 18,
// // // // // // //     paddingBottom: 26,
// // // // // // //   },
// // // // // // //   brainWrap: {
// // // // // // //     marginBottom: 10,
// // // // // // //   },
// // // // // // //   titleFrame: {
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#1C3A66",
// // // // // // //     borderRadius: 6,
// // // // // // //     paddingHorizontal: 22,
// // // // // // //     paddingVertical: 8,
// // // // // // //     backgroundColor: "#081324",
// // // // // // //   },
// // // // // // //   title: {
// // // // // // //     fontSize: 30,
// // // // // // //     fontWeight: "800",
// // // // // // //     letterSpacing: 3,
// // // // // // //     color: "#FFFFFF",
// // // // // // //   },
// // // // // // //   tagline: {
// // // // // // //     marginTop: 12,
// // // // // // //     fontSize: 11,
// // // // // // //     letterSpacing: 2.5,
// // // // // // //     color: "#6E7A90",
// // // // // // //     fontWeight: "600",
// // // // // // //   },

// // // // // // //   list: {
// // // // // // //     gap: 14,
// // // // // // //   },
// // // // // // //   card: {
// // // // // // //     flexDirection: "row",
// // // // // // //     alignItems: "center",
// // // // // // //     backgroundColor: "#0A1020",
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: "#17233B",
// // // // // // //     borderRadius: 12,
// // // // // // //     paddingVertical: 16,
// // // // // // //     paddingHorizontal: 14,
// // // // // // //   },
// // // // // // //   cardFeatured: {
// // // // // // //     borderColor: "#5B3FD6",
// // // // // // //     backgroundColor: "#0D1330",
// // // // // // //   },
// // // // // // //   cardLocked: {
// // // // // // //     opacity: 0.55,
// // // // // // //   },
// // // // // // //   iconBox: {
// // // // // // //     width: 44,
// // // // // // //     height: 44,
// // // // // // //     borderRadius: 10,
// // // // // // //     alignItems: "center",
// // // // // // //     justifyContent: "center",
// // // // // // //     marginRight: 14,
// // // // // // //   },
// // // // // // //   cardText: {
// // // // // // //     flex: 1,
// // // // // // //   },
// // // // // // //   cardTitle: {
// // // // // // //     color: "#FFFFFF",
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: "700",
// // // // // // //     marginBottom: 3,
// // // // // // //   },
// // // // // // //   cardSubtitle: {
// // // // // // //     color: "#7A879C",
// // // // // // //     fontSize: 12.5,
// // // // // // //   },
// // // // // // //   soon: {
// // // // // // //     color: "#5A6478",
// // // // // // //     fontSize: 11,
// // // // // // //     fontWeight: "600",
// // // // // // //   },

// // // // // // //   tabBar: {
// // // // // // //     flexDirection: "row",
// // // // // // //     borderTopWidth: 1,
// // // // // // //     borderTopColor: "#131C30",
// // // // // // //     backgroundColor: "#070B16",
// // // // // // //     paddingVertical: 10,
// // // // // // //   },
// // // // // // //   tabItem: {
// // // // // // //     flex: 1,
// // // // // // //     alignItems: "center",
// // // // // // //     gap: 4,
// // // // // // //   },
// // // // // // //   tabLabel: {
// // // // // // //     fontSize: 11,
// // // // // // //     color: "#5A6478",
// // // // // // //     fontWeight: "600",
// // // // // // //   },
// // // // // // //   tabLabelActive: {
// // // // // // //     color: "#4D9DFF",
// // // // // // //   },
// // // // // // // });
// // // // // // import React from "react";
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   StyleSheet,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // //   Dimensions,
// // // // // // } from "react-native";
// // // // // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// // // // // // type GameId =
// // // // // //   | "word-cipher"
// // // // // //   | "code-breaker"
// // // // // //   | "memory-grid"
// // // // // //   | "pattern-hacker"
// // // // // //   | "word-scramble";

// // // // // // type GameItem = {
// // // // // //   id: GameId;
// // // // // //   title: string;
// // // // // //   subtitle: string;
// // // // // //   description: string;
// // // // // //   icon: React.ReactNode;
// // // // // //   iconBg: string;
// // // // // //   accent: string;
// // // // // //   ready: boolean;
// // // // // //   difficulty: string;
// // // // // //   players: string;
// // // // // // };

// // // // // // type Props = {
// // // // // //   onSelectGame: (id: GameId) => void;
// // // // // // };

// // // // // // const { width } = Dimensions.get("window");

// // // // // // const GAMES: GameItem[] = [
// // // // // //   {
// // // // // //     id: "code-breaker",
// // // // // //     title: "Code Breaker",
// // // // // //     subtitle: "Crack the secret code",
// // // // // //     description: "Use clues and logic to find the hidden number.",
// // // // // //     icon: (
// // // // // //       <Ionicons
// // // // // //         name="lock-closed"
// // // // // //         size={25}
// // // // // //         color="#61A8FF"
// // // // // //       />
// // // // // //     ),
// // // // // //     iconBg: "#122B4D",
// // // // // //     accent: "#4D9DFF",
// // // // // //     ready: true,
// // // // // //     difficulty: "Easy",
// // // // // //     players: "1 Player",
// // // // // //   },

// // // // // //   {
// // // // // //     id: "word-scramble",
// // // // // //     title: "Word Scramble",
// // // // // //     subtitle: "Unscramble the words",
// // // // // //     description: "Challenge your friends and solve words quickly.",
// // // // // //     icon: (
// // // // // //       <MaterialCommunityIcons
// // // // // //         name="shuffle-variant"
// // // // // //         size={27}
// // // // // //         color="#FFC94D"
// // // // // //       />
// // // // // //     ),
// // // // // //     iconBg: "#3A2E0E",
// // // // // //     accent: "#FFC94D",
// // // // // //     ready: true,
// // // // // //     difficulty: "Medium",
// // // // // //     players: "Multiplayer",
// // // // // //   },

// // // // // //   {
// // // // // //     id: "memory-grid",
// // // // // //     title: "Memory Grid",
// // // // // //     subtitle: "Test your memory",
// // // // // //     description: "Remember the positions and recall them correctly.",
// // // // // //     icon: (
// // // // // //       <Ionicons
// // // // // //         name="grid"
// // // // // //         size={25}
// // // // // //         color="#32E79A"
// // // // // //       />
// // // // // //     ),
// // // // // //     iconBg: "#0D3024",
// // // // // //     accent: "#32E79A",
// // // // // //     ready: false,
// // // // // //     difficulty: "Medium",
// // // // // //     players: "1 Player",
// // // // // //   },

// // // // // //   {
// // // // // //     id: "pattern-hacker",
// // // // // //     title: "Pattern Hacker",
// // // // // //     subtitle: "Find the missing pattern",
// // // // // //     description: "Observe the sequence and solve the missing part.",
// // // // // //     icon: (
// // // // // //       <MaterialCommunityIcons
// // // // // //         name="graph-outline"
// // // // // //         size={26}
// // // // // //         color="#A678FF"
// // // // // //       />
// // // // // //     ),
// // // // // //     iconBg: "#271A4B",
// // // // // //     accent: "#A678FF",
// // // // // //     ready: false,
// // // // // //     difficulty: "Hard",
// // // // // //     players: "1 Player",
// // // // // //   },

// // // // // //   {
// // // // // //     id: "word-cipher",
// // // // // //     title: "Word Cipher",
// // // // // //     subtitle: "Decode the hidden word",
// // // // // //     description: "Break the encrypted word using clever clues.",
// // // // // //     // icon: (
// // // // // //     //   <Text style={styles.aaIcon}>
// // // // // //     //     Aa
// // // // // //     //   </Text>
// // // // // //     // ),
// // // // // //     icon: (
// // // // // //   <Text
// // // // // //     style={{
// // // // // //       color: "#FFFFFF",
// // // // // //       fontSize: 17,
// // // // // //       fontWeight: "800",
// // // // // //     }}
// // // // // //   >
// // // // // //     Aa
// // // // // //   </Text>
// // // // // // ),

// // // // // //     iconBg: "#321D58",
// // // // // //     accent: "#C47CFF",
// // // // // //     ready: false,
// // // // // //     difficulty: "Hard",
// // // // // //     players: "1 Player",
// // // // // //   },
// // // // // // ];

// // // // // // export default function MenuScreen({ onSelectGame }: Props) {
// // // // // //   const [activeTab, setActiveTab] = React.useState<
// // // // // //     "home" | "games" | "profile"
// // // // // //   >("home");

// // // // // //   const openGame = (game: GameItem) => {
// // // // // //     if (game.ready) {
// // // // // //       onSelectGame(game.id);
// // // // // //     }
// // // // // //   };

// // // // // //   const renderGameCard = (game: GameItem) => {
// // // // // //     return (
// // // // // //       <TouchableOpacity
// // // // // //         key={game.id}
// // // // // //         activeOpacity={game.ready ? 0.75 : 1}
// // // // // //         onPress={() => openGame(game)}
// // // // // //         style={[
// // // // // //           styles.gameCard,
// // // // // //           !game.ready && styles.lockedCard,
// // // // // //         ]}
// // // // // //       >
// // // // // //         {/* Icon */}
// // // // // //         <View
// // // // // //           style={[
// // // // // //             styles.gameIcon,
// // // // // //             { backgroundColor: game.iconBg },
// // // // // //           ]}
// // // // // //         >
// // // // // //           {game.icon}
// // // // // //         </View>

// // // // // //         {/* Main content */}
// // // // // //         <View style={styles.gameContent}>
// // // // // //           <View style={styles.gameTitleRow}>
// // // // // //             <Text style={styles.gameTitle}>
// // // // // //               {game.title}
// // // // // //             </Text>

// // // // // //             {game.ready ? (
// // // // // //               <View
// // // // // //                 style={[
// // // // // //                   styles.statusDot,
// // // // // //                   { backgroundColor: game.accent },
// // // // // //                 ]}
// // // // // //               />
// // // // // //             ) : (
// // // // // //               <View style={styles.comingSoonBadge}>
// // // // // //                 <Text style={styles.comingSoonText}>
// // // // // //                   SOON
// // // // // //                 </Text>
// // // // // //               </View>
// // // // // //             )}
// // // // // //           </View>

// // // // // //           <Text style={styles.gameSubtitle}>
// // // // // //             {game.subtitle}
// // // // // //           </Text>

// // // // // //           <Text
// // // // // //             style={styles.gameDescription}
// // // // // //             numberOfLines={2}
// // // // // //           >
// // // // // //             {game.description}
// // // // // //           </Text>

// // // // // //           <View style={styles.metaRow}>
// // // // // //             <View style={styles.metaItem}>
// // // // // //               <Ionicons
// // // // // //                 name="flash-outline"
// // // // // //                 size={13}
// // // // // //                 color="#77849B"
// // // // // //               />
// // // // // //               <Text style={styles.metaText}>
// // // // // //                 {game.difficulty}
// // // // // //               </Text>
// // // // // //             </View>

// // // // // //             <View style={styles.metaItem}>
// // // // // //               <Ionicons
// // // // // //                 name={
// // // // // //                   game.players === "Multiplayer"
// // // // // //                     ? "people-outline"
// // // // // //                     : "person-outline"
// // // // // //                 }
// // // // // //                 size={13}
// // // // // //                 color="#77849B"
// // // // // //               />
// // // // // //               <Text style={styles.metaText}>
// // // // // //                 {game.players}
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         {/* Arrow */}
// // // // // //         {game.ready && (
// // // // // //           <View style={styles.arrowButton}>
// // // // // //             <Ionicons
// // // // // //               name="chevron-forward"
// // // // // //               size={18}
// // // // // //               color="#AEB9CC"
// // // // // //             />
// // // // // //           </View>
// // // // // //         )}

// // // // // //         {!game.ready && (
// // // // // //           <Ionicons
// // // // // //             name="lock-closed-outline"
// // // // // //             size={17}
// // // // // //             color="#414D62"
// // // // // //           />
// // // // // //         )}
// // // // // //       </TouchableOpacity>
// // // // // //     );
// // // // // //   };

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.safe}>
// // // // // //       <StatusBar
// // // // // //         barStyle="light-content"
// // // // // //         backgroundColor="#070A13"
// // // // // //       />

// // // // // //       {/* HEADER */}
// // // // // //       <View style={styles.header}>
// // // // // //         <View style={styles.brandRow}>
// // // // // //           <View style={styles.logo}>
// // // // // //             <MaterialCommunityIcons
// // // // // //               name="brain"
// // // // // //               size={25}
// // // // // //               color="#5CA8FF"
// // // // // //             />
// // // // // //           </View>

// // // // // //           <View>
// // // // // //             <Text style={styles.brand}>
// // // // // //               CYBER <Text style={styles.brandAccent}>MIND</Text>
// // // // // //             </Text>

// // // // // //             <Text style={styles.brandSub}>
// // // // // //               THINK • SOLVE • UNLOCK
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         <TouchableOpacity style={styles.profileButton}>
// // // // // //           <Ionicons
// // // // // //             name="person-outline"
// // // // // //             size={19}
// // // // // //             color="#C8D2E3"
// // // // // //           />
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       <ScrollView
// // // // // //         showsVerticalScrollIndicator={false}
// // // // // //         contentContainerStyle={styles.scrollContent}
// // // // // //       >
// // // // // //         {/* WELCOME */}
// // // // // //         <View style={styles.welcomeSection}>
// // // // // //           <Text style={styles.welcomeSmall}>
// // // // // //             WELCOME BACK
// // // // // //           </Text>

// // // // // //           <Text style={styles.welcomeTitle}>
// // // // // //             Choose your challenge
// // // // // //           </Text>

// // // // // //           <Text style={styles.welcomeDescription}>
// // // // // //             Train your memory, logic and problem-solving skills.
// // // // // //           </Text>
// // // // // //         </View>

// // // // // //         {/* STATS */}
// // // // // //         <View style={styles.statsRow}>
// // // // // //           <View style={styles.statCard}>
// // // // // //             <View style={styles.statIcon}>
// // // // // //               <Ionicons
// // // // // //                 name="game-controller-outline"
// // // // // //                 size={18}
// // // // // //                 color="#5CA8FF"
// // // // // //               />
// // // // // //             </View>

// // // // // //             <View>
// // // // // //               <Text style={styles.statValue}>
// // // // // //                 2
// // // // // //               </Text>

// // // // // //               <Text style={styles.statLabel}>
// // // // // //                 Games
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <View style={styles.statCard}>
// // // // // //             <View
// // // // // //               style={[
// // // // // //                 styles.statIcon,
// // // // // //                 { backgroundColor: "#2B2310" },
// // // // // //               ]}
// // // // // //             >
// // // // // //               <Ionicons
// // // // // //                 name="trophy-outline"
// // // // // //                 size={18}
// // // // // //                 color="#FFC94D"
// // // // // //               />
// // // // // //             </View>

// // // // // //             <View>
// // // // // //               <Text style={styles.statValue}>
// // // // // //                 622
// // // // // //               </Text>

// // // // // //               <Text style={styles.statLabel}>
// // // // // //                 Best Score
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <View style={styles.statCard}>
// // // // // //             <View
// // // // // //               style={[
// // // // // //                 styles.statIcon,
// // // // // //                 { backgroundColor: "#102A22" },
// // // // // //               ]}
// // // // // //             >
// // // // // //               <Ionicons
// // // // // //                 name="flame-outline"
// // // // // //                 size={18}
// // // // // //                 color="#32E79A"
// // // // // //               />
// // // // // //             </View>

// // // // // //             <View>
// // // // // //               <Text style={styles.statValue}>
// // // // // //                 3
// // // // // //               </Text>

// // // // // //               <Text style={styles.statLabel}>
// // // // // //                 Streak
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         {/* FEATURED */}
// // // // // //         <View style={styles.sectionHeader}>
// // // // // //           <Text style={styles.sectionTitle}>
// // // // // //             Featured Game
// // // // // //           </Text>

// // // // // //           <Text style={styles.sectionLink}>
// // // // // //             PLAY NOW
// // // // // //           </Text>
// // // // // //         </View>

// // // // // //         <TouchableOpacity
// // // // // //           activeOpacity={0.8}
// // // // // //           onPress={() =>
// // // // // //             onSelectGame("code-breaker")
// // // // // //           }
// // // // // //           style={styles.featuredCard}
// // // // // //         >
// // // // // //           <View style={styles.featuredGlow} />

// // // // // //           <View style={styles.featuredTop}>
// // // // // //             <View style={styles.featuredIcon}>
// // // // // //               <Ionicons
// // // // // //                 name="lock-closed"
// // // // // //                 size={29}
// // // // // //                 color="#62AAFF"
// // // // // //               />
// // // // // //             </View>

// // // // // //             <View style={styles.featuredBadge}>
// // // // // //               <View style={styles.liveDot} />
// // // // // //               <Text style={styles.featuredBadgeText}>
// // // // // //                 AVAILABLE
// // // // // //               </Text>
// // // // // //             </View>
// // // // // //           </View>

// // // // // //           <Text style={styles.featuredTitle}>
// // // // // //             CODE BREAKER
// // // // // //           </Text>

// // // // // //           <Text style={styles.featuredSubtitle}>
// // // // // //             Crack the secret code
// // // // // //           </Text>

// // // // // //           <Text style={styles.featuredDescription}>
// // // // // //             Find the hidden number using clues,
// // // // // //             position and logic.
// // // // // //           </Text>

// // // // // //           <View style={styles.featuredBottom}>
// // // // // //             <View style={styles.featuredInfo}>
// // // // // //               <Ionicons
// // // // // //                 name="flash-outline"
// // // // // //                 size={15}
// // // // // //                 color="#8090AA"
// // // // // //               />
// // // // // //               <Text style={styles.featuredInfoText}>
// // // // // //                 Easy
// // // // // //               </Text>
// // // // // //             </View>

// // // // // //             <View style={styles.featuredInfo}>
// // // // // //               <Ionicons
// // // // // //                 name="person-outline"
// // // // // //                 size={15}
// // // // // //                 color="#8090AA"
// // // // // //               />
// // // // // //               <Text style={styles.featuredInfoText}>
// // // // // //                 Single Player
// // // // // //               </Text>
// // // // // //             </View>

// // // // // //             <View style={styles.playButton}>
// // // // // //               <Text style={styles.playButtonText}>
// // // // // //                 PLAY
// // // // // //               </Text>

// // // // // //               <Ionicons
// // // // // //                 name="play"
// // // // // //                 size={13}
// // // // // //                 color="#FFFFFF"
// // // // // //               />
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </TouchableOpacity>

// // // // // //         {/* ALL GAMES */}
// // // // // //         <View style={styles.sectionHeader}>
// // // // // //           <Text style={styles.sectionTitle}>
// // // // // //             All Games
// // // // // //           </Text>

// // // // // //           <Text style={styles.gameCount}>
// // // // // //             {GAMES.length} GAMES
// // // // // //           </Text>
// // // // // //         </View>

// // // // // //         <View style={styles.gameList}>
// // // // // //           {GAMES.map(renderGameCard)}
// // // // // //         </View>

// // // // // //         {/* BOTTOM INFO */}
// // // // // //         <View style={styles.footerCard}>
// // // // // //           <View style={styles.footerIcon}>
// // // // // //             <MaterialCommunityIcons
// // // // // //               name="brain"
// // // // // //               size={22}
// // // // // //               color="#5CA8FF"
// // // // // //             />
// // // // // //           </View>

// // // // // //           <View style={styles.footerText}>
// // // // // //             <Text style={styles.footerTitle}>
// // // // // //               Train your mind
// // // // // //             </Text>

// // // // // //             <Text style={styles.footerSubtitle}>
// // // // // //               New challenges will be added regularly.
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         <View style={{ height: 30 }} />
// // // // // //       </ScrollView>

// // // // // //       {/* BOTTOM NAVIGATION */}
// // // // // //       <View style={styles.bottomNav}>
// // // // // //         <TouchableOpacity
// // // // // //           style={styles.navItem}
// // // // // //           onPress={() => setActiveTab("home")}
// // // // // //         >
// // // // // //           <Ionicons
// // // // // //             name={
// // // // // //               activeTab === "home"
// // // // // //                 ? "home"
// // // // // //                 : "home-outline"
// // // // // //             }
// // // // // //             size={22}
// // // // // //             color={
// // // // // //               activeTab === "home"
// // // // // //                 ? "#5CA8FF"
// // // // // //                 : "#68758C"
// // // // // //             }
// // // // // //           />

// // // // // //           <Text
// // // // // //             style={[
// // // // // //               styles.navText,
// // // // // //               activeTab === "home" &&
// // // // // //                 styles.navTextActive,
// // // // // //             ]}
// // // // // //           >
// // // // // //             Home
// // // // // //           </Text>
// // // // // //         </TouchableOpacity>

// // // // // //         <TouchableOpacity
// // // // // //           style={styles.navItem}
// // // // // //           onPress={() => setActiveTab("games")}
// // // // // //         >
// // // // // //           <Ionicons
// // // // // //             name={
// // // // // //               activeTab === "games"
// // // // // //                 ? "game-controller"
// // // // // //                 : "game-controller-outline"
// // // // // //             }
// // // // // //             size={22}
// // // // // //             color={
// // // // // //               activeTab === "games"
// // // // // //                 ? "#5CA8FF"
// // // // // //                 : "#68758C"
// // // // // //             }
// // // // // //           />

// // // // // //           <Text
// // // // // //             style={[
// // // // // //               styles.navText,
// // // // // //               activeTab === "games" &&
// // // // // //                 styles.navTextActive,
// // // // // //             ]}
// // // // // //           >
// // // // // //             Games
// // // // // //           </Text>
// // // // // //         </TouchableOpacity>

// // // // // //         <TouchableOpacity
// // // // // //           style={styles.navItem}
// // // // // //           onPress={() => setActiveTab("profile")}
// // // // // //         >
// // // // // //           <Ionicons
// // // // // //             name={
// // // // // //               activeTab === "profile"
// // // // // //                 ? "person"
// // // // // //                 : "person-outline"
// // // // // //             }
// // // // // //             size={22}
// // // // // //             color={
// // // // // //               activeTab === "profile"
// // // // // //                 ? "#5CA8FF"
// // // // // //                 : "#68758C"
// // // // // //             }
// // // // // //           />

// // // // // //           <Text
// // // // // //             style={[
// // // // // //               styles.navText,
// // // // // //               activeTab === "profile" &&
// // // // // //                 styles.navTextActive,
// // // // // //             ]}
// // // // // //           >
// // // // // //             Profile
// // // // // //           </Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // }

// // // // // // const styles = StyleSheet.create({
// // // // // //   safe: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: "#070A13",
// // // // // //   },

// // // // // //   scrollContent: {
// // // // // //     paddingHorizontal: 18,
// // // // // //     paddingBottom: 20,
// // // // // //   },

// // // // // //   /* HEADER */

// // // // // //   header: {
// // // // // //     height: 70,
// // // // // //     paddingHorizontal: 18,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: "#151D2D",
// // // // // //     backgroundColor: "#090C17",
// // // // // //   },

// // // // // //   brandRow: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   logo: {
// // // // // //     width: 43,
// // // // // //     height: 43,
// // // // // //     borderRadius: 13,
// // // // // //     backgroundColor: "#0D1B30",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#244B7C",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginRight: 11,
// // // // // //   },

// // // // // //   brand: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: "800",
// // // // // //     letterSpacing: 0.5,
// // // // // //   },

// // // // // //   brandAccent: {
// // // // // //     color: "#7C6AFF",
// // // // // //   },

// // // // // //   brandSub: {
// // // // // //     marginTop: 2,
// // // // // //     color: "#68758C",
// // // // // //     fontSize: 8,
// // // // // //     letterSpacing: 1.8,
// // // // // //     fontWeight: "600",
// // // // // //   },

// // // // // //   profileButton: {
// // // // // //     width: 39,
// // // // // //     height: 39,
// // // // // //     borderRadius: 20,
// // // // // //     backgroundColor: "#101727",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#202B40",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },

// // // // // //   /* WELCOME */

// // // // // //   welcomeSection: {
// // // // // //     paddingTop: 27,
// // // // // //     paddingBottom: 18,
// // // // // //   },

// // // // // //   welcomeSmall: {
// // // // // //     color: "#5CA8FF",
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: "700",
// // // // // //     letterSpacing: 1.7,
// // // // // //     marginBottom: 6,
// // // // // //   },

// // // // // //   welcomeTitle: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 25,
// // // // // //     fontWeight: "800",
// // // // // //     letterSpacing: -0.4,
// // // // // //   },

// // // // // //   welcomeDescription: {
// // // // // //     color: "#6F7C92",
// // // // // //     fontSize: 12,
// // // // // //     lineHeight: 18,
// // // // // //     marginTop: 6,
// // // // // //     maxWidth: 330,
// // // // // //   },

// // // // // //   /* STATS */

// // // // // //   statsRow: {
// // // // // //     flexDirection: "row",
// // // // // //     gap: 9,
// // // // // //     marginBottom: 27,
// // // // // //   },

// // // // // //   statCard: {
// // // // // //     flex: 1,
// // // // // //     minHeight: 68,
// // // // // //     backgroundColor: "#0C1220",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#182238",
// // // // // //     borderRadius: 13,
// // // // // //     paddingHorizontal: 10,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   statIcon: {
// // // // // //     width: 34,
// // // // // //     height: 34,
// // // // // //     borderRadius: 9,
// // // // // //     backgroundColor: "#10223B",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginRight: 8,
// // // // // //   },

// // // // // //   statValue: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: "800",
// // // // // //   },

// // // // // //   statLabel: {
// // // // // //     color: "#65738A",
// // // // // //     fontSize: 9,
// // // // // //     marginTop: 2,
// // // // // //   },

// // // // // //   /* SECTION */

// // // // // //   sectionHeader: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "space-between",
// // // // // //     marginBottom: 11,
// // // // // //   },

// // // // // //   sectionTitle: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 17,
// // // // // //     fontWeight: "800",
// // // // // //   },

// // // // // //   sectionLink: {
// // // // // //     color: "#5CA8FF",
// // // // // //     fontSize: 9,
// // // // // //     fontWeight: "800",
// // // // // //     letterSpacing: 1,
// // // // // //   },

// // // // // //   gameCount: {
// // // // // //     color: "#59677D",
// // // // // //     fontSize: 9,
// // // // // //     fontWeight: "700",
// // // // // //     letterSpacing: 1,
// // // // // //   },

// // // // // //   /* FEATURED GAME */

// // // // // //   featuredCard: {
// // // // // //     minHeight: 205,
// // // // // //     borderRadius: 18,
// // // // // //     padding: 18,
// // // // // //     marginBottom: 27,
// // // // // //     backgroundColor: "#0C1730",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#24518A",
// // // // // //     overflow: "hidden",
// // // // // //   },

// // // // // //   featuredGlow: {
// // // // // //     position: "absolute",
// // // // // //     width: 170,
// // // // // //     height: 170,
// // // // // //     borderRadius: 100,
// // // // // //     backgroundColor: "#173C72",
// // // // // //     opacity: 0.25,
// // // // // //     right: -65,
// // // // // //     top: -70,
// // // // // //   },

// // // // // //   featuredTop: {
// // // // // //     flexDirection: "row",
// // // // // //     justifyContent: "space-between",
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   featuredIcon: {
// // // // // //     width: 52,
// // // // // //     height: 52,
// // // // // //     borderRadius: 14,
// // // // // //     backgroundColor: "#112B4C",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#245A96",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },

// // // // // //   featuredBadge: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     backgroundColor: "#10261F",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#245A45",
// // // // // //     borderRadius: 20,
// // // // // //     paddingHorizontal: 10,
// // // // // //     paddingVertical: 6,
// // // // // //   },

// // // // // //   liveDot: {
// // // // // //     width: 6,
// // // // // //     height: 6,
// // // // // //     borderRadius: 4,
// // // // // //     backgroundColor: "#32E79A",
// // // // // //     marginRight: 6,
// // // // // //   },

// // // // // //   featuredBadgeText: {
// // // // // //     color: "#32E79A",
// // // // // //     fontSize: 8,
// // // // // //     fontWeight: "800",
// // // // // //     letterSpacing: 0.7,
// // // // // //   },

// // // // // //   featuredTitle: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 23,
// // // // // //     fontWeight: "900",
// // // // // //     marginTop: 17,
// // // // // //     letterSpacing: 0.5,
// // // // // //   },

// // // // // //   featuredSubtitle: {
// // // // // //     color: "#5CA8FF",
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: "700",
// // // // // //     marginTop: 3,
// // // // // //   },

// // // // // //   featuredDescription: {
// // // // // //     color: "#78869C",
// // // // // //     fontSize: 11,
// // // // // //     lineHeight: 17,
// // // // // //     marginTop: 7,
// // // // // //     maxWidth: 300,
// // // // // //   },

// // // // // //   featuredBottom: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     marginTop: 17,
// // // // // //   },

// // // // // //   featuredInfo: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     marginRight: 13,
// // // // // //   },

// // // // // //   featuredInfoText: {
// // // // // //     color: "#7D8BA0",
// // // // // //     fontSize: 10,
// // // // // //     marginLeft: 4,
// // // // // //   },

// // // // // //   playButton: {
// // // // // //     marginLeft: "auto",
// // // // // //     height: 37,
// // // // // //     paddingHorizontal: 16,
// // // // // //     borderRadius: 11,
// // // // // //     backgroundColor: "#4D8FE7",
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     gap: 7,
// // // // // //   },

// // // // // //   playButtonText: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 11,
// // // // // //     fontWeight: "900",
// // // // // //     letterSpacing: 0.6,
// // // // // //   },

// // // // // //   /* GAME LIST */

// // // // // //   gameList: {
// // // // // //     gap: 10,
// // // // // //   },

// // // // // //   gameCard: {
// // // // // //     minHeight: 105,
// // // // // //     backgroundColor: "#0C1220",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#19243A",
// // // // // //     borderRadius: 15,
// // // // // //     padding: 13,
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   lockedCard: {
// // // // // //     opacity: 0.58,
// // // // // //   },

// // // // // //   gameIcon: {
// // // // // //     width: 49,
// // // // // //     height: 49,
// // // // // //     borderRadius: 13,
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginRight: 12,
// // // // // //   },

// // // // // //   aaIcon: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 17,
// // // // // //     fontWeight: "800",
// // // // // //   },

// // // // // //   gameContent: {
// // // // // //     flex: 1,
// // // // // //   },

// // // // // //   gameTitleRow: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   gameTitle: {
// // // // // //     color: "#FFFFFF",
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: "800",
// // // // // //   },

// // // // // //   statusDot: {
// // // // // //     width: 6,
// // // // // //     height: 6,
// // // // // //     borderRadius: 5,
// // // // // //     marginLeft: 7,
// // // // // //   },

// // // // // //   comingSoonBadge: {
// // // // // //     marginLeft: 7,
// // // // // //     paddingHorizontal: 6,
// // // // // //     paddingVertical: 3,
// // // // // //     borderRadius: 5,
// // // // // //     backgroundColor: "#161D2B",
// // // // // //   },

// // // // // //   comingSoonText: {
// // // // // //     color: "#5F6C81",
// // // // // //     fontSize: 7,
// // // // // //     fontWeight: "800",
// // // // // //     letterSpacing: 0.5,
// // // // // //   },

// // // // // //   gameSubtitle: {
// // // // // //     color: "#8290A6",
// // // // // //     fontSize: 11,
// // // // // //     marginTop: 3,
// // // // // //   },

// // // // // //   gameDescription: {
// // // // // //     color: "#59677D",
// // // // // //     fontSize: 9.5,
// // // // // //     lineHeight: 14,
// // // // // //     marginTop: 5,
// // // // // //   },

// // // // // //   metaRow: {
// // // // // //     flexDirection: "row",
// // // // // //     marginTop: 7,
// // // // // //     gap: 13,
// // // // // //   },

// // // // // //   metaItem: {
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   metaText: {
// // // // // //     color: "#69778D",
// // // // // //     fontSize: 9,
// // // // // //     marginLeft: 4,
// // // // // //   },

// // // // // //   arrowButton: {
// // // // // //     width: 31,
// // // // // //     height: 31,
// // // // // //     borderRadius: 9,
// // // // // //     backgroundColor: "#111A2A",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginLeft: 8,
// // // // // //   },

// // // // // //   /* FOOTER */

// // // // // //   footerCard: {
// // // // // //     marginTop: 22,
// // // // // //     borderRadius: 14,
// // // // // //     padding: 14,
// // // // // //     backgroundColor: "#0A101D",
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: "#182238",
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //   },

// // // // // //   footerIcon: {
// // // // // //     width: 42,
// // // // // //     height: 42,
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: "#10213A",
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //     marginRight: 11,
// // // // // //   },

// // // // // //   footerText: {
// // // // // //     flex: 1,
// // // // // //   },

// // // // // //   footerTitle: {
// // // // // //     color: "#DCE5F2",
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: "700",
// // // // // //   },

// // // // // //   footerSubtitle: {
// // // // // //     color: "#65738A",
// // // // // //     fontSize: 9.5,
// // // // // //     marginTop: 3,
// // // // // //   },

// // // // // //   /* BOTTOM NAV */

// // // // // //   bottomNav: {
// // // // // //     height: 70,
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: "#161F31",
// // // // // //     backgroundColor: "#090D18",
// // // // // //     flexDirection: "row",
// // // // // //     alignItems: "center",
// // // // // //     paddingHorizontal: 35,
// // // // // //   },

// // // // // //   navItem: {
// // // // // //     flex: 1,
// // // // // //     alignItems: "center",
// // // // // //     justifyContent: "center",
// // // // // //   },

// // // // // //   navText: {
// // // // // //     color: "#65738A",
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: "600",
// // // // // //     marginTop: 4,
// // // // // //   },

// // // // // //   navTextActive: {
// // // // // //     color: "#5CA8FF",
// // // // // //     fontWeight: "800",
// // // // // //   },
// // // // // // });
// // // // // import React from "react";
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   StyleSheet,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // // } from "react-native";
// // // // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// // // // // type GameId =
// // // // //   | "word-cipher"
// // // // //   | "code-breaker"
// // // // //   | "memory-grid"
// // // // //   | "pattern-hacker"
// // // // //   | "word-scramble";

// // // // // type GameItem = {
// // // // //   id: GameId;
// // // // //   title: string;
// // // // //   subtitle: string;
// // // // //   description: string;
// // // // //   icon: React.ReactNode;
// // // // //   iconBg: string;
// // // // //   accent: string;
// // // // //   ready: boolean;
// // // // //   difficulty: string;
// // // // //   players: string;
// // // // // };

// // // // // type Props = {
// // // // //   onSelectGame: (id: GameId) => void;
// // // // //   onOpenProfile?: () => void; // opens the Profile page
// // // // //   bestScore?: number; // from GET /api/stats
// // // // //   streak?: number; // from GET /api/stats
// // // // // };

// // // // // const GAMES: GameItem[] = [
// // // // //   {
// // // // //     id: "code-breaker",
// // // // //     title: "Code Breaker",
// // // // //     subtitle: "Crack the secret code",
// // // // //     description: "Use clues and logic to find the hidden number.",
// // // // //     icon: <Ionicons name="lock-closed" size={25} color="#61A8FF" />,
// // // // //     iconBg: "#122B4D",
// // // // //     accent: "#4D9DFF",
// // // // //     ready: true,
// // // // //     difficulty: "Easy",
// // // // //     players: "1 Player",
// // // // //   },

// // // // //   {
// // // // //     id: "word-scramble",
// // // // //     title: "Word Scramble",
// // // // //     subtitle: "Unscramble the words",
// // // // //     description: "Challenge your friends and solve words quickly.",
// // // // //     icon: <MaterialCommunityIcons name="shuffle-variant" size={27} color="#FFC94D" />,
// // // // //     iconBg: "#3A2E0E",
// // // // //     accent: "#FFC94D",
// // // // //     ready: true,
// // // // //     difficulty: "Medium",
// // // // //     players: "Multiplayer",
// // // // //   },

// // // // //   {
// // // // //     id: "memory-grid",
// // // // //     title: "Memory Grid",
// // // // //     subtitle: "Test your memory",
// // // // //     description: "Remember the positions and recall them correctly.",
// // // // //     icon: <Ionicons name="grid" size={25} color="#32E79A" />,
// // // // //     iconBg: "#0D3024",
// // // // //     accent: "#32E79A",
// // // // //     ready: false,
// // // // //     difficulty: "Medium",
// // // // //     players: "1 Player",
// // // // //   },

// // // // //   {
// // // // //     id: "pattern-hacker",
// // // // //     title: "Pattern Hacker",
// // // // //     subtitle: "Find the missing pattern",
// // // // //     description: "Observe the sequence and solve the missing part.",
// // // // //     icon: <MaterialCommunityIcons name="graph-outline" size={26} color="#A678FF" />,
// // // // //     iconBg: "#271A4B",
// // // // //     accent: "#A678FF",
// // // // //     ready: false,
// // // // //     difficulty: "Hard",
// // // // //     players: "1 Player",
// // // // //   },

// // // // //   {
// // // // //     id: "word-cipher",
// // // // //     title: "Word Cipher",
// // // // //     subtitle: "Decode the hidden word",
// // // // //     description: "Break the encrypted word using clever clues.",
// // // // //     icon: (
// // // // //       <Text
// // // // //         style={{
// // // // //           color: "#FFFFFF",
// // // // //           fontSize: 17,
// // // // //           fontWeight: "800",
// // // // //         }}
// // // // //       >
// // // // //         Aa
// // // // //       </Text>
// // // // //     ),
// // // // //     iconBg: "#321D58",
// // // // //     accent: "#C47CFF",
// // // // //     ready: false,
// // // // //     difficulty: "Hard",
// // // // //     players: "1 Player",
// // // // //   },
// // // // // ];

// // // // // export default function MenuScreen({
// // // // //   onSelectGame,
// // // // //   onOpenProfile,
// // // // //   bestScore = 0,
// // // // //   streak = 0,
// // // // // }: Props) {
// // // // //   // Profile is a separate page now, so only Home / Games live on this screen
// // // // //   const [activeTab, setActiveTab] = React.useState<"home" | "games">("home");

// // // // //   const readyCount = GAMES.filter((g) => g.ready).length;

// // // // //   const openGame = (game: GameItem) => {
// // // // //     if (game.ready) {
// // // // //       onSelectGame(game.id);
// // // // //     }
// // // // //   };

// // // // //   const renderGameCard = (game: GameItem) => {
// // // // //     return (
// // // // //       <TouchableOpacity
// // // // //         key={game.id}
// // // // //         activeOpacity={game.ready ? 0.75 : 1}
// // // // //         onPress={() => openGame(game)}
// // // // //         style={[styles.gameCard, !game.ready && styles.lockedCard]}
// // // // //       >
// // // // //         {/* Icon */}
// // // // //         <View style={[styles.gameIcon, { backgroundColor: game.iconBg }]}>
// // // // //           {game.icon}
// // // // //         </View>

// // // // //         {/* Main content */}
// // // // //         <View style={styles.gameContent}>
// // // // //           <View style={styles.gameTitleRow}>
// // // // //             <Text style={styles.gameTitle}>{game.title}</Text>

// // // // //             {game.ready ? (
// // // // //               <View style={[styles.statusDot, { backgroundColor: game.accent }]} />
// // // // //             ) : (
// // // // //               <View style={styles.comingSoonBadge}>
// // // // //                 <Text style={styles.comingSoonText}>SOON</Text>
// // // // //               </View>
// // // // //             )}
// // // // //           </View>

// // // // //           <Text style={styles.gameSubtitle}>{game.subtitle}</Text>

// // // // //           <Text style={styles.gameDescription} numberOfLines={2}>
// // // // //             {game.description}
// // // // //           </Text>

// // // // //           <View style={styles.metaRow}>
// // // // //             <View style={styles.metaItem}>
// // // // //               <Ionicons name="flash-outline" size={13} color="#77849B" />
// // // // //               <Text style={styles.metaText}>{game.difficulty}</Text>
// // // // //             </View>

// // // // //             <View style={styles.metaItem}>
// // // // //               <Ionicons
// // // // //                 name={game.players === "Multiplayer" ? "people-outline" : "person-outline"}
// // // // //                 size={13}
// // // // //                 color="#77849B"
// // // // //               />
// // // // //               <Text style={styles.metaText}>{game.players}</Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Arrow */}
// // // // //         {game.ready && (
// // // // //           <View style={styles.arrowButton}>
// // // // //             <Ionicons name="chevron-forward" size={18} color="#AEB9CC" />
// // // // //           </View>
// // // // //         )}

// // // // //         {!game.ready && (
// // // // //           <Ionicons name="lock-closed-outline" size={17} color="#414D62" />
// // // // //         )}
// // // // //       </TouchableOpacity>
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView style={styles.safe}>
// // // // //       <StatusBar barStyle="light-content" backgroundColor="#070A13" />

// // // // //       {/* HEADER */}
// // // // //       <View style={styles.header}>
// // // // //         <View style={styles.brandRow}>
// // // // //           <View style={styles.logo}>
// // // // //             <MaterialCommunityIcons name="brain" size={25} color="#5CA8FF" />
// // // // //           </View>

// // // // //           <View>
// // // // //             <Text style={styles.brand}>
// // // // //               CYBER <Text style={styles.brandAccent}>MIND</Text>
// // // // //             </Text>

// // // // //             <Text style={styles.brandSub}>THINK • SOLVE • UNLOCK</Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Profile button -> Profile page */}
// // // // //         <TouchableOpacity
// // // // //           style={styles.profileButton}
// // // // //           onPress={onOpenProfile}
// // // // //           activeOpacity={0.8}
// // // // //           accessibilityRole="button"
// // // // //           accessibilityLabel="Open profile"
// // // // //         >
// // // // //           <Ionicons name="person-outline" size={19} color="#C8D2E3" />
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       <ScrollView
// // // // //         showsVerticalScrollIndicator={false}
// // // // //         contentContainerStyle={styles.scrollContent}
// // // // //       >
// // // // //         {/* WELCOME */}
// // // // //         <View style={styles.welcomeSection}>
// // // // //           <Text style={styles.welcomeSmall}>WELCOME BACK</Text>

// // // // //           <Text style={styles.welcomeTitle}>Choose your challenge</Text>

// // // // //           <Text style={styles.welcomeDescription}>
// // // // //             Train your memory, logic and problem-solving skills.
// // // // //           </Text>
// // // // //         </View>

// // // // //         {/* STATS */}
// // // // //         <View style={styles.statsRow}>
// // // // //           <View style={styles.statCard}>
// // // // //             <View style={styles.statIcon}>
// // // // //               <Ionicons name="game-controller-outline" size={18} color="#5CA8FF" />
// // // // //             </View>

// // // // //             <View>
// // // // //               <Text style={styles.statValue}>{readyCount}</Text>
// // // // //               <Text style={styles.statLabel}>Games</Text>
// // // // //             </View>
// // // // //           </View>

// // // // //           <View style={styles.statCard}>
// // // // //             <View style={[styles.statIcon, { backgroundColor: "#2B2310" }]}>
// // // // //               <Ionicons name="trophy-outline" size={18} color="#FFC94D" />
// // // // //             </View>

// // // // //             <View>
// // // // //               <Text style={styles.statValue}>{bestScore}</Text>
// // // // //               <Text style={styles.statLabel}>Best Score</Text>
// // // // //             </View>
// // // // //           </View>

// // // // //           <View style={styles.statCard}>
// // // // //             <View style={[styles.statIcon, { backgroundColor: "#102A22" }]}>
// // // // //               <Ionicons name="flame-outline" size={18} color="#32E79A" />
// // // // //             </View>

// // // // //             <View>
// // // // //               <Text style={styles.statValue}>{streak}</Text>
// // // // //               <Text style={styles.statLabel}>Streak</Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* FEATURED */}
// // // // //         <View style={styles.sectionHeader}>
// // // // //           <Text style={styles.sectionTitle}>Featured Game</Text>

// // // // //           <Text style={styles.sectionLink}>PLAY NOW</Text>
// // // // //         </View>

// // // // //         <TouchableOpacity
// // // // //           activeOpacity={0.8}
// // // // //           onPress={() => onSelectGame("code-breaker")}
// // // // //           style={styles.featuredCard}
// // // // //         >
// // // // //           <View style={styles.featuredGlow} />

// // // // //           <View style={styles.featuredTop}>
// // // // //             <View style={styles.featuredIcon}>
// // // // //               <Ionicons name="lock-closed" size={29} color="#62AAFF" />
// // // // //             </View>

// // // // //             <View style={styles.featuredBadge}>
// // // // //               <View style={styles.liveDot} />
// // // // //               <Text style={styles.featuredBadgeText}>AVAILABLE</Text>
// // // // //             </View>
// // // // //           </View>

// // // // //           <Text style={styles.featuredTitle}>CODE BREAKER</Text>

// // // // //           <Text style={styles.featuredSubtitle}>Crack the secret code</Text>

// // // // //           <Text style={styles.featuredDescription}>
// // // // //             Find the hidden number using clues, position and logic.
// // // // //           </Text>

// // // // //           <View style={styles.featuredBottom}>
// // // // //             <View style={styles.featuredInfo}>
// // // // //               <Ionicons name="flash-outline" size={15} color="#8090AA" />
// // // // //               <Text style={styles.featuredInfoText}>Easy</Text>
// // // // //             </View>

// // // // //             <View style={styles.featuredInfo}>
// // // // //               <Ionicons name="person-outline" size={15} color="#8090AA" />
// // // // //               <Text style={styles.featuredInfoText}>Single Player</Text>
// // // // //             </View>

// // // // //             <View style={styles.playButton}>
// // // // //               <Text style={styles.playButtonText}>PLAY</Text>

// // // // //               <Ionicons name="play" size={13} color="#FFFFFF" />
// // // // //             </View>
// // // // //           </View>
// // // // //         </TouchableOpacity>

// // // // //         {/* ALL GAMES */}
// // // // //         <View style={styles.sectionHeader}>
// // // // //           <Text style={styles.sectionTitle}>All Games</Text>

// // // // //           <Text style={styles.gameCount}>{GAMES.length} GAMES</Text>
// // // // //         </View>

// // // // //         <View style={styles.gameList}>{GAMES.map(renderGameCard)}</View>

// // // // //         {/* BOTTOM INFO */}
// // // // //         <View style={styles.footerCard}>
// // // // //           <View style={styles.footerIcon}>
// // // // //             <MaterialCommunityIcons name="brain" size={22} color="#5CA8FF" />
// // // // //           </View>

// // // // //           <View style={styles.footerText}>
// // // // //             <Text style={styles.footerTitle}>Train your mind</Text>

// // // // //             <Text style={styles.footerSubtitle}>
// // // // //               New challenges will be added regularly.
// // // // //             </Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         <View style={{ height: 30 }} />
// // // // //       </ScrollView>

// // // // //       {/* BOTTOM NAVIGATION */}
// // // // //       <View style={styles.bottomNav}>
// // // // //         <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("home")}>
// // // // //           <Ionicons
// // // // //             name={activeTab === "home" ? "home" : "home-outline"}
// // // // //             size={22}
// // // // //             color={activeTab === "home" ? "#5CA8FF" : "#68758C"}
// // // // //           />

// // // // //           <Text style={[styles.navText, activeTab === "home" && styles.navTextActive]}>
// // // // //             Home
// // // // //           </Text>
// // // // //         </TouchableOpacity>

// // // // //         <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("games")}>
// // // // //           <Ionicons
// // // // //             name={activeTab === "games" ? "game-controller" : "game-controller-outline"}
// // // // //             size={22}
// // // // //             color={activeTab === "games" ? "#5CA8FF" : "#68758C"}
// // // // //           />

// // // // //           <Text style={[styles.navText, activeTab === "games" && styles.navTextActive]}>
// // // // //             Games
// // // // //           </Text>
// // // // //         </TouchableOpacity>

// // // // //         {/* Profile tab -> Profile page */}
// // // // //         <TouchableOpacity style={styles.navItem} onPress={onOpenProfile} activeOpacity={0.8}>
// // // // //           <Ionicons name="person-outline" size={22} color="#68758C" />

// // // // //           <Text style={styles.navText}>Profile</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   safe: {
// // // // //     flex: 1,
// // // // //     backgroundColor: "#070A13",
// // // // //   },

// // // // //   scrollContent: {
// // // // //     paddingHorizontal: 18,
// // // // //     paddingBottom: 20,
// // // // //   },

// // // // //   /* HEADER */

// // // // //   header: {
// // // // //     height: 70,
// // // // //     paddingHorizontal: 18,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-between",
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: "#151D2D",
// // // // //     backgroundColor: "#090C17",
// // // // //   },

// // // // //   brandRow: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //   },

// // // // //   logo: {
// // // // //     width: 43,
// // // // //     height: 43,
// // // // //     borderRadius: 13,
// // // // //     backgroundColor: "#0D1B30",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#244B7C",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginRight: 11,
// // // // //   },

// // // // //   brand: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 18,
// // // // //     fontWeight: "800",
// // // // //     letterSpacing: 0.5,
// // // // //   },

// // // // //   brandAccent: {
// // // // //     color: "#7C6AFF",
// // // // //   },

// // // // //   brandSub: {
// // // // //     marginTop: 2,
// // // // //     color: "#68758C",
// // // // //     fontSize: 8,
// // // // //     letterSpacing: 1.8,
// // // // //     fontWeight: "600",
// // // // //   },

// // // // //   profileButton: {
// // // // //     width: 39,
// // // // //     height: 39,
// // // // //     borderRadius: 20,
// // // // //     backgroundColor: "#101727",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#202B40",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },

// // // // //   /* WELCOME */

// // // // //   welcomeSection: {
// // // // //     paddingTop: 27,
// // // // //     paddingBottom: 18,
// // // // //   },

// // // // //   welcomeSmall: {
// // // // //     color: "#5CA8FF",
// // // // //     fontSize: 10,
// // // // //     fontWeight: "700",
// // // // //     letterSpacing: 1.7,
// // // // //     marginBottom: 6,
// // // // //   },

// // // // //   welcomeTitle: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 25,
// // // // //     fontWeight: "800",
// // // // //     letterSpacing: -0.4,
// // // // //   },

// // // // //   welcomeDescription: {
// // // // //     color: "#6F7C92",
// // // // //     fontSize: 12,
// // // // //     lineHeight: 18,
// // // // //     marginTop: 6,
// // // // //     maxWidth: 330,
// // // // //   },

// // // // //   /* STATS */

// // // // //   statsRow: {
// // // // //     flexDirection: "row",
// // // // //     gap: 9,
// // // // //     marginBottom: 27,
// // // // //   },

// // // // //   statCard: {
// // // // //     flex: 1,
// // // // //     minHeight: 68,
// // // // //     backgroundColor: "#0C1220",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#182238",
// // // // //     borderRadius: 13,
// // // // //     paddingHorizontal: 10,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //   },

// // // // //   statIcon: {
// // // // //     width: 34,
// // // // //     height: 34,
// // // // //     borderRadius: 9,
// // // // //     backgroundColor: "#10223B",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginRight: 8,
// // // // //   },

// // // // //   statValue: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 15,
// // // // //     fontWeight: "800",
// // // // //   },

// // // // //   statLabel: {
// // // // //     color: "#65738A",
// // // // //     fontSize: 9,
// // // // //     marginTop: 2,
// // // // //   },

// // // // //   /* SECTION */

// // // // //   sectionHeader: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "space-between",
// // // // //     marginBottom: 11,
// // // // //   },

// // // // //   sectionTitle: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 17,
// // // // //     fontWeight: "800",
// // // // //   },

// // // // //   sectionLink: {
// // // // //     color: "#5CA8FF",
// // // // //     fontSize: 9,
// // // // //     fontWeight: "800",
// // // // //     letterSpacing: 1,
// // // // //   },

// // // // //   gameCount: {
// // // // //     color: "#59677D",
// // // // //     fontSize: 9,
// // // // //     fontWeight: "700",
// // // // //     letterSpacing: 1,
// // // // //   },

// // // // //   /* FEATURED GAME */

// // // // //   featuredCard: {
// // // // //     minHeight: 205,
// // // // //     borderRadius: 18,
// // // // //     padding: 18,
// // // // //     marginBottom: 27,
// // // // //     backgroundColor: "#0C1730",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#24518A",
// // // // //     overflow: "hidden",
// // // // //   },

// // // // //   featuredGlow: {
// // // // //     position: "absolute",
// // // // //     width: 170,
// // // // //     height: 170,
// // // // //     borderRadius: 100,
// // // // //     backgroundColor: "#173C72",
// // // // //     opacity: 0.25,
// // // // //     right: -65,
// // // // //     top: -70,
// // // // //   },

// // // // //   featuredTop: {
// // // // //     flexDirection: "row",
// // // // //     justifyContent: "space-between",
// // // // //     alignItems: "center",
// // // // //   },

// // // // //   featuredIcon: {
// // // // //     width: 52,
// // // // //     height: 52,
// // // // //     borderRadius: 14,
// // // // //     backgroundColor: "#112B4C",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#245A96",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },

// // // // //   featuredBadge: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     backgroundColor: "#10261F",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#245A45",
// // // // //     borderRadius: 20,
// // // // //     paddingHorizontal: 10,
// // // // //     paddingVertical: 6,
// // // // //   },

// // // // //   liveDot: {
// // // // //     width: 6,
// // // // //     height: 6,
// // // // //     borderRadius: 4,
// // // // //     backgroundColor: "#32E79A",
// // // // //     marginRight: 6,
// // // // //   },

// // // // //   featuredBadgeText: {
// // // // //     color: "#32E79A",
// // // // //     fontSize: 8,
// // // // //     fontWeight: "800",
// // // // //     letterSpacing: 0.7,
// // // // //   },

// // // // //   featuredTitle: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 23,
// // // // //     fontWeight: "900",
// // // // //     marginTop: 17,
// // // // //     letterSpacing: 0.5,
// // // // //   },

// // // // //   featuredSubtitle: {
// // // // //     color: "#5CA8FF",
// // // // //     fontSize: 13,
// // // // //     fontWeight: "700",
// // // // //     marginTop: 3,
// // // // //   },

// // // // //   featuredDescription: {
// // // // //     color: "#78869C",
// // // // //     fontSize: 11,
// // // // //     lineHeight: 17,
// // // // //     marginTop: 7,
// // // // //     maxWidth: 300,
// // // // //   },

// // // // //   featuredBottom: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     marginTop: 17,
// // // // //   },

// // // // //   featuredInfo: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     marginRight: 13,
// // // // //   },

// // // // //   featuredInfoText: {
// // // // //     color: "#7D8BA0",
// // // // //     fontSize: 10,
// // // // //     marginLeft: 4,
// // // // //   },

// // // // //   playButton: {
// // // // //     marginLeft: "auto",
// // // // //     height: 37,
// // // // //     paddingHorizontal: 16,
// // // // //     borderRadius: 11,
// // // // //     backgroundColor: "#4D8FE7",
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     gap: 7,
// // // // //   },

// // // // //   playButtonText: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 11,
// // // // //     fontWeight: "900",
// // // // //     letterSpacing: 0.6,
// // // // //   },

// // // // //   /* GAME LIST */

// // // // //   gameList: {
// // // // //     gap: 10,
// // // // //   },

// // // // //   gameCard: {
// // // // //     minHeight: 105,
// // // // //     backgroundColor: "#0C1220",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#19243A",
// // // // //     borderRadius: 15,
// // // // //     padding: 13,
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //   },

// // // // //   lockedCard: {
// // // // //     opacity: 0.58,
// // // // //   },

// // // // //   gameIcon: {
// // // // //     width: 49,
// // // // //     height: 49,
// // // // //     borderRadius: 13,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginRight: 12,
// // // // //   },

// // // // //   gameContent: {
// // // // //     flex: 1,
// // // // //   },

// // // // //   gameTitleRow: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //   },

// // // // //   gameTitle: {
// // // // //     color: "#FFFFFF",
// // // // //     fontSize: 15,
// // // // //     fontWeight: "800",
// // // // //   },

// // // // //   statusDot: {
// // // // //     width: 6,
// // // // //     height: 6,
// // // // //     borderRadius: 5,
// // // // //     marginLeft: 7,
// // // // //   },

// // // // //   comingSoonBadge: {
// // // // //     marginLeft: 7,
// // // // //     paddingHorizontal: 6,
// // // // //     paddingVertical: 3,
// // // // //     borderRadius: 5,
// // // // //     backgroundColor: "#161D2B",
// // // // //   },

// // // // //   comingSoonText: {
// // // // //     color: "#5F6C81",
// // // // //     fontSize: 7,
// // // // //     fontWeight: "800",
// // // // //     letterSpacing: 0.5,
// // // // //   },

// // // // //   gameSubtitle: {
// // // // //     color: "#8290A6",
// // // // //     fontSize: 11,
// // // // //     marginTop: 3,
// // // // //   },

// // // // //   gameDescription: {
// // // // //     color: "#59677D",
// // // // //     fontSize: 9.5,
// // // // //     lineHeight: 14,
// // // // //     marginTop: 5,
// // // // //   },

// // // // //   metaRow: {
// // // // //     flexDirection: "row",
// // // // //     marginTop: 7,
// // // // //     gap: 13,
// // // // //   },

// // // // //   metaItem: {
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //   },

// // // // //   metaText: {
// // // // //     color: "#69778D",
// // // // //     fontSize: 9,
// // // // //     marginLeft: 4,
// // // // //   },

// // // // //   arrowButton: {
// // // // //     width: 31,
// // // // //     height: 31,
// // // // //     borderRadius: 9,
// // // // //     backgroundColor: "#111A2A",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginLeft: 8,
// // // // //   },

// // // // //   /* FOOTER */

// // // // //   footerCard: {
// // // // //     marginTop: 22,
// // // // //     borderRadius: 14,
// // // // //     padding: 14,
// // // // //     backgroundColor: "#0A101D",
// // // // //     borderWidth: 1,
// // // // //     borderColor: "#182238",
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //   },

// // // // //   footerIcon: {
// // // // //     width: 42,
// // // // //     height: 42,
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: "#10213A",
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //     marginRight: 11,
// // // // //   },

// // // // //   footerText: {
// // // // //     flex: 1,
// // // // //   },

// // // // //   footerTitle: {
// // // // //     color: "#DCE5F2",
// // // // //     fontSize: 12,
// // // // //     fontWeight: "700",
// // // // //   },

// // // // //   footerSubtitle: {
// // // // //     color: "#65738A",
// // // // //     fontSize: 9.5,
// // // // //     marginTop: 3,
// // // // //   },

// // // // //   /* BOTTOM NAV */

// // // // //   bottomNav: {
// // // // //     height: 70,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: "#161F31",
// // // // //     backgroundColor: "#090D18",
// // // // //     flexDirection: "row",
// // // // //     alignItems: "center",
// // // // //     paddingHorizontal: 35,
// // // // //   },

// // // // //   navItem: {
// // // // //     flex: 1,
// // // // //     alignItems: "center",
// // // // //     justifyContent: "center",
// // // // //   },

// // // // //   navText: {
// // // // //     color: "#65738A",
// // // // //     fontSize: 10,
// // // // //     fontWeight: "600",
// // // // //     marginTop: 4,
// // // // //   },

// // // // //   navTextActive: {
// // // // //     color: "#5CA8FF",
// // // // //     fontWeight: "800",
// // // // //   },
// // // // // });
// // // // import React, { useRef } from "react";
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   ScrollView,
// // // //   TouchableOpacity,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   useWindowDimensions,
// // // // } from "react-native";
// // // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// // // // type GameId =
// // // //   | "word-cipher"
// // // //   | "code-breaker"
// // // //   | "memory-grid"
// // // //   | "pattern-hacker"
// // // //   | "word-scramble";

// // // // type GameItem = {
// // // //   id: GameId;
// // // //   title: string;
// // // //   subtitle: string;
// // // //   description: string;
// // // //   icon: React.ReactNode;
// // // //   iconBg: string;
// // // //   accent: string;
// // // //   ready: boolean;
// // // //   difficulty: string;
// // // //   players: string;
// // // // };

// // // // type Props = {
// // // //   onSelectGame: (id: GameId) => void;
// // // //   onOpenProfile?: () => void; // opens the Profile page
// // // //   bestScore?: number; // from GET /api/stats
// // // //   streak?: number; // from GET /api/stats
// // // // };

// // // // const WIDE_BREAKPOINT = 900;

// // // // const GAMES: GameItem[] = [
// // // //   {
// // // //     id: "code-breaker",
// // // //     title: "Code Breaker",
// // // //     subtitle: "Crack the secret code",
// // // //     description: "Use clues and logic to find the hidden number.",
// // // //     icon: <Ionicons name="lock-closed" size={25} color="#61A8FF" />,
// // // //     iconBg: "#122B4D",
// // // //     accent: "#4D9DFF",
// // // //     ready: true,
// // // //     difficulty: "Easy",
// // // //     players: "1 Player",
// // // //   },
// // // //   {
// // // //     id: "word-scramble",
// // // //     title: "Word Scramble",
// // // //     subtitle: "Unscramble the words",
// // // //     description: "Challenge your friends and solve words quickly.",
// // // //     icon: <MaterialCommunityIcons name="shuffle-variant" size={27} color="#FFC94D" />,
// // // //     iconBg: "#3A2E0E",
// // // //     accent: "#FFC94D",
// // // //     ready: true,
// // // //     difficulty: "Medium",
// // // //     players: "Multiplayer",
// // // //   },
// // // //   {
// // // //     id: "memory-grid",
// // // //     title: "Memory Grid",
// // // //     subtitle: "Test your memory",
// // // //     description: "Remember the positions and recall them correctly.",
// // // //     icon: <Ionicons name="grid" size={25} color="#32E79A" />,
// // // //     iconBg: "#0D3024",
// // // //     accent: "#32E79A",
// // // //     ready: false,
// // // //     difficulty: "Medium",
// // // //     players: "1 Player",
// // // //   },
// // // //   {
// // // //     id: "pattern-hacker",
// // // //     title: "Pattern Hacker",
// // // //     subtitle: "Find the missing pattern",
// // // //     description: "Observe the sequence and solve the missing part.",
// // // //     icon: <MaterialCommunityIcons name="graph-outline" size={26} color="#A678FF" />,
// // // //     iconBg: "#271A4B",
// // // //     accent: "#A678FF",
// // // //     ready: false,
// // // //     difficulty: "Hard",
// // // //     players: "1 Player",
// // // //   },
// // // //   {
// // // //     id: "word-cipher",
// // // //     title: "Word Cipher",
// // // //     subtitle: "Decode the hidden word",
// // // //     description: "Break the encrypted word using clever clues.",
// // // //     icon: (
// // // //       <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "800" }}>Aa</Text>
// // // //     ),
// // // //     iconBg: "#321D58",
// // // //     accent: "#C47CFF",
// // // //     ready: false,
// // // //     difficulty: "Hard",
// // // //     players: "1 Player",
// // // //   },
// // // // ];

// // // // export default function MenuScreen({
// // // //   onSelectGame,
// // // //   onOpenProfile,
// // // //   bestScore = 0,
// // // //   streak = 0,
// // // // }: Props) {
// // // //   const { width } = useWindowDimensions();
// // // //   const wide = width >= WIDE_BREAKPOINT;
// // // //   const maxContent = wide ? 1080 : 560;

// // // //   // Profile is a separate page, so only Home / Games live on this screen
// // // //   const [activeTab, setActiveTab] = React.useState<"home" | "games">("home");

// // // //   const scrollRef = useRef<ScrollView>(null);
// // // //   const gamesY = useRef(0);

// // // //   const readyCount = GAMES.filter((g) => g.ready).length;

// // // //   const goHome = () => {
// // // //     setActiveTab("home");
// // // //     scrollRef.current?.scrollTo({ y: 0, animated: true });
// // // //   };

// // // //   const goGames = () => {
// // // //     setActiveTab("games");
// // // //     scrollRef.current?.scrollTo({ y: Math.max(0, gamesY.current - 10), animated: true });
// // // //   };

// // // //   const openGame = (game: GameItem) => {
// // // //     if (game.ready) onSelectGame(game.id);
// // // //   };

// // // //   /* ---------------- game card ---------------- */

// // // //   const renderGameCard = (game: GameItem) => (
// // // //     <TouchableOpacity
// // // //       key={game.id}
// // // //       activeOpacity={game.ready ? 0.75 : 1}
// // // //       onPress={() => openGame(game)}
// // // //       style={[styles.gameCard, wide && styles.gameCardWide, !game.ready && styles.lockedCard]}
// // // //     >
// // // //       <View style={[styles.gameIcon, { backgroundColor: game.iconBg }]}>{game.icon}</View>

// // // //       <View style={styles.gameContent}>
// // // //         <View style={styles.gameTitleRow}>
// // // //           <Text style={[styles.gameTitle, wide && { fontSize: 17 }]}>{game.title}</Text>

// // // //           {game.ready ? (
// // // //             <View style={[styles.statusDot, { backgroundColor: game.accent }]} />
// // // //           ) : (
// // // //             <View style={styles.comingSoonBadge}>
// // // //               <Text style={styles.comingSoonText}>SOON</Text>
// // // //             </View>
// // // //           )}
// // // //         </View>

// // // //         <Text style={[styles.gameSubtitle, wide && { fontSize: 13 }]}>{game.subtitle}</Text>

// // // //         <Text
// // // //           style={[styles.gameDescription, wide && { fontSize: 12, lineHeight: 17 }]}
// // // //           numberOfLines={2}
// // // //         >
// // // //           {game.description}
// // // //         </Text>

// // // //         <View style={styles.metaRow}>
// // // //           <View style={styles.metaItem}>
// // // //             <Ionicons name="flash-outline" size={13} color="#77849B" />
// // // //             <Text style={styles.metaText}>{game.difficulty}</Text>
// // // //           </View>

// // // //           <View style={styles.metaItem}>
// // // //             <Ionicons
// // // //               name={game.players === "Multiplayer" ? "people-outline" : "person-outline"}
// // // //               size={13}
// // // //               color="#77849B"
// // // //             />
// // // //             <Text style={styles.metaText}>{game.players}</Text>
// // // //           </View>
// // // //         </View>
// // // //       </View>

// // // //       {game.ready && (
// // // //         <View style={styles.arrowButton}>
// // // //           <Ionicons name="chevron-forward" size={18} color="#AEB9CC" />
// // // //         </View>
// // // //       )}

// // // //       {!game.ready && <Ionicons name="lock-closed-outline" size={17} color="#414D62" />}
// // // //     </TouchableOpacity>
// // // //   );

// // // //   /* ---------------- sections ---------------- */

// // // //   const welcome = (
// // // //     <View style={[styles.welcomeSection, wide && { paddingTop: 8, paddingBottom: 22 }]}>
// // // //       <Text style={styles.welcomeSmall}>WELCOME BACK</Text>

// // // //       <Text style={[styles.welcomeTitle, wide && { fontSize: 36 }]}>Choose your challenge</Text>

// // // //       <Text style={[styles.welcomeDescription, wide && { fontSize: 15, lineHeight: 22 }]}>
// // // //         Train your memory, logic and problem-solving skills.
// // // //       </Text>
// // // //     </View>
// // // //   );

// // // //   // mobile only: 3 small stat cards in a row
// // // //   const statsRow = (
// // // //     <View style={styles.statsRow}>
// // // //       <View style={styles.statCard}>
// // // //         <View style={styles.statIcon}>
// // // //           <Ionicons name="game-controller-outline" size={18} color="#5CA8FF" />
// // // //         </View>
// // // //         <View>
// // // //           <Text style={styles.statValue}>{readyCount}</Text>
// // // //           <Text style={styles.statLabel}>Games</Text>
// // // //         </View>
// // // //       </View>

// // // //       <View style={styles.statCard}>
// // // //         <View style={[styles.statIcon, { backgroundColor: "#2B2310" }]}>
// // // //           <Ionicons name="trophy-outline" size={18} color="#FFC94D" />
// // // //         </View>
// // // //         <View>
// // // //           <Text style={styles.statValue}>{bestScore}</Text>
// // // //           <Text style={styles.statLabel}>Best Score</Text>
// // // //         </View>
// // // //       </View>

// // // //       <View style={styles.statCard}>
// // // //         <View style={[styles.statIcon, { backgroundColor: "#102A22" }]}>
// // // //           <Ionicons name="flame-outline" size={18} color="#32E79A" />
// // // //         </View>
// // // //         <View>
// // // //           <Text style={styles.statValue}>{streak}</Text>
// // // //           <Text style={styles.statLabel}>Streak</Text>
// // // //         </View>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   const featured = (
// // // //     <>
// // // //       <View style={styles.sectionHeader}>
// // // //         <Text style={[styles.sectionTitle, wide && { fontSize: 22 }]}>Featured Game</Text>
// // // //         <Text style={styles.sectionLink}>PLAY NOW</Text>
// // // //       </View>

// // // //       <TouchableOpacity
// // // //         activeOpacity={0.8}
// // // //         onPress={() => onSelectGame("code-breaker")}
// // // //         style={[styles.featuredCard, wide && styles.featuredCardWide]}
// // // //       >
// // // //         <View style={styles.featuredGlow} />

// // // //         <View style={styles.featuredTop}>
// // // //           <View style={[styles.featuredIcon, wide && { width: 68, height: 68, borderRadius: 18 }]}>
// // // //             <Ionicons name="lock-closed" size={wide ? 34 : 29} color="#62AAFF" />
// // // //           </View>

// // // //           {!wide && (
// // // //             <View style={styles.featuredBadge}>
// // // //               <View style={styles.liveDot} />
// // // //               <Text style={styles.featuredBadgeText}>AVAILABLE</Text>
// // // //             </View>
// // // //           )}
// // // //         </View>

// // // //         <View style={wide ? { flex: 1 } : undefined}>
// // // //           {wide && (
// // // //             <View style={[styles.featuredBadge, { alignSelf: "flex-start", marginBottom: 10 }]}>
// // // //               <View style={styles.liveDot} />
// // // //               <Text style={styles.featuredBadgeText}>AVAILABLE</Text>
// // // //             </View>
// // // //           )}

// // // //           <Text style={[styles.featuredTitle, wide && { fontSize: 28, marginTop: 0 }]}>
// // // //             CODE BREAKER
// // // //           </Text>

// // // //           <Text style={[styles.featuredSubtitle, wide && { fontSize: 15 }]}>
// // // //             Crack the secret code
// // // //           </Text>

// // // //           <Text style={[styles.featuredDescription, wide && { fontSize: 13, lineHeight: 20 }]}>
// // // //             Find the hidden number using clues, position and logic.
// // // //           </Text>

// // // //           <View style={[styles.featuredBottom, wide && { marginTop: 12 }]}>
// // // //             <View style={styles.featuredInfo}>
// // // //               <Ionicons name="flash-outline" size={15} color="#8090AA" />
// // // //               <Text style={styles.featuredInfoText}>Easy</Text>
// // // //             </View>

// // // //             <View style={styles.featuredInfo}>
// // // //               <Ionicons name="person-outline" size={15} color="#8090AA" />
// // // //               <Text style={styles.featuredInfoText}>Single Player</Text>
// // // //             </View>

// // // //             {!wide && (
// // // //               <View style={styles.playButton}>
// // // //                 <Text style={styles.playButtonText}>PLAY</Text>
// // // //                 <Ionicons name="play" size={13} color="#FFFFFF" />
// // // //               </View>
// // // //             )}
// // // //           </View>
// // // //         </View>

// // // //         {wide && (
// // // //           <View style={[styles.playButton, styles.playButtonWide]}>
// // // //             <Text style={[styles.playButtonText, { fontSize: 14 }]}>PLAY</Text>
// // // //             <Ionicons name="play" size={16} color="#FFFFFF" />
// // // //           </View>
// // // //         )}
// // // //       </TouchableOpacity>
// // // //     </>
// // // //   );

// // // //   const allGames = (
// // // //     <>
// // // //       <View
// // // //         style={styles.sectionHeader}
// // // //         onLayout={(e) => {
// // // //           gamesY.current = e.nativeEvent.layout.y;
// // // //         }}
// // // //       >
// // // //         <Text style={[styles.sectionTitle, wide && { fontSize: 22 }]}>All Games</Text>
// // // //         <Text style={styles.gameCount}>{GAMES.length} GAMES</Text>
// // // //       </View>

// // // //       <View style={[styles.gameList, wide && styles.gameListWide]}>
// // // //         {GAMES.map(renderGameCard)}
// // // //       </View>
// // // //     </>
// // // //   );

// // // //   const footerCard = (
// // // //     <View style={styles.footerCard}>
// // // //       <View style={styles.footerIcon}>
// // // //         <MaterialCommunityIcons name="brain" size={22} color="#5CA8FF" />
// // // //       </View>

// // // //       <View style={styles.footerText}>
// // // //         <Text style={styles.footerTitle}>Train your mind</Text>
// // // //         <Text style={styles.footerSubtitle}>New challenges will be added regularly.</Text>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   // website sidebar: progress card
// // // //   const progressCard = (
// // // //     <View style={styles.progressCard}>
// // // //       <Text style={styles.progressTitle}>Your Progress</Text>

// // // //       <View style={styles.progressRow}>
// // // //         <View style={styles.progressIcon}>
// // // //           <Ionicons name="game-controller-outline" size={20} color="#5CA8FF" />
// // // //         </View>
// // // //         <Text style={styles.progressLabel}>Games</Text>
// // // //         <Text style={styles.progressValue}>{readyCount}</Text>
// // // //       </View>

// // // //       <View style={[styles.progressRow, styles.progressDivider]}>
// // // //         <View style={[styles.progressIcon, { backgroundColor: "#2B2310" }]}>
// // // //           <Ionicons name="trophy-outline" size={20} color="#FFC94D" />
// // // //         </View>
// // // //         <Text style={styles.progressLabel}>Best Score</Text>
// // // //         <Text style={styles.progressValue}>{bestScore}</Text>
// // // //       </View>

// // // //       <View style={[styles.progressRow, styles.progressDivider]}>
// // // //         <View style={[styles.progressIcon, { backgroundColor: "#102A22" }]}>
// // // //           <Ionicons name="flame-outline" size={20} color="#32E79A" />
// // // //         </View>
// // // //         <Text style={styles.progressLabel}>Streak</Text>
// // // //         <Text style={styles.progressValue}>{streak}</Text>
// // // //       </View>

// // // //       <TouchableOpacity style={styles.progressBtn} onPress={onOpenProfile} activeOpacity={0.85}>
// // // //         <Ionicons name="person-outline" size={17} color="#FFFFFF" />
// // // //         <Text style={styles.progressBtnText}>View Profile</Text>
// // // //       </TouchableOpacity>
// // // //     </View>
// // // //   );

// // // //   /* ---------------- render ---------------- */

// // // //   return (
// // // //     <SafeAreaView style={styles.safe}>
// // // //       <StatusBar barStyle="light-content" backgroundColor="#070A13" />

// // // //       {/* HEADER */}
// // // //       <View style={styles.headerWrap}>
// // // //         <View style={[styles.header, { maxWidth: maxContent }]}>
// // // //           <View style={styles.brandRow}>
// // // //             <View style={styles.logo}>
// // // //               <MaterialCommunityIcons name="brain" size={25} color="#5CA8FF" />
// // // //             </View>

// // // //             <View>
// // // //               <Text style={styles.brand}>
// // // //                 CYBER <Text style={styles.brandAccent}>MIND</Text>
// // // //               </Text>
// // // //               <Text style={styles.brandSub}>THINK • SOLVE • UNLOCK</Text>
// // // //             </View>
// // // //           </View>

// // // //           {wide && (
// // // //             <View style={styles.navLinks}>
// // // //               <TouchableOpacity
// // // //                 style={[styles.navLink, activeTab === "home" && styles.navLinkActive]}
// // // //                 onPress={goHome}
// // // //                 activeOpacity={0.8}
// // // //               >
// // // //                 <Ionicons
// // // //                   name={activeTab === "home" ? "home" : "home-outline"}
// // // //                   size={20}
// // // //                   color={activeTab === "home" ? "#5CA8FF" : "#8290A6"}
// // // //                 />
// // // //                 <Text style={[styles.navLinkText, activeTab === "home" && styles.navLinkTextActive]}>
// // // //                   Home
// // // //                 </Text>
// // // //               </TouchableOpacity>

// // // //               <TouchableOpacity
// // // //                 style={[styles.navLink, activeTab === "games" && styles.navLinkActive]}
// // // //                 onPress={goGames}
// // // //                 activeOpacity={0.8}
// // // //               >
// // // //                 <Ionicons
// // // //                   name={activeTab === "games" ? "game-controller" : "game-controller-outline"}
// // // //                   size={20}
// // // //                   color={activeTab === "games" ? "#5CA8FF" : "#8290A6"}
// // // //                 />
// // // //                 <Text style={[styles.navLinkText, activeTab === "games" && styles.navLinkTextActive]}>
// // // //                   Games
// // // //                 </Text>
// // // //               </TouchableOpacity>

// // // //               <TouchableOpacity style={styles.navLink} onPress={onOpenProfile} activeOpacity={0.8}>
// // // //                 <Ionicons name="person-outline" size={20} color="#8290A6" />
// // // //                 <Text style={styles.navLinkText}>Profile</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           )}

// // // //           <TouchableOpacity
// // // //             style={styles.profileButton}
// // // //             onPress={onOpenProfile}
// // // //             activeOpacity={0.8}
// // // //             accessibilityRole="button"
// // // //             accessibilityLabel="Open profile"
// // // //           >
// // // //             <Ionicons name="person-outline" size={19} color="#C8D2E3" />
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       </View>

// // // //       <ScrollView
// // // //         ref={scrollRef}
// // // //         style={{ flex: 1 }}
// // // //         showsVerticalScrollIndicator={false}
// // // //         contentContainerStyle={styles.scrollContent}
// // // //       >
// // // //         <View
// // // //           style={[
// // // //             styles.content,
// // // //             { maxWidth: maxContent, paddingHorizontal: wide ? 24 : 18, paddingTop: wide ? 32 : 0 },
// // // //           ]}
// // // //         >
// // // //           {wide ? (
// // // //             <View style={styles.wideRow}>
// // // //               {/* main column */}
// // // //               <View style={{ flex: 1, minWidth: 0 }}>
// // // //                 {welcome}
// // // //                 {featured}
// // // //                 {allGames}
// // // //               </View>

// // // //               {/* sidebar */}
// // // //               <View style={styles.sidebar}>
// // // //                 {progressCard}
// // // //                 {footerCard}
// // // //               </View>
// // // //             </View>
// // // //           ) : (
// // // //             <>
// // // //               {welcome}
// // // //               {statsRow}
// // // //               {featured}
// // // //               {allGames}
// // // //               {footerCard}
// // // //             </>
// // // //           )}

// // // //           <View style={{ height: 30 }} />
// // // //         </View>
// // // //       </ScrollView>

// // // //       {/* BOTTOM NAVIGATION (mobile / narrow only) */}
// // // //       {!wide && (
// // // //         <View style={styles.bottomNavWrap}>
// // // //           <View style={[styles.bottomNav, { maxWidth: maxContent }]}>
// // // //             <TouchableOpacity style={styles.navItem} onPress={goHome}>
// // // //               <Ionicons
// // // //                 name={activeTab === "home" ? "home" : "home-outline"}
// // // //                 size={22}
// // // //                 color={activeTab === "home" ? "#5CA8FF" : "#68758C"}
// // // //               />
// // // //               <Text style={[styles.navText, activeTab === "home" && styles.navTextActive]}>Home</Text>
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity style={styles.navItem} onPress={goGames}>
// // // //               <Ionicons
// // // //                 name={activeTab === "games" ? "game-controller" : "game-controller-outline"}
// // // //                 size={22}
// // // //                 color={activeTab === "games" ? "#5CA8FF" : "#68758C"}
// // // //               />
// // // //               <Text style={[styles.navText, activeTab === "games" && styles.navTextActive]}>Games</Text>
// // // //             </TouchableOpacity>

// // // //             <TouchableOpacity style={styles.navItem} onPress={onOpenProfile} activeOpacity={0.8}>
// // // //               <Ionicons name="person-outline" size={22} color="#68758C" />
// // // //               <Text style={styles.navText}>Profile</Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </View>
// // // //       )}
// // // //     </SafeAreaView>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   safe: {
// // // //     flex: 1,
// // // //     backgroundColor: "#070A13",
// // // //   },

// // // //   scrollContent: {
// // // //     alignItems: "center",
// // // //     paddingBottom: 20,
// // // //   },

// // // //   content: {
// // // //     width: "100%",
// // // //   },

// // // //   wideRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "flex-start",
// // // //     gap: 28,
// // // //   },

// // // //   sidebar: {
// // // //     width: 300,
// // // //     gap: 16,
// // // //   },

// // // //   /* HEADER */

// // // //   headerWrap: {
// // // //     width: "100%",
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: "#151D2D",
// // // //     backgroundColor: "#090C17",
// // // //   },

// // // //   header: {
// // // //     width: "100%",
// // // //     alignSelf: "center",
// // // //     height: 70,
// // // //     paddingHorizontal: 18,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-between",
// // // //   },

// // // //   brandRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   logo: {
// // // //     width: 43,
// // // //     height: 43,
// // // //     borderRadius: 13,
// // // //     backgroundColor: "#0D1B30",
// // // //     borderWidth: 1,
// // // //     borderColor: "#244B7C",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 11,
// // // //   },

// // // //   brand: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 18,
// // // //     fontWeight: "800",
// // // //     letterSpacing: 0.5,
// // // //   },

// // // //   brandAccent: {
// // // //     color: "#7C6AFF",
// // // //   },

// // // //   brandSub: {
// // // //     marginTop: 2,
// // // //     color: "#68758C",
// // // //     fontSize: 8,
// // // //     letterSpacing: 1.8,
// // // //     fontWeight: "600",
// // // //   },

// // // //   profileButton: {
// // // //     width: 39,
// // // //     height: 39,
// // // //     borderRadius: 20,
// // // //     backgroundColor: "#101727",
// // // //     borderWidth: 1,
// // // //     borderColor: "#202B40",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   navLinks: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 8,
// // // //   },

// // // //   navLink: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 8,
// // // //     paddingVertical: 10,
// // // //     paddingHorizontal: 18,
// // // //     borderRadius: 12,
// // // //   },

// // // //   navLinkActive: {
// // // //     backgroundColor: "rgba(92,168,255,0.14)",
// // // //   },

// // // //   navLinkText: {
// // // //     color: "#8290A6",
// // // //     fontSize: 15,
// // // //     fontWeight: "600",
// // // //   },

// // // //   navLinkTextActive: {
// // // //     color: "#5CA8FF",
// // // //     fontWeight: "800",
// // // //   },

// // // //   /* WELCOME */

// // // //   welcomeSection: {
// // // //     paddingTop: 27,
// // // //     paddingBottom: 18,
// // // //   },

// // // //   welcomeSmall: {
// // // //     color: "#5CA8FF",
// // // //     fontSize: 10,
// // // //     fontWeight: "700",
// // // //     letterSpacing: 1.7,
// // // //     marginBottom: 6,
// // // //   },

// // // //   welcomeTitle: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 25,
// // // //     fontWeight: "800",
// // // //     letterSpacing: -0.4,
// // // //   },

// // // //   welcomeDescription: {
// // // //     color: "#6F7C92",
// // // //     fontSize: 12,
// // // //     lineHeight: 18,
// // // //     marginTop: 6,
// // // //     maxWidth: 520,
// // // //   },

// // // //   /* STATS (mobile) */

// // // //   statsRow: {
// // // //     flexDirection: "row",
// // // //     gap: 9,
// // // //     marginBottom: 27,
// // // //   },

// // // //   statCard: {
// // // //     flex: 1,
// // // //     minHeight: 68,
// // // //     backgroundColor: "#0C1220",
// // // //     borderWidth: 1,
// // // //     borderColor: "#182238",
// // // //     borderRadius: 13,
// // // //     paddingHorizontal: 10,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   statIcon: {
// // // //     width: 34,
// // // //     height: 34,
// // // //     borderRadius: 9,
// // // //     backgroundColor: "#10223B",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 8,
// // // //   },

// // // //   statValue: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 15,
// // // //     fontWeight: "800",
// // // //   },

// // // //   statLabel: {
// // // //     color: "#65738A",
// // // //     fontSize: 9,
// // // //     marginTop: 2,
// // // //   },

// // // //   /* PROGRESS CARD (website sidebar) */

// // // //   progressCard: {
// // // //     backgroundColor: "#0C1220",
// // // //     borderWidth: 1,
// // // //     borderColor: "#182238",
// // // //     borderRadius: 18,
// // // //     padding: 18,
// // // //   },

// // // //   progressTitle: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 17,
// // // //     fontWeight: "800",
// // // //     marginBottom: 8,
// // // //   },

// // // //   progressRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingVertical: 12,
// // // //   },

// // // //   progressDivider: {
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: "#151D2D",
// // // //   },

// // // //   progressIcon: {
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 11,
// // // //     backgroundColor: "#10223B",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 12,
// // // //   },

// // // //   progressLabel: {
// // // //     flex: 1,
// // // //     color: "#8290A6",
// // // //     fontSize: 14,
// // // //   },

// // // //   progressValue: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 20,
// // // //     fontWeight: "800",
// // // //   },

// // // //   progressBtn: {
// // // //     marginTop: 8,
// // // //     height: 44,
// // // //     borderRadius: 12,
// // // //     backgroundColor: "#4D8FE7",
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     gap: 8,
// // // //   },

// // // //   progressBtnText: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 14,
// // // //     fontWeight: "800",
// // // //   },

// // // //   /* SECTION */

// // // //   sectionHeader: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     justifyContent: "space-between",
// // // //     marginBottom: 11,
// // // //   },

// // // //   sectionTitle: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 17,
// // // //     fontWeight: "800",
// // // //   },

// // // //   sectionLink: {
// // // //     color: "#5CA8FF",
// // // //     fontSize: 9,
// // // //     fontWeight: "800",
// // // //     letterSpacing: 1,
// // // //   },

// // // //   gameCount: {
// // // //     color: "#59677D",
// // // //     fontSize: 9,
// // // //     fontWeight: "700",
// // // //     letterSpacing: 1,
// // // //   },

// // // //   /* FEATURED GAME */

// // // //   featuredCard: {
// // // //     minHeight: 205,
// // // //     borderRadius: 18,
// // // //     padding: 18,
// // // //     marginBottom: 27,
// // // //     backgroundColor: "#0C1730",
// // // //     borderWidth: 1,
// // // //     borderColor: "#24518A",
// // // //     overflow: "hidden",
// // // //   },

// // // //   featuredCardWide: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 24,
// // // //     minHeight: 170,
// // // //     paddingVertical: 26,
// // // //     paddingHorizontal: 28,
// // // //     marginBottom: 34,
// // // //   },

// // // //   featuredGlow: {
// // // //     position: "absolute",
// // // //     width: 170,
// // // //     height: 170,
// // // //     borderRadius: 100,
// // // //     backgroundColor: "#173C72",
// // // //     opacity: 0.25,
// // // //     right: -65,
// // // //     top: -70,
// // // //   },

// // // //   featuredTop: {
// // // //     flexDirection: "row",
// // // //     justifyContent: "space-between",
// // // //     alignItems: "center",
// // // //   },

// // // //   featuredIcon: {
// // // //     width: 52,
// // // //     height: 52,
// // // //     borderRadius: 14,
// // // //     backgroundColor: "#112B4C",
// // // //     borderWidth: 1,
// // // //     borderColor: "#245A96",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   featuredBadge: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     backgroundColor: "#10261F",
// // // //     borderWidth: 1,
// // // //     borderColor: "#245A45",
// // // //     borderRadius: 20,
// // // //     paddingHorizontal: 10,
// // // //     paddingVertical: 6,
// // // //   },

// // // //   liveDot: {
// // // //     width: 6,
// // // //     height: 6,
// // // //     borderRadius: 4,
// // // //     backgroundColor: "#32E79A",
// // // //     marginRight: 6,
// // // //   },

// // // //   featuredBadgeText: {
// // // //     color: "#32E79A",
// // // //     fontSize: 8,
// // // //     fontWeight: "800",
// // // //     letterSpacing: 0.7,
// // // //   },

// // // //   featuredTitle: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 23,
// // // //     fontWeight: "900",
// // // //     marginTop: 17,
// // // //     letterSpacing: 0.5,
// // // //   },

// // // //   featuredSubtitle: {
// // // //     color: "#5CA8FF",
// // // //     fontSize: 13,
// // // //     fontWeight: "700",
// // // //     marginTop: 3,
// // // //   },

// // // //   featuredDescription: {
// // // //     color: "#78869C",
// // // //     fontSize: 11,
// // // //     lineHeight: 17,
// // // //     marginTop: 7,
// // // //     maxWidth: 420,
// // // //   },

// // // //   featuredBottom: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     marginTop: 17,
// // // //   },

// // // //   featuredInfo: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     marginRight: 13,
// // // //   },

// // // //   featuredInfoText: {
// // // //     color: "#7D8BA0",
// // // //     fontSize: 10,
// // // //     marginLeft: 4,
// // // //   },

// // // //   playButton: {
// // // //     marginLeft: "auto",
// // // //     height: 37,
// // // //     paddingHorizontal: 16,
// // // //     borderRadius: 11,
// // // //     backgroundColor: "#4D8FE7",
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     gap: 7,
// // // //   },

// // // //   playButtonWide: {
// // // //     marginLeft: 0,
// // // //     height: 48,
// // // //     paddingHorizontal: 28,
// // // //     borderRadius: 14,
// // // //   },

// // // //   playButtonText: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 11,
// // // //     fontWeight: "900",
// // // //     letterSpacing: 0.6,
// // // //   },

// // // //   /* GAME LIST */

// // // //   gameList: {
// // // //     gap: 10,
// // // //   },

// // // //   gameListWide: {
// // // //     flexDirection: "row",
// // // //     flexWrap: "wrap",
// // // //     gap: 16,
// // // //   },

// // // //   gameCard: {
// // // //     minHeight: 105,
// // // //     backgroundColor: "#0C1220",
// // // //     borderWidth: 1,
// // // //     borderColor: "#19243A",
// // // //     borderRadius: 15,
// // // //     padding: 13,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   gameCardWide: {
// // // //     flexGrow: 1,
// // // //     flexBasis: "46%",
// // // //     minHeight: 124,
// // // //     padding: 18,
// // // //     borderRadius: 18,
// // // //   },

// // // //   lockedCard: {
// // // //     opacity: 0.58,
// // // //   },

// // // //   gameIcon: {
// // // //     width: 49,
// // // //     height: 49,
// // // //     borderRadius: 13,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 12,
// // // //   },

// // // //   gameContent: {
// // // //     flex: 1,
// // // //   },

// // // //   gameTitleRow: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   gameTitle: {
// // // //     color: "#FFFFFF",
// // // //     fontSize: 15,
// // // //     fontWeight: "800",
// // // //   },

// // // //   statusDot: {
// // // //     width: 6,
// // // //     height: 6,
// // // //     borderRadius: 5,
// // // //     marginLeft: 7,
// // // //   },

// // // //   comingSoonBadge: {
// // // //     marginLeft: 7,
// // // //     paddingHorizontal: 6,
// // // //     paddingVertical: 3,
// // // //     borderRadius: 5,
// // // //     backgroundColor: "#161D2B",
// // // //   },

// // // //   comingSoonText: {
// // // //     color: "#5F6C81",
// // // //     fontSize: 7,
// // // //     fontWeight: "800",
// // // //     letterSpacing: 0.5,
// // // //   },

// // // //   gameSubtitle: {
// // // //     color: "#8290A6",
// // // //     fontSize: 11,
// // // //     marginTop: 3,
// // // //   },

// // // //   gameDescription: {
// // // //     color: "#59677D",
// // // //     fontSize: 9.5,
// // // //     lineHeight: 14,
// // // //     marginTop: 5,
// // // //   },

// // // //   metaRow: {
// // // //     flexDirection: "row",
// // // //     marginTop: 7,
// // // //     gap: 13,
// // // //   },

// // // //   metaItem: {
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   metaText: {
// // // //     color: "#69778D",
// // // //     fontSize: 9,
// // // //     marginLeft: 4,
// // // //   },

// // // //   arrowButton: {
// // // //     width: 31,
// // // //     height: 31,
// // // //     borderRadius: 9,
// // // //     backgroundColor: "#111A2A",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginLeft: 8,
// // // //   },

// // // //   /* FOOTER */

// // // //   footerCard: {
// // // //     marginTop: 22,
// // // //     borderRadius: 14,
// // // //     padding: 14,
// // // //     backgroundColor: "#0A101D",
// // // //     borderWidth: 1,
// // // //     borderColor: "#182238",
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //   },

// // // //   footerIcon: {
// // // //     width: 42,
// // // //     height: 42,
// // // //     borderRadius: 12,
// // // //     backgroundColor: "#10213A",
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //     marginRight: 11,
// // // //   },

// // // //   footerText: {
// // // //     flex: 1,
// // // //   },

// // // //   footerTitle: {
// // // //     color: "#DCE5F2",
// // // //     fontSize: 12,
// // // //     fontWeight: "700",
// // // //   },

// // // //   footerSubtitle: {
// // // //     color: "#65738A",
// // // //     fontSize: 9.5,
// // // //     marginTop: 3,
// // // //   },

// // // //   /* BOTTOM NAV */

// // // //   bottomNavWrap: {
// // // //     width: "100%",
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: "#161F31",
// // // //     backgroundColor: "#090D18",
// // // //   },

// // // //   bottomNav: {
// // // //     width: "100%",
// // // //     alignSelf: "center",
// // // //     height: 70,
// // // //     flexDirection: "row",
// // // //     alignItems: "center",
// // // //     paddingHorizontal: 35,
// // // //   },

// // // //   navItem: {
// // // //     flex: 1,
// // // //     alignItems: "center",
// // // //     justifyContent: "center",
// // // //   },

// // // //   navText: {
// // // //     color: "#65738A",
// // // //     fontSize: 10,
// // // //     fontWeight: "600",
// // // //     marginTop: 4,
// // // //   },

// // // //   navTextActive: {
// // // //     color: "#5CA8FF",
// // // //     fontWeight: "800",
// // // //   },
// // // // });
// // // import React, { useRef } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   useWindowDimensions,
// // // } from "react-native";
// // // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// // // type GameId =
// // //   | "word-cipher"
// // //   | "code-breaker"
// // //   | "memory-grid"
// // //   | "pattern-hacker"
// // //   | "word-scramble";

// // // type GameItem = {
// // //   id: GameId;
// // //   title: string;
// // //   subtitle: string;
// // //   description: string;
// // //   icon: React.ReactNode;
// // //   iconBg: string;
// // //   accent: string;
// // //   ready: boolean;
// // //   difficulty: string;
// // //   players: string;
// // // };

// // // type Props = {
// // //   onSelectGame: (id: GameId) => void;
// // //   onOpenProfile?: () => void;
// // //   bestScore?: number;
// // //   streak?: number;
// // // };

// // // const WIDE_BREAKPOINT = 900;

// // // /* =========================================================
// // //    GAMES
// // //    ========================================================= */

// // // const GAMES: GameItem[] = [
// // //   {
// // //     id: "code-breaker",
// // //     title: "Code Breaker",
// // //     subtitle: "Crack the secret code",
// // //     description: "Use clues and logic to find the hidden number.",
// // //     icon: (
// // //       <Ionicons
// // //         name="lock-closed"
// // //         size={25}
// // //         color="#6C63FF"
// // //       />
// // //     ),
// // //     iconBg: "#E9E7FF",
// // //     accent: "#6C63FF",
// // //     ready: true,
// // //     difficulty: "Easy",
// // //     players: "1 Player",
// // //   },

// // //   {
// // //     id: "word-scramble",
// // //     title: "Word Scramble",
// // //     subtitle: "Unscramble the words",
// // //     description: "Challenge your friends and solve words quickly.",
// // //     icon: (
// // //       <MaterialCommunityIcons
// // //         name="shuffle-variant"
// // //         size={27}
// // //         color="#FFB020"
// // //       />
// // //     ),
// // //     iconBg: "#FFF1D6",
// // //     accent: "#FFB020",
// // //     ready: true,
// // //     difficulty: "Medium",
// // //     players: "Multiplayer",
// // //   },

// // //   {
// // //     id: "memory-grid",
// // //     title: "Memory Grid",
// // //     subtitle: "Test your memory",
// // //     description: "Remember the positions and recall them correctly.",
// // //     icon: (
// // //       <Ionicons
// // //         name="grid"
// // //         size={25}
// // //         color="#20C997"
// // //       />
// // //     ),
// // //     iconBg: "#DFF8F0",
// // //     accent: "#20C997",
// // //     ready: false,
// // //     difficulty: "Medium",
// // //     players: "1 Player",
// // //   },

// // //   {
// // //     id: "pattern-hacker",
// // //     title: "Pattern Hacker",
// // //     subtitle: "Find the missing pattern",
// // //     description: "Observe the sequence and solve the missing part.",
// // //     icon: (
// // //       <MaterialCommunityIcons
// // //         name="graph-outline"
// // //         size={26}
// // //         color="#A56EFF"
// // //       />
// // //     ),
// // //     iconBg: "#F0E6FF",
// // //     accent: "#A56EFF",
// // //     ready: false,
// // //     difficulty: "Hard",
// // //     players: "1 Player",
// // //   },

// // //   {
// // //     id: "word-cipher",
// // //     title: "Word Cipher",
// // //     subtitle: "Decode the hidden word",
// // //     description: "Break the encrypted word using clever clues.",

// // //     // IMPORTANT:
// // //     // Do not use styles.letterIcon here because GAMES
// // //     // is declared before the StyleSheet.
// // //     icon: (
// // //       <Text
// // //         style={{
// // //           color: "#FFFFFF",
// // //           fontSize: 17,
// // //           fontWeight: "900",
// // //         }}
// // //       >
// // //         Aa
// // //       </Text>
// // //     ),

// // //     iconBg: "#E9D9FF",
// // //     accent: "#A56EFF",
// // //     ready: false,
// // //     difficulty: "Hard",
// // //     players: "1 Player",
// // //   },
// // // ];

// // // /* =========================================================
// // //    SCREEN
// // //    ========================================================= */

// // // export default function MenuScreen({
// // //   onSelectGame,
// // //   onOpenProfile,
// // //   bestScore = 0,
// // //   streak = 0,
// // // }: Props) {
// // //   const { width } = useWindowDimensions();

// // //   const wide = width >= WIDE_BREAKPOINT;
// // //   const maxContent = wide ? 1080 : 560;

// // //   const [activeTab, setActiveTab] = React.useState<
// // //     "home" | "games"
// // //   >("home");

// // //   const scrollRef = useRef<ScrollView>(null);
// // //   const gamesY = useRef(0);

// // //   const readyCount = GAMES.filter((game) => game.ready).length;

// // //   /* =======================================================
// // //      NAVIGATION
// // //      ======================================================= */

// // //   const goHome = () => {
// // //     setActiveTab("home");

// // //     scrollRef.current?.scrollTo({
// // //       y: 0,
// // //       animated: true,
// // //     });
// // //   };

// // //   const goGames = () => {
// // //     setActiveTab("games");

// // //     scrollRef.current?.scrollTo({
// // //       y: Math.max(0, gamesY.current - 10),
// // //       animated: true,
// // //     });
// // //   };

// // //   const openGame = (game: GameItem) => {
// // //     if (game.ready) {
// // //       onSelectGame(game.id);
// // //     }
// // //   };

// // //   /* =======================================================
// // //      GAME CARD
// // //      ======================================================= */

// // //   const renderGameCard = (game: GameItem) => {
// // //     return (
// // //       <TouchableOpacity
// // //         key={game.id}
// // //         activeOpacity={game.ready ? 0.75 : 1}
// // //         onPress={() => openGame(game)}
// // //         style={[
// // //           styles.gameCard,
// // //           wide && styles.gameCardWide,
// // //           !game.ready && styles.lockedCard,
// // //         ]}
// // //       >
// // //         {/* ICON */}

// // //         <View
// // //           style={[
// // //             styles.gameIcon,
// // //             {
// // //               backgroundColor: game.iconBg,
// // //             },
// // //           ]}
// // //         >
// // //           {game.icon}
// // //         </View>

// // //         {/* CONTENT */}

// // //         <View style={styles.gameContent}>
// // //           <View style={styles.gameTitleRow}>
// // //             <Text
// // //               style={[
// // //                 styles.gameTitle,
// // //                 wide && {
// // //                   fontSize: 17,
// // //                 },
// // //               ]}
// // //             >
// // //               {game.title}
// // //             </Text>

// // //             {game.ready ? (
// // //               <View
// // //                 style={[
// // //                   styles.statusDot,
// // //                   {
// // //                     backgroundColor: game.accent,
// // //                   },
// // //                 ]}
// // //               />
// // //             ) : (
// // //               <View style={styles.comingSoonBadge}>
// // //                 <Text style={styles.comingSoonText}>
// // //                   SOON
// // //                 </Text>
// // //               </View>
// // //             )}
// // //           </View>

// // //           <Text
// // //             style={[
// // //               styles.gameSubtitle,
// // //               wide && {
// // //                 fontSize: 13,
// // //               },
// // //             ]}
// // //           >
// // //             {game.subtitle}
// // //           </Text>

// // //           <Text
// // //             style={[
// // //               styles.gameDescription,
// // //               wide && {
// // //                 fontSize: 12,
// // //                 lineHeight: 17,
// // //               },
// // //             ]}
// // //             numberOfLines={2}
// // //           >
// // //             {game.description}
// // //           </Text>

// // //           {/* META */}

// // //           <View style={styles.metaRow}>
// // //             <View style={styles.metaItem}>
// // //               <Ionicons
// // //                 name="flash-outline"
// // //                 size={13}
// // //                 color="#8790A8"
// // //               />

// // //               <Text style={styles.metaText}>
// // //                 {game.difficulty}
// // //               </Text>
// // //             </View>

// // //             <View style={styles.metaItem}>
// // //               <Ionicons
// // //                 name={
// // //                   game.players === "Multiplayer"
// // //                     ? "people-outline"
// // //                     : "person-outline"
// // //                 }
// // //                 size={13}
// // //                 color="#8790A8"
// // //               />

// // //               <Text style={styles.metaText}>
// // //                 {game.players}
// // //               </Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* ARROW */}

// // //         {game.ready && (
// // //           <View style={styles.arrowButton}>
// // //             <Ionicons
// // //               name="chevron-forward"
// // //               size={18}
// // //               color="#777F96"
// // //             />
// // //           </View>
// // //         )}

// // //         {!game.ready && (
// // //           <Ionicons
// // //             name="lock-closed-outline"
// // //             size={17}
// // //             color="#9DA4B8"
// // //           />
// // //         )}
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   /* =======================================================
// // //      WELCOME
// // //      ======================================================= */

// // //   const welcome = (
// // //     <View
// // //       style={[
// // //         styles.welcomeSection,
// // //         wide && {
// // //           paddingTop: 8,
// // //           paddingBottom: 22,
// // //         },
// // //       ]}
// // //     >
// // //       <View style={styles.welcomeBadge}>
// // //         <MaterialCommunityIcons
// // //           name="brain"
// // //           size={14}
// // //           color="#FFFFFF"
// // //         />

// // //         <Text style={styles.welcomeBadgeText}>
// // //           LET'S PLAY
// // //         </Text>
// // //       </View>

// // //       <Text
// // //         style={[
// // //           styles.welcomeTitle,
// // //           wide && {
// // //             fontSize: 36,
// // //           },
// // //         ]}
// // //       >
// // //         Choose your challenge
// // //       </Text>

// // //       <Text
// // //         style={[
// // //           styles.welcomeDescription,
// // //           wide && {
// // //             fontSize: 15,
// // //             lineHeight: 22,
// // //           },
// // //         ]}
// // //       >
// // //         Train your memory, logic and problem-solving skills.
// // //       </Text>
// // //     </View>
// // //   );

// // //   /* =======================================================
// // //      MOBILE STATS
// // //      ======================================================= */

// // //   const statsRow = (
// // //     <View style={styles.statsRow}>
// // //       {/* Games */}

// // //       <View style={styles.statCard}>
// // //         <View style={styles.statIcon}>
// // //           <Ionicons
// // //             name="game-controller-outline"
// // //             size={18}
// // //             color="#6C63FF"
// // //           />
// // //         </View>

// // //         <View>
// // //           <Text style={styles.statValue}>
// // //             {readyCount}
// // //           </Text>

// // //           <Text style={styles.statLabel}>
// // //             Games
// // //           </Text>
// // //         </View>
// // //       </View>

// // //       {/* Score */}

// // //       <View style={styles.statCard}>
// // //         <View
// // //           style={[
// // //             styles.statIcon,
// // //             {
// // //               backgroundColor: "#FFF3D8",
// // //             },
// // //           ]}
// // //         >
// // //           <Ionicons
// // //             name="trophy-outline"
// // //             size={18}
// // //             color="#FFB020"
// // //           />
// // //         </View>

// // //         <View>
// // //           <Text style={styles.statValue}>
// // //             {bestScore}
// // //           </Text>

// // //           <Text style={styles.statLabel}>
// // //             Best Score
// // //           </Text>
// // //         </View>
// // //       </View>

// // //       {/* Streak */}

// // //       <View style={styles.statCard}>
// // //         <View
// // //           style={[
// // //             styles.statIcon,
// // //             {
// // //               backgroundColor: "#DFF8F0",
// // //             },
// // //           ]}
// // //         >
// // //           <Ionicons
// // //             name="flame-outline"
// // //             size={18}
// // //             color="#20C997"
// // //           />
// // //         </View>

// // //         <View>
// // //           <Text style={styles.statValue}>
// // //             {streak}
// // //           </Text>

// // //           <Text style={styles.statLabel}>
// // //             Streak
// // //           </Text>
// // //         </View>
// // //       </View>
// // //     </View>
// // //   );

// // //   /* =======================================================
// // //      FEATURED GAME
// // //      ======================================================= */

// // //   const featured = (
// // //     <>
// // //       <View style={styles.sectionHeader}>
// // //         <Text
// // //           style={[
// // //             styles.sectionTitle,
// // //             wide && {
// // //               fontSize: 22,
// // //             },
// // //           ]}
// // //         >
// // //           Featured Game
// // //         </Text>

// // //         <Text style={styles.sectionLink}>
// // //           PLAY NOW
// // //         </Text>
// // //       </View>

// // //       <TouchableOpacity
// // //         activeOpacity={0.82}
// // //         onPress={() =>
// // //           onSelectGame("code-breaker")
// // //         }
// // //         style={[
// // //           styles.featuredCard,
// // //           wide && styles.featuredCardWide,
// // //         ]}
// // //       >
// // //         {/* Decorative circles */}

// // //         <View style={styles.featuredCircleOne} />
// // //         <View style={styles.featuredCircleTwo} />

// // //         <View style={styles.featuredTop}>
// // //           <View
// // //             style={[
// // //               styles.featuredIcon,
// // //               wide && {
// // //                 width: 68,
// // //                 height: 68,
// // //                 borderRadius: 20,
// // //               },
// // //             ]}
// // //           >
// // //             <Ionicons
// // //               name="lock-closed"
// // //               size={wide ? 34 : 29}
// // //               color="#FFFFFF"
// // //             />
// // //           </View>

// // //           {!wide && (
// // //             <View style={styles.featuredBadge}>
// // //               <View style={styles.liveDot} />

// // //               <Text style={styles.featuredBadgeText}>
// // //                 AVAILABLE
// // //               </Text>
// // //             </View>
// // //           )}
// // //         </View>

// // //         <View
// // //           style={
// // //             wide
// // //               ? {
// // //                   flex: 1,
// // //                 }
// // //               : undefined
// // //           }
// // //         >
// // //           {wide && (
// // //             <View
// // //               style={[
// // //                 styles.featuredBadge,
// // //                 {
// // //                   alignSelf: "flex-start",
// // //                   marginBottom: 10,
// // //                 },
// // //               ]}
// // //             >
// // //               <View style={styles.liveDot} />

// // //               <Text style={styles.featuredBadgeText}>
// // //                 AVAILABLE
// // //               </Text>
// // //             </View>
// // //           )}

// // //           <Text
// // //             style={[
// // //               styles.featuredTitle,
// // //               wide && {
// // //                 fontSize: 28,
// // //                 marginTop: 0,
// // //               },
// // //             ]}
// // //           >
// // //             CODE BREAKER
// // //           </Text>

// // //           <Text
// // //             style={[
// // //               styles.featuredSubtitle,
// // //               wide && {
// // //                 fontSize: 15,
// // //               },
// // //             ]}
// // //           >
// // //             Crack the secret code
// // //           </Text>

// // //           <Text
// // //             style={[
// // //               styles.featuredDescription,
// // //               wide && {
// // //                 fontSize: 13,
// // //                 lineHeight: 20,
// // //               },
// // //             ]}
// // //           >
// // //             Find the hidden number using clues, position
// // //             and logic.
// // //           </Text>

// // //           <View
// // //             style={[
// // //               styles.featuredBottom,
// // //               wide && {
// // //                 marginTop: 12,
// // //               },
// // //             ]}
// // //           >
// // //             <View style={styles.featuredInfo}>
// // //               <Ionicons
// // //                 name="flash-outline"
// // //                 size={15}
// // //                 color="#707A92"
// // //               />

// // //               <Text style={styles.featuredInfoText}>
// // //                 Easy
// // //               </Text>
// // //             </View>

// // //             <View style={styles.featuredInfo}>
// // //               <Ionicons
// // //                 name="person-outline"
// // //                 size={15}
// // //                 color="#707A92"
// // //               />

// // //               <Text style={styles.featuredInfoText}>
// // //                 Single Player
// // //               </Text>
// // //             </View>

// // //             {!wide && (
// // //               <View style={styles.playButton}>
// // //                 <Text style={styles.playButtonText}>
// // //                   PLAY
// // //                 </Text>

// // //                 <Ionicons
// // //                   name="play"
// // //                   size={13}
// // //                   color="#FFFFFF"
// // //                 />
// // //               </View>
// // //             )}
// // //           </View>
// // //         </View>

// // //         {wide && (
// // //           <View
// // //             style={[
// // //               styles.playButton,
// // //               styles.playButtonWide,
// // //             ]}
// // //           >
// // //             <Text
// // //               style={[
// // //                 styles.playButtonText,
// // //                 {
// // //                   fontSize: 14,
// // //                 },
// // //               ]}
// // //             >
// // //               PLAY
// // //             </Text>

// // //             <Ionicons
// // //               name="play"
// // //               size={16}
// // //               color="#FFFFFF"
// // //             />
// // //           </View>
// // //         )}
// // //       </TouchableOpacity>
// // //     </>
// // //   );

// // //   /* =======================================================
// // //      ALL GAMES
// // //      ======================================================= */

// // //   const allGames = (
// // //     <>
// // //       <View
// // //         style={styles.sectionHeader}
// // //         onLayout={(event) => {
// // //           gamesY.current =
// // //             event.nativeEvent.layout.y;
// // //         }}
// // //       >
// // //         <Text
// // //           style={[
// // //             styles.sectionTitle,
// // //             wide && {
// // //               fontSize: 22,
// // //             },
// // //           ]}
// // //         >
// // //           All Games
// // //         </Text>

// // //         <Text style={styles.gameCount}>
// // //           {GAMES.length} GAMES
// // //         </Text>
// // //       </View>

// // //       <View
// // //         style={[
// // //           styles.gameList,
// // //           wide && styles.gameListWide,
// // //         ]}
// // //       >
// // //         {GAMES.map(renderGameCard)}
// // //       </View>
// // //     </>
// // //   );

// // //   /* =======================================================
// // //      FOOTER
// // //      ======================================================= */

// // //   const footerCard = (
// // //     <View style={styles.footerCard}>
// // //       <View style={styles.footerIcon}>
// // //         <MaterialCommunityIcons
// // //           name="brain"
// // //           size={22}
// // //           color="#6C63FF"
// // //         />
// // //       </View>

// // //       <View style={styles.footerText}>
// // //         <Text style={styles.footerTitle}>
// // //           Train your mind
// // //         </Text>

// // //         <Text style={styles.footerSubtitle}>
// // //           New challenges will be added regularly.
// // //         </Text>
// // //       </View>
// // //     </View>
// // //   );

// // //   /* =======================================================
// // //      PROGRESS CARD
// // //      ======================================================= */

// // //   const progressCard = (
// // //     <View style={styles.progressCard}>
// // //       <Text style={styles.progressTitle}>
// // //         Your Progress
// // //       </Text>

// // //       {/* Games */}

// // //       <View style={styles.progressRow}>
// // //         <View style={styles.progressIcon}>
// // //           <Ionicons
// // //             name="game-controller-outline"
// // //             size={20}
// // //             color="#6C63FF"
// // //           />
// // //         </View>

// // //         <Text style={styles.progressLabel}>
// // //           Games
// // //         </Text>

// // //         <Text style={styles.progressValue}>
// // //           {readyCount}
// // //         </Text>
// // //       </View>

// // //       {/* Best score */}

// // //       <View
// // //         style={[
// // //           styles.progressRow,
// // //           styles.progressDivider,
// // //         ]}
// // //       >
// // //         <View
// // //           style={[
// // //             styles.progressIcon,
// // //             {
// // //               backgroundColor: "#FFF3D8",
// // //             },
// // //           ]}
// // //         >
// // //           <Ionicons
// // //             name="trophy-outline"
// // //             size={20}
// // //             color="#FFB020"
// // //           />
// // //         </View>

// // //         <Text style={styles.progressLabel}>
// // //           Best Score
// // //         </Text>

// // //         <Text style={styles.progressValue}>
// // //           {bestScore}
// // //         </Text>
// // //       </View>

// // //       {/* Streak */}

// // //       <View
// // //         style={[
// // //           styles.progressRow,
// // //           styles.progressDivider,
// // //         ]}
// // //       >
// // //         <View
// // //           style={[
// // //             styles.progressIcon,
// // //             {
// // //               backgroundColor: "#DFF8F0",
// // //             },
// // //           ]}
// // //         >
// // //           <Ionicons
// // //             name="flame-outline"
// // //             size={20}
// // //             color="#20C997"
// // //           />
// // //         </View>

// // //         <Text style={styles.progressLabel}>
// // //           Streak
// // //         </Text>

// // //         <Text style={styles.progressValue}>
// // //           {streak}
// // //         </Text>
// // //       </View>

// // //       <TouchableOpacity
// // //         style={styles.progressBtn}
// // //         onPress={onOpenProfile}
// // //         activeOpacity={0.85}
// // //       >
// // //         <Ionicons
// // //           name="person-outline"
// // //           size={17}
// // //           color="#FFFFFF"
// // //         />

// // //         <Text style={styles.progressBtnText}>
// // //           View Profile
// // //         </Text>
// // //       </TouchableOpacity>
// // //     </View>
// // //   );

// // //   /* =======================================================
// // //      MAIN RENDER
// // //      ======================================================= */

// // //   return (
// // //     <SafeAreaView style={styles.safe}>
// // //       <StatusBar
// // //         barStyle="dark-content"
// // //         backgroundColor="#F8F9FF"
// // //       />

// // //       {/* ===================================================
// // //           HEADER
// // //       =================================================== */}

// // //       <View style={styles.headerWrap}>
// // //         <View
// // //           style={[
// // //             styles.header,
// // //             {
// // //               maxWidth: maxContent,
// // //             },
// // //           ]}
// // //         >
// // //           {/* BRAND */}

// // //           <View style={styles.brandRow}>
// // //             <View style={styles.logo}>
// // //               <MaterialCommunityIcons
// // //                 name="brain"
// // //                 size={25}
// // //                 color="#FFFFFF"
// // //               />
// // //             </View>

// // //             <View>
// // //               <Text style={styles.brand}>
// // //                 MIND{" "}
// // //                 <Text style={styles.brandAccent}>
// // //                   GAMES
// // //                 </Text>
// // //               </Text>

// // //               <Text style={styles.brandSub}>
// // //                 THINK • SOLVE • PLAY
// // //               </Text>
// // //             </View>
// // //           </View>

// // //           {/* DESKTOP NAV */}

// // //           {wide && (
// // //             <View style={styles.navLinks}>
// // //               <TouchableOpacity
// // //                 style={[
// // //                   styles.navLink,
// // //                   activeTab === "home" &&
// // //                     styles.navLinkActive,
// // //                 ]}
// // //                 onPress={goHome}
// // //                 activeOpacity={0.8}
// // //               >
// // //                 <Ionicons
// // //                   name={
// // //                     activeTab === "home"
// // //                       ? "home"
// // //                       : "home-outline"
// // //                   }
// // //                   size={20}
// // //                   color={
// // //                     activeTab === "home"
// // //                       ? "#6C63FF"
// // //                       : "#7D8498"
// // //                   }
// // //                 />

// // //                 <Text
// // //                   style={[
// // //                     styles.navLinkText,
// // //                     activeTab === "home" &&
// // //                       styles.navLinkTextActive,
// // //                   ]}
// // //                 >
// // //                   Home
// // //                 </Text>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity
// // //                 style={[
// // //                   styles.navLink,
// // //                   activeTab === "games" &&
// // //                     styles.navLinkActive,
// // //                 ]}
// // //                 onPress={goGames}
// // //                 activeOpacity={0.8}
// // //               >
// // //                 <Ionicons
// // //                   name={
// // //                     activeTab === "games"
// // //                       ? "game-controller"
// // //                       : "game-controller-outline"
// // //                   }
// // //                   size={20}
// // //                   color={
// // //                     activeTab === "games"
// // //                       ? "#6C63FF"
// // //                       : "#7D8498"
// // //                   }
// // //                 />

// // //                 <Text
// // //                   style={[
// // //                     styles.navLinkText,
// // //                     activeTab === "games" &&
// // //                       styles.navLinkTextActive,
// // //                   ]}
// // //                 >
// // //                   Games
// // //                 </Text>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity
// // //                 style={styles.navLink}
// // //                 onPress={onOpenProfile}
// // //                 activeOpacity={0.8}
// // //               >
// // //                 <Ionicons
// // //                   name="person-outline"
// // //                   size={20}
// // //                   color="#7D8498"
// // //                 />

// // //                 <Text style={styles.navLinkText}>
// // //                   Profile
// // //                 </Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           )}

// // //           {/* PROFILE */}

// // //           <TouchableOpacity
// // //             style={styles.profileButton}
// // //             onPress={onOpenProfile}
// // //             activeOpacity={0.8}
// // //             accessibilityRole="button"
// // //             accessibilityLabel="Open profile"
// // //           >
// // //             <Ionicons
// // //               name="person-outline"
// // //               size={19}
// // //               color="#596176"
// // //             />
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>

// // //       {/* ===================================================
// // //           CONTENT
// // //       =================================================== */}

// // //       <ScrollView
// // //         ref={scrollRef}
// // //         style={styles.scroll}
// // //         showsVerticalScrollIndicator={false}
// // //         contentContainerStyle={
// // //           styles.scrollContent
// // //         }
// // //       >
// // //         <View
// // //           style={[
// // //             styles.content,
// // //             {
// // //               maxWidth: maxContent,
// // //               paddingHorizontal: wide ? 24 : 18,
// // //               paddingTop: wide ? 32 : 0,
// // //             },
// // //           ]}
// // //         >
// // //           {wide ? (
// // //             <View style={styles.wideRow}>
// // //               {/* MAIN */}

// // //               <View
// // //                 style={{
// // //                   flex: 1,
// // //                   minWidth: 0,
// // //                 }}
// // //               >
// // //                 {welcome}
// // //                 {featured}
// // //                 {allGames}
// // //               </View>

// // //               {/* SIDEBAR */}

// // //               <View style={styles.sidebar}>
// // //                 {progressCard}
// // //                 {footerCard}
// // //               </View>
// // //             </View>
// // //           ) : (
// // //             <>
// // //               {welcome}

// // //               {statsRow}

// // //               {featured}

// // //               {allGames}

// // //               {footerCard}
// // //             </>
// // //           )}

// // //           <View style={{ height: 30 }} />
// // //         </View>
// // //       </ScrollView>

// // //       {/* ===================================================
// // //           MOBILE BOTTOM NAV
// // //       =================================================== */}

// // //       {!wide && (
// // //         <View style={styles.bottomNavWrap}>
// // //           <View
// // //             style={[
// // //               styles.bottomNav,
// // //               {
// // //                 maxWidth: maxContent,
// // //               },
// // //             ]}
// // //           >
// // //             {/* HOME */}

// // //             <TouchableOpacity
// // //               style={styles.navItem}
// // //               onPress={goHome}
// // //               activeOpacity={0.8}
// // //             >
// // //               <Ionicons
// // //                 name={
// // //                   activeTab === "home"
// // //                     ? "home"
// // //                     : "home-outline"
// // //                 }
// // //                 size={22}
// // //                 color={
// // //                   activeTab === "home"
// // //                     ? "#6C63FF"
// // //                     : "#7B8397"
// // //                 }
// // //               />

// // //               <Text
// // //                 style={[
// // //                   styles.navText,
// // //                   activeTab === "home" &&
// // //                     styles.navTextActive,
// // //                 ]}
// // //               >
// // //                 Home
// // //               </Text>
// // //             </TouchableOpacity>

// // //             {/* GAMES */}

// // //             <TouchableOpacity
// // //               style={styles.navItem}
// // //               onPress={goGames}
// // //               activeOpacity={0.8}
// // //             >
// // //               <Ionicons
// // //                 name={
// // //                   activeTab === "games"
// // //                     ? "game-controller"
// // //                     : "game-controller-outline"
// // //                 }
// // //                 size={22}
// // //                 color={
// // //                   activeTab === "games"
// // //                     ? "#6C63FF"
// // //                     : "#7B8397"
// // //                 }
// // //               />

// // //               <Text
// // //                 style={[
// // //                   styles.navText,
// // //                   activeTab === "games" &&
// // //                     styles.navTextActive,
// // //                 ]}
// // //               >
// // //                 Games
// // //               </Text>
// // //             </TouchableOpacity>

// // //             {/* PROFILE */}

// // //             <TouchableOpacity
// // //               style={styles.navItem}
// // //               onPress={onOpenProfile}
// // //               activeOpacity={0.8}
// // //             >
// // //               <Ionicons
// // //                 name="person-outline"
// // //                 size={22}
// // //                 color="#7B8397"
// // //               />

// // //               <Text style={styles.navText}>
// // //                 Profile
// // //               </Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         </View>
// // //       )}
// // //     </SafeAreaView>
// // //   );
// // // }

// // // /* =========================================================
// // //    STYLES
// // //    ========================================================= */

// // // const styles = StyleSheet.create({
// // //   safe: {
// // //     flex: 1,
// // //     backgroundColor: "#F8F9FF",
// // //   },

// // //   scroll: {
// // //     flex: 1,
// // //   },

// // //   scrollContent: {
// // //     alignItems: "center",
// // //     paddingBottom: 20,
// // //   },

// // //   content: {
// // //     width: "100%",
// // //   },

// // //   wideRow: {
// // //     flexDirection: "row",
// // //     alignItems: "flex-start",
// // //     gap: 28,
// // //   },

// // //   sidebar: {
// // //     width: 300,
// // //     gap: 16,
// // //   },

// // //   /* =======================================================
// // //      HEADER
// // //   ======================================================= */

// // //   headerWrap: {
// // //     width: "100%",
// // //     backgroundColor: "#FFFFFF",
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: "#ECEEF5",
// // //   },

// // //   header: {
// // //     width: "100%",
// // //     alignSelf: "center",
// // //     height: 70,
// // //     paddingHorizontal: 18,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //   },

// // //   brandRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //   },

// // //   logo: {
// // //     width: 43,
// // //     height: 43,
// // //     borderRadius: 14,
// // //     backgroundColor: "#6C63FF",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 11,

// // //     shadowColor: "#6C63FF",
// // //     shadowOffset: {
// // //       width: 0,
// // //       height: 5,
// // //     },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 8,
// // //     elevation: 5,
// // //   },

// // //   brand: {
// // //     color: "#20294A",
// // //     fontSize: 18,
// // //     fontWeight: "900",
// // //     letterSpacing: 0.5,
// // //   },

// // //   brandAccent: {
// // //     color: "#6C63FF",
// // //   },

// // //   brandSub: {
// // //     marginTop: 2,
// // //     color: "#9AA1B5",
// // //     fontSize: 8,
// // //     letterSpacing: 1.8,
// // //     fontWeight: "700",
// // //   },

// // //   profileButton: {
// // //     width: 39,
// // //     height: 39,
// // //     borderRadius: 20,
// // //     backgroundColor: "#F2F3FA",
// // //     borderWidth: 1,
// // //     borderColor: "#E4E6F0",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   navLinks: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 8,
// // //   },

// // //   navLink: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 8,
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 18,
// // //     borderRadius: 12,
// // //   },

// // //   navLinkActive: {
// // //     backgroundColor: "#EEECFF",
// // //   },

// // //   navLinkText: {
// // //     color: "#7D8498",
// // //     fontSize: 15,
// // //     fontWeight: "600",
// // //   },

// // //   navLinkTextActive: {
// // //     color: "#6C63FF",
// // //     fontWeight: "800",
// // //   },

// // //   /* =======================================================
// // //      WELCOME
// // //   ======================================================= */

// // //   welcomeSection: {
// // //     paddingTop: 27,
// // //     paddingBottom: 18,
// // //   },

// // //   welcomeBadge: {
// // //     alignSelf: "flex-start",
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 6,
// // //     backgroundColor: "#6C63FF",
// // //     paddingHorizontal: 11,
// // //     paddingVertical: 6,
// // //     borderRadius: 20,
// // //     marginBottom: 10,
// // //   },

// // //   welcomeBadgeText: {
// // //     color: "#FFFFFF",
// // //     fontSize: 9,
// // //     fontWeight: "900",
// // //     letterSpacing: 0.8,
// // //   },

// // //   welcomeTitle: {
// // //     color: "#20294A",
// // //     fontSize: 25,
// // //     fontWeight: "900",
// // //     letterSpacing: -0.4,
// // //   },

// // //   welcomeDescription: {
// // //     color: "#7D8498",
// // //     fontSize: 12,
// // //     lineHeight: 18,
// // //     marginTop: 6,
// // //     maxWidth: 520,
// // //   },

// // //   /* =======================================================
// // //      STATS
// // //   ======================================================= */

// // //   statsRow: {
// // //     flexDirection: "row",
// // //     gap: 9,
// // //     marginBottom: 27,
// // //   },

// // //   statCard: {
// // //     flex: 1,
// // //     minHeight: 68,
// // //     backgroundColor: "#FFFFFF",
// // //     borderWidth: 1,
// // //     borderColor: "#E9EAF2",
// // //     borderRadius: 15,
// // //     paddingHorizontal: 10,
// // //     flexDirection: "row",
// // //     alignItems: "center",

// // //     shadowColor: "#20294A",
// // //     shadowOffset: {
// // //       width: 0,
// // //       height: 3,
// // //     },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //     elevation: 2,
// // //   },

// // //   statIcon: {
// // //     width: 34,
// // //     height: 34,
// // //     borderRadius: 10,
// // //     backgroundColor: "#EEECFF",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 8,
// // //   },

// // //   statValue: {
// // //     color: "#20294A",
// // //     fontSize: 15,
// // //     fontWeight: "900",
// // //   },

// // //   statLabel: {
// // //     color: "#9299AC",
// // //     fontSize: 9,
// // //     marginTop: 2,
// // //   },

// // //   /* =======================================================
// // //      PROGRESS
// // //   ======================================================= */

// // //   progressCard: {
// // //     backgroundColor: "#FFFFFF",
// // //     borderWidth: 1,
// // //     borderColor: "#E9EAF2",
// // //     borderRadius: 18,
// // //     padding: 18,

// // //     shadowColor: "#20294A",
// // //     shadowOffset: {
// // //       width: 0,
// // //       height: 5,
// // //     },
// // //     shadowOpacity: 0.06,
// // //     shadowRadius: 12,
// // //     elevation: 3,
// // //   },

// // //   progressTitle: {
// // //     color: "#20294A",
// // //     fontSize: 17,
// // //     fontWeight: "900",
// // //     marginBottom: 8,
// // //   },

// // //   progressRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingVertical: 12,
// // //   },

// // //   progressDivider: {
// // //     borderTopWidth: 1,
// // //     borderTopColor: "#EEF0F5",
// // //   },

// // //   progressIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 11,
// // //     backgroundColor: "#EEECFF",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 12,
// // //   },

// // //   progressLabel: {
// // //     flex: 1,
// // //     color: "#7D8498",
// // //     fontSize: 14,
// // //   },

// // //   progressValue: {
// // //     color: "#20294A",
// // //     fontSize: 20,
// // //     fontWeight: "900",
// // //   },

// // //   progressBtn: {
// // //     marginTop: 8,
// // //     height: 44,
// // //     borderRadius: 12,
// // //     backgroundColor: "#6C63FF",
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     gap: 8,
// // //   },

// // //   progressBtnText: {
// // //     color: "#FFFFFF",
// // //     fontSize: 14,
// // //     fontWeight: "800",
// // //   },

// // //   /* =======================================================
// // //      SECTION
// // //   ======================================================= */

// // //   sectionHeader: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     marginBottom: 11,
// // //   },

// // //   sectionTitle: {
// // //     color: "#20294A",
// // //     fontSize: 17,
// // //     fontWeight: "900",
// // //   },

// // //   sectionLink: {
// // //     color: "#6C63FF",
// // //     fontSize: 9,
// // //     fontWeight: "900",
// // //     letterSpacing: 1,
// // //   },

// // //   gameCount: {
// // //     color: "#A0A6B7",
// // //     fontSize: 9,
// // //     fontWeight: "700",
// // //     letterSpacing: 1,
// // //   },

// // //   /* =======================================================
// // //      FEATURED
// // //   ======================================================= */

// // //   featuredCard: {
// // //     minHeight: 205,
// // //     borderRadius: 20,
// // //     padding: 18,
// // //     marginBottom: 27,
// // //     backgroundColor: "#6C63FF",
// // //     borderWidth: 1,
// // //     borderColor: "#8179FF",
// // //     overflow: "hidden",

// // //     shadowColor: "#6C63FF",
// // //     shadowOffset: {
// // //       width: 0,
// // //       height: 8,
// // //     },
// // //     shadowOpacity: 0.18,
// // //     shadowRadius: 14,
// // //     elevation: 5,
// // //   },

// // //   featuredCardWide: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 24,
// // //     minHeight: 170,
// // //     paddingVertical: 26,
// // //     paddingHorizontal: 28,
// // //     marginBottom: 34,
// // //   },

// // //   featuredCircleOne: {
// // //     position: "absolute",
// // //     width: 190,
// // //     height: 190,
// // //     borderRadius: 100,
// // //     backgroundColor: "#8179FF",
// // //     opacity: 0.45,
// // //     right: -80,
// // //     top: -90,
// // //   },

// // //   featuredCircleTwo: {
// // //     position: "absolute",
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 60,
// // //     backgroundColor: "#A7A1FF",
// // //     opacity: 0.18,
// // //     right: 60,
// // //     bottom: -55,
// // //   },

// // //   featuredTop: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //   },

// // //   featuredIcon: {
// // //     width: 52,
// // //     height: 52,
// // //     borderRadius: 14,
// // //     backgroundColor: "rgba(255,255,255,0.16)",
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255,255,255,0.25)",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   featuredBadge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: "rgba(255,255,255,0.16)",
// // //     borderWidth: 1,
// // //     borderColor: "rgba(255,255,255,0.25)",
// // //     borderRadius: 20,
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 6,
// // //   },

// // //   liveDot: {
// // //     width: 6,
// // //     height: 6,
// // //     borderRadius: 4,
// // //     backgroundColor: "#7EF5C8",
// // //     marginRight: 6,
// // //   },

// // //   featuredBadgeText: {
// // //     color: "#FFFFFF",
// // //     fontSize: 8,
// // //     fontWeight: "900",
// // //     letterSpacing: 0.7,
// // //   },

// // //   featuredTitle: {
// // //     color: "#FFFFFF",
// // //     fontSize: 23,
// // //     fontWeight: "900",
// // //     marginTop: 17,
// // //     letterSpacing: 0.5,
// // //   },

// // //   featuredSubtitle: {
// // //     color: "#E8E6FF",
// // //     fontSize: 13,
// // //     fontWeight: "700",
// // //     marginTop: 3,
// // //   },

// // //   featuredDescription: {
// // //     color: "#E3E1FF",
// // //     fontSize: 11,
// // //     lineHeight: 17,
// // //     marginTop: 7,
// // //     maxWidth: 420,
// // //   },

// // //   featuredBottom: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginTop: 17,
// // //   },

// // //   featuredInfo: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginRight: 13,
// // //   },

// // //   featuredInfoText: {
// // //     color: "#E7E5FF",
// // //     fontSize: 10,
// // //     marginLeft: 4,
// // //   },

// // //   playButton: {
// // //     marginLeft: "auto",
// // //     height: 37,
// // //     paddingHorizontal: 16,
// // //     borderRadius: 11,
// // //     backgroundColor: "#FFFFFF",
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 7,
// // //   },

// // //   playButtonWide: {
// // //     marginLeft: 0,
// // //     height: 48,
// // //     paddingHorizontal: 28,
// // //     borderRadius: 14,
// // //   },

// // //   playButtonText: {
// // //     color: "#6C63FF",
// // //     fontSize: 11,
// // //     fontWeight: "900",
// // //     letterSpacing: 0.6,
// // //   },

// // //   /* =======================================================
// // //      GAME LIST
// // //   ======================================================= */

// // //   gameList: {
// // //     gap: 10,
// // //   },

// // //   gameListWide: {
// // //     flexDirection: "row",
// // //     flexWrap: "wrap",
// // //     gap: 16,
// // //   },

// // //   gameCard: {
// // //     minHeight: 105,
// // //     backgroundColor: "#FFFFFF",
// // //     borderWidth: 1,
// // //     borderColor: "#E8EAF2",
// // //     borderRadius: 16,
// // //     padding: 13,
// // //     flexDirection: "row",
// // //     alignItems: "center",

// // //     shadowColor: "#20294A",
// // //     shadowOffset: {
// // //       width: 0,
// // //       height: 3,
// // //     },
// // //     shadowOpacity: 0.04,
// // //     shadowRadius: 7,
// // //     elevation: 2,
// // //   },

// // //   gameCardWide: {
// // //     flexGrow: 1,
// // //     flexBasis: "46%",
// // //     minHeight: 124,
// // //     padding: 18,
// // //     borderRadius: 18,
// // //   },

// // //   lockedCard: {
// // //     opacity: 0.62,
// // //   },

// // //   gameIcon: {
// // //     width: 49,
// // //     height: 49,
// // //     borderRadius: 14,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 12,
// // //   },

// // //   gameContent: {
// // //     flex: 1,
// // //   },

// // //   gameTitleRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //   },

// // //   gameTitle: {
// // //     color: "#20294A",
// // //     fontSize: 15,
// // //     fontWeight: "900",
// // //   },

// // //   statusDot: {
// // //     width: 6,
// // //     height: 6,
// // //     borderRadius: 5,
// // //     marginLeft: 7,
// // //   },

// // //   comingSoonBadge: {
// // //     marginLeft: 7,
// // //     paddingHorizontal: 6,
// // //     paddingVertical: 3,
// // //     borderRadius: 5,
// // //     backgroundColor: "#F0F1F6",
// // //   },

// // //   comingSoonText: {
// // //     color: "#9299AB",
// // //     fontSize: 7,
// // //     fontWeight: "900",
// // //     letterSpacing: 0.5,
// // //   },

// // //   gameSubtitle: {
// // //     color: "#727A90",
// // //     fontSize: 11,
// // //     marginTop: 3,
// // //   },

// // //   gameDescription: {
// // //     color: "#9AA1B3",
// // //     fontSize: 9.5,
// // //     lineHeight: 14,
// // //     marginTop: 5,
// // //   },

// // //   metaRow: {
// // //     flexDirection: "row",
// // //     marginTop: 7,
// // //     gap: 13,
// // //   },

// // //   metaItem: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //   },

// // //   metaText: {
// // //     color: "#8C94A7",
// // //     fontSize: 9,
// // //     marginLeft: 4,
// // //   },

// // //   arrowButton: {
// // //     width: 31,
// // //     height: 31,
// // //     borderRadius: 9,
// // //     backgroundColor: "#F1F2F8",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginLeft: 8,
// // //   },

// // //   /* =======================================================
// // //      FOOTER
// // //   ======================================================= */

// // //   footerCard: {
// // //     marginTop: 22,
// // //     borderRadius: 14,
// // //     padding: 14,
// // //     backgroundColor: "#FFFFFF",
// // //     borderWidth: 1,
// // //     borderColor: "#E8EAF2",
// // //     flexDirection: "row",
// // //     alignItems: "center",

// // //     shadowColor: "#20294A",
// // //     shadowOffset: {
// // //       width: 0,
// // //       height: 3,
// // //     },
// // //     shadowOpacity: 0.04,
// // //     shadowRadius: 8,
// // //     elevation: 2,
// // //   },

// // //   footerIcon: {
// // //     width: 42,
// // //     height: 42,
// // //     borderRadius: 12,
// // //     backgroundColor: "#EEECFF",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginRight: 11,
// // //   },

// // //   footerText: {
// // //     flex: 1,
// // //   },

// // //   footerTitle: {
// // //     color: "#303951",
// // //     fontSize: 12,
// // //     fontWeight: "800",
// // //   },

// // //   footerSubtitle: {
// // //     color: "#9299AB",
// // //     fontSize: 9.5,
// // //     marginTop: 3,
// // //   },

// // //   /* =======================================================
// // //      BOTTOM NAV
// // //   ======================================================= */

// // //   bottomNavWrap: {
// // //     width: "100%",
// // //     borderTopWidth: 1,
// // //     borderTopColor: "#E7E9F1",
// // //     backgroundColor: "#FFFFFF",
// // //   },

// // //   bottomNav: {
// // //     width: "100%",
// // //     alignSelf: "center",
// // //     height: 70,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     paddingHorizontal: 35,
// // //   },

// // //   navItem: {
// // //     flex: 1,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },

// // //   navText: {
// // //     color: "#858DA1",
// // //     fontSize: 10,
// // //     fontWeight: "600",
// // //     marginTop: 4,
// // //   },

// // //   navTextActive: {
// // //     color: "#6C63FF",
// // //     fontWeight: "900",
// // //   },
// // // });
// // import React, {
// //   useEffect,
// //   useRef,
// //   useState,
// // } from "react";

// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   useWindowDimensions,
// //   Animated,
// //   Easing,
// // } from "react-native";

// // import {
// //   Ionicons,
// //   MaterialCommunityIcons,
// // } from "@expo/vector-icons";

// // /* =========================================================
// //    TYPES
// // ========================================================= */

// // type GameId =
// //   | "word-cipher"
// //   | "code-breaker"
// //   | "memory-grid"
// //   | "pattern-hacker"
// //   | "word-scramble";

// // type GameItem = {
// //   id: GameId;
// //   title: string;
// //   subtitle: string;
// //   description: string;
// //   icon: React.ReactNode;
// //   iconBg: string;
// //   accent: string;
// //   ready: boolean;
// //   difficulty: string;
// //   players: string;
// // };

// // type Props = {
// //   onSelectGame: (id: GameId) => void;
// //   onOpenProfile?: () => void;
// //   bestScore?: number;
// //   streak?: number;
// // };

// // const WIDE_BREAKPOINT = 900;

// // /* =========================================================
// //    THEME
// // ========================================================= */

// // const COLORS = {
// //   cream: "#FFF8E8",
// //   creamLight: "#FFFDF6",
// //   creamDark: "#F8EBCB",

// //   navy: "#202A63",
// //   navyLight: "#33418A",

// //   yellow: "#FFBF24",
// //   yellowDark: "#F3A900",

// //   blue: "#48B8F5",
// //   blueDark: "#2299DE",

// //   pink: "#F58BB8",
// //   pinkLight: "#FFE1ED",

// //   green: "#36C99B",
// //   greenLight: "#DDF8ED",

// //   orange: "#FF8E2B",

// //   purple: "#7167E8",
// //   purpleLight: "#EAE8FF",

// //   text: "#202A63",
// //   textLight: "#717897",
// //   muted: "#A0A4B9",

// //   white: "#FFFFFF",
// // };

// // /* =========================================================
// //    STYLES
// //    IMPORTANT:
// //    Styles are declared BEFORE GAMES.
// //    This prevents:
// //    "Block-scoped variable styles used before declaration"
// // ========================================================= */

// // const styles = StyleSheet.create({
// //   safe: {
// //     flex: 1,
// //     backgroundColor: COLORS.cream,
// //   },

// //   scroll: {
// //     flex: 1,
// //     backgroundColor: COLORS.cream,
// //   },

// //   scrollContent: {
// //     alignItems: "center",
// //     paddingBottom: 30,
// //   },

// //   content: {
// //     width: "100%",
// //   },

// //   /* =======================================================
// //      DECORATIONS
// //   ======================================================= */

// //   floatingCircle: {
// //     position: "absolute",
// //     borderRadius: 999,
// //     opacity: 0.55,
// //   },

// //   floatingPuzzle: {
// //     position: "absolute",
// //     opacity: 0.85,
// //   },

// //   star: {
// //     position: "absolute",
// //   },

// //   /* =======================================================
// //      HEADER
// //   ======================================================= */

// //   headerWrap: {
// //     width: "100%",
// //     backgroundColor: COLORS.creamLight,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#F1E6C9",
// //     zIndex: 10,
// //   },

// //   header: {
// //     width: "100%",
// //     alignSelf: "center",
// //     minHeight: 76,
// //     paddingHorizontal: 20,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },

// //   brandRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   logoAnimated: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 17,
// //     backgroundColor: COLORS.yellow,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 11,

// //     shadowColor: COLORS.yellowDark,
// //     shadowOffset: {
// //       width: 0,
// //       height: 6,
// //     },
// //     shadowOpacity: 0.28,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },

// //   brand: {
// //     color: COLORS.navy,
// //     fontSize: 19,
// //     fontWeight: "900",
// //     letterSpacing: 0.3,
// //   },

// //   brandAccent: {
// //     color: COLORS.blueDark,
// //   },

// //   brandSub: {
// //     marginTop: 2,
// //     color: COLORS.pink,
// //     fontSize: 8,
// //     letterSpacing: 1.7,
// //     fontWeight: "900",
// //   },

// //   profileButton: {
// //     width: 42,
// //     height: 42,
// //     borderRadius: 21,
// //     backgroundColor: COLORS.white,
// //     borderWidth: 1,
// //     borderColor: "#E9DFC6",
// //     alignItems: "center",
// //     justifyContent: "center",

// //     shadowColor: COLORS.navy,
// //     shadowOffset: {
// //       width: 0,
// //       height: 3,
// //     },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 7,
// //     elevation: 3,
// //   },

// //   navLinks: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 7,
// //   },

// //   navLink: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 7,
// //     paddingVertical: 10,
// //     paddingHorizontal: 17,
// //     borderRadius: 14,
// //   },

// //   navLinkActive: {
// //     backgroundColor: COLORS.yellow,
// //   },

// //   navLinkText: {
// //     color: COLORS.textLight,
// //     fontSize: 14,
// //     fontWeight: "700",
// //   },

// //   navLinkTextActive: {
// //     color: COLORS.navy,
// //     fontWeight: "900",
// //   },

// //   /* =======================================================
// //      HERO
// //   ======================================================= */

// //   hero: {
// //     position: "relative",
// //     overflow: "hidden",
// //     backgroundColor: COLORS.cream,
// //     paddingTop: 28,
// //     paddingBottom: 20,
// //   },

// //   heroBadge: {
// //     alignSelf: "flex-start",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 6,
// //     backgroundColor: COLORS.pink,
// //     paddingHorizontal: 13,
// //     paddingVertical: 7,
// //     borderRadius: 22,

// //     shadowColor: COLORS.pink,
// //     shadowOffset: {
// //       width: 0,
// //       height: 5,
// //     },
// //     shadowOpacity: 0.22,
// //     shadowRadius: 8,
// //     elevation: 4,
// //   },

// //   heroBadgeText: {
// //     color: COLORS.white,
// //     fontSize: 9,
// //     fontWeight: "900",
// //     letterSpacing: 0.8,
// //   },

// //   heroTitle: {
// //     color: COLORS.navy,
// //     fontSize: 29,
// //     lineHeight: 35,
// //     fontWeight: "900",
// //     marginTop: 13,
// //     letterSpacing: -0.5,
// //   },

// //   heroTitleAccent: {
// //     color: COLORS.blueDark,
// //   },

// //   heroDescription: {
// //     color: COLORS.textLight,
// //     fontSize: 13,
// //     lineHeight: 20,
// //     marginTop: 7,
// //     maxWidth: 550,
// //   },

// //   heroUnderline: {
// //     width: 82,
// //     height: 5,
// //     borderRadius: 4,
// //     backgroundColor: COLORS.yellow,
// //     marginTop: 13,
// //   },

// //   /* =======================================================
// //      STATS
// //   ======================================================= */

// //   statsRow: {
// //     flexDirection: "row",
// //     gap: 9,
// //     marginBottom: 28,
// //   },

// //   statCard: {
// //     flex: 1,
// //     minHeight: 76,
// //     backgroundColor: COLORS.white,
// //     borderWidth: 1,
// //     borderColor: "#EEE5D0",
// //     borderRadius: 18,
// //     paddingHorizontal: 10,
// //     flexDirection: "row",
// //     alignItems: "center",

// //     shadowColor: COLORS.navy,
// //     shadowOffset: {
// //       width: 0,
// //       height: 5,
// //     },
// //     shadowOpacity: 0.07,
// //     shadowRadius: 10,
// //     elevation: 3,
// //   },

// //   statIcon: {
// //     width: 37,
// //     height: 37,
// //     borderRadius: 12,
// //     backgroundColor: COLORS.purpleLight,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 8,
// //   },

// //   statValue: {
// //     color: COLORS.navy,
// //     fontSize: 16,
// //     fontWeight: "900",
// //   },

// //   statLabel: {
// //     color: COLORS.muted,
// //     fontSize: 9,
// //     marginTop: 2,
// //     fontWeight: "600",
// //   },

// //   /* =======================================================
// //      SECTION
// //   ======================================================= */

// //   sectionHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginBottom: 12,
// //   },

// //   sectionTitle: {
// //     color: COLORS.navy,
// //     fontSize: 18,
// //     fontWeight: "900",
// //   },

// //   sectionLink: {
// //     color: COLORS.blueDark,
// //     fontSize: 9,
// //     fontWeight: "900",
// //     letterSpacing: 1,
// //   },

// //   gameCount: {
// //     color: COLORS.muted,
// //     fontSize: 9,
// //     fontWeight: "800",
// //     letterSpacing: 1,
// //   },

// //   /* =======================================================
// //      FEATURED GAME
// //   ======================================================= */

// //   featuredCard: {
// //     minHeight: 215,
// //     borderRadius: 25,
// //     padding: 19,
// //     marginBottom: 28,
// //     backgroundColor: COLORS.navy,
// //     borderWidth: 1,
// //     borderColor: "#414D94",
// //     overflow: "hidden",

// //     shadowColor: COLORS.navy,
// //     shadowOffset: {
// //       width: 0,
// //       height: 9,
// //     },
// //     shadowOpacity: 0.22,
// //     shadowRadius: 15,
// //     elevation: 7,
// //   },

// //   featuredCardWide: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 24,
// //     minHeight: 185,
// //     paddingVertical: 27,
// //     paddingHorizontal: 29,
// //   },

// //   featuredCircleOne: {
// //     position: "absolute",
// //     width: 210,
// //     height: 210,
// //     borderRadius: 110,
// //     backgroundColor: COLORS.blue,
// //     opacity: 0.24,
// //     right: -90,
// //     top: -110,
// //   },

// //   featuredCircleTwo: {
// //     position: "absolute",
// //     width: 130,
// //     height: 130,
// //     borderRadius: 70,
// //     backgroundColor: COLORS.pink,
// //     opacity: 0.2,
// //     right: 55,
// //     bottom: -75,
// //   },

// //   featuredCircleThree: {
// //     position: "absolute",
// //     width: 75,
// //     height: 75,
// //     borderRadius: 50,
// //     backgroundColor: COLORS.yellow,
// //     opacity: 0.22,
// //     left: -25,
// //     bottom: -25,
// //   },

// //   featuredTop: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },

// //   featuredIcon: {
// //     width: 55,
// //     height: 55,
// //     borderRadius: 17,
// //     backgroundColor: "rgba(255,255,255,0.12)",
// //     borderWidth: 1,
// //     borderColor: "rgba(255,255,255,0.25)",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   featuredBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "rgba(255,255,255,0.13)",
// //     borderWidth: 1,
// //     borderColor: "rgba(255,255,255,0.22)",
// //     borderRadius: 20,
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //   },

// //   liveDot: {
// //     width: 7,
// //     height: 7,
// //     borderRadius: 5,
// //     backgroundColor: COLORS.green,
// //     marginRight: 6,
// //   },

// //   featuredBadgeText: {
// //     color: COLORS.white,
// //     fontSize: 8,
// //     fontWeight: "900",
// //     letterSpacing: 0.7,
// //   },

// //   featuredTitle: {
// //     color: COLORS.yellow,
// //     fontSize: 24,
// //     fontWeight: "900",
// //     marginTop: 17,
// //     letterSpacing: 0.5,
// //   },

// //   featuredSubtitle: {
// //     color: COLORS.white,
// //     fontSize: 13,
// //     fontWeight: "800",
// //     marginTop: 3,
// //   },

// //   featuredDescription: {
// //     color: "#DDE3FF",
// //     fontSize: 11,
// //     lineHeight: 17,
// //     marginTop: 7,
// //     maxWidth: 430,
// //   },

// //   featuredBottom: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginTop: 17,
// //   },

// //   featuredInfo: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginRight: 14,
// //   },

// //   featuredInfoText: {
// //     color: "#DCE2FF",
// //     fontSize: 10,
// //     marginLeft: 4,
// //   },

// //   playButton: {
// //     marginLeft: "auto",
// //     height: 40,
// //     paddingHorizontal: 17,
// //     borderRadius: 13,
// //     backgroundColor: COLORS.yellow,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 7,

// //     shadowColor: COLORS.yellow,
// //     shadowOffset: {
// //       width: 0,
// //       height: 4,
// //     },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 7,
// //     elevation: 4,
// //   },

// //   playButtonWide: {
// //     marginLeft: 0,
// //     height: 50,
// //     paddingHorizontal: 27,
// //     borderRadius: 15,
// //   },

// //   playButtonText: {
// //     color: COLORS.navy,
// //     fontSize: 11,
// //     fontWeight: "900",
// //     letterSpacing: 0.6,
// //   },

// //   /* =======================================================
// //      GAMES
// //   ======================================================= */

// //   gameList: {
// //     gap: 11,
// //   },

// //   gameListWide: {
// //     flexDirection: "row",
// //     flexWrap: "wrap",
// //     gap: 15,
// //   },

// //   gameCard: {
// //     minHeight: 110,
// //     backgroundColor: COLORS.white,
// //     borderWidth: 1,
// //     borderColor: "#EEE6D4",
// //     borderRadius: 18,
// //     padding: 14,
// //     flexDirection: "row",
// //     alignItems: "center",

// //     shadowColor: COLORS.navy,
// //     shadowOffset: {
// //       width: 0,
// //       height: 4,
// //     },
// //     shadowOpacity: 0.06,
// //     shadowRadius: 9,
// //     elevation: 2,
// //   },

// //   gameCardWide: {
// //     flexGrow: 1,
// //     flexBasis: "46%",
// //     minHeight: 126,
// //     padding: 18,
// //     borderRadius: 20,
// //   },

// //   lockedCard: {
// //     opacity: 0.63,
// //   },

// //   gameIcon: {
// //     width: 51,
// //     height: 51,
// //     borderRadius: 16,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 12,
// //   },

// //   gameContent: {
// //     flex: 1,
// //   },

// //   gameTitleRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   gameTitle: {
// //     color: COLORS.navy,
// //     fontSize: 15,
// //     fontWeight: "900",
// //   },

// //   statusDot: {
// //     width: 7,
// //     height: 7,
// //     borderRadius: 5,
// //     marginLeft: 7,
// //   },

// //   comingSoonBadge: {
// //     marginLeft: 7,
// //     paddingHorizontal: 6,
// //     paddingVertical: 3,
// //     borderRadius: 6,
// //     backgroundColor: "#F2EFE5",
// //   },

// //   comingSoonText: {
// //     color: COLORS.muted,
// //     fontSize: 7,
// //     fontWeight: "900",
// //     letterSpacing: 0.5,
// //   },

// //   gameSubtitle: {
// //     color: COLORS.textLight,
// //     fontSize: 11,
// //     marginTop: 3,
// //     fontWeight: "600",
// //   },

// //   gameDescription: {
// //     color: "#9A9FB1",
// //     fontSize: 9.5,
// //     lineHeight: 14,
// //     marginTop: 5,
// //   },

// //   metaRow: {
// //     flexDirection: "row",
// //     marginTop: 7,
// //     gap: 13,
// //   },

// //   metaItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   metaText: {
// //     color: "#8E94A7",
// //     fontSize: 9,
// //     marginLeft: 4,
// //   },

// //   arrowButton: {
// //     width: 33,
// //     height: 33,
// //     borderRadius: 11,
// //     backgroundColor: COLORS.cream,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginLeft: 8,
// //   },

// //   /* =======================================================
// //      PROGRESS
// //   ======================================================= */

// //   progressCard: {
// //     backgroundColor: COLORS.white,
// //     borderWidth: 1,
// //     borderColor: "#EEE5D2",
// //     borderRadius: 21,
// //     padding: 18,

// //     shadowColor: COLORS.navy,
// //     shadowOffset: {
// //       width: 0,
// //       height: 6,
// //     },
// //     shadowOpacity: 0.07,
// //     shadowRadius: 12,
// //     elevation: 3,
// //   },

// //   progressTitle: {
// //     color: COLORS.navy,
// //     fontSize: 17,
// //     fontWeight: "900",
// //     marginBottom: 8,
// //   },

// //   progressRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingVertical: 12,
// //   },

// //   progressDivider: {
// //     borderTopWidth: 1,
// //     borderTopColor: "#F0E9D9",
// //   },

// //   progressIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 12,
// //     backgroundColor: COLORS.purpleLight,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 12,
// //   },

// //   progressLabel: {
// //     flex: 1,
// //     color: COLORS.textLight,
// //     fontSize: 14,
// //     fontWeight: "600",
// //   },

// //   progressValue: {
// //     color: COLORS.navy,
// //     fontSize: 20,
// //     fontWeight: "900",
// //   },

// //   progressBtn: {
// //     marginTop: 8,
// //     height: 45,
// //     borderRadius: 14,
// //     backgroundColor: COLORS.blue,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 8,

// //     shadowColor: COLORS.blue,
// //     shadowOffset: {
// //       width: 0,
// //       height: 5,
// //     },
// //     shadowOpacity: 0.22,
// //     shadowRadius: 8,
// //     elevation: 4,
// //   },

// //   progressBtnText: {
// //     color: COLORS.white,
// //     fontSize: 14,
// //     fontWeight: "900",
// //   },

// //   /* =======================================================
// //      FOOTER
// //   ======================================================= */

// //   footerCard: {
// //     marginTop: 18,
// //     borderRadius: 17,
// //     padding: 14,
// //     backgroundColor: COLORS.white,
// //     borderWidth: 1,
// //     borderColor: "#EEE5D2",
// //     flexDirection: "row",
// //     alignItems: "center",

// //     shadowColor: COLORS.navy,
// //     shadowOffset: {
// //       width: 0,
// //       height: 4,
// //     },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 8,
// //     elevation: 2,
// //   },

// //   footerIcon: {
// //     width: 43,
// //     height: 43,
// //     borderRadius: 13,
// //     backgroundColor: COLORS.pinkLight,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginRight: 11,
// //   },

// //   footerText: {
// //     flex: 1,
// //   },

// //   footerTitle: {
// //     color: COLORS.navy,
// //     fontSize: 12,
// //     fontWeight: "900",
// //   },

// //   footerSubtitle: {
// //     color: COLORS.muted,
// //     fontSize: 9.5,
// //     marginTop: 3,
// //   },

// //   /* =======================================================
// //      SIDEBAR
// //   ======================================================= */

// //   wideRow: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     gap: 28,
// //   },

// //   sidebar: {
// //     width: 300,
// //     gap: 16,
// //   },

// //   /* =======================================================
// //      BOTTOM NAV
// //   ======================================================= */

// //   bottomNavWrap: {
// //     width: "100%",
// //     borderTopWidth: 1,
// //     borderTopColor: "#EDE4D2",
// //     backgroundColor: COLORS.creamLight,
// //   },

// //   bottomNav: {
// //     width: "100%",
// //     alignSelf: "center",
// //     height: 72,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 35,
// //   },

// //   navItem: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   navText: {
// //     color: "#85899D",
// //     fontSize: 10,
// //     fontWeight: "700",
// //     marginTop: 4,
// //   },

// //   navTextActive: {
// //     color: COLORS.blueDark,
// //     fontWeight: "900",
// //   },
// // });

// // /* =========================================================
// //    GAMES
// //    IMPORTANT:
// //    styles is already declared above.
// // ========================================================= */

// // const GAMES: GameItem[] = [
// //   {
// //     id: "code-breaker",
// //     title: "Code Breaker",
// //     subtitle: "Crack the secret code",
// //     description:
// //       "Use clues and logic to find the hidden number.",
// //     icon: (
// //       <Ionicons
// //         name="lock-closed"
// //         size={25}
// //         color={COLORS.purple}
// //       />
// //     ),
// //     iconBg: COLORS.purpleLight,
// //     accent: COLORS.purple,
// //     ready: true,
// //     difficulty: "Easy",
// //     players: "1 Player",
// //   },

// //   {
// //     id: "word-scramble",
// //     title: "Word Scramble",
// //     subtitle: "Unscramble the words",
// //     description:
// //       "Challenge your friends and solve words quickly.",
// //     icon: (
// //       <MaterialCommunityIcons
// //         name="shuffle-variant"
// //         size={27}
// //         color={COLORS.orange}
// //       />
// //     ),
// //     iconBg: "#FFF0D8",
// //     accent: COLORS.orange,
// //     ready: true,
// //     difficulty: "Medium",
// //     players: "Multiplayer",
// //   },

// //   {
// //     id: "memory-grid",
// //     title: "Memory Grid",
// //     subtitle: "Test your memory",
// //     description:
// //       "Remember positions and recall them correctly.",
// //     icon: (
// //       <Ionicons
// //         name="grid"
// //         size={25}
// //         color={COLORS.green}
// //       />
// //     ),
// //     iconBg: COLORS.greenLight,
// //     accent: COLORS.green,
// //     ready: false,
// //     difficulty: "Medium",
// //     players: "1 Player",
// //   },

// //   {
// //     id: "pattern-hacker",
// //     title: "Pattern Hacker",
// //     subtitle: "Find the missing pattern",
// //     description:
// //       "Observe the sequence and solve the missing part.",
// //     icon: (
// //       <MaterialCommunityIcons
// //         name="graph-outline"
// //         size={26}
// //         color={COLORS.blueDark}
// //       />
// //     ),
// //     iconBg: "#DFF4FF",
// //     accent: COLORS.blueDark,
// //     ready: false,
// //     difficulty: "Hard",
// //     players: "1 Player",
// //   },

// //   {
// //     id: "word-cipher",
// //     title: "Word Cipher",
// //     subtitle: "Decode the hidden word",
// //     description:
// //       "Break the encrypted word using clever clues.",
// //     icon: (
// //       <Text
// //         style={{
// //           color: COLORS.white,
// //           fontSize: 17,
// //           fontWeight: "900",
// //         }}
// //       >
// //         Aa
// //       </Text>
// //     ),
// //     iconBg: COLORS.pink,
// //     accent: COLORS.pink,
// //     ready: false,
// //     difficulty: "Hard",
// //     players: "1 Player",
// //   },
// // ];

// // /* =========================================================
// //    SCREEN
// // ========================================================= */

// // export default function MenuScreen({
// //   onSelectGame,
// //   onOpenProfile,
// //   bestScore = 0,
// //   streak = 0,
// // }: Props) {
// //   const { width } = useWindowDimensions();

// //   const wide = width >= WIDE_BREAKPOINT;
// //   const maxContent = wide ? 1080 : 560;

// //   const [activeTab, setActiveTab] = useState<
// //     "home" | "games"
// //   >("home");

// //   const scrollRef = useRef<ScrollView>(null);
// //   const gamesY = useRef(0);

// //   /* =======================================================
// //      ANIMATION VALUES
// //   ======================================================= */

// //   const pageOpacity = useRef(
// //     new Animated.Value(0)
// //   ).current;

// //   const pageTranslate = useRef(
// //     new Animated.Value(30)
// //   ).current;

// //   const logoScale = useRef(
// //     new Animated.Value(1)
// //   ).current;

// //   const badgeScale = useRef(
// //     new Animated.Value(1)
// //   ).current;

// //   const featuredScale = useRef(
// //     new Animated.Value(0.94)
// //   ).current;

// //   const featuredOpacity = useRef(
// //     new Animated.Value(0)
// //   ).current;

// //   const floatingOne = useRef(
// //     new Animated.Value(0)
// //   ).current;

// //   const floatingTwo = useRef(
// //     new Animated.Value(0)
// //   ).current;

// //   const floatingThree = useRef(
// //     new Animated.Value(0)
// //   ).current;

// //   const readyCount = GAMES.filter(
// //     (game) => game.ready
// //   ).length;

// //   /* =======================================================
// //      START ANIMATIONS
// //   ======================================================= */

// //   useEffect(() => {
// //     Animated.parallel([
// //       Animated.timing(pageOpacity, {
// //         toValue: 1,
// //         duration: 650,
// //         easing: Easing.out(Easing.cubic),
// //         useNativeDriver: true,
// //       }),

// //       Animated.spring(pageTranslate, {
// //         toValue: 0,
// //         friction: 7,
// //         tension: 45,
// //         useNativeDriver: true,
// //       }),

// //       Animated.spring(featuredScale, {
// //         toValue: 1,
// //         friction: 6,
// //         tension: 45,
// //         useNativeDriver: true,
// //       }),

// //       Animated.timing(featuredOpacity, {
// //         toValue: 1,
// //         duration: 700,
// //         delay: 180,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();

// //     /* LOGO PULSE */

// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(logoScale, {
// //           toValue: 1.08,
// //           duration: 1000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),

// //         Animated.timing(logoScale, {
// //           toValue: 1,
// //           duration: 1000,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     /* BADGE PULSE */

// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(badgeScale, {
// //           toValue: 1.05,
// //           duration: 900,
// //           useNativeDriver: true,
// //         }),

// //         Animated.timing(badgeScale, {
// //           toValue: 1,
// //           duration: 900,
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     /* FLOATING DECORATION 1 */

// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatingOne, {
// //           toValue: -12,
// //           duration: 1800,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),

// //         Animated.timing(floatingOne, {
// //           toValue: 0,
// //           duration: 1800,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     /* FLOATING DECORATION 2 */

// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatingTwo, {
// //           toValue: 14,
// //           duration: 2100,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),

// //         Animated.timing(floatingTwo, {
// //           toValue: 0,
// //           duration: 2100,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();

// //     /* FLOATING DECORATION 3 */

// //     Animated.loop(
// //       Animated.sequence([
// //         Animated.timing(floatingThree, {
// //           toValue: -9,
// //           duration: 1600,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),

// //         Animated.timing(floatingThree, {
// //           toValue: 0,
// //           duration: 1600,
// //           easing: Easing.inOut(Easing.ease),
// //           useNativeDriver: true,
// //         }),
// //       ])
// //     ).start();
// //   }, []);

// //   /* =======================================================
// //      NAVIGATION
// //   ======================================================= */

// //   const goHome = () => {
// //     setActiveTab("home");

// //     scrollRef.current?.scrollTo({
// //       y: 0,
// //       animated: true,
// //     });
// //   };

// //   const goGames = () => {
// //     setActiveTab("games");

// //     scrollRef.current?.scrollTo({
// //       y: Math.max(0, gamesY.current - 10),
// //       animated: true,
// //     });
// //   };

// //   const openGame = (game: GameItem) => {
// //     if (game.ready) {
// //       onSelectGame(game.id);
// //     }
// //   };

// //   /* =======================================================
// //      GAME CARD
// //   ======================================================= */

// //   const renderGameCard = (
// //     game: GameItem,
// //     index: number
// //   ) => {
// //     const cardOpacity = useRef(
// //       new Animated.Value(0)
// //     ).current;

// //     const cardTranslate = useRef(
// //       new Animated.Value(20)
// //     ).current;

// //     useEffect(() => {
// //       Animated.parallel([
// //         Animated.timing(cardOpacity, {
// //           toValue: 1,
// //           duration: 500,
// //           delay: 250 + index * 100,
// //           useNativeDriver: true,
// //         }),

// //         Animated.spring(cardTranslate, {
// //           toValue: 0,
// //           friction: 7,
// //           tension: 50,
// //           delay: 250 + index * 100,
// //           useNativeDriver: true,
// //         }),
// //       ]).start();
// //     }, []);

// //     const scale = useRef(
// //       new Animated.Value(1)
// //     ).current;

// //     const pressIn = () => {
// //       if (!game.ready) return;

// //       Animated.spring(scale, {
// //         toValue: 0.97,
// //         useNativeDriver: true,
// //       }).start();
// //     };

// //     const pressOut = () => {
// //       Animated.spring(scale, {
// //         toValue: 1,
// //         friction: 5,
// //         useNativeDriver: true,
// //       }).start();
// //     };

// //     return (
// //       <Animated.View
// //         key={game.id}
// //         style={{
// //           opacity: cardOpacity,
// //           transform: [
// //             {
// //               translateY: cardTranslate,
// //             },
// //             {
// //               scale,
// //             },
// //           ],
// //         }}
// //       >
// //         <TouchableOpacity
// //           activeOpacity={1}
// //           onPress={() => openGame(game)}
// //           onPressIn={pressIn}
// //           onPressOut={pressOut}
// //           style={[
// //             styles.gameCard,
// //             wide && styles.gameCardWide,
// //             !game.ready && styles.lockedCard,
// //           ]}
// //         >
// //           <View
// //             style={[
// //               styles.gameIcon,
// //               {
// //                 backgroundColor: game.iconBg,
// //               },
// //             ]}
// //           >
// //             {game.icon}
// //           </View>

// //           <View style={styles.gameContent}>
// //             <View style={styles.gameTitleRow}>
// //               <Text
// //                 style={[
// //                   styles.gameTitle,
// //                   wide && {
// //                     fontSize: 17,
// //                   },
// //                 ]}
// //               >
// //                 {game.title}
// //               </Text>

// //               {game.ready ? (
// //                 <View
// //                   style={[
// //                     styles.statusDot,
// //                     {
// //                       backgroundColor:
// //                         game.accent,
// //                     },
// //                   ]}
// //                 />
// //               ) : (
// //                 <View
// //                   style={styles.comingSoonBadge}
// //                 >
// //                   <Text
// //                     style={styles.comingSoonText}
// //                   >
// //                     SOON
// //                   </Text>
// //                 </View>
// //               )}
// //             </View>

// //             <Text
// //               style={[
// //                 styles.gameSubtitle,
// //                 wide && {
// //                   fontSize: 13,
// //                 },
// //               ]}
// //             >
// //               {game.subtitle}
// //             </Text>

// //             <Text
// //               style={[
// //                 styles.gameDescription,
// //                 wide && {
// //                   fontSize: 12,
// //                   lineHeight: 17,
// //                 },
// //               ]}
// //               numberOfLines={2}
// //             >
// //               {game.description}
// //             </Text>

// //             <View style={styles.metaRow}>
// //               <View style={styles.metaItem}>
// //                 <Ionicons
// //                   name="flash-outline"
// //                   size={13}
// //                   color={COLORS.muted}
// //                 />

// //                 <Text style={styles.metaText}>
// //                   {game.difficulty}
// //                 </Text>
// //               </View>

// //               <View style={styles.metaItem}>
// //                 <Ionicons
// //                   name={
// //                     game.players ===
// //                     "Multiplayer"
// //                       ? "people-outline"
// //                       : "person-outline"
// //                   }
// //                   size={13}
// //                   color={COLORS.muted}
// //                 />

// //                 <Text style={styles.metaText}>
// //                   {game.players}
// //                 </Text>
// //               </View>
// //             </View>
// //           </View>

// //           {game.ready ? (
// //             <View style={styles.arrowButton}>
// //               <Ionicons
// //                 name="chevron-forward"
// //                 size={18}
// //                 color={COLORS.navy}
// //               />
// //             </View>
// //           ) : (
// //             <Ionicons
// //               name="lock-closed-outline"
// //               size={17}
// //               color={COLORS.muted}
// //             />
// //           )}
// //         </TouchableOpacity>
// //       </Animated.View>
// //     );
// //   };

// //   /* =======================================================
// //      WELCOME
// //   ======================================================= */

// //   const welcome = (
// //     <Animated.View
// //       style={[
// //         styles.hero,
// //         {
// //           opacity: pageOpacity,
// //           transform: [
// //             {
// //               translateY: pageTranslate,
// //             },
// //           ],
// //         },
// //       ]}
// //     >
// //       {/* FLOATING CIRCLES */}

// //       <Animated.View
// //         style={[
// //           styles.floatingCircle,
// //           {
// //             width: 110,
// //             height: 110,
// //             backgroundColor:
// //               COLORS.yellow,
// //             right: -50,
// //             top: 8,
// //             transform: [
// //               {
// //                 translateY: floatingOne,
// //               },
// //             ],
// //           },
// //         ]}
// //       />

// //       <Animated.View
// //         style={[
// //           styles.floatingCircle,
// //           {
// //             width: 75,
// //             height: 75,
// //             backgroundColor:
// //               COLORS.pink,
// //             right: 80,
// //             bottom: 10,
// //             transform: [
// //               {
// //                 translateY: floatingTwo,
// //               },
// //             ],
// //           },
// //         ]}
// //       />

// //       <Animated.View
// //         style={[
// //           styles.floatingCircle,
// //           {
// //             width: 48,
// //             height: 48,
// //             backgroundColor:
// //               COLORS.blue,
// //             left: -20,
// //             top: 35,
// //             transform: [
// //               {
// //                 translateY:
// //                   floatingThree,
// //               },
// //             ],
// //           },
// //         ]}
// //       />

// //       {/* STARS */}

// //       <Animated.Text
// //         style={[
// //           styles.star,
// //           {
// //             color: COLORS.yellowDark,
// //             fontSize: 25,
// //             right: 28,
// //             top: 80,
// //             transform: [
// //               {
// //                 rotate: floatingThree.interpolate(
// //                   {
// //                     inputRange: [-9, 0],
// //                     outputRange: [
// //                       "-10deg",
// //                       "10deg",
// //                     ],
// //                   }
// //                 ),
// //               },
// //             ],
// //           },
// //         ]}
// //       >
// //         ✦
// //       </Animated.Text>

// //       <Animated.Text
// //         style={[
// //           styles.star,
// //           {
// //             color: COLORS.pink,
// //             fontSize: 20,
// //             right: 130,
// //             top: 20,
// //             transform: [
// //               {
// //                 translateY: floatingOne,
// //               },
// //             ],
// //           },
// //         ]}
// //       >
// //         ✦
// //       </Animated.Text>

// //       <Animated.View
// //         style={{
// //           transform: [
// //             {
// //               scale: badgeScale,
// //             },
// //           ],
// //         }}
// //       >
// //         <View style={styles.heroBadge}>
// //           <MaterialCommunityIcons
// //             name="brain"
// //             size={15}
// //             color={COLORS.white}
// //           />

// //           <Text style={styles.heroBadgeText}>
// //             LET'S PLAY
// //           </Text>
// //         </View>
// //       </Animated.View>

// //       <Text style={styles.heroTitle}>
// //         Choose your{" "}
// //         <Text style={styles.heroTitleAccent}>
// //           challenge
// //         </Text>
// //       </Text>

// //       <Text style={styles.heroDescription}>
// //         Train your memory, logic and
// //         problem-solving skills with fun
// //         interactive games.
// //       </Text>

// //       <View style={styles.heroUnderline} />
// //     </Animated.View>
// //   );

// //   /* =======================================================
// //      STATS
// //   ======================================================= */

// //   const statsRow = (
// //     <Animated.View
// //       style={{
// //         opacity: pageOpacity,
// //         transform: [
// //           {
// //             translateY: pageTranslate,
// //           },
// //         ],
// //       }}
// //     >
// //       <View style={styles.statsRow}>
// //         {/* GAMES */}

// //         <View style={styles.statCard}>
// //           <View
// //             style={[
// //               styles.statIcon,
// //               {
// //                 backgroundColor:
// //                   COLORS.purpleLight,
// //               },
// //             ]}
// //           >
// //             <Ionicons
// //               name="game-controller-outline"
// //               size={18}
// //               color={COLORS.purple}
// //             />
// //           </View>

// //           <View>
// //             <Text style={styles.statValue}>
// //               {readyCount}
// //             </Text>

// //             <Text style={styles.statLabel}>
// //               Games
// //             </Text>
// //           </View>
// //         </View>

// //         {/* SCORE */}

// //         <View style={styles.statCard}>
// //           <View
// //             style={[
// //               styles.statIcon,
// //               {
// //                 backgroundColor: "#FFF0C9",
// //               },
// //             ]}
// //           >
// //             <Ionicons
// //               name="trophy-outline"
// //               size={18}
// //               color={COLORS.yellowDark}
// //             />
// //           </View>

// //           <View>
// //             <Text style={styles.statValue}>
// //               {bestScore}
// //             </Text>

// //             <Text style={styles.statLabel}>
// //               Best Score
// //             </Text>
// //           </View>
// //         </View>

// //         {/* STREAK */}

// //         <View style={styles.statCard}>
// //           <View
// //             style={[
// //               styles.statIcon,
// //               {
// //                 backgroundColor:
// //                   COLORS.greenLight,
// //               },
// //             ]}
// //           >
// //             <Ionicons
// //               name="flame-outline"
// //               size={18}
// //               color={COLORS.green}
// //             />
// //           </View>

// //           <View>
// //             <Text style={styles.statValue}>
// //               {streak}
// //             </Text>

// //             <Text style={styles.statLabel}>
// //               Streak
// //             </Text>
// //           </View>
// //         </View>
// //       </View>
// //     </Animated.View>
// //   );

// //   /* =======================================================
// //      FEATURED
// //   ======================================================= */

// //   const featured = (
// //     <>
// //       <View style={styles.sectionHeader}>
// //         <Text
// //           style={[
// //             styles.sectionTitle,
// //             wide && {
// //               fontSize: 22,
// //             },
// //           ]}
// //         >
// //           Featured Game
// //         </Text>

// //         <Text style={styles.sectionLink}>
// //           PLAY NOW
// //         </Text>
// //       </View>

// //       <Animated.View
// //         style={{
// //           opacity: featuredOpacity,
// //           transform: [
// //             {
// //               scale: featuredScale,
// //             },
// //           ],
// //         }}
// //       >
// //         <TouchableOpacity
// //           activeOpacity={0.88}
// //           onPress={() =>
// //             onSelectGame(
// //               "code-breaker"
// //             )
// //           }
// //           style={[
// //             styles.featuredCard,
// //             wide &&
// //               styles.featuredCardWide,
// //           ]}
// //         >
// //           <Animated.View
// //             style={[
// //               styles.featuredCircleOne,
// //               {
// //                 transform: [
// //                   {
// //                     translateY:
// //                       floatingOne,
// //                   },
// //                 ],
// //               },
// //             ]}
// //           />

// //           <Animated.View
// //             style={[
// //               styles.featuredCircleTwo,
// //               {
// //                 transform: [
// //                   {
// //                     translateY:
// //                       floatingTwo,
// //                   },
// //                 ],
// //               },
// //             ]}
// //           />

// //           <Animated.View
// //             style={[
// //               styles.featuredCircleThree,
// //               {
// //                 transform: [
// //                   {
// //                     translateY:
// //                       floatingThree,
// //                   },
// //                 ],
// //               },
// //             ]}
// //           />

// //           <View style={styles.featuredTop}>
// //             <View
// //               style={[
// //                 styles.featuredIcon,
// //                 wide && {
// //                   width: 68,
// //                   height: 68,
// //                   borderRadius: 20,
// //                 },
// //               ]}
// //             >
// //               <Ionicons
// //                 name="lock-closed"
// //                 size={
// //                   wide ? 35 : 29
// //                 }
// //                 color={COLORS.white}
// //               />
// //             </View>

// //             {!wide && (
// //               <View
// //                 style={styles.featuredBadge}
// //               >
// //                 <View
// //                   style={styles.liveDot}
// //                 />

// //                 <Text
// //                   style={
// //                     styles.featuredBadgeText
// //                   }
// //                 >
// //                   AVAILABLE
// //                 </Text>
// //               </View>
// //             )}
// //           </View>

// //           <View
// //             style={
// //               wide
// //                 ? {
// //                     flex: 1,
// //                   }
// //                 : undefined
// //             }
// //           >
// //             {wide && (
// //               <View
// //                 style={[
// //                   styles.featuredBadge,
// //                   {
// //                     alignSelf:
// //                       "flex-start",
// //                     marginBottom: 10,
// //                   },
// //                 ]}
// //               >
// //                 <View
// //                   style={styles.liveDot}
// //                 />

// //                 <Text
// //                   style={
// //                     styles.featuredBadgeText
// //                   }
// //                 >
// //                   AVAILABLE
// //                 </Text>
// //               </View>
// //             )}

// //             <Text
// //               style={[
// //                 styles.featuredTitle,
// //                 wide && {
// //                   fontSize: 29,
// //                   marginTop: 0,
// //                 },
// //               ]}
// //             >
// //               CODE BREAKER
// //             </Text>

// //             <Text
// //               style={[
// //                 styles.featuredSubtitle,
// //                 wide && {
// //                   fontSize: 15,
// //                 },
// //               ]}
// //             >
// //               Crack the secret code
// //             </Text>

// //             <Text
// //               style={[
// //                 styles.featuredDescription,
// //                 wide && {
// //                   fontSize: 13,
// //                   lineHeight: 20,
// //                 },
// //               ]}
// //             >
// //               Find the hidden number
// //               using clues, position
// //               and logic.
// //             </Text>

// //             <View
// //               style={[
// //                 styles.featuredBottom,
// //                 wide && {
// //                   marginTop: 12,
// //                 },
// //               ]}
// //             >
// //               <View
// //                 style={styles.featuredInfo}
// //               >
// //                 <Ionicons
// //                   name="flash-outline"
// //                   size={15}
// //                   color="#AAB3DF"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.featuredInfoText
// //                   }
// //                 >
// //                   Easy
// //                 </Text>
// //               </View>

// //               <View
// //                 style={styles.featuredInfo}
// //               >
// //                 <Ionicons
// //                   name="person-outline"
// //                   size={15}
// //                   color="#AAB3DF"
// //                 />

// //                 <Text
// //                   style={
// //                     styles.featuredInfoText
// //                   }
// //                 >
// //                   Single Player
// //                 </Text>
// //               </View>

// //               {!wide && (
// //                 <View
// //                   style={styles.playButton}
// //                 >
// //                   <Text
// //                     style={
// //                       styles.playButtonText
// //                     }
// //                   >
// //                     PLAY
// //                   </Text>

// //                   <Ionicons
// //                     name="play"
// //                     size={13}
// //                     color={
// //                       COLORS.navy
// //                     }
// //                   />
// //                 </View>
// //               )}
// //             </View>
// //           </View>

// //           {wide && (
// //             <View
// //               style={[
// //                 styles.playButton,
// //                 styles.playButtonWide,
// //               ]}
// //             >
// //               <Text
// //                 style={[
// //                   styles.playButtonText,
// //                   {
// //                     fontSize: 14,
// //                   },
// //                 ]}
// //               >
// //                 PLAY
// //               </Text>

// //               <Ionicons
// //                 name="play"
// //                 size={16}
// //                 color={COLORS.navy}
// //               />
// //             </View>
// //           )}
// //         </TouchableOpacity>
// //       </Animated.View>
// //     </>
// //   );

// //   /* =======================================================
// //      ALL GAMES
// //   ======================================================= */

// //   const allGames = (
// //     <>
// //       <View
// //         style={styles.sectionHeader}
// //         onLayout={(event) => {
// //           gamesY.current =
// //             event.nativeEvent.layout.y;
// //         }}
// //       >
// //         <Text
// //           style={[
// //             styles.sectionTitle,
// //             wide && {
// //               fontSize: 22,
// //             },
// //           ]}
// //         >
// //           All Games
// //         </Text>

// //         <Text style={styles.gameCount}>
// //           {GAMES.length} GAMES
// //         </Text>
// //       </View>

// //       <View
// //         style={[
// //           styles.gameList,
// //           wide &&
// //             styles.gameListWide,
// //         ]}
// //       >
// //         {GAMES.map(renderGameCard)}
// //       </View>
// //     </>
// //   );

// //   /* =======================================================
// //      FOOTER
// //   ======================================================= */

// //   const footerCard = (
// //     <View style={styles.footerCard}>
// //       <Animated.View
// //         style={{
// //           transform: [
// //             {
// //               rotate: floatingThree.interpolate(
// //                 {
// //                   inputRange: [-9, 0],
// //                   outputRange: [
// //                     "-8deg",
// //                     "8deg",
// //                   ],
// //                 }
// //               ),
// //             },
// //           ],
// //         }}
// //       >
// //         <View style={styles.footerIcon}>
// //           <MaterialCommunityIcons
// //             name="brain"
// //             size={22}
// //             color={COLORS.pink}
// //           />
// //         </View>
// //       </Animated.View>

// //       <View style={styles.footerText}>
// //         <Text style={styles.footerTitle}>
// //           Train your mind
// //         </Text>

// //         <Text style={styles.footerSubtitle}>
// //           New challenges will be added
// //           regularly.
// //         </Text>
// //       </View>
// //     </View>
// //   );

// //   /* =======================================================
// //      PROGRESS
// //   ======================================================= */

// //   const progressCard = (
// //     <View style={styles.progressCard}>
// //       <Text style={styles.progressTitle}>
// //         Your Progress
// //       </Text>

// //       <View style={styles.progressRow}>
// //         <View style={styles.progressIcon}>
// //           <Ionicons
// //             name="game-controller-outline"
// //             size={20}
// //             color={COLORS.purple}
// //           />
// //         </View>

// //         <Text style={styles.progressLabel}>
// //           Games
// //         </Text>

// //         <Text style={styles.progressValue}>
// //           {readyCount}
// //         </Text>
// //       </View>

// //       <View
// //         style={[
// //           styles.progressRow,
// //           styles.progressDivider,
// //         ]}
// //       >
// //         <View
// //           style={[
// //             styles.progressIcon,
// //             {
// //               backgroundColor:
// //                 "#FFF0C9",
// //             },
// //           ]}
// //         >
// //           <Ionicons
// //             name="trophy-outline"
// //             size={20}
// //             color={COLORS.yellowDark}
// //           />
// //         </View>

// //         <Text style={styles.progressLabel}>
// //           Best Score
// //         </Text>

// //         <Text style={styles.progressValue}>
// //           {bestScore}
// //         </Text>
// //       </View>

// //       <View
// //         style={[
// //           styles.progressRow,
// //           styles.progressDivider,
// //         ]}
// //       >
// //         <View
// //           style={[
// //             styles.progressIcon,
// //             {
// //               backgroundColor:
// //                 COLORS.greenLight,
// //             },
// //           ]}
// //         >
// //           <Ionicons
// //             name="flame-outline"
// //             size={20}
// //             color={COLORS.green}
// //           />
// //         </View>

// //         <Text style={styles.progressLabel}>
// //           Streak
// //         </Text>

// //         <Text style={styles.progressValue}>
// //           {streak}
// //         </Text>
// //       </View>

// //       <TouchableOpacity
// //         style={styles.progressBtn}
// //         onPress={onOpenProfile}
// //         activeOpacity={0.85}
// //       >
// //         <Ionicons
// //           name="person-outline"
// //           size={17}
// //           color={COLORS.white}
// //         />

// //         <Text
// //           style={styles.progressBtnText}
// //         >
// //           View Profile
// //         </Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   /* =======================================================
// //      MAIN
// //   ======================================================= */

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       <StatusBar
// //         barStyle="dark-content"
// //         backgroundColor={COLORS.creamLight}
// //       />

// //       {/* HEADER */}

// //       <View style={styles.headerWrap}>
// //         <View
// //           style={[
// //             styles.header,
// //             {
// //               maxWidth:
// //                 maxContent,
// //             },
// //           ]}
// //         >
// //           <View style={styles.brandRow}>
// //             <Animated.View
// //               style={{
// //                 transform: [
// //                   {
// //                     scale: logoScale,
// //                   },
// //                 ],
// //               }}
// //             >
// //               <View
// //                 style={styles.logoAnimated}
// //               >
// //                 <MaterialCommunityIcons
// //                   name="brain"
// //                   size={26}
// //                   color={COLORS.white}
// //                 />
// //               </View>
// //             </Animated.View>

// //             <View>
// //               <Text
// //                 style={styles.brand}
// //               >
// //                 MIND{" "}
// //                 <Text
// //                   style={
// //                     styles.brandAccent
// //                   }
// //                 >
// //                   GAMES
// //                 </Text>
// //               </Text>

// //               <Text
// //                 style={styles.brandSub}
// //               >
// //                 THINK • SOLVE • PLAY
// //               </Text>
// //             </View>
// //           </View>

// //           {/* DESKTOP NAV */}

// //           {wide && (
// //             <View
// //               style={styles.navLinks}
// //             >
// //               <TouchableOpacity
// //                 style={[
// //                   styles.navLink,
// //                   activeTab ===
// //                     "home" &&
// //                     styles.navLinkActive,
// //                 ]}
// //                 onPress={goHome}
// //               >
// //                 <Ionicons
// //                   name={
// //                     activeTab ===
// //                     "home"
// //                       ? "home"
// //                       : "home-outline"
// //                   }
// //                   size={20}
// //                   color={
// //                     activeTab ===
// //                     "home"
// //                       ? COLORS.navy
// //                       : COLORS.textLight
// //                   }
// //                 />

// //                 <Text
// //                   style={[
// //                     styles.navLinkText,
// //                     activeTab ===
// //                       "home" &&
// //                       styles.navLinkTextActive,
// //                   ]}
// //                 >
// //                   Home
// //                 </Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={[
// //                   styles.navLink,
// //                   activeTab ===
// //                     "games" &&
// //                     styles.navLinkActive,
// //                 ]}
// //                 onPress={goGames}
// //               >
// //                 <Ionicons
// //                   name={
// //                     activeTab ===
// //                     "games"
// //                       ? "game-controller"
// //                       : "game-controller-outline"
// //                   }
// //                   size={20}
// //                   color={
// //                     activeTab ===
// //                     "games"
// //                       ? COLORS.navy
// //                       : COLORS.textLight
// //                   }
// //                 />

// //                 <Text
// //                   style={[
// //                     styles.navLinkText,
// //                     activeTab ===
// //                       "games" &&
// //                       styles.navLinkTextActive,
// //                   ]}
// //                 >
// //                   Games
// //                 </Text>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={styles.navLink}
// //                 onPress={onOpenProfile}
// //               >
// //                 <Ionicons
// //                   name="person-outline"
// //                   size={20}
// //                   color={
// //                     COLORS.textLight
// //                   }
// //                 />

// //                 <Text
// //                   style={
// //                     styles.navLinkText
// //                   }
// //                 >
// //                   Profile
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}

// //           {/* PROFILE */}

// //           <TouchableOpacity
// //             style={
// //               styles.profileButton
// //             }
// //             onPress={
// //               onOpenProfile
// //             }
// //           >
// //             <Ionicons
// //               name="person-outline"
// //               size={19}
// //               color={COLORS.navy}
// //             />
// //           </TouchableOpacity>
// //         </View>
// //       </View>

// //       {/* CONTENT */}

// //       <ScrollView
// //         ref={scrollRef}
// //         style={styles.scroll}
// //         showsVerticalScrollIndicator={
// //           false
// //         }
// //         contentContainerStyle={
// //           styles.scrollContent
// //         }
// //       >
// //         <View
// //           style={[
// //             styles.content,
// //             {
// //               maxWidth:
// //                 maxContent,
// //               paddingHorizontal:
// //                 wide ? 24 : 18,
// //               paddingTop:
// //                 wide ? 20 : 0,
// //             },
// //           ]}
// //         >
// //           {wide ? (
// //             <View
// //               style={styles.wideRow}
// //             >
// //               <View
// //                 style={{
// //                   flex: 1,
// //                   minWidth: 0,
// //                 }}
// //               >
// //                 {welcome}
// //                 {statsRow}
// //                 {featured}
// //                 {allGames}
// //               </View>

// //               <View
// //                 style={styles.sidebar}
// //               >
// //                 {progressCard}
// //                 {footerCard}
// //               </View>
// //             </View>
// //           ) : (
// //             <>
// //               {welcome}
// //               {statsRow}
// //               {featured}
// //               {allGames}
// //               {footerCard}
// //             </>
// //           )}

// //           <View
// //             style={{
// //               height: 25,
// //             }}
// //           />
// //         </View>
// //       </ScrollView>

// //       {/* MOBILE NAV */}

// //       {!wide && (
// //         <View
// //           style={
// //             styles.bottomNavWrap
// //           }
// //         >
// //           <View
// //             style={[
// //               styles.bottomNav,
// //               {
// //                 maxWidth:
// //                   maxContent,
// //               },
// //             ]}
// //           >
// //             <TouchableOpacity
// //               style={styles.navItem}
// //               onPress={goHome}
// //             >
// //               <Ionicons
// //                 name={
// //                   activeTab ===
// //                   "home"
// //                     ? "home"
// //                     : "home-outline"
// //                 }
// //                 size={22}
// //                 color={
// //                   activeTab ===
// //                   "home"
// //                     ? COLORS.blueDark
// //                     : "#85899D"
// //                 }
// //               />

// //               <Text
// //                 style={[
// //                   styles.navText,
// //                   activeTab ===
// //                     "home" &&
// //                     styles.navTextActive,
// //                 ]}
// //               >
// //                 Home
// //               </Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity
// //               style={styles.navItem}
// //               onPress={goGames}
// //             >
// //               <Ionicons
// //                 name={
// //                   activeTab ===
// //                   "games"
// //                     ? "game-controller"
// //                     : "game-controller-outline"
// //                 }
// //                 size={22}
// //                 color={
// //                   activeTab ===
// //                   "games"
// //                     ? COLORS.blueDark
// //                     : "#85899D"
// //                 }
// //               />

// //               <Text
// //                 style={[
// //                   styles.navText,
// //                   activeTab ===
// //                     "games" &&
// //                     styles.navTextActive,
// //                 ]}
// //               >
// //                 Games
// //               </Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity
// //               style={styles.navItem}
// //               onPress={
// //                 onOpenProfile
// //               }
// //             >
// //               <Ionicons
// //                 name="person-outline"
// //                 size={22}
// //                 color="#85899D"
// //               />

// //               <Text
// //                 style={styles.navText}
// //               >
// //                 Profile
// //               </Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       )}
// //     </SafeAreaView>
// //   );
// // }
// import React, { useEffect, useRef, useState } from "react";

// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   useWindowDimensions,
//   Animated,
//   Easing,
// } from "react-native";

// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// /* =========================================================
//    TYPES
// ========================================================= */

// type GameId =
//   | "word-cipher"
//   | "code-breaker"
//   | "memory-grid"
//   | "pattern-hacker"
//   | "word-scramble";

// type GameItem = {
//   id: GameId;
//   title: string;
//   subtitle: string;
//   description: string;
//   icon: React.ReactNode;
//   iconBg: string;
//   accent: string;
//   ready: boolean;
//   difficulty: string;
//   players: string;
// };

// type Props = {
//   onSelectGame: (id: GameId) => void;
//   onOpenProfile?: () => void;
//   bestScore?: number;
//   streak?: number;
// };

// const WIDE_BREAKPOINT = 900;

// /* =========================================================
//    THEME
// ========================================================= */

// const COLORS = {
//   cream: "#FFF8E8",
//   creamLight: "#FFFDF6",
//   creamDark: "#F8EBCB",

//   navy: "#202A63",
//   navyLight: "#33418A",

//   yellow: "#FFBF24",
//   yellowDark: "#F3A900",

//   blue: "#48B8F5",
//   blueDark: "#2299DE",

//   pink: "#F58BB8",
//   pinkLight: "#FFE1ED",

//   green: "#36C99B",
//   greenLight: "#DDF8ED",

//   orange: "#FF8E2B",

//   purple: "#7167E8",
//   purpleLight: "#EAE8FF",

//   text: "#202A63",
//   textLight: "#717897",
//   muted: "#A0A4B9",

//   white: "#FFFFFF",
// };

// /* =========================================================
//    STYLES
//    IMPORTANT:
//    Styles are declared BEFORE GAMES.
//    This prevents:
//    "Block-scoped variable styles used before declaration"
// ========================================================= */

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: COLORS.cream,
//   },

//   scroll: {
//     flex: 1,
//     backgroundColor: COLORS.cream,
//   },

//   scrollContent: {
//     alignItems: "center",
//     paddingBottom: 30,
//   },

//   content: {
//     width: "100%",
//   },

//   /* =======================================================
//      DECORATIONS
//   ======================================================= */

//   floatingCircle: {
//     position: "absolute",
//     borderRadius: 999,
//     opacity: 0.55,
//   },

//   floatingPuzzle: {
//     position: "absolute",
//     opacity: 0.85,
//   },

//   star: {
//     position: "absolute",
//   },

//   /* =======================================================
//      HEADER
//   ======================================================= */

//   headerWrap: {
//     width: "100%",
//     backgroundColor: COLORS.creamLight,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F1E6C9",
//     zIndex: 10,
//   },

//   header: {
//     width: "100%",
//     alignSelf: "center",
//     minHeight: 76,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   brandRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   logoAnimated: {
//     width: 48,
//     height: 48,
//     borderRadius: 17,
//     backgroundColor: COLORS.yellow,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 11,

//     shadowColor: COLORS.yellowDark,
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },
//     shadowOpacity: 0.28,
//     shadowRadius: 8,
//     elevation: 6,
//   },

//   brand: {
//     color: COLORS.navy,
//     fontSize: 19,
//     fontWeight: "900",
//     letterSpacing: 0.3,
//   },

//   brandAccent: {
//     color: COLORS.blueDark,
//   },

//   brandSub: {
//     marginTop: 2,
//     color: COLORS.pink,
//     fontSize: 8,
//     letterSpacing: 1.7,
//     fontWeight: "900",
//   },

//   profileButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: "#E9DFC6",
//     alignItems: "center",
//     justifyContent: "center",

//     shadowColor: COLORS.navy,
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.08,
//     shadowRadius: 7,
//     elevation: 3,
//   },

//   navLinks: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 7,
//   },

//   navLink: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 7,
//     paddingVertical: 10,
//     paddingHorizontal: 17,
//     borderRadius: 14,
//   },

//   navLinkActive: {
//     backgroundColor: COLORS.yellow,
//   },

//   navLinkText: {
//     color: COLORS.textLight,
//     fontSize: 14,
//     fontWeight: "700",
//   },

//   navLinkTextActive: {
//     color: COLORS.navy,
//     fontWeight: "900",
//   },

//   /* =======================================================
//      HERO
//   ======================================================= */

//   hero: {
//     position: "relative",
//     overflow: "hidden",
//     backgroundColor: COLORS.cream,
//     paddingTop: 28,
//     paddingBottom: 28,
//   },

//   heroBadge: {
//     alignSelf: "flex-start",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: COLORS.pink,
//     paddingHorizontal: 13,
//     paddingVertical: 7,
//     borderRadius: 22,

//     shadowColor: COLORS.pink,
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 8,
//     elevation: 4,
//   },

//   heroBadgeText: {
//     color: COLORS.white,
//     fontSize: 9,
//     fontWeight: "900",
//     letterSpacing: 0.8,
//   },

//   heroTitle: {
//     color: COLORS.navy,
//     fontSize: 29,
//     lineHeight: 35,
//     fontWeight: "900",
//     marginTop: 13,
//     letterSpacing: -0.5,
//   },

//   heroTitleAccent: {
//     color: COLORS.blueDark,
//   },

//   heroDescription: {
//     color: COLORS.textLight,
//     fontSize: 13,
//     lineHeight: 20,
//     marginTop: 7,
//     maxWidth: 550,
//   },

//   heroUnderline: {
//     width: 82,
//     height: 5,
//     borderRadius: 4,
//     backgroundColor: COLORS.yellow,
//     marginTop: 13,
//   },

//   /* =======================================================
//      SECTION
//   ======================================================= */

//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },

//   sectionTitle: {
//     color: COLORS.navy,
//     fontSize: 18,
//     fontWeight: "900",
//   },

//   gameCount: {
//     color: COLORS.muted,
//     fontSize: 9,
//     fontWeight: "800",
//     letterSpacing: 1,
//   },

//   /* =======================================================
//      GAMES
//   ======================================================= */

//   gameList: {
//     gap: 11,
//   },

//   gameListWide: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 15,
//   },

//   gameCard: {
//     minHeight: 110,
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: "#EEE6D4",
//     borderRadius: 18,
//     padding: 14,
//     flexDirection: "row",
//     alignItems: "center",

//     shadowColor: COLORS.navy,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.06,
//     shadowRadius: 9,
//     elevation: 2,
//   },

//   gameCardWide: {
//     flexGrow: 1,
//     flexBasis: "46%",
//     minHeight: 126,
//     padding: 18,
//     borderRadius: 20,
//   },

//   lockedCard: {
//     opacity: 0.63,
//   },

//   gameIcon: {
//     width: 51,
//     height: 51,
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },

//   gameContent: {
//     flex: 1,
//   },

//   gameTitleRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   gameTitle: {
//     color: COLORS.navy,
//     fontSize: 15,
//     fontWeight: "900",
//   },

//   statusDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 5,
//     marginLeft: 7,
//   },

//   comingSoonBadge: {
//     marginLeft: 7,
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 6,
//     backgroundColor: "#F2EFE5",
//   },

//   comingSoonText: {
//     color: COLORS.muted,
//     fontSize: 7,
//     fontWeight: "900",
//     letterSpacing: 0.5,
//   },

//   gameSubtitle: {
//     color: COLORS.textLight,
//     fontSize: 11,
//     marginTop: 3,
//     fontWeight: "600",
//   },

//   gameDescription: {
//     color: "#9A9FB1",
//     fontSize: 9.5,
//     lineHeight: 14,
//     marginTop: 5,
//   },

//   metaRow: {
//     flexDirection: "row",
//     marginTop: 7,
//     gap: 13,
//   },

//   metaItem: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   metaText: {
//     color: "#8E94A7",
//     fontSize: 9,
//     marginLeft: 4,
//   },

//   arrowButton: {
//     width: 33,
//     height: 33,
//     borderRadius: 11,
//     backgroundColor: COLORS.cream,
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 8,
//   },

//   /* =======================================================
//      PROGRESS (wide screen sidebar)
//   ======================================================= */

//   progressCard: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: "#EEE5D2",
//     borderRadius: 21,
//     padding: 18,

//     shadowColor: COLORS.navy,
//     shadowOffset: {
//       width: 0,
//       height: 6,
//     },
//     shadowOpacity: 0.07,
//     shadowRadius: 12,
//     elevation: 3,
//   },

//   progressTitle: {
//     color: COLORS.navy,
//     fontSize: 17,
//     fontWeight: "900",
//     marginBottom: 8,
//   },

//   progressRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//   },

//   progressDivider: {
//     borderTopWidth: 1,
//     borderTopColor: "#F0E9D9",
//   },

//   progressIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: COLORS.purpleLight,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },

//   progressLabel: {
//     flex: 1,
//     color: COLORS.textLight,
//     fontSize: 14,
//     fontWeight: "600",
//   },

//   progressValue: {
//     color: COLORS.navy,
//     fontSize: 20,
//     fontWeight: "900",
//   },

//   progressBtn: {
//     marginTop: 8,
//     height: 45,
//     borderRadius: 14,
//     backgroundColor: COLORS.blue,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,

//     shadowColor: COLORS.blue,
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 8,
//     elevation: 4,
//   },

//   progressBtnText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontWeight: "900",
//   },

//   /* =======================================================
//      FOOTER
//   ======================================================= */

//   footerCard: {
//     marginTop: 18,
//     borderRadius: 17,
//     padding: 14,
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: "#EEE5D2",
//     flexDirection: "row",
//     alignItems: "center",

//     shadowColor: COLORS.navy,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },

//   footerIcon: {
//     width: 43,
//     height: 43,
//     borderRadius: 13,
//     backgroundColor: COLORS.pinkLight,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 11,
//   },

//   footerText: {
//     flex: 1,
//   },

//   footerTitle: {
//     color: COLORS.navy,
//     fontSize: 12,
//     fontWeight: "900",
//   },

//   footerSubtitle: {
//     color: COLORS.muted,
//     fontSize: 9.5,
//     marginTop: 3,
//   },

//   /* =======================================================
//      SIDEBAR
//   ======================================================= */

//   wideRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 28,
//   },

//   sidebar: {
//     width: 300,
//     gap: 16,
//   },

//   /* =======================================================
//      BOTTOM NAV
//   ======================================================= */

//   bottomNavWrap: {
//     width: "100%",
//     borderTopWidth: 1,
//     borderTopColor: "#EDE4D2",
//     backgroundColor: COLORS.creamLight,
//   },

//   bottomNav: {
//     width: "100%",
//     alignSelf: "center",
//     height: 72,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 35,
//   },

//   navItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   navText: {
//     color: "#85899D",
//     fontSize: 10,
//     fontWeight: "700",
//     marginTop: 4,
//   },

//   navTextActive: {
//     color: COLORS.blueDark,
//     fontWeight: "900",
//   },
// });

// /* =========================================================
//    GAMES
//    IMPORTANT:
//    styles is already declared above.
// ========================================================= */

// const GAMES: GameItem[] = [
//   {
//     id: "code-breaker",
//     title: "Code Breaker",
//     subtitle: "Crack the secret code",
//     description: "Use clues and logic to find the hidden number.",
//     icon: <Ionicons name="lock-closed" size={25} color={COLORS.purple} />,
//     iconBg: COLORS.purpleLight,
//     accent: COLORS.purple,
//     ready: true,
//     difficulty: "Easy",
//     players: "1 Player",
//   },

//   {
//     id: "word-scramble",
//     title: "Word Scramble",
//     subtitle: "Unscramble the words",
//     description: "Challenge your friends and solve words quickly.",
//     icon: (
//       <MaterialCommunityIcons
//         name="shuffle-variant"
//         size={27}
//         color={COLORS.orange}
//       />
//     ),
//     iconBg: "#FFF0D8",
//     accent: COLORS.orange,
//     ready: true,
//     difficulty: "Medium",
//     players: "Multiplayer",
//   },

//   {
//     id: "memory-grid",
//     title: "Memory Grid",
//     subtitle: "Test your memory",
//     description: "Remember positions and recall them correctly.",
//     icon: <Ionicons name="grid" size={25} color={COLORS.green} />,
//     iconBg: COLORS.greenLight,
//     accent: COLORS.green,
//     ready: false,
//     difficulty: "Medium",
//     players: "1 Player",
//   },

//   {
//     id: "pattern-hacker",
//     title: "Pattern Hacker",
//     subtitle: "Find the missing pattern",
//     description: "Observe the sequence and solve the missing part.",
//     icon: (
//       <MaterialCommunityIcons
//         name="graph-outline"
//         size={26}
//         color={COLORS.blueDark}
//       />
//     ),
//     iconBg: "#DFF4FF",
//     accent: COLORS.blueDark,
//     ready: false,
//     difficulty: "Hard",
//     players: "1 Player",
//   },

//   {
//     id: "word-cipher",
//     title: "Word Cipher",
//     subtitle: "Decode the hidden word",
//     description: "Break the encrypted word using clever clues.",
//     icon: (
//       <Text
//         style={{
//           color: COLORS.white,
//           fontSize: 17,
//           fontWeight: "900",
//         }}
//       >
//         Aa
//       </Text>
//     ),
//     iconBg: COLORS.pink,
//     accent: COLORS.pink,
//     ready: false,
//     difficulty: "Hard",
//     players: "1 Player",
//   },
// ];

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function MenuScreen({
//   onSelectGame,
//   onOpenProfile,
//   bestScore = 0,
//   streak = 0,
// }: Props) {
//   const { width } = useWindowDimensions();

//   const wide = width >= WIDE_BREAKPOINT;
//   const maxContent = wide ? 1080 : 560;

//   const [activeTab, setActiveTab] = useState<"home" | "games">("home");

//   const scrollRef = useRef<ScrollView>(null);
//   const gamesY = useRef(0);

//   /* =======================================================
//      ANIMATION VALUES
//   ======================================================= */

//   const pageOpacity = useRef(new Animated.Value(0)).current;
//   const pageTranslate = useRef(new Animated.Value(30)).current;
//   const logoScale = useRef(new Animated.Value(1)).current;
//   const badgeScale = useRef(new Animated.Value(1)).current;

//   const floatingOne = useRef(new Animated.Value(0)).current;
//   const floatingTwo = useRef(new Animated.Value(0)).current;
//   const floatingThree = useRef(new Animated.Value(0)).current;

//   const readyCount = GAMES.filter((game) => game.ready).length;

//   /* =======================================================
//      START ANIMATIONS
//   ======================================================= */

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(pageOpacity, {
//         toValue: 1,
//         duration: 650,
//         easing: Easing.out(Easing.cubic),
//         useNativeDriver: true,
//       }),

//       Animated.spring(pageTranslate, {
//         toValue: 0,
//         friction: 7,
//         tension: 45,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     /* LOGO PULSE */

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(logoScale, {
//           toValue: 1.08,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),

//         Animated.timing(logoScale, {
//           toValue: 1,
//           duration: 1000,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     /* BADGE PULSE */

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(badgeScale, {
//           toValue: 1.05,
//           duration: 900,
//           useNativeDriver: true,
//         }),

//         Animated.timing(badgeScale, {
//           toValue: 1,
//           duration: 900,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     /* FLOATING DECORATION 1 */

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatingOne, {
//           toValue: -12,
//           duration: 1800,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),

//         Animated.timing(floatingOne, {
//           toValue: 0,
//           duration: 1800,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     /* FLOATING DECORATION 2 */

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatingTwo, {
//           toValue: 14,
//           duration: 2100,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),

//         Animated.timing(floatingTwo, {
//           toValue: 0,
//           duration: 2100,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     /* FLOATING DECORATION 3 */

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floatingThree, {
//           toValue: -9,
//           duration: 1600,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),

//         Animated.timing(floatingThree, {
//           toValue: 0,
//           duration: 1600,
//           easing: Easing.inOut(Easing.ease),
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /* =======================================================
//      NAVIGATION
//   ======================================================= */

//   const goHome = () => {
//     setActiveTab("home");

//     scrollRef.current?.scrollTo({
//       y: 0,
//       animated: true,
//     });
//   };

//   const goGames = () => {
//     setActiveTab("games");

//     scrollRef.current?.scrollTo({
//       y: Math.max(0, gamesY.current - 10),
//       animated: true,
//     });
//   };

//   const openGame = (game: GameItem) => {
//     if (game.ready) {
//       onSelectGame(game.id);
//     }
//   };

//   /* =======================================================
//      GAME CARD
//   ======================================================= */

//   const renderGameCard = (game: GameItem, index: number) => {
//     const cardOpacity = useRef(new Animated.Value(0)).current;

//     const cardTranslate = useRef(new Animated.Value(20)).current;

//     useEffect(() => {
//       Animated.parallel([
//         Animated.timing(cardOpacity, {
//           toValue: 1,
//           duration: 500,
//           delay: 250 + index * 100,
//           useNativeDriver: true,
//         }),

//         Animated.spring(cardTranslate, {
//           toValue: 0,
//           friction: 7,
//           tension: 50,
//           delay: 250 + index * 100,
//           useNativeDriver: true,
//         }),
//       ]).start();
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const scale = useRef(new Animated.Value(1)).current;

//     const pressIn = () => {
//       if (!game.ready) return;

//       Animated.spring(scale, {
//         toValue: 0.97,
//         useNativeDriver: true,
//       }).start();
//     };

//     const pressOut = () => {
//       Animated.spring(scale, {
//         toValue: 1,
//         friction: 5,
//         useNativeDriver: true,
//       }).start();
//     };

//     return (
//       <Animated.View
//         key={game.id}
//         style={{
//           opacity: cardOpacity,
//           transform: [{ translateY: cardTranslate }, { scale }],
//         }}
//       >
//         <TouchableOpacity
//           activeOpacity={1}
//           onPress={() => openGame(game)}
//           onPressIn={pressIn}
//           onPressOut={pressOut}
//           style={[
//             styles.gameCard,
//             wide && styles.gameCardWide,
//             !game.ready && styles.lockedCard,
//           ]}
//         >
//           <View style={[styles.gameIcon, { backgroundColor: game.iconBg }]}>
//             {game.icon}
//           </View>

//           <View style={styles.gameContent}>
//             <View style={styles.gameTitleRow}>
//               <Text style={[styles.gameTitle, wide && { fontSize: 17 }]}>
//                 {game.title}
//               </Text>

//               {game.ready ? (
//                 <View
//                   style={[styles.statusDot, { backgroundColor: game.accent }]}
//                 />
//               ) : (
//                 <View style={styles.comingSoonBadge}>
//                   <Text style={styles.comingSoonText}>SOON</Text>
//                 </View>
//               )}
//             </View>

//             <Text style={[styles.gameSubtitle, wide && { fontSize: 13 }]}>
//               {game.subtitle}
//             </Text>

//             <Text
//               style={[
//                 styles.gameDescription,
//                 wide && { fontSize: 12, lineHeight: 17 },
//               ]}
//               numberOfLines={2}
//             >
//               {game.description}
//             </Text>

//             <View style={styles.metaRow}>
//               <View style={styles.metaItem}>
//                 <Ionicons name="flash-outline" size={13} color={COLORS.muted} />

//                 <Text style={styles.metaText}>{game.difficulty}</Text>
//               </View>

//               <View style={styles.metaItem}>
//                 <Ionicons
//                   name={
//                     game.players === "Multiplayer"
//                       ? "people-outline"
//                       : "person-outline"
//                   }
//                   size={13}
//                   color={COLORS.muted}
//                 />

//                 <Text style={styles.metaText}>{game.players}</Text>
//               </View>
//             </View>
//           </View>

//           {game.ready ? (
//             <View style={styles.arrowButton}>
//               <Ionicons name="chevron-forward" size={18} color={COLORS.navy} />
//             </View>
//           ) : (
//             <Ionicons
//               name="lock-closed-outline"
//               size={17}
//               color={COLORS.muted}
//             />
//           )}
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   /* =======================================================
//      WELCOME
//   ======================================================= */

//   const welcome = (
//     <Animated.View
//       style={[
//         styles.hero,
//         {
//           opacity: pageOpacity,
//           transform: [{ translateY: pageTranslate }],
//         },
//       ]}
//     >
//       {/* FLOATING CIRCLES */}

//       <Animated.View
//         style={[
//           styles.floatingCircle,
//           {
//             width: 110,
//             height: 110,
//             backgroundColor: COLORS.yellow,
//             right: -50,
//             top: 8,
//             transform: [{ translateY: floatingOne }],
//           },
//         ]}
//       />

//       <Animated.View
//         style={[
//           styles.floatingCircle,
//           {
//             width: 75,
//             height: 75,
//             backgroundColor: COLORS.pink,
//             right: 80,
//             bottom: 10,
//             transform: [{ translateY: floatingTwo }],
//           },
//         ]}
//       />

//       <Animated.View
//         style={[
//           styles.floatingCircle,
//           {
//             width: 48,
//             height: 48,
//             backgroundColor: COLORS.blue,
//             left: -20,
//             top: 35,
//             transform: [{ translateY: floatingThree }],
//           },
//         ]}
//       />

//       {/* STARS */}

//       <Animated.Text
//         style={[
//           styles.star,
//           {
//             color: COLORS.yellowDark,
//             fontSize: 25,
//             right: 28,
//             top: 80,
//             transform: [
//               {
//                 rotate: floatingThree.interpolate({
//                   inputRange: [-9, 0],
//                   outputRange: ["-10deg", "10deg"],
//                 }),
//               },
//             ],
//           },
//         ]}
//       >
//         ✦
//       </Animated.Text>

//       <Animated.Text
//         style={[
//           styles.star,
//           {
//             color: COLORS.pink,
//             fontSize: 20,
//             right: 130,
//             top: 20,
//             transform: [{ translateY: floatingOne }],
//           },
//         ]}
//       >
//         ✦
//       </Animated.Text>

//       <Animated.View style={{ transform: [{ scale: badgeScale }] }}>
//         <View style={styles.heroBadge}>
//           <MaterialCommunityIcons name="brain" size={15} color={COLORS.white} />

//           <Text style={styles.heroBadgeText}>LET'S PLAY</Text>
//         </View>
//       </Animated.View>

//       <Text style={styles.heroTitle}>
//         Choose your <Text style={styles.heroTitleAccent}>challenge</Text>
//       </Text>

//       <Text style={styles.heroDescription}>
//         Train your memory, logic and problem-solving skills with fun
//         interactive games.
//       </Text>

//       <View style={styles.heroUnderline} />
//     </Animated.View>
//   );

//   /* =======================================================
//      ALL GAMES
//   ======================================================= */

//   const allGames = (
//     <>
//       <View
//         style={styles.sectionHeader}
//         onLayout={(event) => {
//           gamesY.current = event.nativeEvent.layout.y;
//         }}
//       >
//         <Text style={[styles.sectionTitle, wide && { fontSize: 22 }]}>
//           All Games
//         </Text>

//         <Text style={styles.gameCount}>{GAMES.length} GAMES</Text>
//       </View>

//       <View style={[styles.gameList, wide && styles.gameListWide]}>
//         {GAMES.map(renderGameCard)}
//       </View>
//     </>
//   );

//   /* =======================================================
//      FOOTER
//   ======================================================= */

//   const footerCard = (
//     <View style={styles.footerCard}>
//       <Animated.View
//         style={{
//           transform: [
//             {
//               rotate: floatingThree.interpolate({
//                 inputRange: [-9, 0],
//                 outputRange: ["-8deg", "8deg"],
//               }),
//             },
//           ],
//         }}
//       >
//         <View style={styles.footerIcon}>
//           <MaterialCommunityIcons name="brain" size={22} color={COLORS.pink} />
//         </View>
//       </Animated.View>

//       <View style={styles.footerText}>
//         <Text style={styles.footerTitle}>Train your mind</Text>

//         <Text style={styles.footerSubtitle}>
//           New challenges will be added regularly.
//         </Text>
//       </View>
//     </View>
//   );

//   /* =======================================================
//      PROGRESS (wide screen sidebar only)
//   ======================================================= */

//   const progressCard = (
//     <View style={styles.progressCard}>
//       <Text style={styles.progressTitle}>Your Progress</Text>

//       <View style={styles.progressRow}>
//         <View style={styles.progressIcon}>
//           <Ionicons
//             name="game-controller-outline"
//             size={20}
//             color={COLORS.purple}
//           />
//         </View>

//         <Text style={styles.progressLabel}>Games</Text>

//         <Text style={styles.progressValue}>{readyCount}</Text>
//       </View>

//       <View style={[styles.progressRow, styles.progressDivider]}>
//         <View style={[styles.progressIcon, { backgroundColor: "#FFF0C9" }]}>
//           <Ionicons
//             name="trophy-outline"
//             size={20}
//             color={COLORS.yellowDark}
//           />
//         </View>

//         <Text style={styles.progressLabel}>Best Score</Text>

//         <Text style={styles.progressValue}>{bestScore}</Text>
//       </View>

//       <View style={[styles.progressRow, styles.progressDivider]}>
//         <View
//           style={[styles.progressIcon, { backgroundColor: COLORS.greenLight }]}
//         >
//           <Ionicons name="flame-outline" size={20} color={COLORS.green} />
//         </View>

//         <Text style={styles.progressLabel}>Streak</Text>

//         <Text style={styles.progressValue}>{streak}</Text>
//       </View>

//       <TouchableOpacity
//         style={styles.progressBtn}
//         onPress={onOpenProfile}
//         activeOpacity={0.85}
//       >
//         <Ionicons name="person-outline" size={17} color={COLORS.white} />

//         <Text style={styles.progressBtnText}>View Profile</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   /* =======================================================
//      MAIN
//   ======================================================= */

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.creamLight} />

//       {/* HEADER */}

//       <View style={styles.headerWrap}>
//         <View style={[styles.header, { maxWidth: maxContent }]}>
//           <View style={styles.brandRow}>
//             <Animated.View style={{ transform: [{ scale: logoScale }] }}>
//               <View style={styles.logoAnimated}>
//                 <MaterialCommunityIcons
//                   name="brain"
//                   size={26}
//                   color={COLORS.white}
//                 />
//               </View>
//             </Animated.View>

//             <View>
//               <Text style={styles.brand}>
//                 MIND <Text style={styles.brandAccent}>GAMES</Text>
//               </Text>

//               <Text style={styles.brandSub}>THINK • SOLVE • PLAY</Text>
//             </View>
//           </View>

//           {/* DESKTOP NAV */}

//           {wide && (
//             <View style={styles.navLinks}>
//               <TouchableOpacity
//                 style={[
//                   styles.navLink,
//                   activeTab === "home" && styles.navLinkActive,
//                 ]}
//                 onPress={goHome}
//               >
//                 <Ionicons
//                   name={activeTab === "home" ? "home" : "home-outline"}
//                   size={20}
//                   color={
//                     activeTab === "home" ? COLORS.navy : COLORS.textLight
//                   }
//                 />

//                 <Text
//                   style={[
//                     styles.navLinkText,
//                     activeTab === "home" && styles.navLinkTextActive,
//                   ]}
//                 >
//                   Home
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.navLink,
//                   activeTab === "games" && styles.navLinkActive,
//                 ]}
//                 onPress={goGames}
//               >
//                 <Ionicons
//                   name={
//                     activeTab === "games"
//                       ? "game-controller"
//                       : "game-controller-outline"
//                   }
//                   size={20}
//                   color={
//                     activeTab === "games" ? COLORS.navy : COLORS.textLight
//                   }
//                 />

//                 <Text
//                   style={[
//                     styles.navLinkText,
//                     activeTab === "games" && styles.navLinkTextActive,
//                   ]}
//                 >
//                   Games
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.navLink} onPress={onOpenProfile}>
//                 <Ionicons
//                   name="person-outline"
//                   size={20}
//                   color={COLORS.textLight}
//                 />

//                 <Text style={styles.navLinkText}>Profile</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* PROFILE */}

//           <TouchableOpacity
//             style={styles.profileButton}
//             onPress={onOpenProfile}
//           >
//             <Ionicons name="person-outline" size={19} color={COLORS.navy} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* CONTENT */}

//       <ScrollView
//         ref={scrollRef}
//         style={styles.scroll}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View
//           style={[
//             styles.content,
//             {
//               maxWidth: maxContent,
//               paddingHorizontal: wide ? 24 : 18,
//               paddingTop: wide ? 20 : 0,
//             },
//           ]}
//         >
//           {wide ? (
//             <View style={styles.wideRow}>
//               <View style={{ flex: 1, minWidth: 0 }}>
//                 {welcome}
//                 {allGames}
//               </View>

//               <View style={styles.sidebar}>
//                 {progressCard}
//                 {footerCard}
//               </View>
//             </View>
//           ) : (
//             <>
//               {welcome}
//               {allGames}
//               {footerCard}
//             </>
//           )}

//           <View style={{ height: 25 }} />
//         </View>
//       </ScrollView>

//       {/* MOBILE NAV */}

//       {!wide && (
//         <View style={styles.bottomNavWrap}>
//           <View style={[styles.bottomNav, { maxWidth: maxContent }]}>
//             <TouchableOpacity style={styles.navItem} onPress={goHome}>
//               <Ionicons
//                 name={activeTab === "home" ? "home" : "home-outline"}
//                 size={22}
//                 color={activeTab === "home" ? COLORS.blueDark : "#85899D"}
//               />

//               <Text
//                 style={[
//                   styles.navText,
//                   activeTab === "home" && styles.navTextActive,
//                 ]}
//               >
//                 Home
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.navItem} onPress={goGames}>
//               <Ionicons
//                 name={
//                   activeTab === "games"
//                     ? "game-controller"
//                     : "game-controller-outline"
//                 }
//                 size={22}
//                 color={activeTab === "games" ? COLORS.blueDark : "#85899D"}
//               />

//               <Text
//                 style={[
//                   styles.navText,
//                   activeTab === "games" && styles.navTextActive,
//                 ]}
//               >
//                 Games
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.navItem} onPress={onOpenProfile}>
//               <Ionicons name="person-outline" size={22} color="#85899D" />

//               <Text style={styles.navText}>Profile</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }
import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

/* =========================================================
   TYPES
========================================================= */

type GameId =
  | "word-cipher"
  | "code-breaker"
  | "memory-grid"
  | "pattern-hacker"
  | "word-scramble"
  | "who-is-lying";

type GameItem = {
  id: GameId;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  accent: string;
  ready: boolean;
  difficulty: string;
  players: string;
};

type Props = {
  onSelectGame: (id: GameId) => void;
  onOpenProfile?: () => void;
  bestScore?: number;
  streak?: number;
};

const WIDE_BREAKPOINT = 900;

/* =========================================================
   THEME
========================================================= */

const COLORS = {
  cream: "#FFF8E8",
  creamLight: "#FFFDF6",
  creamDark: "#F8EBCB",

  navy: "#202A63",
  navyLight: "#33418A",

  yellow: "#FFBF24",
  yellowDark: "#F3A900",

  blue: "#48B8F5",
  blueDark: "#2299DE",

  pink: "#F58BB8",
  pinkLight: "#FFE1ED",

  green: "#36C99B",
  greenLight: "#DDF8ED",

  orange: "#FF8E2B",

  purple: "#7167E8",
  purpleLight: "#EAE8FF",

  text: "#202A63",
  textLight: "#717897",
  muted: "#A0A4B9",

  white: "#FFFFFF",
};

/* =========================================================
   STYLES
   IMPORTANT:
   Styles are declared BEFORE GAMES.
   This prevents:
   "Block-scoped variable styles used before declaration"
========================================================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  scroll: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  scrollContent: {
    alignItems: "center",
    paddingBottom: 30,
  },

  content: {
    width: "100%",
  },

  /* =======================================================
     DECORATIONS
  ======================================================= */

  floatingCircle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.55,
  },

  floatingPuzzle: {
    position: "absolute",
    opacity: 0.85,
  },

  star: {
    position: "absolute",
  },

  /* =======================================================
     HEADER
  ======================================================= */

  headerWrap: {
    width: "100%",
    backgroundColor: COLORS.creamLight,
    borderBottomWidth: 1,
    borderBottomColor: "#F1E6C9",
    zIndex: 10,
  },

  header: {
    width: "100%",
    alignSelf: "center",
    minHeight: 76,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoAnimated: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: COLORS.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,

    shadowColor: COLORS.yellowDark,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },

  brand: {
    color: COLORS.navy,
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  brandAccent: {
    color: COLORS.blueDark,
  },

  brandSub: {
    marginTop: 2,
    color: COLORS.pink,
    fontSize: 8,
    letterSpacing: 1.7,
    fontWeight: "900",
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#E9DFC6",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: COLORS.navy,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  },

  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  navLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: 14,
  },

  navLinkActive: {
    backgroundColor: COLORS.yellow,
  },

  navLinkText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: "700",
  },

  navLinkTextActive: {
    color: COLORS.navy,
    fontWeight: "900",
  },

  /* =======================================================
     HERO
  ======================================================= */

  hero: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.cream,
    paddingTop: 28,
    paddingBottom: 28,
  },

  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.pink,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 22,

    shadowColor: COLORS.pink,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },

  heroBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  heroTitle: {
    color: COLORS.navy,
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "900",
    marginTop: 13,
    letterSpacing: -0.5,
  },

  heroTitleAccent: {
    color: COLORS.blueDark,
  },

  heroDescription: {
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 550,
  },

  heroUnderline: {
    width: 82,
    height: 5,
    borderRadius: 4,
    backgroundColor: COLORS.yellow,
    marginTop: 13,
  },

  /* =======================================================
     SECTION
  ======================================================= */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: "900",
  },

  gameCount: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  /* =======================================================
     GAMES
  ======================================================= */

  gameList: {
    gap: 11,
  },

  gameListWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },

  gameCard: {
    minHeight: 110,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#EEE6D4",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: COLORS.navy,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },

  gameCardWide: {
    flexGrow: 1,
    flexBasis: "46%",
    minHeight: 126,
    padding: 18,
    borderRadius: 20,
  },

  lockedCard: {
    opacity: 0.63,
  },

  gameIcon: {
    width: 51,
    height: 51,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  gameContent: {
    flex: 1,
  },

  gameTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  gameTitle: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: "900",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginLeft: 7,
  },

  comingSoonBadge: {
    marginLeft: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#F2EFE5",
  },

  comingSoonText: {
    color: COLORS.muted,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  gameSubtitle: {
    color: COLORS.textLight,
    fontSize: 11,
    marginTop: 3,
    fontWeight: "600",
  },

  gameDescription: {
    color: "#9A9FB1",
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 5,
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 7,
    gap: 13,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaText: {
    color: "#8E94A7",
    fontSize: 9,
    marginLeft: 4,
  },

  arrowButton: {
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  /* =======================================================
     PROGRESS (wide screen sidebar)
  ======================================================= */

  progressCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#EEE5D2",
    borderRadius: 21,
    padding: 18,

    shadowColor: COLORS.navy,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },

  progressTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  progressDivider: {
    borderTopWidth: 1,
    borderTopColor: "#F0E9D9",
  },

  progressIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.purpleLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  progressLabel: {
    flex: 1,
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: "600",
  },

  progressValue: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: "900",
  },

  progressBtn: {
    marginTop: 8,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    shadowColor: COLORS.blue,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },

  progressBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  footerCard: {
    marginTop: 18,
    borderRadius: 17,
    padding: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#EEE5D2",
    flexDirection: "row",
    alignItems: "center",

    shadowColor: COLORS.navy,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  footerIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: COLORS.pinkLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  footerText: {
    flex: 1,
  },

  footerTitle: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "900",
  },

  footerSubtitle: {
    color: COLORS.muted,
    fontSize: 9.5,
    marginTop: 3,
  },

  /* =======================================================
     SIDEBAR
  ======================================================= */

  wideRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 28,
  },

  sidebar: {
    width: 300,
    gap: 16,
  },

  /* =======================================================
     BOTTOM NAV
  ======================================================= */

  bottomNavWrap: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#EDE4D2",
    backgroundColor: COLORS.creamLight,
  },

  bottomNav: {
    width: "100%",
    alignSelf: "center",
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 35,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    color: "#85899D",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },

  navTextActive: {
    color: COLORS.blueDark,
    fontWeight: "900",
  },
});

/* =========================================================
   GAMES
   IMPORTANT:
   styles is already declared above.
========================================================= */

const GAMES: GameItem[] = [
  {
    id: "code-breaker",
    title: "Code Breaker",
    subtitle: "Crack the secret code",
    description: "Use clues and logic to find the hidden number.",
    icon: <Ionicons name="lock-closed" size={25} color={COLORS.purple} />,
    iconBg: COLORS.purpleLight,
    accent: COLORS.purple,
    ready: true,
    difficulty: "Easy",
    players: "1 Player",
  },

  {
    id: "word-scramble",
    title: "Word Scramble",
    subtitle: "Unscramble the words",
    description: "Challenge your friends and solve words quickly.",
    icon: (
      <MaterialCommunityIcons
        name="shuffle-variant"
        size={27}
        color={COLORS.orange}
      />
    ),
    iconBg: "#FFF0D8",
    accent: COLORS.orange,
    ready: true,
    difficulty: "Medium",
    players: "Multiplayer",
  },

  {
    id: "who-is-lying",
    title: "Who Is Lying?",
    subtitle: "Find the liar",
    description: "Check the clues and statements to catch the suspect who is lying.",
    icon: <Ionicons name="search" size={25} color={COLORS.pink} />,
    iconBg: COLORS.pinkLight,
    accent: COLORS.pink,
    ready: true,
    difficulty: "Medium",
    players: "1 Player",
  },

  {
    id: "memory-grid",
    title: "Memory Grid",
    subtitle: "Test your memory",
    description: "Remember positions and recall them correctly.",
    icon: <Ionicons name="grid" size={25} color={COLORS.green} />,
    iconBg: COLORS.greenLight,
    accent: COLORS.green,
    ready: false,
    difficulty: "Medium",
    players: "1 Player",
  },

  {
    id: "pattern-hacker",
    title: "Pattern Hacker",
    subtitle: "Find the missing pattern",
    description: "Observe the sequence and solve the missing part.",
    icon: (
      <MaterialCommunityIcons
        name="graph-outline"
        size={26}
        color={COLORS.blueDark}
      />
    ),
    iconBg: "#DFF4FF",
    accent: COLORS.blueDark,
    ready: false,
    difficulty: "Hard",
    players: "1 Player",
  },

  {
    id: "word-cipher",
    title: "Word Cipher",
    subtitle: "Decode the hidden word",
    description: "Break the encrypted word using clever clues.",
    icon: (
      <Text
        style={{
          color: COLORS.white,
          fontSize: 17,
          fontWeight: "900",
        }}
      >
        Aa
      </Text>
    ),
    iconBg: COLORS.pink,
    accent: COLORS.pink,
    ready: false,
    difficulty: "Hard",
    players: "1 Player",
  },
];

/* =========================================================
   SCREEN
========================================================= */

export default function MenuScreen({
  onSelectGame,
  onOpenProfile,
  bestScore = 0,
  streak = 0,
}: Props) {
  const { width } = useWindowDimensions();

  const wide = width >= WIDE_BREAKPOINT;
  const maxContent = wide ? 1080 : 560;

  const [activeTab, setActiveTab] = useState<"home" | "games">("home");

  const scrollRef = useRef<ScrollView>(null);
  const gamesY = useRef(0);

  /* =======================================================
     ANIMATION VALUES
  ======================================================= */

  const pageOpacity = useRef(new Animated.Value(0)).current;
  const pageTranslate = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;

  const floatingOne = useRef(new Animated.Value(0)).current;
  const floatingTwo = useRef(new Animated.Value(0)).current;
  const floatingThree = useRef(new Animated.Value(0)).current;

  const readyCount = GAMES.filter((game) => game.ready).length;

  /* =======================================================
     START ANIMATIONS
  ======================================================= */

  useEffect(() => {
    Animated.parallel([
      Animated.timing(pageOpacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(pageTranslate, {
        toValue: 0,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    /* LOGO PULSE */

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.08,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* BADGE PULSE */

    Animated.loop(
      Animated.sequence([
        Animated.timing(badgeScale, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),

        Animated.timing(badgeScale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* FLOATING DECORATION 1 */

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingOne, {
          toValue: -12,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(floatingOne, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* FLOATING DECORATION 2 */

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingTwo, {
          toValue: 14,
          duration: 2100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(floatingTwo, {
          toValue: 0,
          duration: 2100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    /* FLOATING DECORATION 3 */

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingThree, {
          toValue: -9,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(floatingThree, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goHome = () => {
    setActiveTab("home");

    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const goGames = () => {
    setActiveTab("games");

    scrollRef.current?.scrollTo({
      y: Math.max(0, gamesY.current - 10),
      animated: true,
    });
  };

  const openGame = (game: GameItem) => {
    if (game.ready) {
      onSelectGame(game.id);
    }
  };

  /* =======================================================
     GAME CARD
  ======================================================= */

  const renderGameCard = (game: GameItem, index: number) => {
    const cardOpacity = useRef(new Animated.Value(0)).current;

    const cardTranslate = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 500,
          delay: 250 + index * 100,
          useNativeDriver: true,
        }),

        Animated.spring(cardTranslate, {
          toValue: 0,
          friction: 7,
          tension: 50,
          delay: 250 + index * 100,
          useNativeDriver: true,
        }),
      ]).start();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () => {
      if (!game.ready) return;

      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const pressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        key={game.id}
        style={{
          opacity: cardOpacity,
          transform: [{ translateY: cardTranslate }, { scale }],
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => openGame(game)}
          onPressIn={pressIn}
          onPressOut={pressOut}
          style={[
            styles.gameCard,
            wide && styles.gameCardWide,
            !game.ready && styles.lockedCard,
          ]}
        >
          <View style={[styles.gameIcon, { backgroundColor: game.iconBg }]}>
            {game.icon}
          </View>

          <View style={styles.gameContent}>
            <View style={styles.gameTitleRow}>
              <Text style={[styles.gameTitle, wide && { fontSize: 17 }]}>
                {game.title}
              </Text>

              {game.ready ? (
                <View
                  style={[styles.statusDot, { backgroundColor: game.accent }]}
                />
              ) : (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>SOON</Text>
                </View>
              )}
            </View>

            <Text style={[styles.gameSubtitle, wide && { fontSize: 13 }]}>
              {game.subtitle}
            </Text>

            <Text
              style={[
                styles.gameDescription,
                wide && { fontSize: 12, lineHeight: 17 },
              ]}
              numberOfLines={2}
            >
              {game.description}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="flash-outline" size={13} color={COLORS.muted} />

                <Text style={styles.metaText}>{game.difficulty}</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons
                  name={
                    game.players === "Multiplayer"
                      ? "people-outline"
                      : "person-outline"
                  }
                  size={13}
                  color={COLORS.muted}
                />

                <Text style={styles.metaText}>{game.players}</Text>
              </View>
            </View>
          </View>

          {game.ready ? (
            <View style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={18} color={COLORS.navy} />
            </View>
          ) : (
            <Ionicons
              name="lock-closed-outline"
              size={17}
              color={COLORS.muted}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  /* =======================================================
     WELCOME
  ======================================================= */

  const welcome = (
    <Animated.View
      style={[
        styles.hero,
        {
          opacity: pageOpacity,
          transform: [{ translateY: pageTranslate }],
        },
      ]}
    >
      {/* FLOATING CIRCLES */}

      <Animated.View
        style={[
          styles.floatingCircle,
          {
            width: 110,
            height: 110,
            backgroundColor: COLORS.yellow,
            right: -50,
            top: 8,
            transform: [{ translateY: floatingOne }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.floatingCircle,
          {
            width: 75,
            height: 75,
            backgroundColor: COLORS.pink,
            right: 80,
            bottom: 10,
            transform: [{ translateY: floatingTwo }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.floatingCircle,
          {
            width: 48,
            height: 48,
            backgroundColor: COLORS.blue,
            left: -20,
            top: 35,
            transform: [{ translateY: floatingThree }],
          },
        ]}
      />

      {/* STARS */}

      <Animated.Text
        style={[
          styles.star,
          {
            color: COLORS.yellowDark,
            fontSize: 25,
            right: 28,
            top: 80,
            transform: [
              {
                rotate: floatingThree.interpolate({
                  inputRange: [-9, 0],
                  outputRange: ["-10deg", "10deg"],
                }),
              },
            ],
          },
        ]}
      >
        ✦
      </Animated.Text>

      <Animated.Text
        style={[
          styles.star,
          {
            color: COLORS.pink,
            fontSize: 20,
            right: 130,
            top: 20,
            transform: [{ translateY: floatingOne }],
          },
        ]}
      >
        ✦
      </Animated.Text>

      <Animated.View style={{ transform: [{ scale: badgeScale }] }}>
        <View style={styles.heroBadge}>
          <MaterialCommunityIcons name="brain" size={15} color={COLORS.white} />

          <Text style={styles.heroBadgeText}>LET'S PLAY</Text>
        </View>
      </Animated.View>

      <Text style={styles.heroTitle}>
        Choose your <Text style={styles.heroTitleAccent}>challenge</Text>
      </Text>

      <Text style={styles.heroDescription}>
        Train your memory, logic and problem-solving skills with fun
        interactive games.
      </Text>

      <View style={styles.heroUnderline} />
    </Animated.View>
  );

  /* =======================================================
     ALL GAMES
  ======================================================= */

  const allGames = (
    <>
      <View
        style={styles.sectionHeader}
        onLayout={(event) => {
          gamesY.current = event.nativeEvent.layout.y;
        }}
      >
        <Text style={[styles.sectionTitle, wide && { fontSize: 22 }]}>
          All Games
        </Text>

        <Text style={styles.gameCount}>{GAMES.length} GAMES</Text>
      </View>

      <View style={[styles.gameList, wide && styles.gameListWide]}>
        {GAMES.map(renderGameCard)}
      </View>
    </>
  );

  /* =======================================================
     FOOTER
  ======================================================= */

  const footerCard = (
    <View style={styles.footerCard}>
      <Animated.View
        style={{
          transform: [
            {
              rotate: floatingThree.interpolate({
                inputRange: [-9, 0],
                outputRange: ["-8deg", "8deg"],
              }),
            },
          ],
        }}
      >
        <View style={styles.footerIcon}>
          <MaterialCommunityIcons name="brain" size={22} color={COLORS.pink} />
        </View>
      </Animated.View>

      <View style={styles.footerText}>
        <Text style={styles.footerTitle}>Train your mind</Text>

        <Text style={styles.footerSubtitle}>
          New challenges will be added regularly.
        </Text>
      </View>
    </View>
  );

  /* =======================================================
     PROGRESS (wide screen sidebar only)
  ======================================================= */

  const progressCard = (
    <View style={styles.progressCard}>
      <Text style={styles.progressTitle}>Your Progress</Text>

      <View style={styles.progressRow}>
        <View style={styles.progressIcon}>
          <Ionicons
            name="game-controller-outline"
            size={20}
            color={COLORS.purple}
          />
        </View>

        <Text style={styles.progressLabel}>Games</Text>

        <Text style={styles.progressValue}>{readyCount}</Text>
      </View>

      <View style={[styles.progressRow, styles.progressDivider]}>
        <View style={[styles.progressIcon, { backgroundColor: "#FFF0C9" }]}>
          <Ionicons
            name="trophy-outline"
            size={20}
            color={COLORS.yellowDark}
          />
        </View>

        <Text style={styles.progressLabel}>Best Score</Text>

        <Text style={styles.progressValue}>{bestScore}</Text>
      </View>

      <View style={[styles.progressRow, styles.progressDivider]}>
        <View
          style={[styles.progressIcon, { backgroundColor: COLORS.greenLight }]}
        >
          <Ionicons name="flame-outline" size={20} color={COLORS.green} />
        </View>

        <Text style={styles.progressLabel}>Streak</Text>

        <Text style={styles.progressValue}>{streak}</Text>
      </View>

      <TouchableOpacity
        style={styles.progressBtn}
        onPress={onOpenProfile}
        activeOpacity={0.85}
      >
        <Ionicons name="person-outline" size={17} color={COLORS.white} />

        <Text style={styles.progressBtnText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.creamLight} />

      {/* HEADER */}

      <View style={styles.headerWrap}>
        <View style={[styles.header, { maxWidth: maxContent }]}>
          <View style={styles.brandRow}>
            <Animated.View style={{ transform: [{ scale: logoScale }] }}>
              <View style={styles.logoAnimated}>
                <MaterialCommunityIcons
                  name="brain"
                  size={26}
                  color={COLORS.white}
                />
              </View>
            </Animated.View>

            <View>
              <Text style={styles.brand}>
                MIND <Text style={styles.brandAccent}>GAMES</Text>
              </Text>

              <Text style={styles.brandSub}>THINK • SOLVE • PLAY</Text>
            </View>
          </View>

          {/* DESKTOP NAV */}

          {wide && (
            <View style={styles.navLinks}>
              <TouchableOpacity
                style={[
                  styles.navLink,
                  activeTab === "home" && styles.navLinkActive,
                ]}
                onPress={goHome}
              >
                <Ionicons
                  name={activeTab === "home" ? "home" : "home-outline"}
                  size={20}
                  color={
                    activeTab === "home" ? COLORS.navy : COLORS.textLight
                  }
                />

                <Text
                  style={[
                    styles.navLinkText,
                    activeTab === "home" && styles.navLinkTextActive,
                  ]}
                >
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navLink,
                  activeTab === "games" && styles.navLinkActive,
                ]}
                onPress={goGames}
              >
                <Ionicons
                  name={
                    activeTab === "games"
                      ? "game-controller"
                      : "game-controller-outline"
                  }
                  size={20}
                  color={
                    activeTab === "games" ? COLORS.navy : COLORS.textLight
                  }
                />

                <Text
                  style={[
                    styles.navLinkText,
                    activeTab === "games" && styles.navLinkTextActive,
                  ]}
                >
                  Games
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navLink} onPress={onOpenProfile}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.textLight}
                />

                <Text style={styles.navLinkText}>Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PROFILE */}

          <TouchableOpacity
            style={styles.profileButton}
            onPress={onOpenProfile}
          >
            <Ionicons name="person-outline" size={19} color={COLORS.navy} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.content,
            {
              maxWidth: maxContent,
              paddingHorizontal: wide ? 24 : 18,
              paddingTop: wide ? 20 : 0,
            },
          ]}
        >
          {wide ? (
            <View style={styles.wideRow}>
              <View style={{ flex: 1, minWidth: 0 }}>
                {welcome}
                {allGames}
              </View>

              <View style={styles.sidebar}>
                {progressCard}
                {footerCard}
              </View>
            </View>
          ) : (
            <>
              {welcome}
              {allGames}
              {footerCard}
            </>
          )}

          <View style={{ height: 25 }} />
        </View>
      </ScrollView>

      {/* MOBILE NAV */}

      {!wide && (
        <View style={styles.bottomNavWrap}>
          <View style={[styles.bottomNav, { maxWidth: maxContent }]}>
            <TouchableOpacity style={styles.navItem} onPress={goHome}>
              <Ionicons
                name={activeTab === "home" ? "home" : "home-outline"}
                size={22}
                color={activeTab === "home" ? COLORS.blueDark : "#85899D"}
              />

              <Text
                style={[
                  styles.navText,
                  activeTab === "home" && styles.navTextActive,
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={goGames}>
              <Ionicons
                name={
                  activeTab === "games"
                    ? "game-controller"
                    : "game-controller-outline"
                }
                size={22}
                color={activeTab === "games" ? COLORS.blueDark : "#85899D"}
              />

              <Text
                style={[
                  styles.navText,
                  activeTab === "games" && styles.navTextActive,
                ]}
              >
                Games
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={onOpenProfile}>
              <Ionicons name="person-outline" size={22} color="#85899D" />

              <Text style={styles.navText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}