import { Box , Paper, Typography, Button } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Round from "../components/Round"
import { useQuery } from "react-query";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../services/apiClient";
import { API_CONFIG  , ROUTES} from "../config/settings";
import { useNavigate, useParams } from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';

const Rounds = ()=>{
    const {session_id} = useParams()

    const {accessToken , userInfo} = useAuth()

    const navigate = useNavigate()

    const {data , isError , isLoading , error} = useQuery('rounds' , 
      async ()=>{
        const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.SESSIONS + "session/" + session_id , 'GET' , accessToken , null)
        return await response.json()
      },
      {
        onSuccess:(data)=>console.log(data)
      }
    )

    const opponentId =
      data && data.length > 0
        ? (data[0].player1_id === userInfo.user_id
            ? data[0].player2_id
            : data[0].player1_id)
        : null;
        
    // const handleClick = () => {
    //   if (opponentId) {
    //     // navigate(`/chat/${session_id}/${userInfo.user_id}/${opponentId}`);
    //     navigate('/menu')
    //   }
      
    // };

    return(
        <Box
            gap={2}
            display={"flex"}
            flexDirection={'column'}
            justifyContent={"center"}
            alignItems={"center"}
            minHeight={'100vh'}
            bgcolor={'rgba(54, 140, 238, 0.36)'}
        >
            
            <Button 
              // onClick={handleClick}
              onClick={()=>navigate(`/chat/${session_id}/${userInfo.user_id}/${opponentId}`)} 
              startIcon={<ChatIcon />}
              variant="outlined"
              sx={{ 
                alignSelf: 'flex', 
                textTransform: 'none',
              }}
            >
              CHAT
            </Button>

            
            <Box
                sx={{
                  width: '80%',
                  maxWidth: 400,
                  padding: 2,
                  borderRadius: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(90deg, #5d67a0e7 0%, #2196f3 100%)',
                  boxShadow: 4,
                  marginBottom:4
                }}
            >
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Rounds
              </Typography>
            </Box>

            { data?.map((round)=>(
              <Round 
                status = {round.round_status}  
                opponent = {round.player1_id === userInfo.user_id?round.player2_id:round.player1_id}
                round_id = {round.round_id}
                winner_id = {round.winner_id}
              /> 
            ))} 
            
        </Box>
    )
}

export default Rounds
