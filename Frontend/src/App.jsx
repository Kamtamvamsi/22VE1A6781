// import { useState } from 'react'
import { useState, useEffect } from 'react'
import './App.css'
function App() {
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState([]);
  const [copied, setCopied] = useState("");

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
    setTimeout(() => setCopied(""), 1000);
  }

  const base = window.location.origin + window.location.pathname;

  return (
    <>
      <div className="heading">
        <h1>URL Shortener</h1>
      </div>
      <div className="bth-url">
        <div className="url-input">
          <input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>
        <button className="btn" onClick={handleShorten}>
          Shorten URL
        </button>
      </div>
      <div className="shortened-list">
        {shortened.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Original URL</th>
                <th>Clicks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shortened.map(item => {
                const shortUrl = `${base}?s=${item.code}`;
                return (
                  <tr key={item.code}>
                    <td>
                      <a
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          handleVisit(item.code);
                        }}
                      >
                        {shortUrl}
                      </a>
                      <button onClick={() => handleCopy(shortUrl)} style={{marginLeft: 8}}>
                        {copied === shortUrl ? "Copied!" : "Copy"}
                      </button>
                    </td>
                    <td style={{maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      <span title={item.original}>{item.original}</span>
                    </td>
                    <td>{item.clicks}</td>
                    <td>
                      <button onClick={() => handleVisit(item.code)}>Visit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default App
