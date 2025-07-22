import { Box , Paper, Typography, Button } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Session from "../components/Session"
import { useQuery } from "react-query";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../services/apiClient";
import { API_CONFIG  , ROUTES} from "../config/settings";

const Sessions = ()=>{
    const handleBack = () => {
        window.history.back(); 
    }

    const {accessToken , userInfo} = useAuth()

    const {data , isError , isLoading , error} = useQuery('sessions' , 
      async ()=>{
        const response = await apiCall(`${API_CONFIG.BASE_URL}${ROUTES.SESSIONS}user/${userInfo.user_id}` , 'GET' , accessToken , null)
        return await response.json()
      },
      {
        enabled: !!userInfo?.user_id && !!accessToken,
        // onSuccess:(data)=>console.log(data)
      }
      
    )


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
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              sx={{ 
                alignSelf: 'flex-start', 
                marginLeft: 4, 
                marginTop: 2,
                textTransform: 'none',
              }}
            >
              Back
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
                Your Sessions
              </Typography>
            </Box>

            {data?.map((session , index)=>(
              <Session 
                key={index}
                session_id = {session.session_id}
                status = {session.session_status}
                winner_id = {session.winner_id}  
                opponent = {session.player1_id === userInfo.user_id?session.player2_id:session.player1_id}
              /> 
            ))}
            
        </Box>
    )
}

export default Sessions
