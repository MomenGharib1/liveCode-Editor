import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Reuse the same tools data from EditorPanel
const tools = [
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

const ToolsModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        pb: 2,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Available Tools
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List>
          {tools.map((tool) => (
            <ListItem
              key={tool.label}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'grey.100',
                '&:last-child': {
                  borderBottom: 'none',
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  >
                    {tool.label}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {tool.detail}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ToolsModal; 