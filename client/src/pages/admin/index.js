import React, { useState, useEffect } from 'react';
import classes from '../../styles/Admin.module.css';
import PieChart from '@/components/PieChart';
import adminSocket from '../../socket/adminSocketSevice';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
} from '@mui/material';
import {
  Check as AcceptIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [error, setError] = useState(false);
  const [mmyList, setMmyList] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [newMMY, setNewMMY] = useState({ make: '', model: '', year: '', vinPrefix: '' });
  const [filter, setFilter] = useState('All');
  const [requestDateFilter, setRequestDateFilter] = useState('ASC');

  const [searchVIN, setSearchVIN] = useState('');
  const [noOfPending, setNoOfPending] = useState(0);
  const [noOfAccepted, setNoOfAccepted] = useState(0);
  const [noOfRejected, setNoOfRejected] = useState(0);
  const [requestData, setRequestData] = useState(false);

  const [requests, setRequests] = useState([]);

  // Connect to the WebSocket when the component mounts
  adminSocket.connect();

  // Listen for customer requests in real-time
  adminSocket.onNewRequest((requestData1) => {
    // Update the request list with the new request
    // setRequests([...requests, requestData]);

    requestData1.status = 'Pending';
    setRequestData(requestData1);

    console.log('dkfdj', requestData1);
  });
  useEffect(() => {
    if (requestData) setEnrollmentRequests((state) => [...state, requestData]);
  }, [requestData]);

  useEffect(() => {
    fetchMMYList();
    fetchEnrollmentRequests();
    // console.log(enrollmentRequests);
  }, []);

  useEffect(() => {
    for (let i = 0; i < enrollmentRequests.length; i++) {
      if (enrollmentRequests[i].status === 'Pending') {
        setNoOfPending((state) => state + 1);
      } else if (enrollmentRequests[i].status === 'Accepted') {
        setNoOfAccepted((state) => state + 1);
      } else if (enrollmentRequests[i].status === 'Rejected') {
        setNoOfRejected((state) => state + 1);
      }
    }
  }, [enrollmentRequests]);

  const fetchMMYList = () => {
    axios
      .get('http://localhost:5000/api/admin/mmy')
      .then((response) => {
        setMmyList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching MMY list:', error);
      });
  };

  const fetchEnrollmentRequests = () => {
    axios
      .get('http://localhost:5000/api/admin/requests')
      .then((response) => {
        setEnrollmentRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching enrollment requests:', error);
      });
  };

  const handleCreateMMY = () => {
    if (newMMY.vinPrefix.length != 8) {
      setError('VIN prefix should be 8 characters long');

      console.error('VIN prefix should be 8 characters long');
      return;
    }

    axios
      .post('http://localhost:5000/api/admin/mmy', newMMY)
      .then(() => {
        fetchMMYList();
        setNewMMY({ make: '', model: '', year: '', vinPrefix: '' });
        setError(false);
      })
      .catch((error) => {
        setError(error.response.data.error);
        console.error('Error creating MMY entry:', error);
      });
  };

  const handleAcceptRequest = (id) => {
    axios
      .put(`http://localhost:5000/api/admin/requests/accept/${id}`)
      .then(() => {
        fetchEnrollmentRequests();
      })
      .catch((error) => {
        console.error('Error accepting enrollment request:', error);
      });
  };

  const handleRejectRequest = (id) => {
    axios
      .put(`http://localhost:5000/api/admin/requests/reject/${id}`)
      .then(() => {
        fetchEnrollmentRequests();
      })
      .catch((error) => {
        console.error('Error rejecting enrollment request:', error);
      });
  };

  const filterEnrollmentRequests = () => {
    let filteredRequests = enrollmentRequests;

    if (filter !== 'All') {
      filteredRequests = filteredRequests.filter((request) => request.status === filter);
    }

    if (searchVIN) {
      filteredRequests = filteredRequests.filter((request) => request.vin.includes(searchVIN));
    }

    if (requestDateFilter == 'ASC') {
      const sortedRequests = filteredRequests.slice().sort((a, b) => {
        // Assuming that requestDate is a string in the format 'YYYY-MM-DDTHH:MM:SS'
        const dateA = new Date(a.requestDate);
        const dateB = new Date(b.requestDate);

        return dateB - dateA; // For ascending order; use dateB - dateA for descending
      });
      filteredRequests = sortedRequests;
    } else if (requestDateFilter == 'DSC') {
      const sortedRequests = filteredRequests.slice().sort((a, b) => {
        // Assuming that requestDate is a string in the format 'YYYY-MM-DDTHH:MM:SS'
        const dateA = new Date(a.requestDate);
        const dateB = new Date(b.requestDate);
        return dateA - dateB;
      });
      filteredRequests = sortedRequests;
    }

    return filteredRequests;
  };

  return (
    <div className={classes.adminContainer}>
      <Typography variant="h4" component="h1" gutterBottom className={classes.header}>
        Admin Dashboard
      </Typography>

      <div className={`mmy-entry-form ${classes.form}`}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add Vehicle
        </Typography>
        <TextField
          label="Make"
          variant="outlined"
          fullWidth
          value={newMMY.make}
          onChange={(e) => setNewMMY({ ...newMMY, make: e.target.value })}
        />
        <TextField
          label="Model"
          variant="outlined"
          fullWidth
          value={newMMY.model}
          onChange={(e) => setNewMMY({ ...newMMY, model: e.target.value })}
        />
        <TextField
          label="Year"
          variant="outlined"
          fullWidth
          value={newMMY.year}
          onChange={(e) => setNewMMY({ ...newMMY, year: e.target.value })}
        />
        <TextField
          label="VIN Prefix (8 characters)"
          variant="outlined"
          fullWidth
          value={newMMY.vinPrefix}
          onChange={(e) => setNewMMY({ ...newMMY, vinPrefix: e.target.value })}
        />
        {error && <p className={classes.error}>{error}</p>}

        <Button variant="contained" color="primary" onClick={handleCreateMMY}>
          Create
        </Button>
      </div>

      <Grid item xs={12} md={6} className={classes.gridContainer}>
        <div className="enrollment-requests">
          <Typography variant="h6" component="h2" gutterBottom>
            Enrollment Requests
          </Typography>
          <div className={classes.filterAndSearch}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Request Date</InputLabel>
              <Select
                value={requestDateFilter}
                onChange={(e) => setRequestDateFilter(e.target.value)}
              >
                <MenuItem value="ASC">Ascending</MenuItem>
                <MenuItem value="DES">Descending</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Search by VIN"
              variant="outlined"
              fullWidth
              value={searchVIN}
              onChange={(e) => setSearchVIN(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={fetchEnrollmentRequests}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </div>

          <List>
            {filterEnrollmentRequests().map((request) => (
              <div key={request._id} className={classes.requestContainer}>
                <ListItem>
                  <ListItemText
                    primary={`Make: ${request.make} | Model: ${request.model} | year: ${request.year} - Status: ${request.status}`}
                    secondary={`Request Date: ${request.requestDate} | VIN : ${request.vin}`}
                  />
                  {request.status === 'Pending' && (
                    <ListItemSecondaryAction className={classes.buttons}>
                      <IconButton
                        edge="end"
                        aria-label="accept"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        <AcceptIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="reject"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </div>
      </Grid>

      <div className={classes.chart}>
        <h2>Chart Data</h2>
        <PieChart data={{ noOfAccepted, noOfRejected, noOfPending }} />
        {/* <LineChart data={{ labels: timeLabels }} /> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
