const {createWriteStream} = require('node:fs');
const path = require('node:path');
const readline = require('node:readline')

const filePath = path.join(__dirname, 'output.txt')
const rl = readline.createInterface({ 
    input: process.stdin,
    output: process.stdout, 
    prompt: 'Enter text: ',});

   

const writeStream = createWriteStream(filePath, {flags: 'a'});

rl.on('line',(input) => {
    if (input.trim().toLowerCase() === 'exit'){
        rl.close()
    } else {
        writeStream.write(`${input}\n`)
        rl.prompt();
    }
  
})
rl.on('SIGINT',() =>{
    rl.close()
})
rl.on('close', () =>{
    writeStream.end()
    console.log('Bye')
})
rl.prompt();