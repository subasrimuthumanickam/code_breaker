// // // import React, { useState } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   ScrollView,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   Share,
// // //   Platform,
// // //   ActivityIndicator,
// // // } from "react-native";
// // // import { Ionicons } from "@expo/vector-icons";

// // // const C = {
// // //   bg: "#FFF9F0",
// // //   ink: "#172033",
// // //   muted: "#7B8491",
// // //   indigo: "#5146E5",
// // //   coral: "#FF6B5A",
// // //   border: "#EEE7DD",
// // // };

// // // type IconName = React.ComponentProps<typeof Ionicons>["name"];

// // // /* ---------- shared pieces ---------- */

// // // const Shell: React.FC<{
// // //   title: string;
// // //   subtitle?: string;
// // //   onBack: () => void;
// // //   children: React.ReactNode;
// // // }> = ({ title, subtitle, onBack, children }) => (
// // //   <SafeAreaView style={s.safe}>
// // //     <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
// // //     <View style={s.header}>
// // //       <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.8}>
// // //         <Ionicons name="arrow-back" size={20} color={C.ink} />
// // //       </TouchableOpacity>
// // //       <View style={s.headerText}>
// // //         <Text style={s.title}>{title}</Text>
// // //         {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
// // //       </View>
// // //       <View style={s.spacer} />
// // //     </View>
// // //     <ScrollView
// // //       contentContainerStyle={s.body}
// // //       keyboardShouldPersistTaps="handled"
// // //       showsVerticalScrollIndicator={false}
// // //     >
// // //       <View style={s.inner}>{children}</View>
// // //     </ScrollView>
// // //   </SafeAreaView>
// // // );

// // // const VARIANTS = {
// // //   indigo: { bg: C.indigo, border: C.indigo, title: "#FFF", sub: "#DAD7FF", icon: "rgba(255,255,255,0.22)", arrow: "#FFF" },
// // //   coral: { bg: C.coral, border: C.coral, title: "#FFF", sub: "#FFE3DE", icon: "rgba(255,255,255,0.25)", arrow: "#FFF" },
// // //   softCoral: { bg: "#FFF0EB", border: "#FFE0D8", title: C.ink, sub: "#858B96", icon: C.coral, arrow: C.coral },
// // //   softIndigo: { bg: "#EEF0FF", border: "#DDE1FF", title: C.ink, sub: "#858B96", icon: C.indigo, arrow: C.indigo },
// // // };

// // // const OptionCard: React.FC<{
// // //   icon: IconName;
// // //   title: string;
// // //   subtitle: string;
// // //   variant: keyof typeof VARIANTS;
// // //   onPress: () => void;
// // // }> = ({ icon, title, subtitle, variant, onPress }) => {
// // //   const v = VARIANTS[variant];
// // //   return (
// // //     <TouchableOpacity
// // //       activeOpacity={0.88}
// // //       onPress={onPress}
// // //       style={[s.optCard, { backgroundColor: v.bg, borderColor: v.border }]}
// // //     >
// // //       <View style={[s.optIcon, { backgroundColor: v.icon }]}>
// // //         <Ionicons name={icon} size={26} color="#FFF" />
// // //       </View>
// // //       <View style={s.flex}>
// // //         <Text style={[s.optTitle, { color: v.title }]}>{title}</Text>
// // //         <Text style={[s.optSub, { color: v.sub }]}>{subtitle}</Text>
// // //       </View>
// // //       <Ionicons name="chevron-forward" size={22} color={v.arrow} />
// // //     </TouchableOpacity>
// // //   );
// // // };

// // // const Btn: React.FC<{
// // //   label: string;
// // //   icon?: IconName;
// // //   onPress: () => void;
// // //   loading?: boolean;
// // //   soft?: boolean;
// // // }> = ({ label, icon, onPress, loading, soft }) => (
// // //   <TouchableOpacity
// // //     activeOpacity={0.88}
// // //     onPress={onPress}
// // //     disabled={loading}
// // //     style={[s.btn, soft && s.btnSoft]}
// // //   >
// // //     {loading ? (
// // //       <ActivityIndicator color={soft ? C.coral : "#FFF"} />
// // //     ) : (
// // //       <>
// // //         <Text style={[s.btnText, soft && s.btnTextSoft]}>{label}</Text>
// // //         {icon ? <Ionicons name={icon} size={18} color={soft ? C.coral : "#FFF"} /> : null}
// // //       </>
// // //     )}
// // //   </TouchableOpacity>
// // // );

// // // const Tiles = () => (
// // //   <View style={s.tiles}>
// // //     {[
// // //       ["W", "#F4B942", "-6deg"],
// // //       ["O", "#3B82F6", "6deg"],
// // //       ["R", "#F15B6C", "-3deg"],
// // //       ["D", "#26B67A", "6deg"],
// // //     ].map(([ch, bg, rot]) => (
// // //       <View key={ch} style={[s.tile, { backgroundColor: bg, transform: [{ rotate: rot }] }]}>
// // //         <Text style={s.tileText}>{ch}</Text>
// // //       </View>
// // //     ))}
// // //   </View>
// // // );

// // // /* ---------- 3. PLAY MODE (Play Online / Play as Guest) ---------- */

// // // export const PlayModeScreen: React.FC<{
// // //   onBack: () => void;
// // //   onPlayOnline: () => void;
// // //   onGuest: () => void;
// // // }> = ({ onBack, onPlayOnline, onGuest }) => (
// // //   <Shell title="Word Scramble" subtitle="Choose how you want to play" onBack={onBack}>
// // //     <Tiles />
// // //     <OptionCard icon="globe-outline" title="PLAY ONLINE" subtitle="Create or join a room with other players" variant="indigo" onPress={onPlayOnline} />
// // //     <OptionCard icon="person-outline" title="PLAY AS GUEST" subtitle="No account needed. Just a nickname" variant="coral" onPress={onGuest} />
// // //   </Shell>
// // // );

// // // /* ---------- 4. CREATE / JOIN OPTIONS ---------- */

// // // export const RoomOptionsScreen: React.FC<{
// // //   guestName?: string | null;
// // //   onBack: () => void;
// // //   onCreate: () => void;
// // //   onJoin: () => void;
// // // }> = ({ guestName, onBack, onCreate, onJoin }) => (
// // //   <Shell title="Play Online" subtitle="Choose how you want to play" onBack={onBack}>
// // //     {guestName ? (
// // //       <View style={s.chip}>
// // //         <Ionicons name="person" size={14} color={C.indigo} />
// // //         <Text style={s.chipText}>Playing as {guestName}</Text>
// // //       </View>
// // //     ) : null}
// // //     <OptionCard icon="add" title="CREATE ROOM" subtitle="Start a new game and invite your friends." variant="softCoral" onPress={onCreate} />
// // //     <OptionCard icon="people" title="JOIN ROOM" subtitle="Enter room code to join a friend's game." variant="softIndigo" onPress={onJoin} />
// // //   </Shell>
// // // );

// // // /* ---------- 5. GUEST NICKNAME ---------- */

// // // export const GuestNicknameScreen: React.FC<{
// // //   defaultName?: string | null;
// // //   onBack: () => void;
// // //   onContinue: (nickname: string) => void;
// // // }> = ({ defaultName, onBack, onContinue }) => {
// // //   const [name, setName] = useState(defaultName || `Guest${Math.floor(1000 + Math.random() * 9000)}`);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const go = () => {
// // //     const n = name.trim();
// // //     if (n.length < 2 || n.length > 16) {
// // //       setError("Nickname must be 2 to 16 characters.");
// // //       return;
// // //     }
// // //     onContinue(n);
// // //   };

// // //   return (
// // //     <Shell title="Play as Guest" subtitle="No account needed. Just a nickname." onBack={onBack}>
// // //       <View style={s.avatar}>
// // //         <Ionicons name="happy-outline" size={52} color={C.indigo} />
// // //       </View>

// // //       <Text style={s.label}>NICKNAME</Text>
// // //       <View style={s.inputWrap}>
// // //         <TextInput
// // //           value={name}
// // //           onChangeText={(t) => {
// // //             setName(t);
// // //             setError(null);
// // //           }}
// // //           maxLength={16}
// // //           autoCorrect={false}
// // //           placeholder="Your nickname"
// // //           placeholderTextColor="#A0A6B2"
// // //           style={s.input}
// // //         />
// // //         <Ionicons name="pencil" size={18} color={C.muted} />
// // //       </View>
// // //       {error ? <Text style={s.error}>{error}</Text> : null}

// // //       <View style={{ height: 20 }} />
// // //       <Btn label="CONTINUE" icon="arrow-forward" onPress={go} />
// // //     </Shell>
// // //   );
// // // };

// // // /* ---------- 8. JOIN ROOM ---------- */

// // // export const JoinRoomScreen: React.FC<{
// // //   onBack: () => void;
// // //   onJoin: (code: string) => Promise<boolean>;
// // // }> = ({ onBack, onJoin }) => {
// // //   const [code, setCode] = useState("");
// // //   const [busy, setBusy] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const go = async () => {
// // //     const c = code.trim();
// // //     if (!c) {
// // //       setError("Enter the room code.");
// // //       return;
// // //     }
// // //     setBusy(true);
// // //     await onJoin(c);
// // //     setBusy(false);
// // //   };

// // //   return (
// // //     <Shell title="Join Room" subtitle="Enter the room code to join" onBack={onBack}>
// // //       <View style={s.card}>
// // //         <Text style={s.label}>ROOM CODE</Text>
// // //         <View style={s.inputWrap}>
// // //           <TextInput
// // //             value={code}
// // //             onChangeText={(t) => {
// // //               setCode(t);
// // //               setError(null);
// // //             }}
// // //             maxLength={8}
// // //             autoCapitalize="characters"
// // //             autoCorrect={false}
// // //             placeholder="Enter 4 digit code"
// // //             placeholderTextColor="#A0A6B2"
// // //             onSubmitEditing={go}
// // //             style={[s.input, { letterSpacing: 3 }]}
// // //           />
// // //           <Ionicons name="grid-outline" size={20} color={C.muted} />
// // //         </View>
// // //         {error ? <Text style={s.error}>{error}</Text> : null}
// // //         <View style={{ height: 16 }} />
// // //         <Btn label="JOIN ROOM" icon="arrow-forward" onPress={go} loading={busy} />
// // //       </View>
// // //       <Text style={s.hint}>Make sure you have the correct room code from your friend.</Text>
// // //     </Shell>
// // //   );
// // // };

// // // /* ---------- 7. ROOM CREATED ---------- */

// // // export const RoomCreatedScreen: React.FC<{
// // //   roomName: string;
// // //   roomCode: string;
// // //   onBack: () => void;
// // //   onContinue: () => void;
// // // }> = ({ roomName, roomCode, onBack, onContinue }) => {
// // //   const [copied, setCopied] = useState(false);

// // //   const share = async () => {
// // //     try {
// // //       await Share.share({ message: `Join my Word Scramble room! Code: ${roomCode}` });
// // //     } catch {}
// // //   };

// // //   const copy = async () => {
// // //     try {
// // //       const clip = (globalThis as any).navigator?.clipboard;
// // //       if (Platform.OS === "web" && clip) {
// // //         await clip.writeText(roomCode);
// // //         setCopied(true);
// // //         setTimeout(() => setCopied(false), 1500);
// // //       } else {
// // //         await share();
// // //       }
// // //     } catch {}
// // //   };

// // //   return (
// // //     <Shell title="Room Created!" subtitle={roomName} onBack={onBack}>
// // //       <View style={s.crown}>
// // //         <Ionicons name="trophy" size={44} color="#F4B942" />
// // //       </View>

// // //       <View style={s.card}>
// // //         <Text style={[s.label, { textAlign: "center" }]}>ROOM CODE</Text>
// // //         <View style={s.codeBox}>
// // //           <Text style={s.codeText}>{roomCode}</Text>
// // //           <TouchableOpacity onPress={copy} hitSlop={10}>
// // //             <Ionicons name={copied ? "checkmark" : "copy-outline"} size={22} color={C.indigo} />
// // //           </TouchableOpacity>
// // //         </View>
// // //         <Text style={s.hint}>Share this code with your friends and start the game.</Text>
// // //       </View>

// // //       <View style={{ height: 14 }} />
// // //       <Btn label="SHARE CODE" icon="share-social-outline" onPress={share} />
// // //       <View style={{ height: 10 }} />
// // //       <Btn label="GO TO WAITING ROOM" icon="arrow-forward" onPress={onContinue} soft />
// // //     </Shell>
// // //   );
// // // };

// // // /* ---------- styles ---------- */

// // // const s = StyleSheet.create({
// // //   safe: { flex: 1, backgroundColor: C.bg },
// // //   flex: { flex: 1, minWidth: 0 },
// // //   header: { height: 72, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
// // //   backBtn: {
// // //     width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF",
// // //     borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center",
// // //   },
// // //   spacer: { width: 40, height: 40 },
// // //   headerText: { flex: 1, alignItems: "center" },
// // //   title: { color: C.ink, fontSize: 20, fontWeight: "900" },
// // //   subtitle: { color: C.muted, fontSize: 12.5, marginTop: 2, textAlign: "center" },
// // //   body: { flexGrow: 1, alignItems: "center", padding: 16, paddingBottom: 40 },
// // //   inner: { width: "100%", maxWidth: 440 },

// // //   tiles: { flexDirection: "row", justifyContent: "center", gap: 9, marginVertical: 16 },
// // //   tile: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center", elevation: 3 },
// // //   tileText: { color: "#FFF", fontSize: 22, fontWeight: "900" },

// // //   optCard: {
// // //     flexDirection: "row", alignItems: "center", borderRadius: 20, borderWidth: 1,
// // //     padding: 16, marginBottom: 14, gap: 14, minHeight: 92,
// // //   },
// // //   optIcon: { width: 54, height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
// // //   optTitle: { fontSize: 15, fontWeight: "900", letterSpacing: 0.4 },
// // //   optSub: { fontSize: 12, marginTop: 3, lineHeight: 17 },

// // //   chip: {
// // //     alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6,
// // //     backgroundColor: "#EEF0FF", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, marginBottom: 16,
// // //   },
// // //   chipText: { color: C.indigo, fontSize: 12, fontWeight: "800" },

// // //   avatar: {
// // //     width: 100, height: 100, borderRadius: 50, backgroundColor: "#EEF0FF",
// // //     alignItems: "center", justifyContent: "center", alignSelf: "center", marginVertical: 22,
// // //   },
// // //   label: { color: C.muted, fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
// // //   inputWrap: {
// // //     flexDirection: "row", alignItems: "center", height: 52, backgroundColor: "#FFF",
// // //     borderRadius: 15, borderWidth: 1, borderColor: "#E5E7F5", paddingHorizontal: 14, gap: 8,
// // //   },
// // //   input: { flex: 1, minWidth: 0, color: C.ink, fontSize: 16, fontWeight: "800" },
// // //   error: { color: "#E11D48", fontSize: 12, fontWeight: "700", marginTop: 8 },
// // //   hint: { color: C.muted, fontSize: 12.5, textAlign: "center", marginTop: 14, lineHeight: 18 },

// // //   card: { backgroundColor: "#FFF", borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 18 },
// // //   crown: {
// // //     width: 84, height: 84, borderRadius: 42, backgroundColor: "#FFF4D6",
// // //     alignItems: "center", justifyContent: "center", alignSelf: "center", marginVertical: 18,
// // //   },
// // //   codeBox: {
// // //     flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14,
// // //     backgroundColor: "#F3F4FB", borderRadius: 16, paddingVertical: 14, marginBottom: 4,
// // //   },
// // //   codeText: { color: C.ink, fontSize: 38, fontWeight: "900", letterSpacing: 6 },

// // //   btn: {
// // //     height: 52, borderRadius: 15, backgroundColor: C.indigo, flexDirection: "row",
// // //     alignItems: "center", justifyContent: "center", gap: 8,
// // //   },
// // //   btnSoft: { backgroundColor: "#FFEDEA", borderWidth: 1, borderColor: "#FFD9D1" },
// // //   btnText: { color: "#FFF", fontSize: 14, fontWeight: "900", letterSpacing: 0.8 },
// // //   btnTextSoft: { color: C.coral },
// // // });
// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   ScrollView,
// //   SafeAreaView,
// //   StatusBar,
// //   Share,
// //   Platform,
// //   ActivityIndicator,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";

// // const C = {
// //   bg: "#FFF9F0",
// //   ink: "#172033",
// //   muted: "#7B8491",
// //   indigo: "#5146E5",
// //   coral: "#FF6B5A",
// //   border: "#EEE7DD",
// // };

// // type IconName = React.ComponentProps<typeof Ionicons>["name"];

// // /* ---------- shared pieces ---------- */

// // const Shell: React.FC<{
// //   title: string;
// //   subtitle?: string;
// //   onBack: () => void;
// //   children: React.ReactNode;
// // }> = ({ title, subtitle, onBack, children }) => (
// //   <SafeAreaView style={s.safe}>
// //     <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
// //     <View style={s.header}>
// //       <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.8}>
// //         <Ionicons name="arrow-back" size={20} color={C.ink} />
// //       </TouchableOpacity>
// //       <View style={s.headerText}>
// //         <Text style={s.title}>{title}</Text>
// //         {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
// //       </View>
// //       <View style={s.spacer} />
// //     </View>
// //     <ScrollView
// //       contentContainerStyle={s.body}
// //       keyboardShouldPersistTaps="handled"
// //       showsVerticalScrollIndicator={false}
// //     >
// //       <View style={s.inner}>{children}</View>
// //     </ScrollView>
// //   </SafeAreaView>
// // );

// // const VARIANTS = {
// //   indigo: { bg: C.indigo, border: C.indigo, title: "#FFF", sub: "#DAD7FF", icon: "rgba(255,255,255,0.22)", arrow: "#FFF" },
// //   coral: { bg: C.coral, border: C.coral, title: "#FFF", sub: "#FFE3DE", icon: "rgba(255,255,255,0.25)", arrow: "#FFF" },
// //   softCoral: { bg: "#FFF0EB", border: "#FFE0D8", title: C.ink, sub: "#858B96", icon: C.coral, arrow: C.coral },
// //   softIndigo: { bg: "#EEF0FF", border: "#DDE1FF", title: C.ink, sub: "#858B96", icon: C.indigo, arrow: C.indigo },
// // };

// // const OptionCard: React.FC<{
// //   icon: IconName;
// //   title: string;
// //   subtitle: string;
// //   variant: keyof typeof VARIANTS;
// //   onPress: () => void;
// // }> = ({ icon, title, subtitle, variant, onPress }) => {
// //   const v = VARIANTS[variant];
// //   return (
// //     <TouchableOpacity
// //       activeOpacity={0.88}
// //       onPress={onPress}
// //       style={[s.optCard, { backgroundColor: v.bg, borderColor: v.border }]}
// //     >
// //       <View style={[s.optIcon, { backgroundColor: v.icon }]}>
// //         <Ionicons name={icon} size={26} color="#FFF" />
// //       </View>
// //       <View style={s.flex}>
// //         <Text style={[s.optTitle, { color: v.title }]}>{title}</Text>
// //         <Text style={[s.optSub, { color: v.sub }]}>{subtitle}</Text>
// //       </View>
// //       <Ionicons name="chevron-forward" size={22} color={v.arrow} />
// //     </TouchableOpacity>
// //   );
// // };

// // const Btn: React.FC<{
// //   label: string;
// //   icon?: IconName;
// //   onPress: () => void;
// //   loading?: boolean;
// //   soft?: boolean;
// // }> = ({ label, icon, onPress, loading, soft }) => (
// //   <TouchableOpacity
// //     activeOpacity={0.88}
// //     onPress={onPress}
// //     disabled={loading}
// //     style={[s.btn, soft && s.btnSoft]}
// //   >
// //     {loading ? (
// //       <ActivityIndicator color={soft ? C.coral : "#FFF"} />
// //     ) : (
// //       <>
// //         <Text style={[s.btnText, soft && s.btnTextSoft]}>{label}</Text>
// //         {icon ? <Ionicons name={icon} size={18} color={soft ? C.coral : "#FFF"} /> : null}
// //       </>
// //     )}
// //   </TouchableOpacity>
// // );

// // const Tiles = () => (
// //   <View style={s.tiles}>
// //     {[
// //       ["W", "#F4B942", "-6deg"],
// //       ["O", "#3B82F6", "6deg"],
// //       ["R", "#F15B6C", "-3deg"],
// //       ["D", "#26B67A", "6deg"],
// //     ].map(([ch, bg, rot]) => (
// //       <View key={ch} style={[s.tile, { backgroundColor: bg, transform: [{ rotate: rot }] }]}>
// //         <Text style={s.tileText}>{ch}</Text>
// //       </View>
// //     ))}
// //   </View>
// // );

// // /* ---------- 3. PLAY MODE (Play Online / Play as Guest) ---------- */

// // export const PlayModeScreen: React.FC<{
// //   onBack: () => void;
// //   onPlayOnline: () => void;
// //   onGuest: () => void;
// // }> = ({ onBack, onPlayOnline, onGuest }) => (
// //   <Shell title="Word Scramble" subtitle="Choose how you want to play" onBack={onBack}>
// //     <Tiles />
// //     <OptionCard icon="globe-outline" title="PLAY ONLINE" subtitle="Create or join a room with other players" variant="indigo" onPress={onPlayOnline} />
// //     <OptionCard icon="person-outline" title="PLAY AS GUEST" subtitle="No account needed. Just a nickname" variant="coral" onPress={onGuest} />
// //   </Shell>
// // );

// // /* ---------- 4. CREATE / JOIN OPTIONS ---------- */

// // export const RoomOptionsScreen: React.FC<{
// //   guestName?: string | null;
// //   onBack: () => void;
// //   onCreate: () => void;
// //   onJoin: () => void;
// //   onChangeName?: () => void;
// // }> = ({ guestName, onBack, onCreate, onJoin, onChangeName }) => (
// //   <Shell
// //     title={guestName ? "Play as Guest" : "Play Online"}
// //     subtitle={
// //       guestName
// //         ? "Create a room or join a friend's game"
// //         : "Choose how you want to play"
// //     }
// //     onBack={onBack}
// //   >
// //     {guestName ? (
// //       <TouchableOpacity
// //         activeOpacity={0.8}
// //         onPress={onChangeName}
// //         disabled={!onChangeName}
// //         style={s.chip}
// //       >
// //         <Ionicons name="person" size={14} color={C.indigo} />
// //         <Text style={s.chipText}>Playing as {guestName}</Text>
// //         {onChangeName ? (
// //           <Ionicons name="pencil" size={12} color={C.indigo} />
// //         ) : null}
// //       </TouchableOpacity>
// //     ) : null}

// //     <OptionCard
// //       icon="add"
// //       title="CREATE ROOM"
// //       subtitle="Start a new game and share the code with friends."
// //       variant="softCoral"
// //       onPress={onCreate}
// //     />
// //     <OptionCard
// //       icon="people"
// //       title="JOIN ROOM"
// //       subtitle="Enter a room code to join a friend's game."
// //       variant="softIndigo"
// //       onPress={onJoin}
// //     />
// //   </Shell>
// // );

// // /* ---------- 5. GUEST NICKNAME ---------- */

// // export const GuestNicknameScreen: React.FC<{
// //   defaultName?: string | null;
// //   onBack: () => void;
// //   onContinue: (nickname: string) => void;
// // }> = ({ defaultName, onBack, onContinue }) => {
// //   const [name, setName] = useState(defaultName || `Guest${Math.floor(1000 + Math.random() * 9000)}`);
// //   const [error, setError] = useState<string | null>(null);

// //   const go = () => {
// //     const n = name.trim();
// //     if (n.length < 2 || n.length > 16) {
// //       setError("Nickname must be 2 to 16 characters.");
// //       return;
// //     }
// //     onContinue(n);
// //   };

// //   return (
// //     <Shell title="Play as Guest" subtitle="No account needed. Just a nickname." onBack={onBack}>
// //       <View style={s.avatar}>
// //         <Ionicons name="happy-outline" size={52} color={C.indigo} />
// //       </View>

// //       <Text style={s.label}>NICKNAME</Text>
// //       <View style={s.inputWrap}>
// //         <TextInput
// //           value={name}
// //           onChangeText={(t) => {
// //             setName(t);
// //             setError(null);
// //           }}
// //           maxLength={16}
// //           autoCorrect={false}
// //           placeholder="Your nickname"
// //           placeholderTextColor="#A0A6B2"
// //           style={s.input}
// //         />
// //         <Ionicons name="pencil" size={18} color={C.muted} />
// //       </View>
// //       {error ? <Text style={s.error}>{error}</Text> : null}

// //       <View style={{ height: 20 }} />
// //       <Btn label="CONTINUE" icon="arrow-forward" onPress={go} />
// //     </Shell>
// //   );
// // };

// // /* ---------- 8. JOIN ROOM ---------- */

// // export const JoinRoomScreen: React.FC<{
// //   onBack: () => void;
// //   onJoin: (code: string) => Promise<boolean>;
// // }> = ({ onBack, onJoin }) => {
// //   const [code, setCode] = useState("");
// //   const [busy, setBusy] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   const go = async () => {
// //     const c = code.trim();
// //     if (!c) {
// //       setError("Enter the room code.");
// //       return;
// //     }
// //     setBusy(true);
// //     await onJoin(c);
// //     setBusy(false);
// //   };

// //   return (
// //     <Shell title="Join Room" subtitle="Enter the room code to join" onBack={onBack}>
// //       <View style={s.card}>
// //         <Text style={s.label}>ROOM CODE</Text>
// //         <View style={s.inputWrap}>
// //           <TextInput
// //             value={code}
// //             onChangeText={(t) => {
// //               setCode(t);
// //               setError(null);
// //             }}
// //             maxLength={8}
// //             autoCapitalize="characters"
// //             autoCorrect={false}
// //             placeholder="Enter 4 digit code"
// //             placeholderTextColor="#A0A6B2"
// //             onSubmitEditing={go}
// //             style={[s.input, { letterSpacing: 3 }]}
// //           />
// //           <Ionicons name="grid-outline" size={20} color={C.muted} />
// //         </View>
// //         {error ? <Text style={s.error}>{error}</Text> : null}
// //         <View style={{ height: 16 }} />
// //         <Btn label="JOIN ROOM" icon="arrow-forward" onPress={go} loading={busy} />
// //       </View>
// //       <Text style={s.hint}>Make sure you have the correct room code from your friend.</Text>
// //     </Shell>
// //   );
// // };

// // /* ---------- 7. ROOM CREATED ---------- */

// // export const RoomCreatedScreen: React.FC<{
// //   roomName: string;
// //   roomCode: string;
// //   onBack: () => void;
// //   onContinue: () => void;
// // }> = ({ roomName, roomCode, onBack, onContinue }) => {
// //   const [copied, setCopied] = useState(false);

// //   const share = async () => {
// //     try {
// //       await Share.share({ message: `Join my Word Scramble room! Code: ${roomCode}` });
// //     } catch {}
// //   };

// //   const copy = async () => {
// //     try {
// //       const clip = (globalThis as any).navigator?.clipboard;
// //       if (Platform.OS === "web" && clip) {
// //         await clip.writeText(roomCode);
// //         setCopied(true);
// //         setTimeout(() => setCopied(false), 1500);
// //       } else {
// //         await share();
// //       }
// //     } catch {}
// //   };

// //   return (
// //     <Shell title="Room Created!" subtitle={roomName} onBack={onBack}>
// //       <View style={s.crown}>
// //         <Ionicons name="trophy" size={44} color="#F4B942" />
// //       </View>

// //       <View style={s.card}>
// //         <Text style={[s.label, { textAlign: "center" }]}>ROOM CODE</Text>
// //         <View style={s.codeBox}>
// //           <Text style={s.codeText}>{roomCode}</Text>
// //           <TouchableOpacity onPress={copy} hitSlop={10}>
// //             <Ionicons name={copied ? "checkmark" : "copy-outline"} size={22} color={C.indigo} />
// //           </TouchableOpacity>
// //         </View>
// //         <Text style={s.hint}>Share this code with your friends and start the game.</Text>
// //       </View>

// //       <View style={{ height: 14 }} />
// //       <Btn label="SHARE CODE" icon="share-social-outline" onPress={share} />
// //       <View style={{ height: 10 }} />
// //       <Btn label="GO TO WAITING ROOM" icon="arrow-forward" onPress={onContinue} soft />
// //     </Shell>
// //   );
// // };

// // /* ---------- styles ---------- */

// // const s = StyleSheet.create({
// //   safe: { flex: 1, backgroundColor: C.bg },
// //   flex: { flex: 1, minWidth: 0 },
// //   header: { height: 72, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
// //   backBtn: {
// //     width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF",
// //     borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center",
// //   },
// //   spacer: { width: 40, height: 40 },
// //   headerText: { flex: 1, alignItems: "center" },
// //   title: { color: C.ink, fontSize: 20, fontWeight: "900" },
// //   subtitle: { color: C.muted, fontSize: 12.5, marginTop: 2, textAlign: "center" },
// //   body: { flexGrow: 1, alignItems: "center", padding: 16, paddingBottom: 40 },
// //   inner: { width: "100%", maxWidth: 440 },

// //   tiles: { flexDirection: "row", justifyContent: "center", gap: 9, marginVertical: 16 },
// //   tile: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center", elevation: 3 },
// //   tileText: { color: "#FFF", fontSize: 22, fontWeight: "900" },

// //   optCard: {
// //     flexDirection: "row", alignItems: "center", borderRadius: 20, borderWidth: 1,
// //     padding: 16, marginBottom: 14, gap: 14, minHeight: 92,
// //   },
// //   optIcon: { width: 54, height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
// //   optTitle: { fontSize: 15, fontWeight: "900", letterSpacing: 0.4 },
// //   optSub: { fontSize: 12, marginTop: 3, lineHeight: 17 },

// //   chip: {
// //     alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6,
// //     backgroundColor: "#EEF0FF", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, marginBottom: 16,
// //   },
// //   chipText: { color: C.indigo, fontSize: 12, fontWeight: "800" },

// //   avatar: {
// //     width: 100, height: 100, borderRadius: 50, backgroundColor: "#EEF0FF",
// //     alignItems: "center", justifyContent: "center", alignSelf: "center", marginVertical: 22,
// //   },
// //   label: { color: C.muted, fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
// //   inputWrap: {
// //     flexDirection: "row", alignItems: "center", height: 52, backgroundColor: "#FFF",
// //     borderRadius: 15, borderWidth: 1, borderColor: "#E5E7F5", paddingHorizontal: 14, gap: 8,
// //   },
// //   input: { flex: 1, minWidth: 0, color: C.ink, fontSize: 16, fontWeight: "800" },
// //   error: { color: "#E11D48", fontSize: 12, fontWeight: "700", marginTop: 8 },
// //   hint: { color: C.muted, fontSize: 12.5, textAlign: "center", marginTop: 14, lineHeight: 18 },

// //   card: { backgroundColor: "#FFF", borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 18 },
// //   crown: {
// //     width: 84, height: 84, borderRadius: 42, backgroundColor: "#FFF4D6",
// //     alignItems: "center", justifyContent: "center", alignSelf: "center", marginVertical: 18,
// //   },
// //   codeBox: {
// //     flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14,
// //     backgroundColor: "#F3F4FB", borderRadius: 16, paddingVertical: 14, marginBottom: 4,
// //   },
// //   codeText: { color: C.ink, fontSize: 38, fontWeight: "900", letterSpacing: 6 },

// //   btn: {
// //     height: 52, borderRadius: 15, backgroundColor: C.indigo, flexDirection: "row",
// //     alignItems: "center", justifyContent: "center", gap: 8,
// //   },
// //   btnSoft: { backgroundColor: "#FFEDEA", borderWidth: 1, borderColor: "#FFD9D1" },
// //   btnText: { color: "#FFF", fontSize: 14, fontWeight: "900", letterSpacing: 0.8 },
// //   btnTextSoft: { color: C.coral },
// // });
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   Share,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const C = {
//   bg: "#FFF9F0",
//   ink: "#172033",
//   muted: "#7B8491",
//   indigo: "#5146E5",
//   coral: "#FF6B5A",
//   border: "#EEE7DD",
// };

// type IconName = React.ComponentProps<typeof Ionicons>["name"];

// /* ---------- shared pieces ---------- */

// const Shell: React.FC<{
//   title: string;
//   subtitle?: string;
//   onBack: () => void;
//   children: React.ReactNode;
// }> = ({ title, subtitle, onBack, children }) => (
//   <SafeAreaView style={s.safe}>
//     <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
//     <View style={s.header}>
//       <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.8}>
//         <Ionicons name="arrow-back" size={20} color={C.ink} />
//       </TouchableOpacity>
//       <View style={s.headerText}>
//         <Text style={s.title}>{title}</Text>
//         {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
//       </View>
//       <View style={s.spacer} />
//     </View>
//     <ScrollView
//       contentContainerStyle={s.body}
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={false}
//     >
//       <View style={s.inner}>{children}</View>
//     </ScrollView>
//   </SafeAreaView>
// );

// const VARIANTS = {
//   indigo: { bg: C.indigo, border: C.indigo, title: "#FFF", sub: "#DAD7FF", icon: "rgba(255,255,255,0.22)", arrow: "#FFF" },
//   coral: { bg: C.coral, border: C.coral, title: "#FFF", sub: "#FFE3DE", icon: "rgba(255,255,255,0.25)", arrow: "#FFF" },
//   softCoral: { bg: "#FFF0EB", border: "#FFE0D8", title: C.ink, sub: "#858B96", icon: C.coral, arrow: C.coral },
//   softIndigo: { bg: "#EEF0FF", border: "#DDE1FF", title: C.ink, sub: "#858B96", icon: C.indigo, arrow: C.indigo },
// };

// const OptionCard: React.FC<{
//   icon: IconName;
//   title: string;
//   subtitle: string;
//   variant: keyof typeof VARIANTS;
//   onPress: () => void;
// }> = ({ icon, title, subtitle, variant, onPress }) => {
//   const v = VARIANTS[variant];
//   return (
//     <TouchableOpacity
//       activeOpacity={0.88}
//       onPress={onPress}
//       style={[s.optCard, { backgroundColor: v.bg, borderColor: v.border }]}
//     >
//       <View style={[s.optIcon, { backgroundColor: v.icon }]}>
//         <Ionicons name={icon} size={26} color="#FFF" />
//       </View>
//       <View style={s.flex}>
//         <Text style={[s.optTitle, { color: v.title }]}>{title}</Text>
//         <Text style={[s.optSub, { color: v.sub }]}>{subtitle}</Text>
//       </View>
//       <Ionicons name="chevron-forward" size={22} color={v.arrow} />
//     </TouchableOpacity>
//   );
// };

// const Btn: React.FC<{
//   label: string;
//   icon?: IconName;
//   onPress: () => void;
//   loading?: boolean;
//   soft?: boolean;
// }> = ({ label, icon, onPress, loading, soft }) => (
//   <TouchableOpacity
//     activeOpacity={0.88}
//     onPress={onPress}
//     disabled={loading}
//     style={[s.btn, soft && s.btnSoft]}
//   >
//     {loading ? (
//       <ActivityIndicator color={soft ? C.coral : "#FFF"} />
//     ) : (
//       <>
//         <Text style={[s.btnText, soft && s.btnTextSoft]}>{label}</Text>
//         {icon ? <Ionicons name={icon} size={18} color={soft ? C.coral : "#FFF"} /> : null}
//       </>
//     )}
//   </TouchableOpacity>
// );

// const Tiles = () => (
//   <View style={s.tiles}>
//     {[
//       ["W", "#F4B942", "-6deg"],
//       ["O", "#3B82F6", "6deg"],
//       ["R", "#F15B6C", "-3deg"],
//       ["D", "#26B67A", "6deg"],
//     ].map(([ch, bg, rot]) => (
//       <View key={ch} style={[s.tile, { backgroundColor: bg, transform: [{ rotate: rot }] }]}>
//         <Text style={s.tileText}>{ch}</Text>
//       </View>
//     ))}
//   </View>
// );

// /* ---------- 3. PLAY MODE (Play Online / Play as Guest) ---------- */

// export const PlayModeScreen: React.FC<{
//   onBack: () => void;
//   onPlayOnline: () => void;
//   onGuest: () => void;
// }> = ({ onBack, onPlayOnline, onGuest }) => (
//   <Shell title="Word Scramble" subtitle="Choose how you want to play" onBack={onBack}>
//     <Tiles />
//     <OptionCard icon="globe-outline" title="PLAY ONLINE" subtitle="Create or join a room with other players" variant="indigo" onPress={onPlayOnline} />
//     <OptionCard icon="person-outline" title="PLAY AS GUEST" subtitle="No account needed. Just a nickname" variant="coral" onPress={onGuest} />
//   </Shell>
// );

// /* ---------- 4. CREATE / JOIN OPTIONS ---------- */

// export const RoomOptionsScreen: React.FC<{
//   guestName?: string | null;
//   onBack: () => void;
//   onCreate: () => void;
//   onJoin: () => void;
//   onChangeName?: () => void;
// }> = ({ guestName, onBack, onCreate, onJoin, onChangeName }) => (
//   <Shell
//     title={guestName ? "Play as Guest" : "Play Online"}
//     subtitle={
//       guestName
//         ? "Create a room or join a friend's game"
//         : "Choose how you want to play"
//     }
//     onBack={onBack}
//   >
//     {guestName ? (
//       <TouchableOpacity
//         activeOpacity={0.8}
//         onPress={onChangeName}
//         disabled={!onChangeName}
//         style={s.chip}
//       >
//         <Ionicons name="person" size={14} color={C.indigo} />
//         <Text style={s.chipText}>Playing as {guestName}</Text>
//         {onChangeName ? (
//           <Ionicons name="pencil" size={12} color={C.indigo} />
//         ) : null}
//       </TouchableOpacity>
//     ) : null}

//     <OptionCard
//       icon="add"
//       title="CREATE ROOM"
//       subtitle="Start a new game and share the code with friends."
//       variant="softCoral"
//       onPress={onCreate}
//     />
//     <OptionCard
//       icon="people"
//       title="JOIN ROOM"
//       subtitle="Enter a room code to join a friend's game."
//       variant="softIndigo"
//       onPress={onJoin}
//     />
//   </Shell>
// );

// /* ---------- 5. GUEST NICKNAME ---------- */

// export const GuestNicknameScreen: React.FC<{
//   defaultName?: string | null;
//   onBack: () => void;
//   onContinue: (nickname: string) => void;
// }> = ({ defaultName, onBack, onContinue }) => {
//   const [name, setName] = useState(defaultName || `Guest${Math.floor(1000 + Math.random() * 9000)}`);
//   const [error, setError] = useState<string | null>(null);

//   const go = () => {
//     const n = name.trim();
//     if (n.length < 2 || n.length > 16) {
//       setError("Nickname must be 2 to 16 characters.");
//       return;
//     }
//     onContinue(n);
//   };

//   return (
//     <Shell title="Play as Guest" subtitle="No account needed. Just a nickname." onBack={onBack}>
//       <View style={s.avatar}>
//         <Ionicons name="happy-outline" size={52} color={C.indigo} />
//       </View>

//       <Text style={s.label}>NICKNAME</Text>
//       <View style={s.inputWrap}>
//         <TextInput
//           value={name}
//           onChangeText={(t) => {
//             setName(t);
//             setError(null);
//           }}
//           maxLength={16}
//           autoCorrect={false}
//           placeholder="Your nickname"
//           placeholderTextColor="#A0A6B2"
//           style={s.input}
//         />
//         <Ionicons name="pencil" size={18} color={C.muted} />
//       </View>
//       {error ? <Text style={s.error}>{error}</Text> : null}

//       <View style={{ height: 20 }} />
//       <Btn label="CONTINUE" icon="arrow-forward" onPress={go} />
//     </Shell>
//   );
// };

// /* ---------- 8. JOIN ROOM ---------- */

// export const JoinRoomScreen: React.FC<{
//   onBack: () => void;
//   onJoin: (code: string) => Promise<boolean>;
// }> = ({ onBack, onJoin }) => {
//   const [code, setCode] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const go = async () => {
//     const c = code.trim();
//     if (!c) {
//       setError("Enter the room code.");
//       return;
//     }
//     setBusy(true);
//     await onJoin(c);
//     setBusy(false);
//   };

//   return (
//     <Shell title="Join Room" subtitle="Enter the room code to join" onBack={onBack}>
//       <View style={s.card}>
//         <Text style={s.label}>ROOM CODE</Text>
//         <View style={s.inputWrap}>
//           <TextInput
//             value={code}
//             onChangeText={(t) => {
//               setCode(t);
//               setError(null);
//             }}
//             maxLength={8}
//             autoCapitalize="characters"
//             autoCorrect={false}
//             placeholder="Enter 4 digit code"
//             placeholderTextColor="#A0A6B2"
//             onSubmitEditing={go}
//             style={[s.input, { letterSpacing: 3 }]}
//           />
//           <Ionicons name="grid-outline" size={20} color={C.muted} />
//         </View>
//         {error ? <Text style={s.error}>{error}</Text> : null}
//         <View style={{ height: 16 }} />
//         <Btn label="JOIN ROOM" icon="arrow-forward" onPress={go} loading={busy} />
//       </View>
//       <Text style={s.hint}>Make sure you have the correct room code from your friend.</Text>
//     </Shell>
//   );
// };

// /* ---------- 7. ROOM CREATED ---------- */

// export const RoomCreatedScreen: React.FC<{
//   roomName: string;
//   roomCode: string;
//   onBack: () => void;
//   onContinue: () => void;
// }> = ({ roomName, roomCode, onBack, onContinue }) => {
//   const [copied, setCopied] = useState(false);

//   const share = async () => {
//     try {
//       await Share.share({ message: `Join my Word Scramble room! Code: ${roomCode}` });
//     } catch {}
//   };

//   const copy = async () => {
//     try {
//       const clip = (globalThis as any).navigator?.clipboard;
//       if (Platform.OS === "web" && clip) {
//         await clip.writeText(roomCode);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 1500);
//       } else {
//         await share();
//       }
//     } catch {}
//   };

//   return (
//     <Shell title="Room Created!" subtitle={roomName} onBack={onBack}>
//       <View style={s.crown}>
//         <Ionicons name="trophy" size={44} color="#F4B942" />
//       </View>

//       <View style={s.card}>
//         <Text style={[s.label, { textAlign: "center" }]}>ROOM CODE</Text>
//         <View style={s.codeBox}>
//           <Text style={s.codeText}>{roomCode}</Text>
//           <TouchableOpacity onPress={copy} hitSlop={10}>
//             <Ionicons name={copied ? "checkmark" : "copy-outline"} size={22} color={C.indigo} />
//           </TouchableOpacity>
//         </View>
//         <Text style={s.hint}>Share this code with your friends and start the game.</Text>
//       </View>

//       <View style={{ height: 14 }} />
//       <Btn label="SHARE CODE" icon="share-social-outline" onPress={share} />
//       <View style={{ height: 10 }} />
//       <Btn label="GO TO WAITING ROOM" icon="arrow-forward" onPress={onContinue} soft />
//     </Shell>
//   );
// };

// /* ---------- styles ---------- */

// const s = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: C.bg },
//   flex: { flex: 1, minWidth: 0 },
//   header: { height: 72, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
//   backBtn: {
//     width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF",
//     borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center",
//   },
//   spacer: { width: 40, height: 40 },
//   headerText: { flex: 1, alignItems: "center" },
//   title: { color: C.ink, fontSize: 20, fontWeight: "900" },
//   subtitle: { color: C.muted, fontSize: 12.5, marginTop: 2, textAlign: "center" },
//   body: { flexGrow: 1, alignItems: "center", padding: 16, paddingBottom: 40 },
//   inner: { width: "100%", maxWidth: 440 },

//   tiles: { flexDirection: "row", justifyContent: "center", gap: 9, marginVertical: 16 },
//   tile: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center", elevation: 3 },
//   tileText: { color: "#FFF", fontSize: 22, fontWeight: "900" },

//   optCard: {
//     flexDirection: "row", alignItems: "center", borderRadius: 20, borderWidth: 1,
//     padding: 16, marginBottom: 14, gap: 14, minHeight: 92,
//   },
//   optIcon: { width: 54, height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
//   optTitle: { fontSize: 15, fontWeight: "900", letterSpacing: 0.4 },
//   optSub: { fontSize: 12, marginTop: 3, lineHeight: 17 },

//   chip: {
//     alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6,
//     backgroundColor: "#EEF0FF", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, marginBottom: 16,
//   },
//   chipText: { color: C.indigo, fontSize: 12, fontWeight: "800" },

//   avatar: {
//     width: 100, height: 100, borderRadius: 50, backgroundColor: "#EEF0FF",
//     alignItems: "center", justifyContent: "center", alignSelf: "center", marginVertical: 22,
//   },
//   label: { color: C.muted, fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
//   inputWrap: {
//     flexDirection: "row", alignItems: "center", height: 52, backgroundColor: "#FFF",
//     borderRadius: 15, borderWidth: 1, borderColor: "#E5E7F5", paddingHorizontal: 14, gap: 8,
//   },
//   input: { flex: 1, minWidth: 0, color: C.ink, fontSize: 16, fontWeight: "800" },
//   error: { color: "#E11D48", fontSize: 12, fontWeight: "700", marginTop: 8 },
//   hint: { color: C.muted, fontSize: 12.5, textAlign: "center", marginTop: 14, lineHeight: 18 },

//   card: { backgroundColor: "#FFF", borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 18 },
//   crown: {
//     width: 84, height: 84, borderRadius: 42, backgroundColor: "#FFF4D6",
//     alignItems: "center", justifyContent: "center", alignSelf: "center", marginVertical: 18,
//   },
//   codeBox: {
//     flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14,
//     backgroundColor: "#F3F4FB", borderRadius: 16, paddingVertical: 14, marginBottom: 4,
//   },
//   codeText: { color: C.ink, fontSize: 38, fontWeight: "900", letterSpacing: 6 },

//   btn: {
//     height: 52, borderRadius: 15, backgroundColor: C.indigo, flexDirection: "row",
//     alignItems: "center", justifyContent: "center", gap: 8,
//   },
//   btnSoft: { backgroundColor: "#FFEDEA", borderWidth: 1, borderColor: "#FFD9D1" },
//   btnText: { color: "#FFF", fontSize: 14, fontWeight: "900", letterSpacing: 0.8 },
//   btnTextSoft: { color: C.coral },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Share,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WordScrambleAnimatedBackground from "../components/WordScrambleAnimatedBackground";

const C = {
  bg: "#FFF9F0",
  ink: "#172033",
  muted: "#7B8491",
  indigo: "#5146E5",
  coral: "#FF6B5A",
  border: "#EEE7DD",
};

type IconName = React.ComponentProps<typeof Ionicons>["name"];

/* ---------- shared pieces ---------- */

const Shell: React.FC<{
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: React.ReactNode;
}> = ({ title, subtitle, onBack, children }) => (
  <View style={s.root}>
    <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

    {/* NEW: animated background - FIRST child, behind everything */}
    <WordScrambleAnimatedBackground backgroundColor={C.bg} />

    {/* CHANGED: transparent, so the animation shows through */}
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={C.ink} />
        </TouchableOpacity>
        <View style={s.headerText}>
          <Text style={s.title}>{title}</Text>
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={s.spacer} />
      </View>
      <ScrollView
        contentContainerStyle={s.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  </View>
);

const VARIANTS = {
  indigo: { bg: C.indigo, border: C.indigo, title: "#FFF", sub: "#DAD7FF", icon: "rgba(255,255,255,0.22)", arrow: "#FFF" },
  coral: { bg: C.coral, border: C.coral, title: "#FFF", sub: "#FFE3DE", icon: "rgba(255,255,255,0.25)", arrow: "#FFF" },
  softCoral: { bg: "#FFF0EB", border: "#FFE0D8", title: C.ink, sub: "#858B96", icon: C.coral, arrow: C.coral },
  softIndigo: { bg: "#EEF0FF", border: "#DDE1FF", title: C.ink, sub: "#858B96", icon: C.indigo, arrow: C.indigo },
};

const OptionCard: React.FC<{
  icon: IconName;
  title: string;
  subtitle: string;
  variant: keyof typeof VARIANTS;
  onPress: () => void;
}> = ({ icon, title, subtitle, variant, onPress }) => {
  const v = VARIANTS[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[s.optCard, { backgroundColor: v.bg, borderColor: v.border }]}
    >
      <View style={[s.optIcon, { backgroundColor: v.icon }]}>
        <Ionicons name={icon} size={26} color="#FFF" />
      </View>
      <View style={s.flex}>
        <Text style={[s.optTitle, { color: v.title }]}>{title}</Text>
        <Text style={[s.optSub, { color: v.sub }]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={v.arrow} />
    </TouchableOpacity>
  );
};

const Btn: React.FC<{
  label: string;
  icon?: IconName;
  onPress: () => void;
  loading?: boolean;
  soft?: boolean;
}> = ({ label, icon, onPress, loading, soft }) => (
  <TouchableOpacity
    activeOpacity={0.88}
    onPress={onPress}
    disabled={loading}
    style={[s.btn, soft && s.btnSoft]}
  >
    {loading ? (
      <ActivityIndicator color={soft ? C.coral : "#FFF"} />
    ) : (
      <>
        <Text style={[s.btnText, soft && s.btnTextSoft]}>{label}</Text>
        {icon ? <Ionicons name={icon} size={18} color={soft ? C.coral : "#FFF"} /> : null}
      </>
    )}
  </TouchableOpacity>
);

const Tiles = () => (
  <View style={s.tiles}>
    {[
      ["W", "#F4B942", "-6deg"],
      ["O", "#3B82F6", "6deg"],
      ["R", "#F15B6C", "-3deg"],
      ["D", "#26B67A", "6deg"],
    ].map(([ch, bg, rot]) => (
      <View key={ch} style={[s.tile, { backgroundColor: bg, transform: [{ rotate: rot }] }]}>
        <Text style={s.tileText}>{ch}</Text>
      </View>
    ))}
  </View>
);

/* ---------- 3. PLAY MODE (Play Online / Play as Guest) ---------- */

export const PlayModeScreen: React.FC<{
  onBack: () => void;
  onPlayOnline: () => void;
  onGuest: () => void;
}> = ({ onBack, onPlayOnline, onGuest }) => (
  <Shell title="Word Scramble" subtitle="Choose how you want to play" onBack={onBack}>
    <Tiles />
    <OptionCard icon="globe-outline" title="PLAY ONLINE" subtitle="Create or join a room with other players" variant="indigo" onPress={onPlayOnline} />
    <OptionCard icon="person-outline" title="PLAY AS GUEST" subtitle="No account needed. Just a nickname" variant="coral" onPress={onGuest} />
  </Shell>
);

/* ---------- 4. CREATE / JOIN OPTIONS ---------- */

export const RoomOptionsScreen: React.FC<{
  guestName?: string | null;
  onBack: () => void;
  onCreate: () => void;
  onJoin: () => void;
  onChangeName?: () => void;
}> = ({ guestName, onBack, onCreate, onJoin, onChangeName }) => (
  <Shell
    title={guestName ? "Play as Guest" : "Play Online"}
    subtitle={
      guestName
        ? "Create a room or join a friend's game"
        : "Choose how you want to play"
    }
    onBack={onBack}
  >
    {guestName ? (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onChangeName}
        disabled={!onChangeName}
        style={s.chip}
      >
        <Ionicons name="person" size={14} color={C.indigo} />
        <Text style={s.chipText}>Playing as {guestName}</Text>
        {onChangeName ? (
          <Ionicons name="pencil" size={12} color={C.indigo} />
        ) : null}
      </TouchableOpacity>
    ) : null}

    <OptionCard
      icon="add"
      title="CREATE ROOM"
      subtitle="Start a new game and share the code with friends."
      variant="softCoral"
      onPress={onCreate}
    />
    <OptionCard
      icon="people"
      title="JOIN ROOM"
      subtitle="Enter a room code to join a friend's game."
      variant="softIndigo"
      onPress={onJoin}
    />
  </Shell>
);

/* ---------- 5. GUEST NICKNAME ---------- */

export const GuestNicknameScreen: React.FC<{
  defaultName?: string | null;
  onBack: () => void;
  onContinue: (nickname: string) => void;
}> = ({ defaultName, onBack, onContinue }) => {
  const [name, setName] = useState(defaultName || `Guest${Math.floor(1000 + Math.random() * 9000)}`);
  const [error, setError] = useState<string | null>(null);

  const go = () => {
    const n = name.trim();
    if (n.length < 2 || n.length > 16) {
      setError("Nickname must be 2 to 16 characters.");
      return;
    }
    onContinue(n);
  };

  return (
    <Shell title="Play as Guest" subtitle="No account needed. Just a nickname." onBack={onBack}>
      <View style={s.avatar}>
        <Ionicons name="happy-outline" size={52} color={C.indigo} />
      </View>

      <Text style={s.label}>NICKNAME</Text>
      <View style={s.inputWrap}>
        <TextInput
          value={name}
          onChangeText={(t) => {
            setName(t);
            setError(null);
          }}
          maxLength={16}
          autoCorrect={false}
          placeholder="Your nickname"
          placeholderTextColor="#A0A6B2"
          style={s.input}
        />
        <Ionicons name="pencil" size={18} color={C.muted} />
      </View>
      {error ? <Text style={s.error}>{error}</Text> : null}

      <View style={{ height: 20 }} />
      <Btn label="CONTINUE" icon="arrow-forward" onPress={go} />
    </Shell>
  );
};

/* ---------- 8. JOIN ROOM ---------- */

export const JoinRoomScreen: React.FC<{
  onBack: () => void;
  onJoin: (code: string) => Promise<boolean>;
}> = ({ onBack, onJoin }) => {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = async () => {
    const c = code.trim();
    if (!c) {
      setError("Enter the room code.");
      return;
    }
    setBusy(true);
    await onJoin(c);
    setBusy(false);
  };

  return (
    <Shell title="Join Room" subtitle="Enter the room code to join" onBack={onBack}>
      <View style={s.card}>
        <Text style={s.label}>ROOM CODE</Text>
        <View style={s.inputWrap}>
          <TextInput
            value={code}
            onChangeText={(t) => {
              setCode(t);
              setError(null);
            }}
            maxLength={8}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="Enter 4 digit code"
            placeholderTextColor="#A0A6B2"
            onSubmitEditing={go}
            style={[s.input, { letterSpacing: 3 }]}
          />
          <Ionicons name="grid-outline" size={20} color={C.muted} />
        </View>
        {error ? <Text style={s.error}>{error}</Text> : null}
        <View style={{ height: 16 }} />
        <Btn label="JOIN ROOM" icon="arrow-forward" onPress={go} loading={busy} />
      </View>
      <Text style={s.hint}>Make sure you have the correct room code from your friend.</Text>
    </Shell>
  );
};

/* ---------- 7. ROOM CREATED ---------- */

export const RoomCreatedScreen: React.FC<{
  roomName: string;
  roomCode: string;
  onBack: () => void;
  onContinue: () => void;
}> = ({ roomName, roomCode, onBack, onContinue }) => {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await Share.share({ message: `Join my Word Scramble room! Code: ${roomCode}` });
    } catch {}
  };

  const copy = async () => {
    try {
      const clip = (globalThis as any).navigator?.clipboard;
      if (Platform.OS === "web" && clip) {
        await clip.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } else {
        await share();
      }
    } catch {}
  };

  return (
    <Shell title="Room Created!" subtitle={roomName} onBack={onBack}>
      <View style={s.crown}>
        <Ionicons name="trophy" size={44} color="#F4B942" />
      </View>

      <View style={s.card}>
        <Text style={[s.label, { textAlign: "center" }]}>ROOM CODE</Text>
        <View style={s.codeBox}>
          <Text style={s.codeText}>{roomCode}</Text>
          <TouchableOpacity onPress={copy} hitSlop={10}>
            <Ionicons name={copied ? "checkmark" : "copy-outline"} size={22} color={C.indigo} />
          </TouchableOpacity>
        </View>
        <Text style={s.hint}>Share this code with your friends and start the game.</Text>
      </View>

      <View style={{ height: 14 }} />
      <Btn label="SHARE CODE" icon="share-social-outline" onPress={share} />
      <View style={{ height: 10 }} />
      <Btn label="GO TO WAITING ROOM" icon="arrow-forward" onPress={onContinue} soft />
    </Shell>
  );
};

/* ---------- styles ---------- */

const s = StyleSheet.create({
  // NEW: root holds the solid colour + animated background
  root: { flex: 1, backgroundColor: C.bg },
  // CHANGED: transparent so the animated background is visible
  safe: { flex: 1, backgroundColor: "transparent" },
  flex: { flex: 1, minWidth: 0 },
  header: { height: 72, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF",
    borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center",
  },
  spacer: { width: 40, height: 40 },
  headerText: { flex: 1, alignItems: "center" },
  title: { color: C.ink, fontSize: 20, fontWeight: "900" },
  subtitle: { color: C.muted, fontSize: 12.5, marginTop: 2, textAlign: "center" },
  body: { flexGrow: 1, alignItems: "center", padding: 16, paddingBottom: 40 },
  inner: { width: "100%", maxWidth: 440 },

  tiles: { flexDirection: "row", justifyContent: "center", gap: 9, marginVertical: 16 },
  tile: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center", elevation: 3 },
  tileText: { color: "#FFF", fontSize: 22, fontWeight: "900" },

  optCard: {
    flexDirection: "row", alignItems: "center", borderRadius: 20, borderWidth: 1,
    padding: 16, marginBottom: 14, gap: 14, minHeight: 92,
  },
  optIcon: { width: 54, height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  optTitle: { fontSize: 15, fontWeight: "900", letterSpacing: 0.4 },
  optSub: { fontSize: 12, marginTop: 3, lineHeight: 17 },

  chip: {
    alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#EEF0FF", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, marginBottom: 16,
  },
  chipText: { color: C.indigo, fontSize: 12, fontWeight: "800" },

  avatar: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: "#EEF0FF",
    alignItems: "center", justifyContent: "center", alignSelf: "center", marginVertical: 22,
  },
  label: { color: C.muted, fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  inputWrap: {
    flexDirection: "row", alignItems: "center", height: 52, backgroundColor: "#FFF",
    borderRadius: 15, borderWidth: 1, borderColor: "#E5E7F5", paddingHorizontal: 14, gap: 8,
  },
  input: { flex: 1, minWidth: 0, color: C.ink, fontSize: 16, fontWeight: "800" },
  error: { color: "#E11D48", fontSize: 12, fontWeight: "700", marginTop: 8 },
  hint: { color: C.muted, fontSize: 12.5, textAlign: "center", marginTop: 14, lineHeight: 18 },

  card: { backgroundColor: "#FFF", borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 18 },
  crown: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: "#FFF4D6",
    alignItems: "center", justifyContent: "center", alignSelf: "center", marginVertical: 18,
  },
  codeBox: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14,
    backgroundColor: "#F3F4FB", borderRadius: 16, paddingVertical: 14, marginBottom: 4,
  },
  codeText: { color: C.ink, fontSize: 38, fontWeight: "900", letterSpacing: 6 },

  btn: {
    height: 52, borderRadius: 15, backgroundColor: C.indigo, flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnSoft: { backgroundColor: "#FFEDEA", borderWidth: 1, borderColor: "#FFD9D1" },
  btnText: { color: "#FFF", fontSize: 14, fontWeight: "900", letterSpacing: 0.8 },
  btnTextSoft: { color: C.coral },
});