import { Box , Button, Paper, TextField, Typography } from "@mui/material"

const QuestionAnswer = ()=>{
    
    return(
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
                    gap:1,
                    padding: 4,
                    width: 500,
                    backgroundColor:'transparent',
                    display:'flex',
                    flexDirection:'column'
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
                  What is the capital of France?
                </Typography>

                <Button variant='outlined'>Paris</Button>
                <Button variant='outlined'>Berlin</Button>
                <Button variant='outlined'>Madrid</Button>
                <Button variant='outlined'>Rome</Button>
            </Paper>
            <Paper
                elevation={24} 
                sx={{
                    gap:1,
                    padding: 4,
                    width: 500,
                    height:30,
                    backgroundColor:'transparent',
                    display:'flex',
                    flexDirection:'row'
                }}
            >
                <Button variant="contained" sx={{ width: 'fit-content', mx: 'auto' }}>confirm</Button>
                <Button variant="contained" sx={{ width: 'fit-content', mx: 'auto' }}>confirm</Button>
                <Button variant="contained" sx={{ width: 'fit-content', mx: 'auto' }}>confirm</Button>
                <Button variant="contained" sx={{ width: 'fit-content', mx: 'auto' }}>confirm</Button>
                <Button variant="contained" sx={{ width: 'fit-content', mx: 'auto' }}>confirm</Button>
            </Paper>      
        </Box>
    )
}

export default QuestionAnswer
