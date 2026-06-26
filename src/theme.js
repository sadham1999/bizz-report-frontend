import { alpha, createTheme } from "@mui/material/styles";

export const appColors = {
  navy: "#1f2d39",
  navyDeep: "#17212b",
  navySoft: "#253746",
  teal: "#23b3aa",
  tealDeep: "#17978f",
  tealSoft: "#d9f5f2",
  background: "#eef2f4",
  backgroundAlt: "#e5ebef",
  paper: "#ffffff",
  paperMuted: "#f8faf9",
  border: "#d7e0e6",
  text: "#24333f",
  textMuted: "#63707b",
  success: "#44b48f",
  warning: "#c99a31",
  danger: "#cf5e5e",
};

export const sidebarGradient =
  "linear-gradient(180deg, rgba(13, 19, 24, 0.98) 0%, rgba(20, 28, 35, 0.98) 52%, rgba(28, 38, 47, 0.98) 100%)";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: appColors.navy,
      dark: appColors.navyDeep,
      light: appColors.navySoft,
      contrastText: "#ffffff",
    },
    secondary: {
      main: appColors.teal,
      dark: appColors.tealDeep,
      light: "#6cd4cb",
      contrastText: "#ffffff",
    },
    success: {
      main: appColors.success,
    },
    warning: {
      main: appColors.warning,
    },
    error: {
      main: appColors.danger,
    },
    background: {
      default: appColors.background,
      paper: appColors.paper,
    },
    text: {
      primary: appColors.text,
      secondary: appColors.textMuted,
    },
    divider: appColors.border,
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily:
      '"Segoe UI", "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.04em" },
    h2: { fontWeight: 800, letterSpacing: "-0.03em" },
    h3: { fontWeight: 750, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: "0.01em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--app-bg": appColors.background,
          "--app-bg-alt": appColors.backgroundAlt,
          "--surface": appColors.paper,
          "--surface-muted": appColors.paperMuted,
          "--surface-strong": appColors.navyDeep,
          "--text-main": appColors.text,
          "--text-muted": appColors.textMuted,
          "--border-soft": appColors.border,
          "--primary": appColors.navy,
          "--primary-strong": appColors.navyDeep,
          "--accent": appColors.teal,
          "--accent-soft": alpha(appColors.teal, 0.12),
          "--accent-2": appColors.tealDeep,
          "--danger": appColors.danger,
          "--shadow-soft": "0 12px 30px rgba(15, 23, 42, 0.08)",
          "--shadow-strong": "0 18px 40px rgba(15, 23, 42, 0.14)",
          "--font-family":
            '"Segoe UI", "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        html: {
          minHeight: "100%",
        },
        body: {
          minHeight: "100%",
          margin: 0,
          background:
            `radial-gradient(circle at top left, ${alpha(appColors.teal, 0.1)}, transparent 28%), linear-gradient(180deg, ${appColors.background} 0%, #e7edf0 100%)`,
          color: appColors.text,
          fontFamily:
            '"Segoe UI", "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "#root": {
          minHeight: "100%",
        },
        a: {
          color: "inherit",
          textDecoration: "none",
        },
        "::selection": {
          background: alpha(appColors.teal, 0.18),
          color: appColors.text,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: sidebarGradient,
          boxShadow: "0 14px 30px rgba(15, 23, 42, 0.18)",
          borderBottom: `1px solid ${alpha("#ffffff", 0.06)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderColor: appColors.border,
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${appColors.border}`,
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          minHeight: 44,
          paddingInline: 18,
          boxShadow: "none",
        },
        containedPrimary: {
          backgroundImage: `linear-gradient(135deg, ${appColors.navy} 0%, ${appColors.teal} 100%)`,
          "&:hover": {
            backgroundImage: `linear-gradient(135deg, ${appColors.navyDeep} 0%, ${appColors.tealDeep} 100%)`,
            boxShadow: "0 12px 26px rgba(31, 45, 57, 0.18)",
          },
        },
        containedSecondary: {
          backgroundImage: `linear-gradient(135deg, ${appColors.teal} 0%, #6cd4cb 100%)`,
          "&:hover": {
            backgroundImage: `linear-gradient(135deg, ${appColors.tealDeep} 0%, #4fbeb3 100%)`,
          },
        },
        outlinedPrimary: {
          borderColor: appColors.navy,
          color: appColors.navy,
          "&:hover": {
            borderColor: appColors.teal,
            backgroundColor: alpha(appColors.teal, 0.06),
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: appColors.textMuted,
          "&.Mui-focused": {
            color: appColors.navy,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: appColors.textMuted,
          "&.Mui-focused": {
            color: appColors.navy,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: appColors.paper,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: appColors.border,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: appColors.teal,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: appColors.teal,
            borderWidth: 2,
          },
          "&.Mui-disabled": {
            backgroundColor: appColors.paperMuted,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${appColors.border}`,
        },
        head: {
          backgroundImage: sidebarGradient,
          color: "#ffffff",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          borderBottom: "none",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: alpha(appColors.teal, 0.05),
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: `1px solid ${appColors.border}`,
          borderRadius: 18,
          overflow: "hidden",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
          backgroundColor: "#edf4f3",
          color: appColors.text,
        },
        colorPrimary: {
          backgroundColor: alpha(appColors.teal, 0.12),
          color: appColors.tealDeep,
        },
        colorSuccess: {
          backgroundColor: "#e8f6ef",
          color: "#2f8d68",
        },
        colorWarning: {
          backgroundColor: "#fbf1d7",
          color: "#9f6b12",
        },
        colorError: {
          backgroundColor: "#fde8e8",
          color: "#b54747",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 22,
          border: `1px solid ${appColors.border}`,
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          border: `1px solid ${appColors.border}`,
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.14)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: appColors.navyDeep,
          borderRadius: 10,
          fontSize: 12,
          padding: "8px 10px",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: appColors.tealDeep,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: appColors.border,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          "&.Mui-selected": {
            backgroundColor: alpha(appColors.teal, 0.14),
            color: appColors.navy,
            "&:hover": {
              backgroundColor: alpha(appColors.teal, 0.18),
            },
          },
          "&:hover": {
            backgroundColor: alpha(appColors.navy, 0.06),
          },
        },
      },
    },
  },
});

export default theme;
