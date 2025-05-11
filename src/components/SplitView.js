import React, { useState, useRef } from "react";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import ChatPanel from "./ChatPanel.js";
import EditorPanel from "./EditorPanel.js";
import CodeIcon from "@mui/icons-material/Code";
import ChatIcon from "@mui/icons-material/Chat";

const SplitView = ({ themeMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activePanel, setActivePanel] = useState("chat");

  // Create the refs for EditorPanel and ChatPanel
  const editorRef = useRef();
  const chatPanelRef = useRef();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "background.default",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Mobile Toggle Button */}
      {isMobile && (
        <IconButton
          onClick={() => setActivePanel(activePanel === "chat" ? "editor" : "chat")}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            boxShadow: 3,
          }}
        >
          {activePanel === "chat" ? <CodeIcon /> : <ChatIcon />}
        </IconButton>
      )}

      {/* Chat Panel */}
      <Box
        sx={{
          width: { xs: "100%", md: "40%" },
          minWidth: { md: 320 },
          maxWidth: { md: 480 },
          height: "100%",
          borderRight: { md: "1px solid" },
          borderColor: { md: "grey.200" },
          display: { xs: activePanel === "chat" ? "block" : "none", md: "block" },
        }}
      >
        <ChatPanel ref={chatPanelRef} editorRef={editorRef} />
      </Box>

      {/* Editor Panel */}
      <Box
        sx={{
          flex: 1,
          height: "100%",
          display: { xs: activePanel === "editor" ? "block" : "none", md: "block" },
        }}
      >
        <EditorPanel ref={editorRef} themeMode={themeMode} onSave={() => chatPanelRef.current?.saveChatLog()} />
      </Box>
    </Box>
  );
};

export default SplitView;
