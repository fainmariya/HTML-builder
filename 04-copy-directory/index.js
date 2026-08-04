const path = require('node:path');
const fs = require('node:fs/promises');


const folderPath = path.join(__dirname, 'files')
const folderPathCopy = path.join(__dirname,'files-copy')

async function main (sourcePath, destinationPath) {
    await deleteOldPath(destinationPath)
    await createFolder(destinationPath)
    await readFolder(sourcePath, destinationPath)
    
    
}

async function deleteOldPath(oldPath) {
    await fs.rm(oldPath, {
        force: true,
        recursive: true
    })
    
}


async function  createFolder(newPathFolder) {
    
    await fs.mkdir(newPathFolder,{
        recursive: true 
    })
}

async function readFolder(sourcePath, destinationPath) {
    const listFiles = await fs.readdir(sourcePath,
        { withFileTypes: true }
    )
    for (const entry of listFiles) {
        const fullPathFiles = path.join(sourcePath, entry.name);
        const fullPathFilesCopy = path.join(destinationPath, entry.name);
        if (entry.isFile()) {
          await copyFiles(fullPathFiles, fullPathFilesCopy)
        } else if (entry.isDirectory()){
            await createFolder(fullPathFilesCopy)
            await readFolder(fullPathFiles, fullPathFilesCopy)
            

        }
        
      }
    
}
async function copyFiles(sourcePath, destinationPath) {
    await fs.copyFile(sourcePath, destinationPath)
}
main(folderPath, folderPathCopy)