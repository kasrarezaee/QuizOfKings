import { Box, Paper, Typography, Divider , Button , InputLabel , MenuItem , FormControl , Select, TextField} from "@mui/material"
import { useState } from "react";

const Profile = () => {
    // Sample static values – replace with props/state as needed
    const totalGames = 25;
    const gamesWon = 18;
    const accuracy = ((gamesWon / totalGames) * 100).toFixed(1) + "%";
    const xpLevel = 7;
    const [role , setRole] = useState('')
    const [clicked , setClicked] = useState(false)
    const handleClick = ()=>{
        setClicked(prev=>!prev)
    }
    const handleChange = (event)=>{
        setRole(event.target.value)
    }
    return (
        <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            minHeight={'100vh'}
            bgcolor={'rgba(54, 140, 238, 0.36)'}
            flexDirection={'column'}
        >
            <Paper
                elevation={24}
                sx={{
                    padding: 4,
                    width: 320,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #304ceeff 30%, #47a2ecff 90%)',
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
            <FormControl sx={{width:'200px' , mt:'20px'}}>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value={"moderator"}>moderator</MenuItem>
                <MenuItem value={"admin"}>admin</MenuItem>
                <MenuItem value={"question_designer"}>question designer</MenuItem>
              </Select>
            </FormControl>

            <Button
                type="submit"
                variant={clicked?"outlined":"contained"}
                color="primary"
                sx={{mt:'10px' , borderRadius:"10px"}}
                onClick={handleClick}
            >{clicked?"unblock":"block"}</Button>
        </Box>
    )
}

export default Profile
