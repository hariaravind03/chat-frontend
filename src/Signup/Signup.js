import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';

export default function Signup() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [action] = useState('signup');


  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const canSendOtp = isEmailValid && password.trim() !== '';
  const canVerifyOtp = otp.trim() !== '';

  const sendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/send-otp', {
        email,
        password,
        action,
      });
      setMessage(res.data.message || 'OTP sent successfully.');
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/verify-otp', {
        email,
        password,
        otp,
        action,
      });
      setMessage(res.data.message || 'OTP verified successfully.');
      // Navigate to dashboard or show success
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 10,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Signup
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
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
            error={email !== '' && !isEmailValid}
            helperText={email !== '' && !isEmailValid ? 'Invalid email format' : ''}
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
            disabled={!canSendOtp || loading}
            onClick={sendOtp}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
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
            disabled={!canVerifyOtp || loading}
            onClick={verifyOtp}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => {
              setStep('email');
              setOtp('');
              setMessage('');
            }}
            disabled={loading}
          >
            Back to Email
          </Button>
        </>
      )}
    </Box>
  );
}
