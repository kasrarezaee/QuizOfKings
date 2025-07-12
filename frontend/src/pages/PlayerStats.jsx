import { Box, Paper, Typography, Divider } from "@mui/material"

const PlayerStats = () => {
    // Sample static values – replace with props/state as needed
    const totalGames = 25;
    const gamesWon = 18;
    const accuracy = ((gamesWon / totalGames) * 100).toFixed(1) + "%";
    const xpLevel = 7;

    return (
        <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            minHeight={'100vh'}
            bgcolor={'rgba(54, 140, 238, 0.36)'}
        >
            <Paper
                elevation={24}
                sx={{
                    padding: 4,
                    width: 320,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #576cdfff 30%, #91c4eeff 90%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}
            >
                <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
                    Player Stats
                </Typography>
                
                <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />

                <Typography variant="body1" fontSize="1.1rem">
                    🎮 <strong>Total Games:</strong> {totalGames}
                </Typography>

                <Typography variant="body1" fontSize="1.1rem">
                    🏆 <strong>Games Won:</strong> {gamesWon}
                </Typography>

                <Typography variant="body1" fontSize="1.1rem">
                    🎯 <strong>Accuracy:</strong> {accuracy}
                </Typography>

                <Typography variant="body1" fontSize="1.1rem">
                    ⭐ <strong>XP Level:</strong> {xpLevel}
                </Typography>
            </Paper>
        </Box>
    )
}

export default PlayerStats
