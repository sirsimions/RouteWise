import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';

const JourneyPlanner = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedStartLocation, setSelectedStartLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [journeyPlan, setJourneyPlan] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const [error, setError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // New state for spinner

  useEffect(() => {
    fetch('https://routeback.onrender.com/api/v1/routes')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setRoutes(data);
        } else {
          setError('Failed to load routes');
        }
      })
      .catch((err) => {
        console.error('Error fetching routes:', err);
        setError('Failed to load routes');
      })
      .finally(() => setLoadingRoutes(false));
  }, []);

  const handleSubmit = () => {
    if (!selectedRoute || !selectedStartLocation || !startTime) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setFormSubmitted(false);
    setIsGenerating(true);

    fetch('https://routeback.onrender.com/api/v1/journey_planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        route: selectedRoute,
        start_location: selectedStartLocation,
        start_time: startTime,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.plan) {
          setJourneyPlan(data.plan);

          const distance = data.plan.reduce((sum, step) => sum + (step.km || 0), 0);
          const time = data.plan.reduce((sum, step) => sum + (step.time_used || 0), 0);

          setTotalDistance(distance);
          setTotalTimeUsed(time);
          setFormSubmitted(true);
        } else {
          setError('Journey plan error: ' + (data.error || 'Unknown error'));
        }
      })
      .catch((err) => {
        console.error('Error generating journey plan:', err);
        setError('An error occurred while generating the journey plan.');
      })
      .finally(() => setIsGenerating(false));
  };

  if (loadingRoutes) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <CircularProgress />
        <p>Loading routes...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
      <h2 style={{ color: '#333', textAlign: 'center' }}>Journey Management</h2>

      <Card elevation={4} style={{ maxWidth: '1000px', margin: '0 auto', marginBottom: '30px' }}>
        <CardContent>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '15px',
              marginTop: '10px',
            }}
          >
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <TextField
                label="Route"
                select
                fullWidth
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                variant="outlined"
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {routes.map((route) => (
                  <option key={route.id} value={route.name}>
                    {route.name}
                  </option>
                ))}
              </TextField>
            </div>

            <div style={{ width: '100%', maxWidth: '300px' }}>
              <TextField
                label="Start Location"
                value={selectedStartLocation}
                onChange={(e) => setSelectedStartLocation(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </div>

            <div style={{ width: '100%', maxWidth: '300px' }}>
              <TextField
                label="Start Time (HH:MM)"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </div>

            <div style={{ maxWidth: '200px', width: '100%' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ marginTop: '8px', width: '100%', height: '40px' }}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Generate Journey Plan'
                )}
              </Button>
            </div>
          </form>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </CardContent>
      </Card>

      {formSubmitted && journeyPlan.length > 0 && (
        <>
          <Card elevation={4} style={{ maxWidth: '1000px', margin: '0 auto', marginBottom: '20px' }}>
            <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">
                <strong>Total Distance:</strong> {totalDistance.toFixed(1)} km
              </Typography>
              <Typography variant="subtitle1">
                <strong>Total Time:</strong> {Math.ceil(totalTimeUsed / 60)} hours
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={4} style={{ maxWidth: '1000px', margin: '0 auto', marginBottom: '30px' }}>
            <CardContent>
              <div style={{ marginTop: '30px', overflowY: 'auto', maxHeight: '60vh' }}>
                <h3 style={{ textAlign: 'center' }}>Journey Plan</h3>
                <TableContainer
                  component={Paper}
                  style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}
                >
                  <Table aria-label="journey plan table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={cellHeaderStyle}>Start Location</TableCell>
                        <TableCell style={cellHeaderStyle}>Stop Location</TableCell>
                        <TableCell style={cellHeaderStyle}>Start Time</TableCell>
                        <TableCell style={cellHeaderStyle}>Stop Time</TableCell>
                        <TableCell style={cellHeaderStyle}>Distance (km)</TableCell>
                        <TableCell style={cellHeaderStyle}>Time Used (min)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {journeyPlan.map((step, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }}>
                          <TableCell style={cellBodyStyle}>{step.start_location}</TableCell>
                          <TableCell style={cellBodyStyle}>{step.stop_location}</TableCell>
                          <TableCell style={cellBodyStyle}>{step.start_time}</TableCell>
                          <TableCell style={cellBodyStyle}>{step.stop_time}</TableCell>
                          <TableCell style={cellBodyStyle}>{step.km}</TableCell>
                          <TableCell style={cellBodyStyle}>{step.time_used}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

const cellHeaderStyle = {
  fontWeight: 'bold',
  border: '1px solid #a9a9a9',
  padding: '4px 6px',
  fontSize: '12px',
  backgroundColor: '#e6e6e6',
  fontFamily: 'Consolas, "Courier New", monospace',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  height: '30px',
  lineHeight: '1.2',
};

const cellBodyStyle = {
  border: '1px solid #a9a9a9',
  padding: '4px 6px',
  fontSize: '12px',
  fontFamily: 'Consolas, "Courier New", monospace',
  height: '28px',
  lineHeight: '1.2',
};

export default JourneyPlanner;
