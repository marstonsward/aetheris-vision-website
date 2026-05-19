import {
  BRAND,
  brandAccentBorder,
  brandAccentGlow,
  brandAccentMuted,
  brandGradient,
  brandGradientButton,
} from "./brand";

/** Shared dark UI palette for admin + client portals */
export const portalDark = {
  surface: "#0d1b2e",
  surfaceAlt: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
  text: "#f1f5f9",
  textMuted: "rgba(255,255,255,0.5)",
  textDim: "rgba(255,255,255,0.25)",
  navy: BRAND.navy,
  mid: BRAND.mid,
  accent: BRAND.accent,
  accentLight: BRAND.light,
  borderFocus: BRAND.accent,
  blue: BRAND.accent,
  blueDeep: BRAND.navy,
  blueGlow: brandAccentGlow,
  blueTag: brandAccentMuted,
  blueTagText: BRAND.light,
  gradient: brandGradient,
  gradientButton: brandGradientButton,
  green: "rgba(34,197,94,0.15)",
  greenText: "#86efac",
  greenBorder: "rgba(34,197,94,0.25)",
  danger: "rgba(220,38,38,0.12)",
  dangerText: "#f87171",
} as const;

export const portalActiveStep = {
  color: BRAND.light,
  bg: brandAccentMuted,
  border: brandAccentBorder,
  dot: BRAND.accent,
} as const;
