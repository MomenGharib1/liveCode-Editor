import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Popper,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';

// Mock tools data - replace with your actual tools
const tools = [
  {
    name: 'search',
    description: 'Search through the codebase',
    trigger: '@search',
  },
  {
    name: 'edit',
    description: 'Edit a file in the codebase',
    trigger: '@edit',
  },
  {
    name: 'create',
    description: 'Create a new file',
    trigger: '@create',
  },
  {
    name: 'delete',
    description: 'Delete a file',
    trigger: '@delete',
  },
];

const SmartChatInput = ({ onSend, disabled, isStreaming, onCancel }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Keep focus on input when suggestions are shown
  useEffect(() => {
    if (suggestions.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [suggestions]);

  const handleInputChange = (event) => {
    if (disabled) return;
    const value = event.target.value;
    setInput(value);

    // Find the last @ symbol position
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const searchText = value.slice(lastAtIndex + 1);
      const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchText.toLowerCase())
      );
      
      if (filteredTools.length > 0) {
        setSuggestions(filteredTools);
        setSelectedIndex(0);
        setAnchorEl(inputRef.current);
      } else {
        setSuggestions([]);
        setAnchorEl(null);
      }
    } else {
      setSuggestions([]);
      setAnchorEl(null);
    }
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    
    if (suggestions.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          event.stopPropagation();
          setSelectedIndex((prev) => {
            const newIndex = prev < suggestions.length - 1 ? prev + 1 : prev;
            if (listRef.current && newIndex !== prev) {
              const selectedElement = listRef.current.children[newIndex];
              if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
              }
            }
            return newIndex;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          event.stopPropagation();
          setSelectedIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : prev;
            if (listRef.current && newIndex !== prev) {
              const selectedElement = listRef.current.children[newIndex];
              if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
              }
            }
            return newIndex;
          });
          break;
        case 'Enter':
          event.preventDefault();
          event.stopPropagation();
          if (selectedIndex >= 0) {
            insertSuggestion(suggestions[selectedIndex]);
          } else {
            handleSend();
          }
          break;
        case 'Escape':
          event.preventDefault();
          event.stopPropagation();
          setSuggestions([]);
          setAnchorEl(null);
          break;
        default:
          break;
      }
    } else if (event.key === 'Enter' && !event.shiftKey && !disabled && !isStreaming) {
      event.preventDefault();
      handleSend();
    }
  };

  const insertSuggestion = (tool) => {
    const lastAtIndex = input.lastIndexOf('@');
    const newInput = input.slice(0, lastAtIndex) + tool.trigger + ' ';
    setInput(newInput);
    setSuggestions([]);
    setAnchorEl(null);
    inputRef.current.focus();
  };

  const handleSend = () => {
    if (disabled || !input.trim()) return;
    onSend(input);
    setInput('');
    setSuggestions([]);
    setAnchorEl(null);
  };

  // Handle keyboard events on the list items
  const handleListItemKeyDown = (event, tool) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      insertSuggestion(tool);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TextField
        inputRef={inputRef}
        fullWidth
        multiline
        maxRows={4}
        variant="outlined"
        size="small"
        placeholder={disabled ? "Waiting for response..." : "Type your message... (Use @ for tools)"}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.default',
            pr: 6, // Space for send button
          },
          flex: 1,
        }}
      />
      {isStreaming ? (
        <IconButton 
          color="error" 
          onClick={onCancel} 
          size="large"
          sx={{
            bgcolor: 'error.main',
            color: 'common.white',
            '&:hover': {
              bgcolor: 'error.dark',
            },
            boxShadow: 2,
          }}
        >
          <CancelIcon fontSize="large" />
        </IconButton>
      ) : (
        <IconButton color="primary" onClick={handleSend} disabled={disabled || !input.trim()}>
          <SendIcon />
        </IconButton>
      )}

      <Popper
        open={Boolean(anchorEl) && suggestions.length > 0 && !disabled}
        anchorEl={anchorEl}
        placement="top-start"
        sx={{ zIndex: 1300 }}
      >
        <Paper
          elevation={3}
          sx={{
            maxHeight: 200,
            overflow: 'auto',
            width: 300,
            mt: 1,
          }}
        >
          <List ref={listRef} dense>
            {suggestions.map((tool, index) => (
              <ListItem
                key={tool.name}
                selected={index === selectedIndex}
                onClick={() => insertSuggestion(tool)}
                onKeyDown={(e) => handleListItemKeyDown(e, tool)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {tool.trigger}
                    </Typography>
                  }
                  secondary={tool.description}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popper>
    </Box>
  );
};

export default SmartChatInput; 