const express = require('express');
const multer = require('multer');
const SFTPClient = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

const sftp = new SFTPClient();
const sftpConfig = {
  host: 'storage1.danbot.host',
  port: 2022,
  username: 'daddy08.ee40ebff',
  password: 'Ayaanop08'
};

app.use(express.static('public'));

app.post('/upload', upload.single('media'), async (req, res) => {
  const file = req.file;
  const remotePath = `/media/${file.originalname}`;

  try {
    await sftp.connect(sftpConfig);
    await sftp.put(file.path, remotePath);
    await sftp.end();
    fs.unlinkSync(file.path);  // Remove file from local uploads folder
    res.send('File uploaded successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('File upload failed');
  }
});

app.get('/media', async (req, res) => {
  try {
    await sftp.connect(sftpConfig);
    const list = await sftp.list('/media');
    await sftp.end();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to retrieve media');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
