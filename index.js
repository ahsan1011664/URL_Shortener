const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const { URL } = require('url'); 


const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const urls = []; 

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// URL Shortener Endpoint
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  
  try {
    new URL(originalUrl);
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

 
  const hostname = new URL(originalUrl).hostname;

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    } else {
      const shortUrl = urls.length + 1; 
      urls.push({ original_url: originalUrl, short_url: shortUrl });
      res.json({ original_url: originalUrl, short_url: shortUrl });
    }
  });
});


app.get('/api/shorturl/:short_url', (req, res) => {
  const short = parseInt(req.params.short_url);
  const urlMapping = urls.find(u => u.short_url === short);

  if (urlMapping) {
    res.redirect(urlMapping.original_url);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
