// // // import React, { useEffect, useRef, useState } from "react";

// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   ActivityIndicator,
// // //   ScrollView,
// // // } from "react-native";

// // // import AsyncStorage from "@react-native-async-storage/async-storage";
// // // import { MaterialCommunityIcons } from "@expo/vector-icons";

// // // import { LoginResponse } from "../api/api";
// // // import { guestAccount } from "../api/authApi";

// // // type Props = {
// // //   onBack: () => void;
// // //   onLogin: (user: LoginResponse) => void;
// // // };

// // // const SAVED_NICK_KEY = "cyber-mind-guest-nickname";
// // // const CARD_MAX_WIDTH = 440;
// // // const NICK_REGEX = /^[A-Za-z0-9_ ]+$/;

// // // // Guest2465 style default name
// // // const randomNickname = () => `Guest${Math.floor(1000 + Math.random() * 9000)}`;

// // // export default function GuestLoginScreen({ onBack, onLogin }: Props) {
// // //   const [nickname, setNickname] = useState<string>(randomNickname);
// // //   const [error, setError] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const [focused, setFocused] = useState(false);

// // //   const inputRef = useRef<TextInput>(null);

// // //   // if this device already played as guest, show the same nickname again
// // //   useEffect(() => {
// // //     let alive = true;

// // //     AsyncStorage.getItem(SAVED_NICK_KEY)
// // //       .then((saved) => {
// // //         if (alive && saved) setNickname(saved);
// // //       })
// // //       .catch(() => {});

// // //     return () => {
// // //       alive = false;
// // //     };
// // //   }, []);

// // //   const handleContinue = async () => {
// // //     if (loading) return;

// // //     const clean = nickname.trim().replace(/\s+/g, " ");

// // //     if (clean.length < 2) {
// // //       setError("Nickname must be at least 2 characters");
// // //       return;
// // //     }

// // //     if (clean.length > 20) {
// // //       setError("Maximum 20 characters");
// // //       return;
// // //     }

// // //     if (!NICK_REGEX.test(clean)) {
// // //       setError("Only letters, numbers and _ are allowed");
// // //       return;
// // //     }

// // //     setError("");
// // //     setLoading(true);

// // //     try {
// // //       /**
// // //        * FRONTEND -> POST /api/auth/guest { deviceId, nickname }
// // //        * BACKEND  -> finds / creates the guest player in MySQL
// // //        * BACKEND  -> JSON { success, player: { id, name, type: "guest" } }
// // //        */
// // //       const player = await guestAccount(clean);

// // //       console.log("GUEST SUCCESS:", JSON.stringify(player));

// // //       try {
// // //         await AsyncStorage.setItem(SAVED_NICK_KEY, clean);
// // //       } catch {}

// // //       onLogin({
// // //         success: true,
// // //         player: player,
// // //       } as unknown as LoginResponse);
// // //     } catch (err: any) {
// // //       console.warn("GUEST FAILED:", err);

// // //       setError(err?.message || "Couldn't connect. Check server and try again.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const webNoOutline =
// // //     Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null;

// // //   return (
// // //     <SafeAreaView style={styles.safe}>
// // //       <StatusBar barStyle="light-content" backgroundColor="#070B2E" />

// // //       {/* ---------------- background decoration ---------------- */}
// // //       <View style={StyleSheet.absoluteFill} pointerEvents="none">
// // //         <View style={[styles.blob, styles.blobTopLeft]} />
// // //         <View style={[styles.blob, styles.blobTopRight]} />
// // //         <View style={[styles.blob, styles.blobBottomLeft]} />
// // //         <View style={[styles.blob, styles.blobBottomRight]} />

// // //         <MaterialCommunityIcons
// // //           name="star-four-points"
// // //           size={30}
// // //           color="#FFC83D"
// // //           style={styles.starTopRight}
// // //         />
// // //         <MaterialCommunityIcons
// // //           name="star-four-points"
// // //           size={26}
// // //           color="#FFC83D"
// // //           style={styles.starLeft}
// // //         />
// // //         <MaterialCommunityIcons
// // //           name="star-four-points"
// // //           size={30}
// // //           color="#5B4BFF"
// // //           style={styles.starBottomRight}
// // //         />
// // //         <MaterialCommunityIcons
// // //           name="brain"
// // //           size={96}
// // //           color="#111B66"
// // //           style={styles.ghostBrain}
// // //         />
// // //         <MaterialCommunityIcons
// // //           name="crown-outline"
// // //           size={76}
// // //           color="#16227A"
// // //           style={styles.ghostCrown}
// // //         />
// // //       </View>

// // //       {/* back button */}
// // //       <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
// // //         <MaterialCommunityIcons name="arrow-left" size={26} color="#FFFFFF" />
// // //       </TouchableOpacity>

// // //       <KeyboardAvoidingView
// // //         style={styles.flex}
// // //         behavior={Platform.OS === "ios" ? "padding" : undefined}
// // //       >
// // //         <ScrollView
// // //           contentContainerStyle={styles.scrollContent}
// // //           keyboardShouldPersistTaps="handled"
// // //           showsVerticalScrollIndicator={false}
// // //         >
// // //           <View style={styles.content}>
// // //             {/* ---------- title + mascot ---------- */}
// // //             <View style={styles.hero}>
// // //               <View style={styles.heroText}>
// // //                 <Text style={styles.title}>
// // //                   Play as <Text style={styles.titleAccent}>Guest</Text>
// // //                 </Text>
// // //                 <Text style={styles.subtitle}>No account needed. Just a nickname.</Text>
// // //               </View>

// // //               <View style={styles.mascot}>
// // //                 <MaterialCommunityIcons
// // //                   name="crown"
// // //                   size={34}
// // //                   color="#FFC83D"
// // //                   style={styles.crown}
// // //                 />
// // //                 <View style={styles.mascotBody}>
// // //                   <MaterialCommunityIcons name="brain" size={70} color="#FFFFFF" />
// // //                 </View>
// // //               </View>
// // //             </View>

// // //             {/* ---------- nickname card ---------- */}
// // //             <View style={styles.card}>
// // //               <View style={styles.labelRow}>
// // //                 <View style={styles.labelIcon}>
// // //                   <MaterialCommunityIcons name="account" size={26} color="#FFFFFF" />
// // //                 </View>
// // //                 <Text style={styles.labelText}>NICKNAME</Text>
// // //               </View>

// // //               <View
// // //                 style={[
// // //                   styles.inputRow,
// // //                   focused && styles.inputFocused,
// // //                   !!error && styles.inputError,
// // //                 ]}
// // //               >
// // //                 <TextInput
// // //                   ref={inputRef}
// // //                   value={nickname}
// // //                   onChangeText={(t) => {
// // //                     setNickname(t.replace(/[^A-Za-z0-9_ ]/g, ""));
// // //                     if (error) setError("");
// // //                   }}
// // //                   placeholder="Enter a nickname"
// // //                   placeholderTextColor="#5A6AB8"
// // //                   maxLength={20}
// // //                   autoCorrect={false}
// // //                   autoCapitalize="none"
// // //                   selectTextOnFocus
// // //                   editable={!loading}
// // //                   returnKeyType="done"
// // //                   onSubmitEditing={handleContinue}
// // //                   onFocus={() => setFocused(true)}
// // //                   onBlur={() => setFocused(false)}
// // //                   style={[styles.input, webNoOutline]}
// // //                 />

// // //                 <TouchableOpacity
// // //                   onPress={() => inputRef.current?.focus()}
// // //                   activeOpacity={0.7}
// // //                   hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
// // //                 >
// // //                   <MaterialCommunityIcons name="pencil" size={22} color="#8E9BFF" />
// // //                 </TouchableOpacity>
// // //               </View>

// // //               {error ? (
// // //                 <Text style={styles.error}>{error}</Text>
// // //               ) : (
// // //                 <View style={styles.hintRow}>
// // //                   <MaterialCommunityIcons name="star-four-points" size={18} color="#7B5CFF" />
// // //                   <Text style={styles.hintText}>
// // //                     This will be your display name in the game.
// // //                   </Text>
// // //                 </View>
// // //               )}

// // //               <TouchableOpacity
// // //                 style={[styles.button, loading && styles.buttonDisabled]}
// // //                 activeOpacity={0.9}
// // //                 onPress={handleContinue}
// // //                 disabled={loading}
// // //               >
// // //                 {loading ? (
// // //                   <ActivityIndicator color="#FFFFFF" />
// // //                 ) : (
// // //                   <View style={styles.buttonRow}>
// // //                     <Text style={styles.buttonText}>CONTINUE</Text>
// // //                     <MaterialCommunityIcons name="arrow-right" size={24} color="#FFFFFF" />
// // //                   </View>
// // //                 )}
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </ScrollView>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // /* ------------------------------------------------------------------ */
// // // /* Styles                                                              */
// // // /* ------------------------------------------------------------------ */

// // // const styles = StyleSheet.create({
// // //   safe: {
// // //     flex: 1,
// // //     backgroundColor: "#070B2E",
// // //     overflow: "hidden",
// // //   },

// // //   flex: { flex: 1 },

// // //   /* background */
// // //   blob: {
// // //     position: "absolute",
// // //     borderRadius: 999,
// // //   },
// // //   blobTopLeft: {
// // //     width: 320,
// // //     height: 320,
// // //     top: -170,
// // //     left: -120,
// // //     backgroundColor: "rgba(60,90,255,0.35)",
// // //   },
// // //   blobTopRight: {
// // //     width: 260,
// // //     height: 260,
// // //     top: -150,
// // //     right: -110,
// // //     backgroundColor: "rgba(130,70,240,0.30)",
// // //   },
// // //   blobBottomLeft: {
// // //     width: 420,
// // //     height: 420,
// // //     bottom: -280,
// // //     left: -150,
// // //     backgroundColor: "rgba(140,60,235,0.55)",
// // //   },
// // //   blobBottomRight: {
// // //     width: 460,
// // //     height: 460,
// // //     bottom: -300,
// // //     right: -170,
// // //     backgroundColor: "rgba(40,90,255,0.45)",
// // //   },
// // //   starTopRight: { position: "absolute", top: 54, right: 22 },
// // //   starLeft: { position: "absolute", bottom: "34%", left: 24 },
// // //   starBottomRight: { position: "absolute", bottom: "20%", right: 30 },
// // //   ghostBrain: { position: "absolute", bottom: "22%", left: -10 },
// // //   ghostCrown: {
// // //     position: "absolute",
// // //     bottom: "30%",
// // //     right: 20,
// // //     transform: [{ rotate: "-12deg" }],
// // //   },

// // //   backBtn: {
// // //     position: "absolute",
// // //     top: Platform.OS === "web" ? 18 : 44,
// // //     left: 16,
// // //     zIndex: 10,
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 24,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     backgroundColor: "rgba(20,30,110,0.85)",
// // //     borderWidth: 1.5,
// // //     borderColor: "#2E3EA8",
// // //   },

// // //   scrollContent: {
// // //     flexGrow: 1,
// // //     alignItems: "center",
// // //     paddingTop: 100,
// // //     paddingBottom: 40,
// // //     paddingHorizontal: 20,
// // //   },

// // //   content: {
// // //     width: "100%",
// // //     maxWidth: CARD_MAX_WIDTH,
// // //   },

// // //   /* title + mascot */
// // //   hero: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     marginBottom: 26,
// // //   },

// // //   heroText: {
// // //     flex: 1,
// // //     paddingRight: 8,
// // //   },

// // //   title: {
// // //     fontSize: 34,
// // //     fontWeight: "900",
// // //     color: "#FFFFFF",
// // //   },

// // //   titleAccent: {
// // //     color: "#8B6CFF",
// // //   },

// // //   subtitle: {
// // //     marginTop: 8,
// // //     fontSize: 14.5,
// // //     color: "#A9B4F0",
// // //   },

// // //   mascot: {
// // //     width: 118,
// // //     alignItems: "center",
// // //   },

// // //   crown: {
// // //     marginBottom: -10,
// // //     zIndex: 2,
// // //   },

// // //   mascotBody: {
// // //     width: 108,
// // //     height: 108,
// // //     borderRadius: 54,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     backgroundColor: "#6D5BFF",
// // //     borderWidth: 3,
// // //     borderColor: "#9A8CFF",
// // //     shadowColor: "#6D5BFF",
// // //     shadowOpacity: 0.6,
// // //     shadowRadius: 22,
// // //     shadowOffset: { width: 0, height: 8 },
// // //     elevation: 10,
// // //   },

// // //   /* card */
// // //   card: {
// // //     width: "100%",
// // //     backgroundColor: "rgba(18,26,100,0.62)",
// // //     borderWidth: 1.5,
// // //     borderColor: "#2E3A9C",
// // //     borderRadius: 30,
// // //     padding: 20,
// // //   },

// // //   labelRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginBottom: 14,
// // //   },

// // //   labelIcon: {
// // //     width: 52,
// // //     height: 52,
// // //     borderRadius: 16,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     backgroundColor: "#7A4DF0",
// // //   },

// // //   labelText: {
// // //     marginLeft: 14,
// // //     color: "#9DA8FF",
// // //     fontSize: 15,
// // //     fontWeight: "800",
// // //     letterSpacing: 1.6,
// // //   },

// // //   inputRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     backgroundColor: "rgba(28,38,128,0.7)",
// // //     borderWidth: 1.5,
// // //     borderColor: "#34439F",
// // //     borderRadius: 999,
// // //     paddingRight: 20,
// // //   },

// // //   input: {
// // //     flex: 1,
// // //     paddingVertical: 16,
// // //     paddingHorizontal: 22,
// // //     color: "#FFFFFF",
// // //     fontSize: 18,
// // //     fontWeight: "600",
// // //   },

// // //   inputFocused: {
// // //     borderColor: "#7C8CFF",
// // //   },

// // //   inputError: {
// // //     borderColor: "#FF5C5C",
// // //   },

// // //   hintRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginTop: 14,
// // //     marginLeft: 4,
// // //   },

// // //   hintText: {
// // //     marginLeft: 8,
// // //     color: "#8F9BEA",
// // //     fontSize: 13.5,
// // //     flexShrink: 1,
// // //   },

// // //   error: {
// // //     marginTop: 14,
// // //     marginLeft: 6,
// // //     color: "#FF5C5C",
// // //     fontSize: 13,
// // //   },

// // //   button: {
// // //     marginTop: 22,
// // //     backgroundColor: "#6D4DF2",
// // //     borderRadius: 999,
// // //     paddingVertical: 18,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     borderWidth: 1.5,
// // //     borderColor: "#8F7BFF",
// // //     shadowColor: "#6D4DF2",
// // //     shadowOpacity: 0.55,
// // //     shadowRadius: 16,
// // //     shadowOffset: { width: 0, height: 8 },
// // //     elevation: 10,
// // //   },

// // //   buttonDisabled: { opacity: 0.7 },

// // //   buttonRow: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //   },

// // //   buttonText: {
// // //     color: "#FFFFFF",
// // //     fontSize: 19,
// // //     fontWeight: "900",
// // //     letterSpacing: 1,
// // //     marginRight: 12,
// // //   },
// // // });
// // import React, { useRef, useState } from "react";

// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TextInput,
// //   TouchableOpacity,
// //   SafeAreaView,
// //   StatusBar,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ActivityIndicator,
// //   ScrollView,
// // } from "react-native";

// // import { MaterialCommunityIcons } from "@expo/vector-icons";

// // import { LoginResponse } from "../api/api";
// // import { guestAccount } from "../api/authApi";

// // type Props = {
// //   onBack: () => void;
// //   onLogin: (user: LoginResponse) => void;
// // };

// // const CARD_MAX_WIDTH = 440;
// // const NICK_REGEX = /^[A-Za-z0-9_ ]+$/;

// // export default function GuestLoginScreen({ onBack, onLogin }: Props) {
// //   // empty by default: user has to type the nickname manually
// //   const [nickname, setNickname] = useState<string>("");
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [focused, setFocused] = useState(false);

// //   const inputRef = useRef<TextInput>(null);

// //   const handleContinue = async () => {
// //     if (loading) return;

// //     const clean = nickname.trim().replace(/\s+/g, " ");

// //     if (clean.length < 2) {
// //       setError("Nickname must be at least 2 characters");
// //       return;
// //     }

// //     if (clean.length > 20) {
// //       setError("Maximum 20 characters");
// //       return;
// //     }

// //     if (!NICK_REGEX.test(clean)) {
// //       setError("Only letters, numbers and _ are allowed");
// //       return;
// //     }

// //     setError("");
// //     setLoading(true);

// //     try {
// //       /**
// //        * FRONTEND -> POST /api/auth/guest { deviceId, nickname }
// //        * BACKEND  -> finds / creates the guest player in MySQL
// //        * BACKEND  -> JSON { success, player: { id, name, type: "guest" } }
// //        */
// //       const player = await guestAccount(clean);

// //       console.log("GUEST SUCCESS:", JSON.stringify(player));

// //       onLogin({
// //         success: true,
// //         player: player,
// //       } as unknown as LoginResponse);
// //     } catch (err: any) {
// //       console.warn("GUEST FAILED:", err);

// //       setError(err?.message || "Couldn't connect. Check server and try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const webNoOutline =
// //     Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null;

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       <StatusBar barStyle="light-content" backgroundColor="#070B2E" />

// //       {/* ---------------- background decoration ---------------- */}
// //       <View style={StyleSheet.absoluteFill} pointerEvents="none">
// //         <View style={[styles.blob, styles.blobTopLeft]} />
// //         <View style={[styles.blob, styles.blobTopRight]} />
// //         <View style={[styles.blob, styles.blobBottomLeft]} />
// //         <View style={[styles.blob, styles.blobBottomRight]} />

// //         <MaterialCommunityIcons
// //           name="star-four-points"
// //           size={30}
// //           color="#FFC83D"
// //           style={styles.starTopRight}
// //         />
// //         <MaterialCommunityIcons
// //           name="star-four-points"
// //           size={26}
// //           color="#FFC83D"
// //           style={styles.starLeft}
// //         />
// //         <MaterialCommunityIcons
// //           name="star-four-points"
// //           size={30}
// //           color="#5B4BFF"
// //           style={styles.starBottomRight}
// //         />
// //         <MaterialCommunityIcons
// //           name="brain"
// //           size={96}
// //           color="#111B66"
// //           style={styles.ghostBrain}
// //         />
// //         <MaterialCommunityIcons
// //           name="crown-outline"
// //           size={76}
// //           color="#16227A"
// //           style={styles.ghostCrown}
// //         />
// //       </View>

// //       {/* back button */}
// //       <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
// //         <MaterialCommunityIcons name="arrow-left" size={26} color="#FFFFFF" />
// //       </TouchableOpacity>

// //       <KeyboardAvoidingView
// //         style={styles.flex}
// //         behavior={Platform.OS === "ios" ? "padding" : undefined}
// //       >
// //         <ScrollView
// //           contentContainerStyle={styles.scrollContent}
// //           keyboardShouldPersistTaps="handled"
// //           showsVerticalScrollIndicator={false}
// //         >
// //           <View style={styles.content}>
// //             {/* ---------- title + mascot ---------- */}
// //             <View style={styles.hero}>
// //               <View style={styles.heroText}>
// //                 <Text style={styles.title}>
// //                   Play as <Text style={styles.titleAccent}>Guest</Text>
// //                 </Text>
// //                 <Text style={styles.subtitle}>No account needed. Just a nickname.</Text>
// //               </View>

// //               <View style={styles.mascot}>
// //                 <MaterialCommunityIcons
// //                   name="crown"
// //                   size={34}
// //                   color="#FFC83D"
// //                   style={styles.crown}
// //                 />
// //                 <View style={styles.mascotBody}>
// //                   <MaterialCommunityIcons name="brain" size={70} color="#FFFFFF" />
// //                 </View>
// //               </View>
// //             </View>

// //             {/* ---------- nickname card ---------- */}
// //             <View style={styles.card}>
// //               <View style={styles.labelRow}>
// //                 <View style={styles.labelIcon}>
// //                   <MaterialCommunityIcons name="account" size={26} color="#FFFFFF" />
// //                 </View>
// //                 <Text style={styles.labelText}>NICKNAME</Text>
// //               </View>

// //               <View
// //                 style={[
// //                   styles.inputRow,
// //                   focused && styles.inputFocused,
// //                   !!error && styles.inputError,
// //                 ]}
// //               >
// //                 <TextInput
// //                   ref={inputRef}
// //                   value={nickname}
// //                   onChangeText={(t) => {
// //                     setNickname(t.replace(/[^A-Za-z0-9_ ]/g, ""));
// //                     if (error) setError("");
// //                   }}
// //                   placeholder="Enter a nickname"
// //                   placeholderTextColor="#5A6AB8"
// //                   maxLength={20}
// //                   autoCorrect={false}
// //                   autoCapitalize="none"
// //                   editable={!loading}
// //                   returnKeyType="done"
// //                   onSubmitEditing={handleContinue}
// //                   onFocus={() => setFocused(true)}
// //                   onBlur={() => setFocused(false)}
// //                   style={[styles.input, webNoOutline]}
// //                 />

// //                 <TouchableOpacity
// //                   onPress={() => inputRef.current?.focus()}
// //                   activeOpacity={0.7}
// //                   hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
// //                 >
// //                   <MaterialCommunityIcons name="pencil" size={22} color="#8E9BFF" />
// //                 </TouchableOpacity>
// //               </View>

// //               {error ? (
// //                 <Text style={styles.error}>{error}</Text>
// //               ) : (
// //                 <View style={styles.hintRow}>
// //                   <MaterialCommunityIcons name="star-four-points" size={18} color="#7B5CFF" />
// //                   <Text style={styles.hintText}>
// //                     This will be your display name in the game.
// //                   </Text>
// //                 </View>
// //               )}

// //               <TouchableOpacity
// //                 style={[styles.button, loading && styles.buttonDisabled]}
// //                 activeOpacity={0.9}
// //                 onPress={handleContinue}
// //                 disabled={loading}
// //               >
// //                 {loading ? (
// //                   <ActivityIndicator color="#FFFFFF" />
// //                 ) : (
// //                   <View style={styles.buttonRow}>
// //                     <Text style={styles.buttonText}>CONTINUE</Text>
// //                     <MaterialCommunityIcons name="arrow-right" size={24} color="#FFFFFF" />
// //                   </View>
// //                 )}
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </ScrollView>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // }

// // /* ------------------------------------------------------------------ */
// // /* Styles                                                              */
// // /* ------------------------------------------------------------------ */

// // const styles = StyleSheet.create({
// //   safe: {
// //     flex: 1,
// //     backgroundColor: "#070B2E",
// //     overflow: "hidden",
// //   },

// //   flex: { flex: 1 },

// //   /* background */
// //   blob: {
// //     position: "absolute",
// //     borderRadius: 999,
// //   },
// //   blobTopLeft: {
// //     width: 320,
// //     height: 320,
// //     top: -170,
// //     left: -120,
// //     backgroundColor: "rgba(60,90,255,0.35)",
// //   },
// //   blobTopRight: {
// //     width: 260,
// //     height: 260,
// //     top: -150,
// //     right: -110,
// //     backgroundColor: "rgba(130,70,240,0.30)",
// //   },
// //   blobBottomLeft: {
// //     width: 420,
// //     height: 420,
// //     bottom: -280,
// //     left: -150,
// //     backgroundColor: "rgba(140,60,235,0.55)",
// //   },
// //   blobBottomRight: {
// //     width: 460,
// //     height: 460,
// //     bottom: -300,
// //     right: -170,
// //     backgroundColor: "rgba(40,90,255,0.45)",
// //   },
// //   starTopRight: { position: "absolute", top: 54, right: 22 },
// //   starLeft: { position: "absolute", bottom: "34%", left: 24 },
// //   starBottomRight: { position: "absolute", bottom: "20%", right: 30 },
// //   ghostBrain: { position: "absolute", bottom: "22%", left: -10 },
// //   ghostCrown: {
// //     position: "absolute",
// //     bottom: "30%",
// //     right: 20,
// //     transform: [{ rotate: "-12deg" }],
// //   },

// //   backBtn: {
// //     position: "absolute",
// //     top: Platform.OS === "web" ? 18 : 44,
// //     left: 16,
// //     zIndex: 10,
// //     width: 48,
// //     height: 48,
// //     borderRadius: 24,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: "rgba(20,30,110,0.85)",
// //     borderWidth: 1.5,
// //     borderColor: "#2E3EA8",
// //   },

// //   scrollContent: {
// //     flexGrow: 1,
// //     alignItems: "center",
// //     paddingTop: 100,
// //     paddingBottom: 40,
// //     paddingHorizontal: 20,
// //   },

// //   content: {
// //     width: "100%",
// //     maxWidth: CARD_MAX_WIDTH,
// //   },

// //   /* title + mascot */
// //   hero: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginBottom: 26,
// //   },

// //   heroText: {
// //     flex: 1,
// //     paddingRight: 8,
// //   },

// //   title: {
// //     fontSize: 34,
// //     fontWeight: "900",
// //     color: "#FFFFFF",
// //   },

// //   titleAccent: {
// //     color: "#8B6CFF",
// //   },

// //   subtitle: {
// //     marginTop: 8,
// //     fontSize: 14.5,
// //     color: "#A9B4F0",
// //   },

// //   mascot: {
// //     width: 118,
// //     alignItems: "center",
// //   },

// //   crown: {
// //     marginBottom: -10,
// //     zIndex: 2,
// //   },

// //   mascotBody: {
// //     width: 108,
// //     height: 108,
// //     borderRadius: 54,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: "#6D5BFF",
// //     borderWidth: 3,
// //     borderColor: "#9A8CFF",
// //     shadowColor: "#6D5BFF",
// //     shadowOpacity: 0.6,
// //     shadowRadius: 22,
// //     shadowOffset: { width: 0, height: 8 },
// //     elevation: 10,
// //   },

// //   /* card */
// //   card: {
// //     width: "100%",
// //     backgroundColor: "rgba(18,26,100,0.62)",
// //     borderWidth: 1.5,
// //     borderColor: "#2E3A9C",
// //     borderRadius: 30,
// //     padding: 20,
// //   },

// //   labelRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 14,
// //   },

// //   labelIcon: {
// //     width: 52,
// //     height: 52,
// //     borderRadius: 16,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: "#7A4DF0",
// //   },

// //   labelText: {
// //     marginLeft: 14,
// //     color: "#9DA8FF",
// //     fontSize: 15,
// //     fontWeight: "800",
// //     letterSpacing: 1.6,
// //   },

// //   inputRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "rgba(28,38,128,0.7)",
// //     borderWidth: 1.5,
// //     borderColor: "#34439F",
// //     borderRadius: 999,
// //     paddingRight: 20,
// //   },

// //   input: {
// //     flex: 1,
// //     paddingVertical: 16,
// //     paddingHorizontal: 22,
// //     color: "#FFFFFF",
// //     fontSize: 18,
// //     fontWeight: "600",
// //   },

// //   inputFocused: {
// //     borderColor: "#7C8CFF",
// //   },

// //   inputError: {
// //     borderColor: "#FF5C5C",
// //   },

// //   hintRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginTop: 14,
// //     marginLeft: 4,
// //   },

// //   hintText: {
// //     marginLeft: 8,
// //     color: "#8F9BEA",
// //     fontSize: 13.5,
// //     flexShrink: 1,
// //   },

// //   error: {
// //     marginTop: 14,
// //     marginLeft: 6,
// //     color: "#FF5C5C",
// //     fontSize: 13,
// //   },

// //   button: {
// //     marginTop: 22,
// //     backgroundColor: "#6D4DF2",
// //     borderRadius: 999,
// //     paddingVertical: 18,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderWidth: 1.5,
// //     borderColor: "#8F7BFF",
// //     shadowColor: "#6D4DF2",
// //     shadowOpacity: 0.55,
// //     shadowRadius: 16,
// //     shadowOffset: { width: 0, height: 8 },
// //     elevation: 10,
// //   },

// //   buttonDisabled: { opacity: 0.7 },

// //   buttonRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },

// //   buttonText: {
// //     color: "#FFFFFF",
// //     fontSize: 19,
// //     fontWeight: "900",
// //     letterSpacing: 1,
// //     marginRight: 12,
// //   },
// // });
// import React, { useEffect, useRef, useState } from "react";

// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Pressable,
//   SafeAreaView,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   ScrollView,
//   Animated,
//   Easing,
//   StyleProp,
//   ViewStyle,
// } from "react-native";

// import { MaterialCommunityIcons } from "@expo/vector-icons";

// import { LoginResponse } from "../api/api";
// import { guestAccount } from "../api/authApi";

// type Props = {
//   onBack: () => void;
//   onLogin: (user: LoginResponse) => void;
// };

// const CARD_MAX_WIDTH = 440;
// const NICK_REGEX = /^[A-Za-z0-9_ ]+$/;

// /* ---------------- theme (matches Mind Games home screen) ---------------- */
// const C = {
//   cream: "#FFF8EE",
//   navy: "#1F2A7A",
//   navySoft: "#5A639E",
//   yellow: "#FFC21A",
//   yellowDark: "#E5A100",
//   yellowPale: "#FFF1C9",
//   sky: "#5BB5F5",
//   skyPale: "#DCEEFD",
//   pink: "#F58FB0",
//   pinkPale: "#FFE0EA",
//   lavender: "#E9E8FB",
//   orange: "#FF9F1C",
//   green: "#35C79B",
//   purple: "#8E6CF0",
//   error: "#E5484D",
//   errorPale: "#FFECEC",
//   white: "#FFFFFF",
// };

// /* ---------------- small reusable animated helpers ---------------- */

// /** Floats children up/down (and gently rotates) forever. */
// function Floating({
//   children,
//   style,
//   delay = 0,
//   distance = 8,
//   duration = 2200,
//   tilt = 0,
// }: {
//   children: React.ReactNode;
//   style?: StyleProp<ViewStyle>;
//   delay?: number;
//   distance?: number;
//   duration?: number;
//   tilt?: number;
// }) {
//   const v = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(v, {
//           toValue: 1,
//           duration,
//           delay,
//           easing: Easing.inOut(Easing.sin),
//           useNativeDriver: true,
//         }),
//         Animated.timing(v, {
//           toValue: 0,
//           duration,
//           easing: Easing.inOut(Easing.sin),
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [v, delay, duration]);

//   const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, -distance] });
//   const rotate = v.interpolate({
//     inputRange: [0, 1],
//     outputRange: [`${-tilt}deg`, `${tilt}deg`],
//   });

//   return (
//     <Animated.View style={[style, { transform: [{ translateY }, { rotate }] }]}>
//       {children}
//     </Animated.View>
//   );
// }

// /** Scale + fade pulse, used for sparkles and the bulb glow. */
// function Twinkle({
//   children,
//   style,
//   delay = 0,
//   duration = 900,
// }: {
//   children: React.ReactNode;
//   style?: StyleProp<ViewStyle>;
//   delay?: number;
//   duration?: number;
// }) {
//   const v = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(v, {
//           toValue: 1,
//           duration,
//           delay,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//         Animated.timing(v, {
//           toValue: 0,
//           duration,
//           easing: Easing.inOut(Easing.quad),
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [v, delay, duration]);

//   const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.2] });
//   const opacity = v.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] });

//   return (
//     <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>
//       {children}
//     </Animated.View>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Screen                                                              */
// /* ------------------------------------------------------------------ */

// export default function GuestLoginScreen({ onBack, onLogin }: Props) {
//   // empty by default: user has to type the nickname manually
//   const [nickname, setNickname] = useState<string>("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [focused, setFocused] = useState(false);

//   const inputRef = useRef<TextInput>(null);

//   /* animation values */
//   const enter = useRef(new Animated.Value(0)).current; // page entrance
//   const shake = useRef(new Animated.Value(0)).current; // error shake
//   const press = useRef(new Animated.Value(0)).current; // button press
//   const errorIn = useRef(new Animated.Value(0)).current; // error message pop

//   useEffect(() => {
//     Animated.timing(enter, {
//       toValue: 1,
//       duration: 650,
//       easing: Easing.out(Easing.back(1.3)),
//       useNativeDriver: true,
//     }).start();
//   }, [enter]);

//   const runShake = () => {
//     shake.setValue(0);
//     Animated.sequence([
//       Animated.timing(shake, { toValue: 1, duration: 70, useNativeDriver: true }),
//       Animated.timing(shake, { toValue: -1, duration: 70, useNativeDriver: true }),
//       Animated.timing(shake, { toValue: 1, duration: 70, useNativeDriver: true }),
//       Animated.timing(shake, { toValue: -1, duration: 70, useNativeDriver: true }),
//       Animated.timing(shake, { toValue: 0, duration: 70, useNativeDriver: true }),
//     ]).start();
//   };

//   const showError = (msg: string) => {
//     setError(msg);
//     runShake();
//     errorIn.setValue(0);
//     Animated.spring(errorIn, {
//       toValue: 1,
//       friction: 6,
//       tension: 120,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleContinue = async () => {
//     if (loading) return;

//     const clean = nickname.trim().replace(/\s+/g, " ");

//     if (clean.length < 2) {
//       showError("Nickname must be at least 2 characters");
//       return;
//     }

//     if (clean.length > 20) {
//       showError("Maximum 20 characters");
//       return;
//     }

//     if (!NICK_REGEX.test(clean)) {
//       showError("Only letters, numbers and _ are allowed");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       /**
//        * FRONTEND -> POST /api/auth/guest { deviceId, nickname }
//        * BACKEND  -> finds / creates the guest player in MySQL
//        * BACKEND  -> JSON { success, player: { id, name, type: "guest" } }
//        */
//       const player = await guestAccount(clean);

//       console.log("GUEST SUCCESS:", JSON.stringify(player));

//       onLogin({
//         success: true,
//         player: player,
//       } as unknown as LoginResponse);
//     } catch (err: any) {
//       console.warn("GUEST FAILED:", err);

//       showError(err?.message || "Couldn't connect. Check server and try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const webNoOutline =
//     Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null;

//   /* derived animated styles */
//   const heroStyle = {
//     opacity: enter,
//     transform: [
//       {
//         translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }),
//       },
//     ],
//   };

//   const cardStyle = {
//     opacity: enter,
//     transform: [
//       {
//         translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }),
//       },
//       {
//         translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-9, 9] }),
//       },
//     ],
//   };

//   const buttonScale = press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.96] });
//   const buttonDrop = press.interpolate({ inputRange: [0, 1], outputRange: [0, 4] });

//   const errorStyle = {
//     opacity: errorIn,
//     transform: [
//       { scale: errorIn.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
//     ],
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.cream} />

//       {/* ---------------- background decoration ---------------- */}
//       <View style={StyleSheet.absoluteFill} pointerEvents="none">
//         {/* soft pastel circles */}
//         <View style={[styles.blob, styles.blobTopLeft]} />
//         <View style={[styles.blob, styles.blobTopRight]} />
//         <View style={[styles.blob, styles.blobMidLeft]} />
//         <View style={[styles.blob, styles.blobBottomLeft]} />
//         <View style={[styles.blob, styles.blobBottomRight]} />

//         {/* floating game pieces */}
//         <Floating style={styles.qBlock} distance={10} duration={2400} tilt={4}>
//           <View style={styles.qBlockInner}>
//             <Text style={styles.qText}>?</Text>
//           </View>
//         </Floating>

//         <Floating style={styles.puzzle} distance={9} duration={2800} delay={300} tilt={6}>
//           <MaterialCommunityIcons name="puzzle" size={54} color={C.green} />
//         </Floating>

//         <Floating style={styles.blockA} distance={8} duration={2000} delay={150} tilt={5}>
//           <View style={[styles.letterBlock, { backgroundColor: C.purple }]}>
//             <Text style={styles.letterText}>A</Text>
//           </View>
//         </Floating>

//         <Floating style={styles.blockB} distance={11} duration={2600} delay={500} tilt={5}>
//           <View style={[styles.letterBlock, { backgroundColor: C.pink }]}>
//             <Text style={styles.letterText}>B</Text>
//           </View>
//         </Floating>

//         <Floating style={styles.blockC} distance={7} duration={2300} delay={800} tilt={4}>
//           <View style={[styles.letterBlock, { backgroundColor: C.sky }]}>
//             <Text style={styles.letterText}>C</Text>
//           </View>
//         </Floating>

//         <Floating style={styles.trophy} distance={6} duration={3000} tilt={3}>
//           <MaterialCommunityIcons name="trophy" size={64} color={C.yellow} />
//         </Floating>

//         {/* sparkles */}
//         <Twinkle style={styles.sparkleTopRight}>
//           <MaterialCommunityIcons name="star-four-points" size={28} color={C.yellow} />
//         </Twinkle>
//         <Twinkle style={styles.sparkleLeft} delay={400}>
//           <MaterialCommunityIcons name="star-four-points" size={20} color={C.sky} />
//         </Twinkle>
//         <Twinkle style={styles.sparkleBottom} delay={700}>
//           <MaterialCommunityIcons name="star-four-points" size={22} color={C.pink} />
//         </Twinkle>
//       </View>

//       {/* back button */}
//       <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
//         <MaterialCommunityIcons name="arrow-left" size={26} color={C.navy} />
//       </TouchableOpacity>

//       <KeyboardAvoidingView
//         style={styles.flex}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.content}>
//             {/* ---------- title + mascot ---------- */}
//             <Animated.View style={[styles.hero, heroStyle]}>
//               <View style={styles.heroText}>
//                 <Text style={styles.title}>Play as</Text>
//                 <Text style={[styles.title, styles.titleAccent]}>Guest</Text>
//                 <Text style={styles.subtitle}>No account needed. Just a nickname.</Text>
//               </View>

//               <Floating style={styles.mascot} distance={10} duration={1600} tilt={3}>
//                 <Twinkle style={styles.bulb} duration={1100}>
//                   <MaterialCommunityIcons name="lightbulb-on" size={34} color={C.yellow} />
//                 </Twinkle>
//                 <View style={styles.mascotBody}>
//                   <MaterialCommunityIcons name="brain" size={66} color={C.pink} />
//                 </View>
//               </Floating>
//             </Animated.View>

//             {/* ---------- nickname card ---------- */}
//             <Animated.View style={[styles.card, cardStyle]}>
//               <View style={styles.labelRow}>
//                 <View style={styles.labelIcon}>
//                   <MaterialCommunityIcons name="account" size={26} color={C.navy} />
//                 </View>
//                 <Text style={styles.labelText}>Your nickname</Text>
//               </View>

//               <View
//                 style={[
//                   styles.inputRow,
//                   focused && styles.inputFocused,
//                   !!error && styles.inputError,
//                 ]}
//               >
//                 <TextInput
//                   ref={inputRef}
//                   value={nickname}
//                   onChangeText={(t) => {
//                     setNickname(t.replace(/[^A-Za-z0-9_ ]/g, ""));
//                     if (error) setError("");
//                   }}
//                   placeholder="Enter a nickname"
//                   placeholderTextColor="#9AA1CC"
//                   maxLength={20}
//                   autoCorrect={false}
//                   autoCapitalize="none"
//                   editable={!loading}
//                   returnKeyType="done"
//                   onSubmitEditing={handleContinue}
//                   onFocus={() => setFocused(true)}
//                   onBlur={() => setFocused(false)}
//                   style={[styles.input, webNoOutline]}
//                 />

//                 <TouchableOpacity
//                   onPress={() => inputRef.current?.focus()}
//                   activeOpacity={0.7}
//                   hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
//                 >
//                   <MaterialCommunityIcons
//                     name="pencil"
//                     size={22}
//                     color={error ? C.error : C.sky}
//                   />
//                 </TouchableOpacity>
//               </View>

//               {error ? (
//                 <Animated.View style={[styles.errorRow, errorStyle]}>
//                   <MaterialCommunityIcons name="alert-circle" size={18} color={C.error} />
//                   <Text style={styles.error}>{error}</Text>
//                 </Animated.View>
//               ) : (
//                 <View style={styles.hintRow}>
//                   <MaterialCommunityIcons name="star-four-points" size={18} color={C.orange} />
//                   <Text style={styles.hintText}>
//                     This will be your display name in the game.
//                   </Text>
//                 </View>
//               )}

//               {/* 3D yellow button */}
//               <Animated.View
//                 style={{
//                   marginTop: 22,
//                   transform: [{ scale: buttonScale }, { translateY: buttonDrop }],
//                   opacity: loading ? 0.75 : 1,
//                 }}
//               >
//                 <Pressable
//                   onPress={handleContinue}
//                   disabled={loading}
//                   onPressIn={() =>
//                     Animated.spring(press, {
//                       toValue: 1,
//                       friction: 7,
//                       tension: 200,
//                       useNativeDriver: true,
//                     }).start()
//                   }
//                   onPressOut={() =>
//                     Animated.spring(press, {
//                       toValue: 0,
//                       friction: 4,
//                       tension: 120,
//                       useNativeDriver: true,
//                     }).start()
//                   }
//                   style={styles.buttonEdge}
//                 >
//                   <View style={styles.button}>
//                     <View style={styles.buttonShine} />
//                     {loading ? (
//                       <ActivityIndicator color={C.navy} />
//                     ) : (
//                       <View style={styles.buttonRow}>
//                         <Text style={styles.buttonText}>Continue</Text>
//                         <MaterialCommunityIcons name="arrow-right" size={24} color={C.navy} />
//                       </View>
//                     )}
//                   </View>
//                 </Pressable>
//               </Animated.View>
//             </Animated.View>

//             <Text style={styles.footerNote}>Guest progress is saved on this device.</Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Styles                                                              */
// /* ------------------------------------------------------------------ */

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: C.cream,
//     overflow: "hidden",
//   },

//   flex: { flex: 1 },

//   /* background circles */
//   blob: {
//     position: "absolute",
//     borderRadius: 999,
//   },
//   blobTopLeft: {
//     width: 320,
//     height: 320,
//     top: -170,
//     left: -110,
//     backgroundColor: C.yellowPale,
//   },
//   blobTopRight: {
//     width: 260,
//     height: 260,
//     top: -120,
//     right: -110,
//     backgroundColor: C.lavender,
//   },
//   blobMidLeft: {
//     width: 120,
//     height: 120,
//     top: "46%",
//     left: -60,
//     backgroundColor: C.skyPale,
//   },
//   blobBottomLeft: {
//     width: 380,
//     height: 380,
//     bottom: -250,
//     left: -140,
//     backgroundColor: C.skyPale,
//   },
//   blobBottomRight: {
//     width: 340,
//     height: 340,
//     bottom: -230,
//     right: -120,
//     backgroundColor: "#CDEFB8",
//   },

//   /* floating pieces */
//   qBlock: { position: "absolute", top: "34%", left: -6 },
//   qBlockInner: {
//     width: 58,
//     height: 58,
//     borderRadius: 16,
//     backgroundColor: C.orange,
//     alignItems: "center",
//     justifyContent: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#E07F00",
//     transform: [{ rotate: "-8deg" }],
//   },
//   qText: { color: C.white, fontSize: 32, fontWeight: "900" },

//   puzzle: {
//     position: "absolute",
//     bottom: "18%",
//     left: 18,
//     transform: [{ rotate: "-14deg" }],
//   },

//   blockA: { position: "absolute", top: 58, right: 74 },
//   blockB: { position: "absolute", top: 74, right: 18 },
//   blockC: { position: "absolute", top: 126, right: 44 },
//   letterBlock: {
//     width: 38,
//     height: 38,
//     borderRadius: 11,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   letterText: { color: C.white, fontSize: 20, fontWeight: "900" },

//   trophy: { position: "absolute", bottom: "6%", right: 26 },

//   sparkleTopRight: { position: "absolute", top: "28%", right: 22 },
//   sparkleLeft: { position: "absolute", top: 130, left: 28 },
//   sparkleBottom: { position: "absolute", bottom: "26%", right: 54 },

//   backBtn: {
//     position: "absolute",
//     top: Platform.OS === "web" ? 18 : 44,
//     left: 16,
//     zIndex: 10,
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: C.white,
//     borderWidth: 2,
//     borderColor: C.skyPale,
//     shadowColor: C.navy,
//     shadowOpacity: 0.12,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 4,
//   },

//   scrollContent: {
//     flexGrow: 1,
//     alignItems: "center",
//     paddingTop: 100,
//     paddingBottom: 40,
//     paddingHorizontal: 20,
//   },

//   content: {
//     width: "100%",
//     maxWidth: CARD_MAX_WIDTH,
//   },

//   /* title + mascot */
//   hero: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 26,
//   },

//   heroText: {
//     flex: 1,
//     paddingRight: 8,
//   },

//   title: {
//     fontSize: 36,
//     lineHeight: 42,
//     fontWeight: "900",
//     color: C.navy,
//   },

//   titleAccent: {
//     color: C.orange,
//   },

//   subtitle: {
//     marginTop: 8,
//     fontSize: 14.5,
//     color: C.navySoft,
//   },

//   mascot: {
//     width: 118,
//     alignItems: "center",
//   },

//   bulb: {
//     marginBottom: -6,
//     zIndex: 2,
//   },

//   mascotBody: {
//     width: 108,
//     height: 108,
//     borderRadius: 54,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: C.pinkPale,
//     borderWidth: 4,
//     borderColor: C.white,
//     shadowColor: C.pink,
//     shadowOpacity: 0.45,
//     shadowRadius: 18,
//     shadowOffset: { width: 0, height: 8 },
//     elevation: 8,
//   },

//   /* card */
//   card: {
//     width: "100%",
//     backgroundColor: C.white,
//     borderWidth: 3,
//     borderColor: C.yellow,
//     borderRadius: 30,
//     padding: 20,
//     shadowColor: C.yellowDark,
//     shadowOpacity: 0.25,
//     shadowRadius: 20,
//     shadowOffset: { width: 0, height: 10 },
//     elevation: 8,
//   },

//   labelRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 14,
//   },

//   labelIcon: {
//     width: 52,
//     height: 52,
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: C.yellowPale,
//     borderBottomWidth: 4,
//     borderBottomColor: C.yellow,
//   },

//   labelText: {
//     marginLeft: 14,
//     color: C.navy,
//     fontSize: 17,
//     fontWeight: "800",
//   },

//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F3F8FF",
//     borderWidth: 2,
//     borderColor: C.skyPale,
//     borderRadius: 999,
//     paddingRight: 20,
//   },

//   input: {
//     flex: 1,
//     paddingVertical: 16,
//     paddingHorizontal: 22,
//     color: C.navy,
//     fontSize: 18,
//     fontWeight: "700",
//   },

//   inputFocused: {
//     borderColor: C.sky,
//     backgroundColor: C.white,
//   },

//   inputError: {
//     borderColor: C.error,
//     backgroundColor: C.errorPale,
//   },

//   hintRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 14,
//     marginLeft: 4,
//   },

//   hintText: {
//     marginLeft: 8,
//     color: C.navySoft,
//     fontSize: 13.5,
//     flexShrink: 1,
//   },

//   errorRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 14,
//     marginLeft: 4,
//   },

//   error: {
//     marginLeft: 8,
//     color: C.error,
//     fontSize: 13.5,
//     fontWeight: "600",
//     flexShrink: 1,
//   },

//   /* 3D button: dark-yellow "edge" wrapper + bright-yellow face */
//   buttonEdge: {
//     backgroundColor: C.yellowDark,
//     borderRadius: 999,
//     paddingBottom: 6,
//   },

//   button: {
//     backgroundColor: C.yellow,
//     borderRadius: 999,
//     paddingVertical: 17,
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//   },

//   buttonShine: {
//     position: "absolute",
//     top: 5,
//     left: 24,
//     width: 70,
//     height: 9,
//     borderRadius: 6,
//     backgroundColor: "rgba(255,255,255,0.55)",
//   },

//   buttonRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   buttonText: {
//     color: C.navy,
//     fontSize: 20,
//     fontWeight: "900",
//     marginRight: 12,
//   },

//   footerNote: {
//     marginTop: 22,
//     textAlign: "center",
//     color: C.navySoft,
//     fontSize: 13,
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

type Props = {
  mode: "player" | "group";
  onContinue: (nickname: string) => void;
  onBack: () => void;
};

export default function GuestLoginScreen({ mode, onContinue, onBack }: Props) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    const name = nickname.trim();

    if (name.length < 2) {
      setError("Nickname must be at least 2 characters");
      return;
    }
    if (name.length > 15) {
      setError("Nickname can be max 15 characters");
      return;
    }

    setError("");
    setLoading(true);

    // App.tsx (handleGuestEntry) registers the guest and navigates.
    // If it fails, App shows an alert; reset the spinner shortly after.
    onContinue(name);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Background circles */}
      <View style={[styles.circle, styles.circleYellow]} />
      <View style={[styles.circle, styles.circlePurple]} />
      <View style={[styles.circle, styles.circleBlue]} />
      <View style={[styles.circle, styles.circleGreen]} />

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.inner}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Play as</Text>
          <Text style={styles.titleAccent}>Guest</Text>
          <Text style={styles.subtitle}>
            {mode === "player"
              ? "No account needed. Just a nickname."
              : "Enter a nickname to join your group."}
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <Text style={styles.cardTitle}>Your nickname</Text>
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Enter a nickname"
              placeholderTextColor="#9AA0D0"
              value={nickname}
              onChangeText={(t) => {
                setNickname(t);
                if (error) setError("");
              }}
              maxLength={15}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
            <Text style={styles.pencil}>✎</Text>
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Text style={styles.hint}>
            ✦ This will be your display name in the game.
          </Text>

          <TouchableOpacity
            style={[styles.continueBtn, loading && { opacity: 0.7 }]}
            onPress={handleContinue}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#1E2A78" />
            ) : (
              <Text style={styles.continueText}>Continue  →</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          {mode === "player"
            ? "Guest progress is saved on this device."
            : "You'll enter a room code on the next screen."}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF6EA",
    overflow: "hidden",
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  // background decoration
  circle: { position: "absolute", borderRadius: 999 },
  circleYellow: { width: 260, height: 260, top: -80, left: -60, backgroundColor: "#FFEFC2" },
  circlePurple: { width: 220, height: 220, top: -40, right: -80, backgroundColor: "#E7E4FA" },
  circleBlue: { width: 240, height: 240, bottom: -60, left: -80, backgroundColor: "#D9ECFF" },
  circleGreen: { width: 260, height: 260, bottom: -90, right: -70, backgroundColor: "#CFEFB8" },

  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 5,
  },
  backIcon: { fontSize: 22, color: "#1E2A78", fontWeight: "700" },

  header: { marginBottom: 24 },
  title: { fontSize: 38, fontWeight: "900", color: "#1E2A78" },
  titleAccent: { fontSize: 38, fontWeight: "900", color: "#FF9A1F", marginTop: -6 },
  subtitle: { marginTop: 8, color: "#5A5F9A", fontSize: 14, maxWidth: 240 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#FFC21A",
    padding: 18,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFEFC2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconText: { fontSize: 22 },
  cardTitle: { fontSize: 17, fontWeight: "800", color: "#1E2A78" },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F7FF",
    borderWidth: 2,
    borderColor: "#D9E8FA",
    borderRadius: 28,
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 17,
    fontWeight: "700",
    color: "#1E2A78",
  },
  pencil: { fontSize: 18, color: "#4DA3FF" },

  error: { color: "#E53935", marginTop: 8, marginLeft: 6, fontSize: 13 },
  hint: { marginTop: 12, marginLeft: 6, color: "#5A5F9A", fontSize: 13 },

  continueBtn: {
    marginTop: 18,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FFC21A",
    borderBottomWidth: 6,
    borderBottomColor: "#E8A50C",
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: { fontSize: 20, fontWeight: "900", color: "#1E2A78" },

  footer: {
    textAlign: "center",
    marginTop: 18,
    color: "#5A5F9A",
    fontSize: 13,
  },
});
