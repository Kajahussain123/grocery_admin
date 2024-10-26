import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, List, ListItem, ListItemText, IconButton, Divider, Typography as MuiTypography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done'; // Icon for marking as read
import DeleteIcon from '@mui/icons-material/Delete'; // Icon for deleting read notifications
import { deleteNotification, fetchNotifications, markAsRead } from '../services/allApi';

function NotificationsView() {
  const [tabValue, setTabValue] = useState('unread');
  const [notifications, setNotifications] = useState({ unread: [], read: [] });

  useEffect(() => {
    fetchNotificationsData();
  }, []);

  const fetchNotificationsData = async () => {
    try {
      const data = await fetchNotifications(); // Fetch notifications data directly
      const unread = data.results.filter((n) => !n.is_read);
      const read = data.results.filter((n) => n.is_read);
      setNotifications({ unread, read });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };
    
  
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotificationsData(); // Refresh notifications after marking as read
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotificationsData(); // Refresh notifications after deletion
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const renderNotifications = (type) => {
    const notificationsList = notifications[type];
    if (notificationsList.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <MuiTypography variant="body1">No Unread notifications</MuiTypography>
        </Box>
      );
    }

    return notificationsList.map((notification) => (
      <Box key={notification.id} sx={{ mb: 2, p: 2, borderRadius: 1, boxShadow: 1, backgroundColor: '#f5f5f5' }}>
        <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={notification.message}
            secondary={new Date(notification.created_at).toLocaleDateString()}
            sx={{ flexGrow: 1 }}
          />
          {type === 'unread' ? (
            <IconButton onClick={() => handleMarkAsRead(notification.id)} color="primary">
              <DoneIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleDeleteNotification(notification.id)} color="error">
              <DeleteIcon />
            </IconButton>
          )}
        </ListItem>
        <Divider />
      </Box>
    ));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="div" gutterBottom>
        Notifications
      </Typography>
      <Tabs
        value={tabValue}
        onChange={(event, newValue) => setTabValue(newValue)}
        aria-label="notification tabs"
        sx={{ mb: 2 }}
      >
        <Tab label="Unread" value="unread" />
        <Tab label="Read" value="read" />
      </Tabs>
      <Box sx={{ width: '100%' }}>
        <List sx={{ padding: 0 }}>
          {renderNotifications(tabValue)}
        </List>
      </Box>
    </Box>
  );
}

export default NotificationsView;
