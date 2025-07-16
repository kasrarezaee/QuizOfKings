import { Box , Button, Paper, TextField, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { apiCall } from "../services/apiClient"
import { API_CONFIG, ROUTES } from "../config/settings"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import Spinner from "../components/Spinner"
const CategorySelect = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const { data, isLoading, isError, error } = useQuery(
    'categories',
    async () => {
      const response = await apiCall(
        API_CONFIG.BASE_URL + ROUTES.CATEGORY + "random/random",
        'GET',
        accessToken,
        null
      );
      return await response.json();
    }
  );

  return (
    <Box
      gap={4}
      display={"flex"}
      flexDirection={'column'}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={'100vh'}
      bgcolor={'rgba(54, 140, 238, 0.36)'}
    >
      <Paper
        elevation={24}
        sx={{
          gap: 1,
          padding: 4,
          width: 300,
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          mb={2}
          sx={{
            color: '#047bebec',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          Choose a category.
        </Typography>

        {isLoading && <Spinner/>}
        {isError && <Typography>Error: {error.message}</Typography>}

        {data?.map((category, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => navigate('/questionAnswer')}
          >
            {category.name}
          </Button>
        ))}
      </Paper>
    </Box>
  );
};


export default CategorySelect