import { Paper, Typography, Avatar, Box } from "@mui/material"
import PersonIcon from '@mui/icons-material/Person';

const User = () => {
    return (
        <Paper
            elevation={8}
            sx={{
                padding: 1,
                width: 250,
                background: 'linear-gradient(135deg, #4fc3f7, #227edaff)',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
        >
            <Avatar sx={{ bgcolor: 'white', color: '#1976d2' }}>
                <PersonIcon />
            </Avatar>

            <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                    username
                </Typography>
                
            </Box>
        </Paper>
    )
}

export default User;
