import {useEffect, useState} from 'react';
import './App.css';
import Grid2 from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useParams } from "react-router";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton } from '@mui/material';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function App() {

  const [input, setInput] = useState<string>("")
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBitlyAddress, setNewBitlyAddress] = useState("");
  const { id } = useParams();
  
const createRandomString = ()=>{
    let result = '';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

  const createNewBitlyAddress = () => {    
    setLoading(true);
    const randomString = createRandomString()
    fetch("/.netlify/functions/doesShortLinkExistAlready", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ randomString }),
    })
      .then((res) => res.json())
      .then((res) => {
        setNewBitlyAddress(`notbitly.com/${randomString}`)
      })
      .catch((res) => {
        setError(res);
        return ""
      }); 
    }

  const getRedirectUrl = () => {
    setLoading(true);
    fetch("/.netlify/functions/getRedirectUrl", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => {
        // redirect user to the new site
        window.open(res.url,"_self")
        setLoading(false);
      })
      .catch((res) => {
        setError(res);
        setLoading(false);
      });
  };

  const createRedirectUrl = () => {
    // let newBitlyAddress
    setLoading(true);
     const newShortUrl = createNewBitlyAddress()
    // while (!newBitlyAddress && !error) {
    //   newBitlyAddress = createNewBitlyAddress()
    // }
    fetch("/.netlify/functions/createShortUrl", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ fullUrl:input, newShortUrl }),
    })
      .then((res) => res.json())
      .then((res) => {
        // redirect user to the new site
        window.open(res.url,"_self")
        setLoading(false);
      })
      .catch((res) => {
        setError(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      getRedirectUrl();
    }
  }, [id]);

   const copyText = () => {
    navigator.clipboard.writeText(newBitlyAddress);
  };

  if (error) console.log({ error });

  if (loading) return <CircularProgress/>

  if (id) return null

  return (
    
      <Grid2 container display="flex" alignContent="center" justifyContent="center" flexDirection="column">
        <Grid2 flexDirection="column">
          <TextField onChange={(e)=>setInput(e.target.value)} variant="outlined" value={input} sx={{width:'100%'}}/>
          <Button onClick={createRedirectUrl} variant='contained' fullWidth sx={{marginTop:'1rem'}}>Get Shortened URL</Button>
        </Grid2>
        <Grid2>
          <Grid2
          flexDirection="row"
          alignContent="center"
          justifyContent="center"
        >
          <span>{newBitlyAddress}</span>
          <IconButton onClick={copyText}>
            <ContentCopyIcon />
          </IconButton>
        </Grid2>
        </Grid2>
      </Grid2>
      
  );
}

export default App;
