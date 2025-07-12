import { Box , Paper, Typography, Button } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Session from "../components/Session"

const Sessions = ()=>{
    const handleBack = () => {
        window.history.back(); 
    }

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

            <Session/>
            <Session/>
            <Session/>
            <Session/>
        </Box>
    )
}

export default Sessions
