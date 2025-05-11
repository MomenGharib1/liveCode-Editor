import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Button,
} from "@mui/material";
import SmartChatInput from "./SmartChatInput.js";
import { streamAssistantResponse } from "../services/aiService.js";

const mockMessages = [
  {
    id: 1,
    sender: "AI",
    avatar: "/static/images/avatar/ai.png",
    text: "Hello! How can I help you today?",
    time: "09:00",
  },
];

const ChatPanel = forwardRef(({ editorRef }, ref) => {
  const [messages, setMessages] = useState(mockMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (autoScroll) scrollToBottom();
  }, [messages, autoScroll]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 40;
    setAutoScroll(atBottom);
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Cancel previous request if streaming
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // New abort controller for this request
    abortControllerRef.current = new AbortController();

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: "User",
      avatar: "/static/images/avatar/user.png",
      text: text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages(prev => [...prev, userMessage]);

    // Add AI message placeholder
    const aiMessageId = messages.length + 2;
    setMessages(prev => [...prev, {
      id: aiMessageId,
      sender: "AI",
      avatar: "/static/images/avatar/ai.png",
      text: "",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }]);

    setIsStreaming(true);
    let responseText = "";
    let firstChunk = true;

    // Set editor to thinking state
    if (editorRef.current) {
      editorRef.current.setStreamingStatus('thinking');
    }

    try {
      await streamAssistantResponse(
        text,
        (chunk) => {
          responseText += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, text: responseText }
              : msg
          ));
          // On first chunk, set to applying
          if (editorRef.current) {
            if (firstChunk) {
              editorRef.current.setStreamingStatus('applying');
              firstChunk = false;
            }
            editorRef.current.handleStreamingResponse(responseText);
          }
        },
        (status) => {
          if (status === 'error') {
            setMessages(prev => prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, text: "Sorry, I encountered an error. Please try again." }
                : msg
            ));
            if (editorRef.current) {
              editorRef.current.setStreamingStatus('done');
            }
          }
          if (status === 'done') {
            if (editorRef.current) {
              editorRef.current.setStreamingStatus('done');
            }
          }
          if (status === 'cancelled') {
            setIsStreaming(false);
            if (editorRef.current) {
              editorRef.current.setStreamingStatus('done');
            }
          }
        },
        abortControllerRef.current
      );
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, text: "Sorry, I encountered an error. Please try again." }
          : msg
      ));
      if (editorRef.current) {
        editorRef.current.setStreamingStatus('done');
      }
    } finally {
      setIsStreaming(false);
    }
  };

  // Load chat log from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chatLog');
    if (saved) {
      try {
        const msgs = JSON.parse(saved);
        if (Array.isArray(msgs)) setMessages(msgs);
      } catch {}
    }
  }, []);

  // Expose saveChatLog method
  useImperativeHandle(ref, () => ({
    saveChatLog: () => {
      localStorage.setItem('chatLog', JSON.stringify(messages));
    },
  }));

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 0,
        borderRight: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "grey.200",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chat Assistant
        </Typography>
      </Box>
      <Box
        ref={messagesContainerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "background.default",
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
        }}
      >
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              alignItems="flex-start"
              sx={{
                px: 0,
                py: 1,
                justifyContent: msg.sender === "User" ? "flex-end" : "flex-start",
              }}
            >
              {msg.sender !== "User" && (
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar
                    src={msg.avatar}
                    alt={msg.sender}
                    sx={{ width: 32, height: 32 }}
                  />
                </ListItemAvatar>
              )}
              <Box
                sx={{
                  maxWidth: "70%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "User" ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    bgcolor: msg.sender === "User" ? "primary.main" : "grey.100",
                    color: msg.sender === "User" ? "primary.contrastText" : "text.primary",
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                  {isStreaming && msg.sender === "AI" && msg.text === "" && (
                    <CircularProgress size={16} />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, px: 1 }}
                >
                  {msg.time}
                </Typography>
              </Box>
              {msg.sender === "User" && (
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar
                    src={msg.avatar}
                    alt={msg.sender}
                    sx={{ width: 32, height: 32 }}
                  />
                </ListItemAvatar>
              )}
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "grey.200",
          bgcolor: "background.paper",
          position: 'relative',
        }}
      >
        <SmartChatInput 
          onSend={handleSend} 
          disabled={isStreaming} 
          isStreaming={isStreaming}
          onCancel={() => {
            if (abortControllerRef.current) {
              abortControllerRef.current.abort();
            }
            setIsStreaming(false);
            if (editorRef.current) {
              editorRef.current.setStreamingStatus('done');
            }
          }}
        />
      </Box>
    </Paper>
  );
});

export default ChatPanel;
