import React, { useState } from 'react';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import { sendNotification } from '../services/allApi';
import DeleteIcon from '@mui/icons-material/Delete';

function SendNotification() {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null); // For storing selected image
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle emoji click
  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Capture the selected image
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null); // Clear the selected image
  };

  // Handle send button click
  const handleSendNotification = async () => {
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create form data to send both message and image
      const formData = new FormData();
      formData.append('message', message);
      if (image) {
        formData.append('image', image);
      }

      // Call the sendNotification API function
      await sendNotification(formData);
      setSuccess('Notification sent successfully!');
      setMessage(''); // Clear the message after sending
      setImage(null); // Clear the image field after sending
    } catch (error) {
      setError('Failed to send notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" gutterBottom>
        <b>Send Notification</b>
      </Typography>

      {/* Message Text Field */}
      <TextField
        label="Message"
        value={message}
        onChange={handleMessageChange}
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        margin="normal"
        error={Boolean(error)}
        helperText={error || ''}
      />

      {/* Emoji Picker Toggle Button */}
      <Button
        variant="outlined"
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        style={{ marginBottom: '10px' }}
      >
        {showEmojiPicker ? 'Close Emoji Picker' : 'Add Emoji'}
      </Button>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <Box style={{ marginBottom: '10px' }}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </Box>
      )}

      {/* Image Upload Field */}
      <Button variant="outlined" component="label" style={{ marginBottom: '10px' }}>
        Upload Image
        <input type="file" hidden onChange={handleImageChange} accept="image/*" />
      </Button>

      {/* Display selected image preview */}
      {image && (
        <Box display="flex" alignItems="center" style={{ marginBottom: '10px' }}>
          <img
            src={URL.createObjectURL(image)}
            alt="Selected"
            style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
          />
          {/* Remove Image Button */}
          <IconButton onClick={handleRemoveImage} color="secondary">
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

      {/* Send Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendNotification}
        disabled={loading || !message.trim()} // Disable if loading or message is empty
        style={{ marginTop: '10px' }}
      >
        {loading ? 'Sending...' : 'Send Notification'}
      </Button>

      {/* Success Message */}
      {success && (
        <Typography color="green" variant="body1" style={{ marginTop: '10px' }}>
          {success}
        </Typography>
      )}

      {/* Error Message */}
      {error && (
        <Typography color="red" variant="body1" style={{ marginTop: '10px' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default SendNotification;
