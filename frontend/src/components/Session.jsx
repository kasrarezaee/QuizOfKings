import { Paper, Typography } from "@mui/material"

const Session = ()=>{
    return (
        <Paper
            elevation={24} 
            sx={{
                gap:20,
                padding: 1,
                width: 500,
                backgroundColor:'transparent',
                display:'flex',
                flexDirection:'row',
                justifyContent:'center',
                alignItems:'center'
            }}
        >
            <Typography>you</Typography>
            <Typography>status</Typography>
            <Typography>opponent</Typography>
        </Paper>
    )
}

export default Session