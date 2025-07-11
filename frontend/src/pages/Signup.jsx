import { useState } from "react";
import {Box , Button , TextField , Typography , Paper} from '@mui/material'
import { blue } from "@mui/material/colors";

const SignUp = () =>{
    //'rgba(73, 122, 177, 0.68)'
    return(
        <> 
            <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                minHeight={'100vh'}
                bgcolor={'rgba(54, 140, 238, 0.36)'}
            >
                <Paper 
                    elevation={24} 
                    sx={{padding: 4, width :300 , backgroundColor:'transparent'}}
                >
                    <Typography
                        variant="h4"
                        mb={2}
                        align="center"                    
                    >
                        Sign up
                    </Typography>
                    <form>
                        <TextField
                            label="email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"    
                        />
                        <TextField
                            label="username"
                            type="text"
                            variant="outlined"
                            fullWidth
                            margin="normal"    
                        />
                        <TextField
                            label="password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            color="primary"
                            margin="normal"
                            
                        />
                        <Button
                            variant="text"
                            color="primary"
                            sx={{mx:'auto' , display:'block'}}
                        >
                            don you have account?
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{mt:2}}
                        >
                            Sign up
                        </Button>
                    </form>
                </Paper>
            </Box>     
        </>
    )
}

export default SignUp