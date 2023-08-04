import { useEffect, useState } from "react";
import "./App.css";
import Grid2 from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // B64

const createShortUrlEndpoint = process.env.REACT_APP_CREATE_SHORT_URL_ENDPOINT;
const getLongUrlEndpoint = process.env.REACT_APP_GET_LONG_URL_ENDPOINT;

function App() {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [newBitlyAddress, setNewBitlyAddress] = useState<string>("");

  const { id } = useParams();

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
    if (getLongUrlEndpoint) {
      setLoading(true);
      fetch(getLongUrlEndpoint, {
        method: "POST",
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log({ res });
          if (!res) {
            setError("No URL found");
          } else {
            goToLongUrl(res.longUrl);
          }
          setLoading(false);
        })
        .catch((res) => {
          setError(res);
          setLoading(false);
        });
    }
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
    if (createShortUrlEndpoint) {
      setLoading(true);
      const newShortUrlId = createRandomString();
      fetch(createShortUrlEndpoint, {
        method: "POST",
        body: JSON.stringify({ fullUrl: input, newShortUrlId }),
      })
        .then((res) => res.json())
        .then((res) => {
          setNewBitlyAddress(res.shortUrl);
          setLoading(false);
        })
        .catch((res) => {
          setError(res);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (id && getLongUrlEndpoint) {
      getRedirectUrl();
    }
  }, [id]);

  const copyText = () => {
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
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          createRedirectUrl();
        }
      }}
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
