import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { ArrowBack, Refresh, Person, Email, Phone, DateRange, Code } from '@mui/icons-material';
import { fetchInfluencerByCode, fetchInfluencerReferrals } from '../lib/api-service';

const InfluencerDetails = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [influencer, setInfluencer] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch influencer details and referrals
  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch the influencer details
      const influencerData = await fetchInfluencerByCode(code);
      setInfluencer(influencerData);
      
      // Fetch the referrals
      const referralsData = await fetchInfluencerReferrals(code);
      setReferrals(referralsData);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      console.error('Error fetching influencer details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data on mount and when code changes
  useEffect(() => {
    if (code) {
      fetchData();
    } else {
      setError('No influencer code provided');
      setLoading(false);
    }
  }, [code]);
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/influencers')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Influencer Details
          </Typography>
          <Button 
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchData}
            disabled={loading}
            sx={{ ml: 'auto' }}
          >
            Refresh
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : influencer ? (
          <>
            {/* Influencer Information Card */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person sx={{ mr: 1 }} />
                      <Typography variant="h6">{influencer.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Email sx={{ mr: 1 }} />
                      <Typography variant="body1">{influencer.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={{ mr: 1 }} />
                      <Typography variant="body1">{influencer.phone || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Code sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        Code: <Chip label={influencer.unique_code} color="primary" />
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DateRange sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        Joined: {formatDate(influencer.created_at)}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      Total Referrals: {referrals.length}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            {/* Referrals Table */}
            <Typography variant="h5" gutterBottom>
              Referred Candidates
            </Typography>
            
            {referrals.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                No candidates have been referred by this influencer yet.
              </Alert>
            ) : (
              <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Primary City</TableCell>
                      <TableCell>Applied On</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {referrals.map((candidate) => (
                      <TableRow key={candidate.id} hover>
                        <TableCell>{candidate.name || candidate.full_name}</TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell>{candidate.phone || candidate.phone_number || 'N/A'}</TableCell>
                        <TableCell>{candidate.primary_city || 'N/A'}</TableCell>
                        <TableCell>{formatDate(candidate.created_at)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={candidate.status || 'Applied'} 
                            color={candidate.status === 'Hired' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {/* Referral Statistics */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Referral Statistics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {referrals.length}
                    </Typography>
                    <Typography variant="body2">Total Referrals</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {referrals.filter(r => r.status === 'Hired').length}
                    </Typography>
                    <Typography variant="body2">Hired Candidates</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {referrals.length > 0 
                        ? new Date(Math.max(...referrals.map(r => new Date(r.created_at)))).toLocaleDateString()
                        : 'N/A'
                      }
                    </Typography>
                    <Typography variant="body2">Last Referral Date</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </>
        ) : (
          <Alert severity="warning">
            Influencer not found
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default InfluencerDetails; 