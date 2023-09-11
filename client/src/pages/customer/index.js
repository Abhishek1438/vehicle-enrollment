import React, { useState, useEffect } from 'react';
import classes from '../../styles/Customer.module.css';
import axios from 'axios';
import customerSocket from '../../socket/socketService';
import { useSelector } from 'react-redux';

import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  IconButton,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const CustomerDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  // console.log(user);
  const [error, setError] = useState(false);
  const [mmyList, setMmyList] = useState([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    licensePlate: '',
  });
  const [filter, setFilter] = useState('All');
  const [requestDateFilter, setRequestDateFilter] = useState('ASC');
  const [searchVIN, setSearchVIN] = useState('');

  const [adminResponse, setAdminResponse] = useState('');

  // Connect to the WebSocket when the component mounts
  customerSocket.connect();

  // Listen for admin responses in real-time
  customerSocket.onNewRequest((responseData) => {
    setAdminResponse(responseData);
  });

  useEffect(() => {
    fetchMMYList();
    fetchEnrollmentRequests();
  }, []);

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
      .get('http://localhost:5000/api/customer/requests')
      .then((response) => {
        setEnrollmentRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching enrollment requests:', error);
      });
  };

  const handleCreateRequest = () => {
    // Client-side validation for VIN length

    if (newRequest.vin.length !== 17) {
      setError('VIN must be 17 characters.');
      // Handle validation error here

      console.error('VIN must be 17 characters.');
      return;
    }
    let mmy = undefined;
    for (let i = 0; i < mmyList.length; i++) {
      if (
        mmyList[i].make == newRequest.make &&
        mmyList[i].model == newRequest.model &&
        mmyList[i].year == newRequest.year &&
        mmyList[i].vinPrefix == newRequest.vin.substring(0, 8)
      ) {
        mmy = mmyList[i];
      }
    }

    if (mmy == undefined) {
      setError('VIN should have the prefix as provided');
      // Handle validation error here

      console.error('VIN should have the prefix as provided');
      return;
    }

    axios
      .post('http://localhost:5000/api/customer/submit-request', newRequest)
      .then(() => {
        // Clear form and refresh requests
        setNewRequest({
          make: '',
          model: '',
          year: '',
          vin: '',
          licensePlate: '',
          vehiclePhoto: null,
        });
        customerSocket.sendRequest(newRequest);

        fetchEnrollmentRequests();
      })
      .catch((error) => {
        console.error('Error creating enrollment request:', error);
      });

    setError(false);
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

  const getVin = (newRequest, year) => {
    let mmy;
    for (let i = 0; i < mmyList.length; i++) {
      if (
        mmyList[i].make == newRequest.make &&
        mmyList[i].model == newRequest.model &&
        mmyList[i].year == year
      ) {
        mmy = mmyList[i];
      }
    }

    return mmy.vinPrefix;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setNewRequest({ ...newRequest, carPhoto: file });
  };

  return (
    <div className={classes.customerContainer}>
      {user && <h1 className={classes.email}>USER : {user.email}</h1>}
      <Typography variant="h4" component="h1" gutterBottom className={classes.header}>
        Customer Dashboard
      </Typography>

      <div className={classes.form}>
        <Typography variant="h6" component="h2" gutterBottom>
          Make Enrollment Request
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Make</InputLabel>
              <Select
                value={newRequest.make}
                onChange={(e) => setNewRequest({ ...newRequest, make: e.target.value })}
              >
                <MenuItem value="">Select Make</MenuItem>
                {mmyList.map((mmy) => (
                  <MenuItem key={mmy._id} value={mmy.make}>
                    {mmy.make}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Model</InputLabel>
              <Select
                value={newRequest.model}
                onChange={(e) => {
                  setNewRequest({ ...newRequest, model: e.target.value });
                }}
              >
                <MenuItem value="">Select Model</MenuItem>
                {mmyList
                  .filter((mmy) => mmy.make === newRequest.make)
                  .map((mmy) => (
                    <MenuItem key={mmy._id} value={mmy.model}>
                      {mmy.model}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={newRequest.year}
                onChange={(e) => {
                  setNewRequest({
                    ...newRequest,
                    year: e.target.value,
                    vin: getVin(newRequest, e.target.value),
                  });
                }}
              >
                <MenuItem value="">Select Year</MenuItem>
                {mmyList
                  .filter((mmy) => mmy.make === newRequest.make && mmy.model === newRequest.model)
                  .map((mmy) => (
                    <MenuItem key={mmy._id} value={mmy.year}>
                      {mmy.year}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TextField
          label="VIN (17 characters)"
          variant="outlined"
          fullWidth
          value={newRequest.vin}
          onChange={(e) => setNewRequest({ ...newRequest, vin: e.target.value })}
        />
        <TextField
          label="License Plate"
          variant="outlined"
          fullWidth
          value={newRequest.licensePlate}
          onChange={(e) => setNewRequest({ ...newRequest, licensePlate: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        {error && <p className={classes.error}>{error}</p>}
        <Button variant="contained" color="primary" onClick={handleCreateRequest}>
          Submit Request
        </Button>
      </div>

      <div className={classes.enrollmentRequests}>
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
            <div key={request._id}>
              <ListItem className={classes.listItem}>
                <ListItemText
                  primary={`Make: ${request.make} - Model: ${request.model} - Year: ${request.year} - VIN: ${request.vin}`}
                  secondary={`License Plate: ${request.licensePlate} | Request Date: ${request.requestDate}`}
                />
                {request.status}
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </div>
    </div>
  );
};

export default CustomerDashboard;
