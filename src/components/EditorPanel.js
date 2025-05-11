import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Box, Paper, Typography, Tabs, Tab, IconButton, Badge, Tooltip } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { autocompletion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import BuildIcon from '@mui/icons-material/Build';
import ToolsModal from './ToolsModal.js';
import StreamingStatus from './StreamingStatus.js';
import { streamAssistantResponse } from '../services/aiService.js';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ReactMarkdown from 'react-markdown';

// Mock tools data for editor suggestions
const editorTools = [
  {
    label: "@search",
    detail: "Search through the codebase",
    apply: "@search ",
  },
  {
    label: "@edit",
    detail: "Edit a file in the codebase",
    apply: "@edit ",
  },
  {
    label: "@create",
    detail: "Create a new file",
    apply: "@create ",
  },
  {
    label: "@delete",
    detail: "Delete a file",
    apply: "@delete ",
  },
  {
    label: "@refactor",
    detail: "Refactor code",
    apply: "@refactor ",
  },
  {
    label: "@test",
    detail: "Run tests",
    apply: "@test ",
  },
];

// Custom autocomplete function for @ suggestions
const atSuggestions = (context) => {
  const word = context.matchBefore(/@\w*/);
  if (!word) return null;

  const searchText = word.text.slice(1).toLowerCase();
  const filteredTools = editorTools.filter(tool =>
    tool.label.toLowerCase().includes(searchText)
  );

  return {
    from: word.from,
    options: filteredTools,
  };
};

const initialMarkdown = `# Welcome to the Editor\n\nYou can write **Markdown**, HTML, or code here!\n\nTry typing @ to see available tools.`;
const initialCode = `function helloWorld() {\n  console.log('Hello, world!');\n}\n\n// Try typing @ to see available tools`;
const initialHTML = `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello</title>\n  </head>\n  <body>\n    <h1>Hello, world!</h1>\n    <!-- Try typing @ to see available tools -->\n  </body>\n</html>`;

const EditorPanel = ({ themeMode, onStreamStart, onStreamEnd, onSave }, ref) => {
  const [tab, setTab] = useState(0);
  const [markdownValue, setMarkdownValue] = useState(initialMarkdown);
  const [codeValue, setCodeValue] = useState(initialCode);
  const [htmlValue, setHtmlValue] = useState(initialHTML);
  const [toolsModalOpen, setToolsModalOpen] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState('done');
  const [isStreaming, setIsStreaming] = useState(false);
  const [originalContent, setOriginalContent] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  // Helper to show overlay if not done
  const showOverlay = streamingStatus === 'thinking' || streamingStatus === 'applying';

  const handleStreamingResponse = useCallback((content) => {
    setStreamingStatus('thinking'); // Show Thinking... and spinner
    setTimeout(() => {
      setStreamingStatus('applying'); // Show Applying edits... and spinner
      // Detect HTML
      if (/<!DOCTYPE html>|<html[\s>]/i.test(content)) {
        setHtmlValue(content);
        setTab(2); // HTML tab
      } 
      // Detect JavaScript/TypeScript (simple heuristics)
      else if (/\b(function|const|let|var|class|import|export|=>)\b|console\.log|\(\)\s*=>/.test(content)) {
        setCodeValue(content);
        setTab(1); // Code tab
      } 
      // Default to Markdown
      else {
        setMarkdownValue(content);
        setTab(0); // Markdown tab
      }
      setStreamingStatus('done'); // Show Done. and hide spinner
    }, 100); // Small delay to show 'Thinking...'
  }, []);

  // Expose the streaming handler to parent components
  React.useImperativeHandle(ref, () => ({
    handleStreamingResponse: (content) => {
      if (/<!DOCTYPE html>|<html[\s>]/i.test(content)) {
        setHtmlValue(content);
        setTab(2);
      } else if (/\b(function|const|let|var|class|import|export|=>)\b|console\.log|\(\)\s*=>/.test(content)) {
        setCodeValue(content);
        setTab(1);
      } else {
        setMarkdownValue(content);
        setTab(0);
      }
    },
    setStreamingStatus: (status) => setStreamingStatus(status),
  }));

  // Memoize extensions for performance
  const markdownExtensions = useMemo(
    () => [
      markdown(),
      EditorPanel.wordWrapExtension,
      autocompletion({
        override: [atSuggestions],
      }),
    ],
    []
  );

  const codeExtensions = useMemo(
    () => [
      javascript(),
      EditorPanel.wordWrapExtension,
      autocompletion({
        override: [atSuggestions],
      }),
    ],
    []
  );

  const htmlExtensions = useMemo(
    () => [
      html(),
      EditorPanel.wordWrapExtension,
      autocompletion({
        override: [atSuggestions],
      }),
    ],
    []
  );

  // Theme for CodeMirror
  const cmTheme = themeMode === "dark" ? oneDark : "light";

  useEffect(() => {
    const saved = localStorage.getItem('editorContent');
    if (saved) {
      try {
        const { markdownValue: m, codeValue: c, htmlValue: h } = JSON.parse(saved);
        if (m) setMarkdownValue(m);
        if (c) setCodeValue(c);
        if (h) setHtmlValue(h);
      } catch {}
    }
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 0,
        bgcolor: "background.paper",
        position: "relative",
        transition: 'opacity 0.3s ease',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "grey.200",
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Live Editor
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button variant="outlined" size="small" onClick={() => setPreviewOpen(true)}>
            Preview
          </Button>
          <Button variant="contained" size="small" onClick={() => {
            setSaveOpen(true);
            localStorage.setItem('editorContent', JSON.stringify({ markdownValue, codeValue, htmlValue }));
            if (typeof onSave === 'function') onSave();
          }}>
            Save
          </Button>
          <Tooltip title="Available Tools">
            <IconButton
              onClick={() => setToolsModalOpen(true)}
              sx={{
                color: "primary.main",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Badge
                badgeContent={editorTools.length}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.75rem",
                    height: "20px",
                    minWidth: "20px",
                  },
                }}
              >
                <BuildIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          borderBottom: "1px solid",
          borderColor: "grey.200",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            minWidth: 100,
          },
        }}
      >
        <Tab label="Markdown" />
        <Tab label="Code" />
        <Tab label="HTML" />
      </Tabs>

      <Box
        sx={{
          flex: 1,
          p: 2,
          bgcolor: "background.default",
          overflow: "auto",
          position: "relative",
          filter: showOverlay ? 'blur(2px) brightness(0.7)' : 'none',
          pointerEvents: showOverlay ? 'none' : 'auto',
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "grey.300",
            borderRadius: "4px",
          },
          "& .cm-editor": {
            height: "100%",
            fontSize: "0.875rem",
            transition: 'opacity 0.3s ease',
            "& .cm-scroller": {
              fontFamily: "JetBrains Mono, monospace",
            },
            "& .cm-tooltip": {
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "grey.200",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "& .cm-tooltip-section": {
                padding: "4px 8px",
              },
            },
          },
        }}
      >
        {tab === 0 && (
          <CodeMirror
            value={markdownValue}
            height="100%"
            theme={cmTheme}
            extensions={markdownExtensions}
            basicSetup={{ lineNumbers: true }}
            onChange={setMarkdownValue}
          />
        )}
        {tab === 1 && (
          <CodeMirror
            value={codeValue}
            height="100%"
            theme={cmTheme}
            extensions={codeExtensions}
            basicSetup={{ lineNumbers: true }}
            onChange={setCodeValue}
          />
        )}
        {tab === 2 && (
          <CodeMirror
            value={htmlValue}
            height="100%"
            theme={cmTheme}
            extensions={htmlExtensions}
            basicSetup={{ lineNumbers: true }}
            onChange={setHtmlValue}
          />
        )}
      </Box>

      <ToolsModal
        open={toolsModalOpen}
        onClose={() => setToolsModalOpen(false)}
      />

      {/* Preview Modal */}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          minWidth: 400,
          minHeight: 200,
          maxHeight: '80vh',
          overflow: 'auto',
        }}>
          {tab === 0 && (
            <ReactMarkdown>{markdownValue}</ReactMarkdown>
          )}
          {tab === 1 && (
            <Typography variant="body2" color="text.secondary">
              Preview not available for code.
            </Typography>
          )}
          {tab === 2 && (
            <Box dangerouslySetInnerHTML={{ __html: htmlValue }} />
          )}
        </Box>
      </Modal>
      {/* Save Snackbar */}
      <Snackbar open={saveOpen} autoHideDuration={2000} onClose={() => setSaveOpen(false)}>
        <MuiAlert onClose={() => setSaveOpen(false)} severity="success" sx={{ width: '100%' }}>
          Saved!
        </MuiAlert>
      </Snackbar>

      {/* Overlay Spinner and Status */}
      {showOverlay && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.3)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" color="white">
            {streamingStatus === 'thinking' && 'Thinking...'}
            {streamingStatus === 'applying' && 'Applying edits...'}
          </Typography>
        </Box>
      )}
      {/* Show Done only after streaming ends */}
      {streamingStatus === 'done' && isStreaming && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.1)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" color="white">Done.</Typography>
        </Box>
      )}
    </Paper>
  );
};

// Soft word wrapping extension for CodeMirror 6
EditorPanel.wordWrapExtension = EditorView.lineWrapping;

export default React.forwardRef(EditorPanel);
