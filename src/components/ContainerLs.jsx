import React, { useState, useEffect } from "react";
import { ContainerDetails } from "./ContainerDetail";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
} from "@mui/material";
import Api from "../api";

export const ContainerLs = ({ containers }) => {
  const [spacePercentage, setSpacePercentage] = useState([]);

  useEffect(() => {
    const getSpacePercentage = () => {
      const percentage = containers.map((container) => {
        const totalSpace =
          container.length * container.breadth * container.height;
        const filledSpace = container.cargoItems.reduce((acc, item) => {
          return acc + item.length * item.breadth * item.height;
        }, 0);
        return (filledSpace / totalSpace) * 100;
      });
      setSpacePercentage(percentage);
    };
    getSpacePercentage();
  }, [containers]);


const [cities, setCities] = useState([]);

useEffect(() => {
  const fetchCities = async () => {
    try {
      const response = await Api.fetchCities(); // returns { cities: [{ id, name }] }
      const cityMap = {};
      response.data.cities.forEach(city => {
        cityMap[city.id] = city.name; // Use number as key
      });
      setCities(cityMap);
    } catch (err) {
      console.error("Error fetching cities", err);
    }
  };

  fetchCities();
}, []);


  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Container List
      </Typography>
      {containers.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No containers available
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {containers.map((container, index) => (
            <Grid item xs={12} sm={6} md={4} key={container.id}>
              <Card
                variant="outlined"
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Container #{container.id}
                  </Typography>
<Typography variant="body1">
  <strong>From:</strong> {cities[container.from_city_id] || "Unknown"}
</Typography>
<Typography variant="body1">
  <strong>To:</strong> {cities[container.to_city_id] || "Unknown"}
</Typography>

                  <Typography variant="body1" gutterBottom>
                    <strong>Dimensions:</strong> {container.length} x{" "}
                    {container.breadth} x {container.height}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Available From:</strong>{" "}
                    {new Date(container.availableFrom).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Available Until:</strong>{" "}
                    {new Date(container.availableUntil).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Cost per cubic ft:</strong>{" "}
                    ₹{container.cost}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Space Utilization:</strong>{" "}
                      {spacePercentage[index]?.toFixed(2) || 0}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={spacePercentage[index] || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  </Box>
                  <ContainerDetails container={container} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
