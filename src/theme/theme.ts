export interface Theme {
  gradient: [string, string, string];
  cardBg: string;
  text: string;
  subtext: string;
  accent: string;
  border: string;
}

export const darkTheme: Theme = {
  gradient: ["#0F1226", "#171B3A", "#0B0E1F"],
  cardBg: "rgba(255,255,255,0.06)",
  text: "#FFFFFF",
  subtext: "#9CA3AF",
  accent: "#A5B4FC",
  border: "rgba(255,255,255,0.08)",
};

export const lightTheme: Theme = {
  gradient: ["#F3F4F6", "#E9EAFB", "#F9FAFB"],
  cardBg: "rgba(0,0,0,0.045)",
  text: "#111827",
  subtext: "#6B7280",
  accent: "#6C5CE7",
  border: "rgba(0,0,0,0.08)",
};

export function getTheme(darkMode: boolean): Theme {
  return darkMode ? darkTheme : lightTheme;
}