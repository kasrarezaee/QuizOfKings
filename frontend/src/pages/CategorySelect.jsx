import { Box , Button, Paper, TextField, Typography } from "@mui/material"


const CategorySelect = ()=>{
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
                    width: 300,
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
                  Chose a category for this round.
                </Typography>

                <Button variant='contained'>Paris</Button>
                <Button variant='contained'>Berlin</Button>
                <Button variant='contained'>Madrid</Button>
            </Paper>      
        </Box>
    )
}

export default CategorySelect