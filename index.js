require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const urlParser = require('url');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const urls = [];

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', (req, res) => {
  const Url = req.body.url;
  const host = urlParser.parse(Url).hostname;

  dns.lookup(host, (err) => {
    if (err) {
      return res.json({
         error: 'URL is Invalid '
         });
    } else {
      const short_URL = urls.length + 1;
      urls.push({ originalURL: Url, shortURL: short_URL });
      res.json({ originalURL: Url, shortURL: short_URL });
    }
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short = parseInt(req.params.short_url);
  const a = urls.find(u => u.short_url === short);

  if (a) {
    res.redirect(a.original_url);
  } else {
    res.status(404).send('URL is not present');
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
