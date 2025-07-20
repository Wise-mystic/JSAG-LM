const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const loginHtml = fs.readFileSync(path.join(__dirname, '../public/login.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(loginHtml);
  } catch (error) {
    console.error('Error serving login.html:', error);
    res.status(500).send('Internal Server Error');
  }
}; 