import {
  Button, Box, Paper, TextField, InputLabel, MenuItem,
  FormControl, Select, FormHelperText
} from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "react-query";
import { apiCall } from "../services/apiClient";
import { API_CONFIG, ROUTES } from "../config/settings";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  question_text: yup.string().required("Question text is required"),
  option_a: yup.string().required("Option A is required"),
  option_b: yup.string().required("Option B is required"),
  option_c: yup.string().required("Option C is required"),
  option_d: yup.string().required("Option D is required"),
  difficulty: yup.string().required("Please select a difficulty"),
  correct_answer: yup.string().required("Please select the correct answer"),
  category_id: yup.number().required('category should be selected')
});







const QuestionDesign = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate()

  const {accessToken , userInfo} = useAuth()

  const{data} = useQuery('categories' , 
    async()=>{
        const response = await apiCall(API_CONFIG.BASE_URL+ROUTES.CATEGORY , 'GET' , accessToken , null)
        return await response.json()
    }
  )

  const mutation = useMutation(
      async (formDate)=>{
          const body = {...formDate , author_id: userInfo.user_id}
          const response = await apiCall(API_CONFIG.BASE_URL+ROUTES.QUESTIONS , 'POST' , accessToken , body)
          return await response.json()
      },
      {
          onSuccess:()=>{
              alert('question created')
              navigate('/menu')  
          }
      }
  )

  const onSubmit = (data) => {
    mutation.mutate(data)
  };

  return (
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
          gap: 1,
          padding: 4,
          width: 500,
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <TextField
            multiline
            rows={3}
            label="Question Text"
            style={{ width: 500 }}
            error={!!errors.text}
            helperText={errors.text?.message}
            {...register('question_text')}
          />
          <TextField
            label="Option A"
            style={{ width: 500 }}
            error={!!errors.A}
            helperText={errors.A?.message}
            {...register('option_a')}
          />
          <TextField
            label="Option B"
            style={{ width: 500 }}
            error={!!errors.B}
            helperText={errors.B?.message}
            {...register('option_b')}
          />
          <TextField
            label="Option C"
            style={{ width: 500 }}
            error={!!errors.C}
            helperText={errors.C?.message}
            {...register('option_c')}
          />
          <TextField
            label="Option D"
            style={{ width: 500 }}
            error={!!errors.D}
            helperText={errors.D?.message}
            {...register('option_d')}
          />

          
          <FormControl sx={{ width: '200px' }} error={!!errors.difficulty}>
            <InputLabel>Difficulty</InputLabel>
            <Controller
              name="difficulty"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select label="Difficulty" {...field}>
                  <MenuItem value="EASY">EASY</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="HARD">HARD</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.difficulty?.message}</FormHelperText>
          </FormControl>


          <FormControl sx={{ width: '200px' }} error={!!errors.category_id}>
            <InputLabel>Category</InputLabel>
            <Controller
              name="category_id"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select label="Difficulty" {...field}>
                  {data?.map((category)=>(<MenuItem value={category?.category_id}>{category?.name}</MenuItem>))}
                </Select>
              )}
            />
            <FormHelperText>{errors.difficulty?.message}</FormHelperText>
          </FormControl>

          
          <FormControl sx={{ width: '200px' }} error={!!errors.correct_answer}>
            <InputLabel>Correct Answer</InputLabel>
            <Controller
              name="correct_answer"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select label="Correct Answer" {...field}>
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.correctAnswer?.message}</FormHelperText>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: '10px', borderRadius: "20px" }}
          >
            Confirm
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default QuestionDesign;
