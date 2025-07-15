import { useMutation } from 'react-query'
import {Alert , Box , Button , TextField , Typography , Paper} from '@mui/material'
import { apiCall } from '../services/apiClient'
import { API_CONFIG , ROUTES} from '../config/settings'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from "@hookform/resolvers/yup"
const Login = () =>{
    const schema = yup.object().shape({
        email: yup.string()/*.email("invalid email")*/.required("email must be provided") ,
        password: yup.string().required("password must be provided")
    })
    const {register , handleSubmit , formState:{errors}} = useForm({resolver:yupResolver(schema)})
    const mutation = useMutation(
        async (formData)=>{
            const response = await apiCall(API_CONFIG.BASE_URL+ROUTES.LOGIN , 'POST' , '' , formData)
            return await response.json()
        },
        {
            onSuccess:(data)=> console.log(data),
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
                        >
                            don't have an account?
                        </Button>
                        {mutation.error?.message && <Alert severity="error" sx={{backgroundColor:'transparent' , justifyContent:'center'}}>login failed</Alert>}
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