// import { useState } from 'react'
import { useState, useEffect } from 'react';
import './App.css';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
function App() {
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState([]);
  const [copied, setCopied] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("shortenedUrls");
    if (data) setShortened(JSON.parse(data));
  }, []);
  useEffect(() => {
    localStorage.setItem("shortenedUrls", JSON.stringify(shortened));
  }, [shortened]);

  function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
  }

  function handleShorten() {
    if (!url.trim()) return;
    const found = shortened.find(item => item.original === url);
    if (found) return;
    const code = generateShortCode();
    setShortened([
      ...shortened,
      { original: url, code, clicks: 0 }
    ]);
    setUrl("");
  }

  function handleVisit(code) {
    setShortened(shortened.map(item =>
      item.code === code ? { ...item, clicks: item.clicks + 1 } : item
    ));
    const item = shortened.find(i => i.code === code);
    if (item) window.open(item.original, "_blank");
  }

  function handleCopy(shortUrl) {
    navigator.clipboard.writeText(shortUrl);
    setCopied(shortUrl);
    setSnackbarMsg("Copied to clipboard!");
    setSnackbarOpen(true);
    setTimeout(() => setCopied(""), 1000);
  }

  const base = window.location.origin + window.location.pathname;

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            URL Shortener
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleShorten();
            }}
            style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}
          >
            <TextField
              label="Paste your long URL here..."
              variant="outlined"
              value={url}
              onChange={e => setUrl(e.target.value)}
              fullWidth
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleShorten}
              type="submit"
              sx={{ minWidth: 140 }}
            >
              Shorten URL
            </Button>
          </form>
        </Paper>
        {shortened.length > 0 && (
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shortened.map(item => {
                  const shortUrl = `${base}?s=${item.code}`;
                  return (
                    <TableRow key={item.code}>
                      <TableCell>
                        <Tooltip title="Open short URL">
                          <Button
                            href="#"
                            onClick={e => {
                              e.preventDefault();
                              handleVisit(item.code);
                            }}
                            endIcon={<OpenInNewIcon fontSize="small" />}
                            size="small"
                            sx={{ textTransform: 'none' }}
                          >
                            {shortUrl}
                          </Button>
                        </Tooltip>
                        <Tooltip title={copied === shortUrl ? "Copied!" : "Copy to clipboard"}>
                          <IconButton
                            color={copied === shortUrl ? "success" : "default"}
                            onClick={() => handleCopy(shortUrl)}
                            sx={{ ml: 1 }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Tooltip title={item.original}>
                          <span>{item.original}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{item.clicks}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleVisit(item.code)}
                          size="small"
                        >
                          Visit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={1200}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Container>
    </>
  );
}

export default App
