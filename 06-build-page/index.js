const path = require('node:path')
const fs = require('node:fs/promises')

const pathTemplate = path.join(__dirname, 'template.html')
const pathComponents = path.join(__dirname, 'components')
const pathStyles = path.join(__dirname, 'styles')
const pathAssets = path.join(__dirname, 'assets')
const pathProjectDist = path.join(__dirname, 'project-dist')
const pathDistHTML = path.join(pathProjectDist, 'index.html')
const pathDistStyle = path.join(pathProjectDist, 'style.css')
const pathDistAssets = path.join(pathProjectDist, 'assets')

async function main(destinationPath, pathModel, currentPathStyles, bundlePath, currentPathAssets, destinationPathAssets) {

    await fs.rm(destinationPath,{
        recursive: true,
        force: true
    })
    await fs.mkdir(destinationPath, {
        recursive: true
    })
    await buildHTML(pathModel);
    await mergeStyles(currentPathStyles, bundlePath)
    await copyDir (currentPathAssets, destinationPathAssets)
}

async function buildHTML(pathModel) {
    const data = await fs.readFile(pathModel, 'utf8');
    let result = data
    const pattern = /{{([^{}]+)}}/g;
    const matches = data.matchAll(pattern)

    for (const match of matches) {
        const nameFile = match[1] + ".html";
        const fullPathFiles = path.join(pathComponents, nameFile)
        const componentsFile = await fs.readFile(fullPathFiles, 'utf-8')
        result = result.replace(match[0], componentsFile)
        
      }
      await fs.writeFile(pathDistHTML, result, 'utf-8')
      
}

async function mergeStyles (currentPathStyles, bundlePath) {
    const listStylesFiles = await fs.readdir(currentPathStyles, {
        withFileTypes: true
       })
    let bundleFile = '';
    for (const el of listStylesFiles){
        if (el.isFile()){
            const fileName = el.name;
            const parsedFile =path.parse(fileName)
            const extension = parsedFile.ext.slice(1); 
            if (extension === 'css'){
                const fullPath = path.join(currentPathStyles, fileName)
                const dataFile = await fs.readFile(fullPath, 'utf8')
                bundleFile += `${dataFile}\n`
            }
        }
        
    }
   
     await fs.writeFile(bundlePath, bundleFile, 'utf-8')
}

async function copyDir (currentPathAssets, destinationPathAssets) {
    await fs.mkdir(destinationPathAssets)
    const dataCurentFolder = await fs.readdir(currentPathAssets, {
        withFileTypes: true
    })
    for (const entri of dataCurentFolder){
       const sourceEntryPath = path.join(currentPathAssets, entri.name)
       const destinationEntryPath = path.join(destinationPathAssets, entri.name)
       if (entri.isFile()){
        await fs.copyFile(sourceEntryPath, destinationEntryPath)
       }
       else if (entri.isDirectory()){
         await copyDir(sourceEntryPath, destinationEntryPath)
       }
    }
}
main(pathProjectDist, pathTemplate, pathStyles, pathDistStyle, pathAssets, pathDistAssets)