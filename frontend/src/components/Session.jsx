import { Paper, Typography, Box, Avatar, Chip } from "@mui/material"
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useQuery } from "react-query";
import { apiCall } from "../services/apiClient";
import { API_CONFIG, ROUTES } from "../config/settings";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Session = ({winner_id , status , opponent , session_id}) => {
    
    const {accessToken , userInfo} = useAuth()

    const {data , isLoading , isError , error} = useQuery(['opponent' , opponent] , 
        async () =>{
            const response = await apiCall(API_CONFIG.BASE_URL+ROUTES.PLAYER_STATS+opponent , 'GET' , accessToken , null)
            return await response.json()
        },
        {
            // onSuccess:(data)=>console.log(data)
        }
    )
    
   

    return (
        <Paper
            elevation={8}
            sx={{
                width: 400,
                p: 1,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #64b5f6, #1976d2)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
            }}
        >
            <Box display="flex" alignItems="center" gap={1}>
                <Avatar 
                    component={Link}
                    to={`/profile/${userInfo.user_id}`}
                    sx={{ 
                        bgcolor: 'white',
                        color: '#1976d2',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        },
                        transition: 'all 0.3s ease-in-out', 
                        
                    }}>
                    Y
                </Avatar>
                <Typography fontWeight="bold">You</Typography>
            </Box>

            
            <Chip 
              component={Link}
              to={`/rounds/${session_id}`}
              icon={<SportsEsportsIcon />} 
            //   label={status}
              label={
                        winner_id
                        ? (winner_id === userInfo.user_id ? 'YOU' : data?.[0]?.username)
                        : (status === 'COMPLETED'? 'draw' :'pending')
                    }

              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            />

            
            <Box display="flex" alignItems="center" gap={1}>
                <Avatar 
                    component={Link}
                    to={`/profile/${opponent}`}
                    sx={{ 
                        bgcolor: 'white', 
                        color: '#1976d2',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        },
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    O
                </Avatar>
                <Typography fontWeight="bold">{data?.[0]?.username}</Typography>
            </Box>
        </Paper>
    )
}

export default Session;
