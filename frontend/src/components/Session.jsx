import { Paper, Typography, Box, Avatar, Chip } from "@mui/material"
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const Session = () => {
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
                <Avatar sx={{ bgcolor: 'white', color: '#1976d2' }}>Y</Avatar>
                <Typography fontWeight="bold">You</Typography>
            </Box>

            {/* Status */}
            <Chip 
              icon={<SportsEsportsIcon />} 
              label="In Progress" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 'bold'
              }}
            />

            {/* Opponent */}
            <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ bgcolor: 'white', color: '#1976d2' }}>O</Avatar>
                <Typography fontWeight="bold">Opponent</Typography>
            </Box>
        </Paper>
    )
}

export default Session;
