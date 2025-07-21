import { Box , Button, Paper, TextField, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery } from "react-query"
import { apiCall } from "../services/apiClient"
import { API_CONFIG, ROUTES } from "../config/settings"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import Spinner from "../components/Spinner"
const CategorySelect = () => {

  const navigate = useNavigate();
  
  const {session_id} = useParams()

  const { accessToken } = useAuth();

  const handleCategorySelect = async (category_id)=>{
    
    console.log(category_id)
    const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.QUESTIONS + "random/" + category_id , 'GET' , accessToken)
    const result = await response.json()  


    round_mutation.mutate({category_id:category_id , round_questions: result})
  
  }

  const { data, isLoading, isError, error } = useQuery(
    ['categories'],
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

  const round_mutation = useMutation(
    async({category_id , round_questions})=>{
    
      const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.ROUNDS, 'POST', accessToken
              , {
                  session_id: session_id,
                  category_id: category_id,
                  round_questions: round_questions
              })
      return await response.json()
    },
    {
      onSuccess:(data)=>{
        navigate(`/round_questions/${data[0].round_id}/answer`)
      },
      onError:(error)=>alert("error")
    }
  )

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
            onClick={()=>handleCategorySelect(category.category_id)}
          >
            {category.name}
          </Button>
        ))}
      </Paper>
    </Box>
  );
};


export default CategorySelect