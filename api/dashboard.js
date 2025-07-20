const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const dashboardHtml = fs.readFileSync(path.join(__dirname, '../public/dashboard.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(dashboardHtml);
  } catch (error) {
    console.error('Error serving dashboard.html:', error);
    res.status(500).send('Internal Server Error');
  }
}; 