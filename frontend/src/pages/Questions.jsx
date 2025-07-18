import User from "../components/User";
import { useQuery } from "react-query";
import { API_CONFIG, ROUTES } from "../config/settings";
import { apiCall } from "../services/apiClient";
import { useAuth } from "../context/AuthContext";
import { Box, Typography } from "@mui/material";
import Spinner from "../components/Spinner";
import QuestionCard from "../components/QuestionCard";

const Questions = ({title}) => {
  
  
  const { accessToken } = useAuth();
  
  const {
    data,
    isError,
    isLoading,
    error,
  } = useQuery(
    ["Questions", title],
    async () => {
      const response = await apiCall(API_CONFIG.BASE_URL+ROUTES.QUESTIONS , "GET", accessToken, null);
      return await response.json();
    },
    {
      staleTime: 5 * 60 * 1000, // prevent re-fetching for 5 minutes
      cacheTime: 10 * 60 * 1000,
      keepPreviousData: true,
    },
    
  );

  return (
    <Box
      gap={2}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"100vh"}
      bgcolor={"rgba(54, 140, 238, 0.36)"}
    >
      <Box
        sx={{
          width: "80%",
          maxWidth: 400,
          padding: 2,
          borderRadius: 3,
          textAlign: "center",
          background: "linear-gradient(90deg, #5d67a0e7 0%, #2196f3 100%)",
          boxShadow: 4,
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
          questions
        </Typography>
      </Box>

      {isLoading && <Spinner />}
      {isError && <Typography color="error">Error: {error.message}</Typography>}

      {data?.map((question , index) => (
        <QuestionCard
          key={index}
          question_id={question.question_id}
          status={question.approval_status}
          title= {title}
        />
      ))}
    </Box>
  );
};

export default Questions;
