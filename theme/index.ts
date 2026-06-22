/**
 * Design token interface used across all components.
 * Replace the values below with your brand colors to theme the entire library.
 */

export type BackgroundType =
  | "primary"
  | "secondary"
  | "gray"
  | "danger"
  | "success"
  | "warning"
  | "transparent";

export const theme = {
  background: {
    primary: "#1B1B1B",
    secondary: "#2A2A2A",
    gray: "#3B3B3B",
    danger: "#3B1A1A",
    success: "#1A3B1A",
    warning: "#3B2E1A",
    transparent: "transparent",
  },

  border: {
    primary: "#333333",
    secondary: "#444444",
    gray: "#555555",
    danger: "#FF4444",
    success: "#44BB44",
    warning: "#FFAA00",
    transparent: "transparent",
  },

  shadows: {
    primary: "#000000",
    secondary: "#111111",
    gray: "#222222",
    danger: "#FF0000",
    success: "#00BB00",
    warning: "#FF8800",
    transparent: "transparent",
  },

  colors: {
    primary: "#6C63FF",
    white: "#FFFFFF",
    black: "#000000",
    success: "#44BB44",
    warning: "#FFAA00",
    danger: "#FF4444",
    info: "#4499FF",
    gray: "#888888",
    placeholder: "#666666",
  },

  typography: {
    titulo: { fontSize: 20, fontWeight: "700" as const },
    subtitulo: { fontSize: 16, fontWeight: "600" as const },
    paragrafo: { fontSize: 14, fontWeight: "400" as const },
    link: { fontSize: 14, fontWeight: "400" as const },
    small: { fontSize: 12, fontWeight: "400" as const },
  },
};
