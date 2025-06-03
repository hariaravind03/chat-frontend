import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import { RESPONSE_LIMIT_DEFAULT } from 'next/dist/server/api-utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [friendEmail, setFriendEmail] = useState('');
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);


  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/api/auth/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);
        setUserData(response.data);
        console.log(userData);
      } catch (error) {
        setFeedback({ open: true, message: 'Failed to fetch user data', severity: 'error' });
      }
    };

    fetchUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleSendRequest = async () => {
    const token = localStorage.getItem('token');
    try {
      console.log("Friend Email:", friendEmail);
      console.log("Token:", token);

      const userRes = await axios.get(`http://localhost:5000/api/auth/users?email=${friendEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Users response:", userRes);


      const receiver = userRes.data.users.find(user => user.email === friendEmail);
      if (!receiver) {
        setFeedback({ open: true, message: 'User not found', severity: 'error' });
        return;
      }

      const currentUser = await axios.get('http://localhost:5000/api/friend/friends', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Current user response:", currentUser);

      const friends = Array.isArray(currentUser.data.friends) ? currentUser.data.friends : [];
      const sentRequests = Array.isArray(currentUser.data.sentRequests) ? currentUser.data.sentRequests : [];

      if (friends.includes(friendEmail)) {
        setFeedback({ open: true, message: 'Already friends with this user', severity: 'warning' });
        return;
      }

      if (sentRequests.includes(friendEmail)) {
        setFeedback({ open: true, message: 'Request already sent', severity: 'warning' });
        return;
      }

      const postData = { receiverEmail: friendEmail };
      console.log("Sending data:", postData);

      await axios.post('http://localhost:5000/api/friend/send', postData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFeedback({ open: true, message: 'Friend request sent successfully!', severity: 'success' });
      setOpenDialog(false);
      setFriendEmail('');
    } catch (error) {
      // Handle specific error codes
      if (error.response) {
        const { status, data } = error.response;
        let message = 'Error sending friend request';

        switch (status) {
          case 400:
            message = data.message || 'Bad request. Please check the details.';
            break;
          case 401:
            message = data.message || 'Cannot send request to yourself.';
            break;
          case 404:
            message = data.message || 'Receiver not found.';
            break;
          case 409:
            message = data.message || 'You are already friends.';
            break;
          case 500:
            message = 'Internal server error. Please try again later.';
            break;
          default:
            message = data.message || 'Something went wrong. Try again.';
        }

        setFeedback({ open: true, message, severity: 'error' });
      } else {
        // Network or unexpected errors
        setFeedback({ open: true, message: 'Network error or unexpected issue.', severity: 'error' });
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chat App
          </Typography>
          <Button color="inherit" onClick={() => navigate('requests')}>
            Friend Requests
          </Button>
          <Button color="inherit" onClick={() => navigate('friends')}>
            Friends
          </Button>
          <Button color="inherit" onClick={() => setOpenDialog(true)}>
            Send Request
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
  <Typography variant="h5" gutterBottom>
    {userData ? `Welcome, ${userData.email}` : 'Welcome,'}
  </Typography>
  <Outlet />
</Container>


      {/* Send Request Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Send Friend Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Friend's Email"
            type="email"
            fullWidth
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSendRequest} variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.severity}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;
