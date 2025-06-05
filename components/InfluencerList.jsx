import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  InputAdornment,
  Stack
} from '@mui/material';
import { Search, ContentCopy, Refresh, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { fetchInfluencers } from '../lib/api-service';

const InfluencerList = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  
  // Function to fetch influencers from the API
  const fetchInfluencerData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchInfluencers();
      setInfluencers(data);
    } catch (err) {
      setError('Failed to fetch influencers: ' + err.message);
      console.error('Error fetching influencers:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Copy influencer code to clipboard
  const copyCodeToClipboard = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedCode(code);
        // Reset the copied status after 2 seconds
        setTimeout(() => setCopiedCode(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
      });
  };
  
  // Copy full referral link to clipboard
  const copyReferralLink = (code) => {
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/${code}`;
    
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopiedCode(`link-${code}`);
        // Reset the copied status after 2 seconds
        setTimeout(() => setCopiedCode(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };
  
  // Filter influencers based on search term
  const filteredInfluencers = influencers.filter(influencer => 
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.unique_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (influencer.phone && influencer.phone.includes(searchTerm))
  );
  
  // Fetch influencers on component mount
  useEffect(() => {
    fetchInfluencerData();
  }, []);
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Influencer Management
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/create-influencer"
            >
              Create Influencer
            </Button>
            
            <Button 
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchInfluencerData}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by name, email, code or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : influencers.length === 0 ? (
            <Alert severity="info">
              No influencers found. Click 'Create Influencer' to add one.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Unique Code</TableCell>
                    <TableCell>Referral Count</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInfluencers.map((influencer) => (
                    <TableRow key={influencer.id} hover>
                      <TableCell>{influencer.id}</TableCell>
                      <TableCell>{influencer.name}</TableCell>
                      <TableCell>{influencer.email}</TableCell>
                      <TableCell>{influencer.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {influencer.unique_code}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => copyCodeToClipboard(influencer.unique_code)}
                            color={copiedCode === influencer.unique_code ? 'success' : 'default'}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                          {copiedCode === influencer.unique_code && (
                            <Typography variant="caption" sx={{ ml: 1, color: 'success.main' }}>
                              Copied!
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{influencer.referral_count}</TableCell>
                      <TableCell>{new Date(influencer.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => copyReferralLink(influencer.unique_code)}
                            color={copiedCode === `link-${influencer.unique_code}` ? 'success' : 'primary'}
                          >
                            {copiedCode === `link-${influencer.unique_code}` ? 'Copied!' : 'Copy Link'}
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            component={Link}
                            to={`/influencer/${influencer.unique_code}`}
                            startIcon={<Visibility />}
                          >
                            View Details
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            How to Use Influencer Codes
          </Typography>
          <Typography variant="body2" paragraph>
            Each influencer has a unique code that can be used to track candidate referrals.
          </Typography>
          <Typography variant="body2" paragraph>
            1. Copy the unique code or the full referral link
          </Typography>
          <Typography variant="body2" paragraph>
            2. Share the link with potential candidates
          </Typography>
          <Typography variant="body2" paragraph>
            3. When a candidate signs up through the link, the influencer gets credit for the referral
          </Typography>
          <Typography variant="body2">
            The referral count shows how many candidates have registered using each influencer's code.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default InfluencerList; 