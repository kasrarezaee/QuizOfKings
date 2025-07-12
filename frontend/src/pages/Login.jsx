import { useState } from "react";
import {Box , Button , TextField , Typography , Paper} from '@mui/material'
import { blue } from "@mui/material/colors";

const Login = () =>{
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
                        Login
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
                            don't have an account?
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{mt:2}}
                        >
                            login
                        </Button>
                    </form>
                </Paper>
            </Box>     
        </>
    )
}

export default Login