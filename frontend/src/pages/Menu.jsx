import { Paper, Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate()
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"97vh"}
      bgcolor={"rgba(54, 140, 238, 0.36)"}
      gap={4} 
    >
      <Box
        sx={{
          width: '80%',
          maxWidth: 400,
          padding: 2,
          borderRadius: 3,
          textAlign: 'center',
          background: 'linear-gradient(90deg, #5d67a0e7 0%, #2196f3 100%)',
          boxShadow: 4,
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          Welcome to QuizMaster
        </Typography>
        
        <Typography variant="subtitle1" sx={{ color: 'white' }}>
          Test your knowledge & compete with friends!
        </Typography>
      </Box>

      
      <Paper
        elevation={24}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: 4,
          width: 200,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
        }}
      >
        <Stack spacing={2}>
          <Button variant="contained" color="primary" onClick={()=>navigate('/categorySelect')}>
            New Match
          </Button>
          <Button variant="contained" color="primary" onClick={()=>navigate('/sessions')}>
            Sessions
          </Button>
          <Button variant="contained" color="primary" onClick={()=>navigate('google.com/')}>
            Exit
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Menu;
