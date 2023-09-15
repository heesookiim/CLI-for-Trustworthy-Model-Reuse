import { module } from './fileio';

// object to hold raw data for each module
export type data = {
    contrubtorMostPullRequests: number, // Most active contributor's pull requests in past year, number
    totalPullRequests: number,          // All pull requests in the last year, number
    activeContributors: number,         // Number of active contributors in the past year, number
    totalClosedIssues: number,          // number of total closed issues, number
    totalissues: number,                // number of total issues, number
    totalClosedIssuesMonth: number,     // number of closed issues in the last month, number
    totalIssuesMonth: number,           // number of issues in the last month, number
    quickStart: number,                 // existence of quickStart in README (0 for doesn't exist, 1 for exists)
    examples: number,                   // existence of examples in README (0 for doesn't exist, 1 for exists)
    usage: number                       // existance of usage section in README (0 for doesn't exist, 1 for exists)
    closedIssues: number,               // number of closed issues in past 2 weeks, number
    openIssues: number,                 // number of open issues, number
    licenses: string[],                 // string of licenses for module and dependencies
}

// bus factor caclulation
// input: raw data from REST API call
// output: number from bus factor calculation [0, 1]
function BusFactor(rawData: data): number {
    // check inputs for divide by 0
    if(rawData.totalPullRequests == 0) {
        return 0;
    }

    let scaleFactor: number = Math.min(1, (rawData.activeContributors / 20));
    let busFactor: number = 1 - (scaleFactor * rawData.contrubtorMostPullRequests / rawData.totalPullRequests);
    return busFactor;
}

// CORRECTNESS_SCORE calculation
// input: raw data from REST API call
// output: number from CORRECTNESS_SCORE calculation [0, 1]
function Correctness(rawData: data): number {
    // check inputs for divide by 0
    if(rawData.totalissues == 0 || rawData.totalIssuesMonth == 0) {
        return 0;
    }

    let totalRatio: number = rawData.totalClosedIssues / rawData.totalissues;
    let monthRatio: number = rawData.totalClosedIssuesMonth / rawData.totalIssuesMonth;
    return Math.min(totalRatio, monthRatio);
}

// ramp up calculation
// input: raw data from REST API call
// output: number from ramp up calculation [0, 1]
function RampUP(rawData: data): number {
    return (0.5 * rawData.quickStart) + (0.25 * rawData.examples) + (0.25 * rawData.usage);
}

// responsive maintainer calculation
// input: raw data from REST API call
// output: number from responsive maintainer calculation [0, 1]
function ResponsiveMaintainer(rawData: data): number {
    // check inputs for divide by 0
    if(rawData.openIssues == 0) {
        return 1;
    }

    let issueRatio = rawData.closedIssues / rawData.openIssues;
    return Math.min(issueRatio, 1);
}

// license calculation
// input: raw data from REST API call
// output: number from license calculation [0, 1]
function License(rawData: data): number {
    let compliant: number = 1;  // compliance of license
    // check each license
    for(let idx: number = 0; idx < (rawData.licenses).length; idx++) {
        if ((rawData.licenses)[idx] != 'GNU Lesser General Public License, version 2.1') {
            compliant = 0;
        }
    }

    return compliant;
}

// net score calculation
// input: module with data from other metric calculations
// output: number from net score calculation [0, 1]
function NetScore(module: module): number {
    // calculate net score
    return ((0.4 * module.BUS_FACTOR_SCORE) + (0.15 * module.CORRECTNESS_SCORE) + (0.15 * module.RAMP_UP_SCORE) + (0.3 * module.RESPONSIVE_MAINTAINER_SCORE))
            - (1 * (1 - module.LICENSE_SCORE))
}

// generate calculations for each module
// input: array of modules with URLs filled in
// output: array of modules with all fields filled
function GenerateCalculations(moduleList: module[]): module[] {
    let dataList: data[] = [];
    // loop through each module and get data from REST API
    // complete claculations for each module
    for(let idx: number = 0; idx < moduleList.length; idx++) {
        // only initialized below for testing calculations independently (can be changed for calculation testing)
        // remove once REST API call is ready
        let rawData: data = {contrubtorMostPullRequests: 0, totalPullRequests: 0, activeContributors: 0,
                             totalClosedIssues: 0, totalissues: 0, totalClosedIssuesMonth: 0, totalIssuesMonth: 0,
                             quickStart: 0, examples: 0, usage: 0, closedIssues: 0, openIssues: 0, licenses: []};

        // call REST API on URL from module
        // example command:
        // let rawData: data = RestAPI(moduleList[idx].URL);

        // calculate each metric and update module object
        moduleList[idx].BUS_FACTOR_SCORE = BusFactor(rawData);
        moduleList[idx].CORRECTNESS_SCORE = Correctness(rawData);
        moduleList[idx].RAMP_UP_SCORE = RampUP(rawData);
        moduleList[idx].RESPONSIVE_MAINTAINER_SCORE = ResponsiveMaintainer(rawData);
        moduleList[idx].LICENSE_SCORE = License(rawData);
        moduleList[idx].NET_SCORE = NetScore(moduleList[idx]);
    }

    return moduleList;
}