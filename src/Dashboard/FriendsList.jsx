import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // For menu anchor
  const [selectedFriend, setSelectedFriend] = useState(null); // To track selected friend for actions

  // Fetch friends list
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/friend/friends", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (error) {
        console.error("Failed to fetch friends", error);
      }
    };
    fetchFriends();
  }, []);

  // Open menu when three dots are clicked
  const handleClick = (event, friend) => {
    setAnchorEl(event.currentTarget);
    setSelectedFriend(friend); // Set selected friend for later use
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedFriend(null);
  };

  // Example actions for the menu
  const handleModifyFriend = () => {
    console.log(`Modify friend: ${selectedFriend.email}`);
    handleClose();
  };

  const handleRemoveFriend = async () => {
  try {
    // Retrieve the token for authentication
    const token = localStorage.getItem("token");

    // Send a DELETE request to the backend to remove the friend
    await axios.delete(`http://localhost:5000/api/friend/remove/${selectedFriend._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Update the state to reflect the removal of the friend
    setFriends(friends.filter((friend) => friend._id !== selectedFriend._id));

    // Close the dialog or modal if you're using one for confirmation
    handleClose();
  } catch (error) {
    // Handle any errors (network issues, invalid token, etc.)
    console.error('Error removing friend:', error);
    alert('Failed to remove friend. Please try again later.');
  }
};


  return (
    <>
      <Typography variant="h6" gutterBottom>Your Friends</Typography>
      {friends.length === 0 ? (
        <Typography>No friends yet.</Typography>
      ) : (
        <Paper>
          <List>
            {friends.map((friend) => (
              <ListItem key={friend._id}>
                <ListItemText primary={friend.email} />
                {/* More options (three dots) */}
                <IconButton onClick={(e) => handleClick(e, friend)}>
                  <MoreHorizIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Menu for options (Modify or Remove Friend) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleModifyFriend}>Modify Friend</MenuItem>
        <MenuItem onClick={handleRemoveFriend}>Remove Friend</MenuItem>
      </Menu>
    </>
  );
};

export default FriendsList;

