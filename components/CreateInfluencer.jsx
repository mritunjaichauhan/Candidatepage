import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';

const CreateInfluencer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:8080/api/influencers', formData);
      setSuccess(response.data);
      setFormData({ name: '', email: '', phone: '' }); // Reset form
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create influencer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Influencer
          </Typography>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/influencers"
          >
            View All Influencers
          </Button>
        </Box>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              margin="normal"
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Influencer'}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Influencer created successfully!
              <Box sx={{ mt: 1, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Name:</strong> {success.influencer.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Unique Code:</strong> {success.influencer.unique_code}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {success.influencer.email}
                </Typography>
              </Box>
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateInfluencer; 