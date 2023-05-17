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
const baseUrl = process.env.REACT_APP_BASE_URL;

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
        if (!res) {
          setError("No URL found");
        } else {
          console.log("redirecting to ", res.longUrl);
          goToLongUrl(res.longUrl);
        }
        setLoading(false);
      })
      .catch((res) => {
        setError(res);
        setLoading(false);
      });
  };

  const goToLongUrl = (site: string) => {
    const cleanLink = addPrefixIfNeeded(site);
    window.open(cleanLink, "_self");
  };

  const addPrefixIfNeeded = (url: string) => {
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    if (!/^www\./i.test(url))
      url = url.replace(/^(https?:\/\/)?(www\.)?/i, "$1www.");
    return url;
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
        setNewBitlyAddress(`${baseUrl}${res.id}`);
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
    console.log({ newBitlyAddress, navigator });
    navigator.clipboard.writeText(newBitlyAddress);
  };

  if (error) console.log({ error });

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
          {loading && <CircularProgress />}
          {newBitlyAddress && !loading && (
            <>
              <a
                href={`http://www.${newBitlyAddress}`}
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
