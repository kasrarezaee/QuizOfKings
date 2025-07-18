import { Box , Button, Paper, TextField, Typography } from "@mui/material"
import { useMutation, useQuery } from "react-query"
import { apiCall } from "../services/apiClient"
import { API_CONFIG, ROUTES } from "../config/settings"
import { useAuth } from "../context/AuthContext"
import { useParams } from "react-router-dom"

const QuestionAnswer = ()=>{
    
    const {accessToken , userInfo} = useAuth()

    const {title , question_id} = useParams()

    const answer_enable = (title === 'answer')
    const review_enable = (title === 'review')
    const manage_enable = (title === 'manage')


    const {data} = useQuery('question' , 
        async()=>{
            const response = await apiCall(API_CONFIG.BASE_URL+ROUTES.QUESTIONS+question_id , 'GET' , accessToken , null)
            return await response.json()
        },
        {
            onSuccess:(data)=>console.log(data)
        }
    )

    const handleConfirm = async ()=>{
        const notes = "nothing"
        const target_question_id = question_id
        const target_user_id = null
        const action_type = 'CONFIRM'
        const moderator_id = userInfo.user_id
        
        if (data && data[0]) {
          data[0].approval_status = 'ACCEPTED'
          data[0].moderator_id = userInfo.user_id
          review_mutation.mutate(data[0])
        }

        report_mutation.mutate({moderator_id, target_user_id, target_question_id, action_type, notes})

    }

    const handleReject = async ()=>{
        const notes = "nothing"
        const target_question_id = question_id
        const target_user_id = null
        const action_type = 'REJECT'
        const moderator_id = userInfo.user_id
        if (data && data[0]) {
          data[0].approval_status = 'REJECTED'
          data[0].moderator_id = userInfo.user_id
          review_mutation.mutate(data[0])
        }
        
        report_mutation.mutate({moderator_id, target_user_id, target_question_id, action_type, notes})

    }

    const report_mutation = useMutation(
        async ({moderator_id, target_user_id, target_question_id, action_type, notes}) =>{
            const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.MODERATION, 'POST', accessToken
                , {
                    moderator_id: moderator_id,
                    target_question_id: target_question_id,
                    target_user_id: target_user_id,
                    action_type: action_type,
                    notes: notes
                }
            )
            return await response.json()
        },
        {
            onSuccess:()=>alert("reported")
        }
    )

    const review_mutation = useMutation(
        async(question)=>{
            const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.QUESTIONS + question.question_id, 'POST', accessToken, question)       
        }
    )

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
                    {data?.[0]?.question_text}
                </Typography>

                <Button variant='outlined' disabled={!answer_enable}>{data?.[0]?.option_a}</Button>
                <Button variant='outlined' disabled={!answer_enable}>{data?.[0]?.option_b}</Button>
                <Button variant='outlined' disabled={!answer_enable}>{data?.[0]?.option_c}</Button>
                <Button variant='outlined' disabled={!answer_enable}>{data?.[0]?.option_d}</Button>

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
                <Button variant="contained" disabled={!review_enable} sx={{ width: 'fit-content', mx: 'auto' }}>next</Button>
                <Button variant="contained" disabled={!review_enable} sx={{ width: 'fit-content', mx: 'auto' }}>back</Button>
                <Button variant="contained" disabled={!manage_enable} onClick={handleConfirm} sx={{ width: 'fit-content', mx: 'auto' }}>confirm</Button>
                <Button variant="contained" disabled={!manage_enable} onClick={handleReject} sx={{ width: 'fit-content', mx: 'auto' }}>reject</Button>

            </Paper>      
        </Box>
    )
}

export default QuestionAnswer
