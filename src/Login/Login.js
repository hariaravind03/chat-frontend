import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function Login() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [action] = useState('login');

  const sendOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/send-otp', { email, password,action });
      setMessage(res.data.message);
      setStep('otp');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setMessage('No user found with this email.');
        } else if (err.response.status === 401) {
          setMessage('Please check the email and password.');
        } else {
          setMessage(err.response.data.error || 'Error sending OTP');
        }
      } else {
        setMessage('Server not responding. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/verify-otp', { email, otp,password,action });
      setMessage(res.data.message);
      // TODO: Redirect to dashboard or update login state
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error verifying OTP');
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 10,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>

      {message && (
        <Typography color={message.includes('success') ? 'green' : 'error'} align="center" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      {step === 'email' && (
        <>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!email.trim() || !password.trim() || loading}
            onClick={sendOtp}
            sx={{ mt: 2 }}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </>
      )}

      {step === 'otp' && (
        <>
          <TextField
            label="Enter OTP"
            variant="outlined"
            fullWidth
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            variant="contained"
            color="success"
            fullWidth
            disabled={!otp.trim() || loading}
            onClick={verifyOtp}
            sx={{ mt: 2 }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => setStep('email')}
            disabled={loading}
          >
            Back to Email
          </Button>
        </>
      )}
    </Box>
  );
}
