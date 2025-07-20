const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const registerHtml = fs.readFileSync(path.join(__dirname, '../public/register.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(registerHtml);
  } catch (error) {
    console.error('Error serving register.html:', error);
    res.status(500).send('Internal Server Error');
  }
}; 