// import { useState } from "react";
// import {Box , Button , TextField , Typography , Paper} from '@mui/material'
// import { blue } from "@mui/material/colors";

// const SignUp = () =>{
//     //'rgba(73, 122, 177, 0.68)'
//     return(
//         <> 
//             <Box
//                 display={"flex"}
//                 justifyContent={"center"}
//                 alignItems={"center"}
//                 minHeight={'100vh'}
//                 bgcolor={'rgba(54, 140, 238, 0.36)'}
//             >
//                 <Paper 
//                     elevation={24} 
//                     sx={{padding: 4, width :300 , backgroundColor:'transparent'}}
//                 >
//                     <Typography
//                         variant="h4"
//                         mb={2}
//                         align="center"                    
//                     >
//                         Sign up
//                     </Typography>
//                     <form>
//                         <TextField
//                             label="email"
//                             type="email"
//                             variant="outlined"
//                             fullWidth
//                             margin="normal"    
//                         />
//                         <TextField
//                             label="username"
//                             type="text"
//                             variant="outlined"
//                             fullWidth
//                             margin="normal"    
//                         />
//                         <TextField
//                             label="password"
//                             type="password"
//                             variant="outlined"
//                             fullWidth
//                             color="primary"
//                             margin="normal"
                            
//                         />
//                         <Button
//                             variant="text"
//                             color="primary"
//                             sx={{mx:'auto' , display:'block'}}
//                         >
//                             don you have account?
//                         </Button>
//                         <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             fullWidth
//                             sx={{mt:2}}
//                         >
//                             Sign up
//                         </Button>
//                     </form>
//                 </Paper>
//             </Box>     
//         </>
//     )
// }

// export default SignUp


import { useMutation } from 'react-query'
import {Alert , Box , Button , TextField , Typography , Paper} from '@mui/material'
import { apiCall } from '../services/apiClient'
import { API_CONFIG , ROUTES} from '../config/settings'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import {yupResolver} from "@hookform/resolvers/yup"
import { useAuth } from '../context/AuthContext'
const SignUp = () =>{
    const navigate = useNavigate()
    const {setAccessToken , setUserInfo , userInfo} = useAuth()
    const schema = yup.object().shape({
        email: yup.string()/*.email("invalid email")*/.required("email must be provided") ,
        password: yup.string().required("password must be provided"),
        username: yup.string().required('username must be provided')
    })
    const {register , handleSubmit , formState:{errors}} = useForm({resolver:yupResolver(schema)})
    const mutation = useMutation(
        async (formData)=>{
            const response = await apiCall(API_CONFIG.BASE_URL+ROUTES.SIGNUP , 'POST' , '' , formData)
            return await response.json()
        },
        {
            onSuccess:(data)=> { 
                navigate('/login')
            },
            onError:(error)=>console.log(error)
        }
    )
    const onSubmit = (data)=>{
        mutation.mutate(data)
    }
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            label="email"
                            //type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...register("email")}
                            
                        />
                        <TextField
                            error={!!errors.email}
                            helperText={errors.username?.message}
                            label="username"
                            //type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            {...register("username")}
                            
                        />
                        <TextField
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            label="password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            color="primary"
                            margin="normal"
                            {...register("password")}
                            
                        />
                        <Button
                            variant="text"
                            color="primary"
                            sx={{mx:'auto' , display:'block'}}
                            onClick={()=>navigate('/login')}
                        >
                            have an account?
                        </Button>
                        {mutation.error?.message && <Alert severity="error" sx={{backgroundColor:'transparent' , justifyContent:'center'}}>login failed</Alert>}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{mt:2}}
                        >
                            sing up
                        </Button>
                    </form>
                </Paper>
            </Box>     
        </>
    )
}

export default SignUp