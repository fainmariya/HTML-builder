const fs = require('node:fs/promises')
const path = require('node:path')
const stylesPath = path.join(__dirname, 'styles')
const projectDistPath = path.join(__dirname, 'project-dist')
const bundlePath = path.join(projectDistPath, 'bundle.css')
async function mergeStyles(folderPath) {
   const data = await fs.readdir(folderPath,
    {
    withFileTypes: true
   })
   let bundleFile = ''
    for (const entry of data){
        if (entry.isFile()){
            const fileName = entry.name;
            const parsedFile =path.parse(fileName)
            const extension = parsedFile.ext.slice(1); 
            if (extension === 'css'){
                const fullPath = path.join(folderPath, fileName)
                const dataFile = await fs.readFile(fullPath, 'utf8')
                bundleFile += `${dataFile}\n`
            }
        }
    }
    await fs.mkdir(projectDistPath, { recursive: true });
    await fs.writeFile(bundlePath, bundleFile, 'utf-8')
    }  

    mergeStyles(stylesPath)