import * as fs from 'fs'

// object to hold data for each module
export type module = {
    URL: string,
    NET_SCORE: number,
    RAMP_UP_SCORE: number,
    CORRECTNESS_SCORE: number,
    BUS_FACTOR_SCORE: number,    
    RESPONSIVE_MAINTAINER_SCORE: number,
    LICENSE_SCORE: number
}

// read URLs from input into array of strings
// each string in return array will be one URL
// input: file path as string
// output: array of strings
function ReadFile(file: string): string[] {
    // read file contents
    let URLs: string = fs.readFileSync(file, 'utf-8');
    let URLsList: string[] = URLs.split('\n');
    return URLsList;
}

// create an array of module objects and populate URLs field
function CreateModules(URLsList: string[]): module[] {
    let moduleList: module[] = [];
    // create list of module objects for each URL
    // fill URL field
    // initialize calculation fields to 0
    for(let idx: number = 0; idx < URLsList.length; idx++) {
        let newModule: module = {URL: URLsList[idx], NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0,
                                 BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0};
        console.log('\nURL: %s\n', URLsList[idx]);
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
export function URLFileHandler(file: string) {
    // check for file existing
    if(!fs.existsSync(file)) {
        // needs to be changed to logging
        console.log('Error: file does not exist at provided path');
        return 1;
    }

    // split file into array of strings
    let URLsList: string[] = ReadFile(file);

    // create array of modules
    let moduleList: module[] = CreateModules(URLsList);

    // complete calculations
    // note: all calculated values will output 0 for now

    // generate output and print to stdout
    GenerateOutput(moduleList);
}