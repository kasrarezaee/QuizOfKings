import {Button, Box, Paper, TextareaAutosize, InputLabel , MenuItem , FormControl , Select, TextField } from "@mui/material"
import { useState } from "react"

const QuestionDesign = ()=>{
    const [difficulity , setDifficulity] = useState('')
    const handleChangeDifficulity = (event)=>{
        setDifficulity(event.target.value)
    }
    const [correctAnswer , setCorrectAnswer] = useState('')
    const handleChangeCorrectAnswer = (event)=>{
        setCorrectAnswer(event.target.value)
    }
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
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center'
                    
                }}
            >
                <form style={{
                    display:'flex',
                    flexDirection:'column',
                    gap:'8px',
                    alignItems:'center'
                }}>
                    <TextField
                        multiline                    
                        rows={3}
                        label="question text"
                        style={{ width: 500}}
                    />
                    <TextField
                        label="option a"
                        style={{ width: 500}}
                    />
                    <TextField
                        label="option b"
                        style={{ width: 500}}
                    />
                    <TextField
                        label="option c"
                        style={{ width: 500}}
                    />
                    <TextField
                        label="option d"
                        style={{ width: 500}}
                    />
                    <FormControl sx={{width:'200px'}}>
                      <InputLabel id="demo-simple-select-label">Difiiculity</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={difficulity}
                        label="Age"
                        onChange={handleChangeDifficulity}
                      >
                        <MenuItem value={"EASY"}>EASY</MenuItem>
                        <MenuItem value={"MEDIUM"}>MEDIUM</MenuItem>
                        <MenuItem value={"HARD"}>HARD</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{width:'200px'}}>
                      <InputLabel id="demo-simple-select-label">Correct Answer</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={correctAnswer}
                        label="Age"
                        onChange={handleChangeCorrectAnswer}
                      >
                        <MenuItem value={"A"}>A</MenuItem>
                        <MenuItem value={"B"}>B</MenuItem>
                        <MenuItem value={"C"}>C</MenuItem>
                        <MenuItem value={"D"}>D</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{mt:'10px' , borderRadius:"20px"}}
                        
                    >confirm</Button>
                </form>
            </Paper>
        </Box>
    )
}

export default QuestionDesign