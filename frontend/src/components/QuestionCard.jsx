import { Paper, Typography, Avatar, Box  , Chip} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { Link } from "react-router-dom";

const QuestionCard = ({ question_id , status , title}) => {
  return (
    <Paper
      component={Link}
      to={`/questionAnswer/${question_id}/${title}`}
      elevation={8}
      sx={{
        padding: 1.5,
        width: 280,
        background: 'linear-gradient(135deg, #4fc3f7, #227edaff)',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        textDecoration: 'none', // removes underline from link
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >

      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {question_id}
        </Typography>

        <Chip  
          label={status} 
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            color: 'white',
            fontWeight: 'bold'
          }}
        />

      </Box>
    </Paper>
  );
};

export default QuestionCard;
