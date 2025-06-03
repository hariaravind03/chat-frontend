import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Card, CardContent, Stack } from '@mui/material';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Function to fetch friend requests
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/friend/friend-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setErrorMsg('No pending friend requests.');
          setRequests([]); // Clear requests if no data
        } else {
          setRequests(response.data); // Set the friend requests
          setErrorMsg(''); // Clear any previous error message
        }
      } else {
        setErrorMsg(response.data.message || 'No pending requests found.');
        setRequests([]); // Clear requests if there is no valid data
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 404:
            setErrorMsg('No friend requests found.'); // Display message when 404 is returned
            break;
          case 500:
            setErrorMsg('Server error. Please try again later.');
            break;
          default:
            setErrorMsg('Unexpected error occurred.');
        }
        setRequests([]); // Ensure to clear requests on error
      } else {
        setErrorMsg('Network error. Please check your connection.');
        setRequests([]); // Clear requests on network error
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Function to handle accepting the request
  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/friend/accept', { requestId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the accepted request from the state
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error('Error accepting request', err);
    }
  };

  // Function to handle rejecting the request
  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/friend/reject', { requestId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state by removing the rejected request
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      console.log(response.data); // Handle the response accordingly
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      alert('Failed to reject friend request.');
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>Pending Friend Requests</Typography>

      {errorMsg && <Typography color="error">{errorMsg}</Typography>}

      {!errorMsg && requests.length === 0 ? (
        <Typography>No pending requests.</Typography>
      ) : (
        <Stack spacing={2}>
          {requests.map((req) => (
            <Card key={req._id}>
              <CardContent>
                <Typography>{req.sender.email}</Typography>
                <Button onClick={() => handleAccept(req._id)} color="primary">Accept</Button>
                <Button onClick={() => handleReject(req._id)} color="error">Reject</Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </>
  );
};

export default FriendRequests;
