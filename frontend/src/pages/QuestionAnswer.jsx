import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Grid,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { apiCall } from "../services/apiClient";
import { API_CONFIG, ROUTES } from "../config/settings";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const QuestionAnswer = (props=null) => {
  const { accessToken, userInfo } = useAuth();
//   let { title, question_id } = useParams();

//   if (title === null && question_id === null) {
//     title = props.title;
//     question_id = props.question_id;
//   }

  let { title: routeTitle, question_id: routeQuestionId } = useParams();
  let title = routeTitle ?? props?.title;
  let question_id = routeQuestionId ?? props?.question_id;


  const answer_enable = title === "answer";
  const review_enable = title === "review";
  const manage_enable = title === "manage";

  const { data } = useQuery(
    ["question" , question_id],
    async () => {
      const response = await apiCall(
        API_CONFIG.BASE_URL + ROUTES.QUESTIONS + question_id,
        "GET",
        accessToken,
        null
      );
      return await response.json();
    },
    {
      onSuccess: (data) => console.log(data),
      onError:()=>console.log(question_id)
    }
  );

  const handleConfirm = () => {
    const notes = "nothing";
    const target_question_id = question_id;
    const target_user_id = null;
    const action_type = "CONFIRM";
    const moderator_id = userInfo.user_id;

    if (data && data[0]) {
      data[0].approval_status = "ACCEPTED";
      data[0].moderator_id = moderator_id;
      review_mutation.mutate(data[0]);
    }

    report_mutation.mutate({
      moderator_id,
      target_user_id,
      target_question_id,
      action_type,
      notes,
    });
  };

  const handleReject = () => {
    const notes = "nothing";
    const target_question_id = question_id;
    const target_user_id = null;
    const action_type = "REJECT";
    const moderator_id = userInfo.user_id;

    if (data && data[0]) {
      data[0].approval_status = "REJECTED";
      data[0].moderator_id = moderator_id;
      review_mutation.mutate(data[0]);
    }

    report_mutation.mutate({
      moderator_id,
      target_user_id,
      target_question_id,
      action_type,
      notes,
    });
  };

  const report_mutation = useMutation(
    async ({
      moderator_id,
      target_user_id,
      target_question_id,
      action_type,
      notes,
    }) => {
      const response = await apiCall(
        API_CONFIG.BASE_URL + ROUTES.MODERATION,
        "POST",
        accessToken,
        {
          moderator_id,
          target_question_id,
          target_user_id,
          action_type,
          notes,
        }
      );
      return await response.json();
    },
    {
      onSuccess: () => alert("Reported successfully"),
    }
  );

  const review_mutation = useMutation(async (question) => {
    const response = await apiCall(
      API_CONFIG.BASE_URL + ROUTES.QUESTIONS + question.question_id,
      "POST",
      accessToken,
      question
    );
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: `linear-gradient(
          135deg,
          rgba(54, 140, 238, 0.15) 0%,
          rgba(54, 140, 238, 0.25) 50%,
          rgba(54, 140, 238, 0.36) 100%
        )`,
        padding: 2,
        borderRadius:"20px"
      }}
    >
      <Paper
        elevation={8}
        sx={{
          padding: 4,
          width: "90%",
          maxWidth: 600,
          borderRadius: "24px",
          background: "transparent",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          mb={3}
          color="primary"
        >
          {data?.[0]?.question_text}
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            color="info"
            disabled={!answer_enable}
            sx={{ borderRadius: "12px" }}
          >
            {data?.[0]?.option_a}
          </Button>
          <Button
            variant="contained"
            color="info"
            disabled={!answer_enable}
            sx={{ borderRadius: "12px" }}
          >
            {data?.[0]?.option_b}
          </Button>
          <Button
            variant="contained"
            color="info"
            disabled={!answer_enable}
            sx={{ borderRadius: "12px" }}
          >
            {data?.[0]?.option_c}
          </Button>
          <Button
            variant="contained"
            color="info"
            disabled={!answer_enable}
            sx={{ borderRadius: "12px" }}
          >
            {data?.[0]?.option_d}
          </Button>
        </Stack>
      </Paper>

      <Grid
        container
        spacing={2}
        justifyContent="center"
        mt={4}
        maxWidth="sm"
      >
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<NavigateBeforeIcon />}
            disabled={!review_enable}
            sx={{ display: review_enable ? 'inline-flex' : 'none' }}
          >
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            endIcon={<NavigateNextIcon />}
            disabled={!review_enable}
            sx={{ display: review_enable ? 'inline-flex' : 'none' }}
          >
            Next
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckIcon />}
            disabled={!manage_enable}
            onClick={handleConfirm}
            sx={{ display: manage_enable ? 'inline-flex' : 'none' }}
          >
            Confirm
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="error"
            startIcon={<ClearIcon />}
            disabled={!manage_enable}
            onClick={handleReject}
            sx={{ display: manage_enable ? 'inline-flex' : 'none' }}
          >
            Reject
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionAnswer;
