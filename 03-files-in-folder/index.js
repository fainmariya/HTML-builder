const fs = require('node:fs/promises');
const path = require('node:path');

const folderPath = path.join(__dirname, 'secret-folder');

async function readFolder() {
  const entries = await fs.readdir(folderPath, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (entry.isFile()) {
      const fileName = entry.name;
      const parsedFile = path.parse(fileName);

      const name = parsedFile.name;
      const extension = parsedFile.ext.slice(1);
      const filePath = path.join(folderPath, fileName);

      const fileStats = await fs.stat(filePath);
      const fileSize = (fileStats.size / 1024).toFixed(3);

      console.log(`${name} - ${extension} - ${fileSize}kb`);
    }
  }
}

readFolder();