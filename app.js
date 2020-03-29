const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const config = require('./model/config');

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  const window = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#333',
    show: false,
    frame: false
  });

  window.setFullScreen(true);

  if (config.prod) {
    // To disable full screen hotkey F11. The default menu bounds F11.
    window.setMenu(null);
  }

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  window.once('ready-to-show', () => {
    window.show();
  });

  if (config.prod) {
    window.on('blur', () => {
      window.focus();
    });
  }
});
