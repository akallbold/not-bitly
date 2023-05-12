import {useState} from 'react';
import './App.css';
import Grid2 from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
function App() {

  const [input, setInput] = useState<string>("")
  const handleSubmit = () =>{
    console.log(input)
  }
  return (
    <div className="App">
  <Grid2 container>
<Grid2>

     <TextField onChange={(e)=>setInput(e.target.value)} variant="outlined" value={input}/>
     <Button onClick={handleSubmit}/>
</Grid2>
<Grid2>

     <p>Bitly link will pop up here</p>
</Grid2>
  </Grid2>
      
    </div>
  );
}

export default App;
