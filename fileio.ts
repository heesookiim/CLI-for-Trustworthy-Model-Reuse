import * as fs from 'fs'

// object to hold data for each module
type module = {
    link: string,
    busFactor: number,
    correctness: number,
    rampUp: number,
    responsiveMaintainer: number,
    license: number,
    netScore: number
}

// read URLs from input into array of strings
// each string in return array will be one link
// input: file path as string
// output: array of strings
function ReadFile(file: string): string[] {
    // read file contents
    let links: string = fs.readFileSync(file, 'utf-8');
    let linksList: string[] = links.split('\n');
    return linksList;
}

// create an array of module objects and populate links field
function CreateModules(linksList: string[]): module[] {
    let moduleList: module[] = [];
    // create list of module objects for each link
    // fill link field
    // initialize calculation fields to 0
    for(let idx: number = 0; idx < linksList.length; idx++) {
        let newModule: module = {link: linksList[idx], busFactor: 0, correctness: 0, rampUp: 0, 
                                 responsiveMaintainer: 0, license: 0, netScore: 0};
        console.log('\nlink: %s\n', linksList[idx]);
        moduleList.push(newModule);
    }

    return moduleList;
}

// generate output
// input: array of modules
// prints NDJSON output to stdout
function GenerateOutput(moduleList: module[]) {
    // output each element in moduleList
    for(let idx: number = 0; idx < moduleList.length; idx++) {
        console.log(JSON.stringify(moduleList[idx]));
    }
}

// primary function for handling input, output and calculations
// input: string with URL_FILE location
// output: error or NDJSON to stdout
function URLFileHandler(file: string) {
    // check for file existing
    if(!fs.existsSync(file)) {
        console.log('Error: file does not exist at provided path');
        return 1;
    }

    // split file into array of strings
    let linksList: string[] = ReadFile(file);

    // create array of modules
    let moduleList: module[] = CreateModules(linksList);

    // complete calculations
    // note: all calculated values will output 0 for now

    // generate output and print to stdout
    GenerateOutput(moduleList);
}

//URLFileHandler('test.txt');