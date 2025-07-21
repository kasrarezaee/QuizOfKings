import {
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useQuery } from "react-query";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../services/apiClient";
import { API_CONFIG, ROUTES } from "../config/settings";
import { useParams, useNavigate } from "react-router-dom";
import QuestionAnswer from "./QuestionAnswer";
import { useState } from "react";

const RoundQuestions = () => {
  const { round_id , title} = useParams();
  const navigate = useNavigate();
  const { accessToken, userInfo } = useAuth();

  const [session_id , setSessionId] = useState(null)

  const { data, isError, isLoading, error } = useQuery(
    ["questions", round_id],
    async () => {
      const response = await apiCall(
        API_CONFIG.BASE_URL + ROUTES.ROUNDS + "round_id/" + round_id,
        "GET",
        accessToken,
        null
      );
      return await response.json();
    },
    {
      onSuccess: (data) => {setSessionId(data[0].session_id); console.log(data)}
    }
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: 4,
        background: `linear-gradient(135deg, rgba(54, 140, 238, 0.15), rgba(54, 140, 238, 0.36))`,
        backdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      {/* Header */}
      <Paper
        elevation={12}
        sx={{
          padding: 3,
          px: 5,
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          textAlign: "center",
          mt: 10
        }}
        
      >
        <Typography variant="h4" fontWeight="bold" color="primary" mb={1}>
          Review Round #{round_id}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Paper>

      {/* Question List */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
          maxWidth: 800,
        }}
      >
        {isLoading && <Typography>Loading...</Typography>}
        {isError && (
          <Typography color="error">
            Something went wrong: {error?.message}
          </Typography>
        )}

        {data?.map((question, index) => (
          <Fade in timeout={500 + index * 100} key={question.question_id}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Question {index + 1}
              </Typography>
              <QuestionAnswer title={title} question_id={question.question_id} round_id = {round_id} session_id = {session_id} question = {question}/>
              <Divider sx={{ mt: 3 }} />
            </Box>
          </Fade>
        ))}

        <Button variant="contained">finish round</Button>
      </Box>
    </Box>
  );
};

export default RoundQuestions;
