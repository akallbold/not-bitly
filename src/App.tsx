import { useEffect, useState } from "react";
import "./App.css";
import Grid2 from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // B64
const notBitlyBase = "notbitly.com/";

function App() {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [newBitlyAddress, setNewBitlyAddress] = useState<string>("");

  const { id } = useParams();
  console.log({ id });

  const createRandomString = () => {
    let result = "";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const getRedirectUrl = () => {
    setLoading(true);
    console.log("get redirect url");
    fetch("/.netlify/functions/getLongUrl", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => {
        // redirect user to the longURL site
        console.log({ res });
        if (!res) {
          setError("No URL found");
        } else {
          console.log("redirecting to ", res.longUrl);
          window.open(res.longUrl, "_self");
        }
        setLoading(false);
      })
      .catch((res) => {
        setError(res);
        setLoading(false);
      });
  };

  const createRedirectUrl = () => {
    setLoading(true);
    const newShortUrlId = createRandomString();
    fetch("/.netlify/functions/createShortUrl", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ fullUrl: input, newShortUrlId }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log({ res });
        console.log("new site! ", `${notBitlyBase}${res.id}`);
        setNewBitlyAddress(`${notBitlyBase}${res.id}`);
        setLoading(false);
      })
      .catch((res) => {
        console.log({ res });
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

  if (loading) return <CircularProgress />;

  if (id) return null;

  return (
    <Grid2
      container
      display="flex"
      alignContent="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Grid2 flexDirection="column">
        <TextField
          onChange={(e) => setInput(e.target.value)}
          variant="outlined"
          value={input}
          sx={{ width: "100%" }}
        />
        <Button
          onClick={createRedirectUrl}
          variant="contained"
          fullWidth
          sx={{ marginTop: "1rem" }}
        >
          Get Shortened URL
        </Button>
      </Grid2>
      <Grid2>
        <Grid2
          flexDirection="row"
          alignContent="center"
          justifyContent="center"
        >
          {newBitlyAddress && (
            <>
              <a
                href={newBitlyAddress}
                target="_blank"
                rel="noreferrer noopener"
              >
                {newBitlyAddress}
              </a>
              <IconButton onClick={copyText}>
                <ContentCopyIcon />
              </IconButton>
            </>
          )}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export default App;
