const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const config = require('./model/config');

app.once('ready', () => {
  const window = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#333',
    icon: path.join(__dirname, '/res/256x256.png'),
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
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
      slashes: true,
    })
  );

  window.once('ready-to-show', () => {
    window.show();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
