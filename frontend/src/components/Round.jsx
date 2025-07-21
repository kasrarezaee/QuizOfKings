import { Paper, Typography, Box, Avatar, Chip } from "@mui/material"
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useQuery } from "react-query";
import { apiCall } from "../services/apiClient";
import { API_CONFIG, ROUTES } from "../config/settings";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Round = ({ status, opponent, round_id }) => {
    const { accessToken, userInfo } = useAuth();

    const { data: opponentData, isLoading, isError, error } = useQuery(
        ['opponent', opponent],
        async () => {
            const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.PLAYER_STATS + opponent, 'GET', accessToken);
            return await response.json();
        }
    );

    const { data: roundQuestions } = useQuery(
        ['round_questions', round_id],
        async () => {
            const response = await apiCall(API_CONFIG.BASE_URL + ROUTES.ROUNDS + "round_id/" + round_id, 'GET', accessToken);
            return await response.json();
        },
        {
            onError: () => alert('Error fetching round questions'),
            onSuccess: () => {
                if (!opponentData || !opponentData[0]) return;

                const isPlayer1 = userInfo.user_id === opponentData[0].user_id;
                setWhichPlayerYouAre(isPlayer1 ? 'player1' : 'player2');
            }
        }
    );

    const [whichPlayerYouAre, setWhichPlayerYouAre] = useState('');
    const [youAnsweredThisRound, setYouAnsweredThisRound] = useState(false);
    const [pageStatus, setPageStatus] = useState('');

    useEffect(() => {
        if (!opponentData || !opponentData[0] || whichPlayerYouAre === '') return;

        const answerField = whichPlayerYouAre === 'player1'
            ? roundQuestions[0].player1_answer
            : roundQuestions[0].player2_answer;

        const answered = answerField !== null;
        setYouAnsweredThisRound(answered);
        setPageStatus(answered ? 'review' : 'answer');
        
        console.log(answerField)
    }, [whichPlayerYouAre, opponentData]);

    return (
        <Paper
            elevation={8}
            sx={{
                width: 400,
                p: 1,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #64b5f6, #1976d2)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
            }}
        >
            <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                    component={Link}
                    to={`/profile/${userInfo.user_id}`}
                    sx={{
                        bgcolor: 'white',
                        color: '#1976d2',
                        '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        },
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    Y
                </Avatar>
                <Typography fontWeight="bold">You</Typography>
            </Box>

            <Chip
                component={pageStatus ? Link : 'div'}
                to={pageStatus ? `/round_questions/${round_id}/${pageStatus}` : undefined}
                icon={<SportsEsportsIcon />}
                label={status}
                sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': pageStatus ? {
                        transform: 'scale(1.02)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                    } : {},
                    transition: 'all 0.3s ease-in-out',
                    cursor: pageStatus ? 'pointer' : 'not-allowed'
                }}
            />

            <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                    component={Link}
                    to={`/profile/${opponent}`}
                    sx={{
                        bgcolor: 'white',
                        color: '#1976d2',
                        '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                        },
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    O
                </Avatar>
                <Typography fontWeight="bold">{opponentData?.[0]?.username}</Typography>
            </Box>
        </Paper>
    );
};

export default Round;
