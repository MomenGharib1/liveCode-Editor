import React from "react";
import { ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { berryTheme, berryDarkTheme } from "./theme.js";
import SplitView from "./components/SplitView.js";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = prefersDarkMode ? berryDarkTheme : berryTheme;
  const themeMode = prefersDarkMode ? "dark" : "light";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SplitView themeMode={themeMode} />
    </ThemeProvider>
  );
}

export default App;
