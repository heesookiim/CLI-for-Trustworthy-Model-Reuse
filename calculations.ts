// bus factor caclulation
// inputs:
// - contrubtorMostPullRequests: Most active contributor's pull requests in past year, number
// - totalPullRequests: All pull requests in the last year, number
// - activeContributors: Number of active contributors in the past year, number
// output: number from bus factor calculation [0, 1]
function BusFactor(contrubtorMostPullRequests: number, totalPullRequests: number, activeContributors: number): number {
    // check inputs for divide by 0
    if(totalPullRequests == 0) {
        return 0;
    }

    let scaleFactor: number = Math.min(1, (activeContributors / 20));
    let busFactor: number = 1 - (scaleFactor * contrubtorMostPullRequests / totalPullRequests);
    return busFactor;
}

// correctness calculation
// inputs:
// - totalClosedIssues: number of total closed issues, number
// - totalissues: number of total issues, number
// - totalClosedIssuesMonth: number of closed issues in the last month, number
// - totalIssuesMonth: number of issues in the last month, number
// output: number from correctness calculation [0, 1]
function Correctness(totalClosedIssues: number, totalissues: number, totalClosedIssuesMonth: number, totalIssuesMonth: number): number {
    // check inputs for divide by 0
    if(totalissues == 0 || totalIssuesMonth == 0) {
        return 0;
    }

    let totalRatio: number = totalClosedIssues / totalissues;
    let monthRatio: number = totalClosedIssuesMonth / totalIssuesMonth;
    return Math.min(totalRatio, monthRatio);
}

// ramp up calculation
// inputs:
// - quickStart: existence of quickStart in README (0 for doesn't exist, 1 for exists)
// - examples: existence of examples in README (0 for doesn't exist, 1 for exists)
// - usage: existance of usage section in README (0 for doesn't exist, 1 for exists)
// output: number from ramp up calculation [0, 1]
function RampUp(quickStart: number, examples: number, usage: number): number {
    return (0.5 * quickStart) + (0.25 * examples) + (0.25 * usage);
}

// responsive maintainer calculation
// inputs:
// - closedIssues: number of closed issues in past 2 weeks, number
// - openIssues: number of open issues, number
// output: number from responsive maintainer calculation [0, 1]
function ResponsiveMaintainer(closedIssues: number, openIssues: number) {
    // check inputs for divide by 0
    if(openIssues == 0) {
        return 1;
    }

    let issueRatio = closedIssues / openIssues;
    return Math.min(issueRatio, 1);
}

// license calculation
// input: list of licenses for the library and any dependencies, array of strings
// output: number from license calculation [0, 1]
function License(licenses: string[]) {
    let compliant: number = 1;  // compliance of license
    // check each license
    for(let idx: number = 0; idx < licenses.length; idx++) {
        if (licenses[idx] != 'GNU Lesser General Public License, version 2.1') {
            compliant = 0;
        }
    }

    return compliant;
}

// net score calculation
// inputs: 
// - data: array of arrays with data for each calculation:
//   [[contrubtorMostPullRequests: number, totalPullRequests: number, activeContributors: number],
//    [totalClosedIssues: number, totalissues: number, totalClosedIssuesMonth: number, totalIssuesMonth: number]
//    [quickStart: number, examples: number, usage: number]
//    [closedIssues: number, openIssues: number]
//    [licenses: string[]]]
function NetScore(data: any[]): number {
    // calculate each element of the net score
    let busFactor: number = BusFactor(data[0[0]], data[0[1]], data[0[2]]);
    let correctness: number = Correctness(data[1[0]], data[1[1]], data[1[2]], data[1[3]]);
    let rampUp: number = RampUp(data[2[0]], data[2[1]], data[2[2]]);
    let responsiveMaintainer: number = ResponsiveMaintainer(data[3[0]], data[3[1]]);
    let license: number = License[data[4[0]]];

    // calculate net score
    let netScore: number = (0.4 * busFactor) + (0.15 * correctness) + (0.15 * rampUp) + (0.3 * responsiveMaintainer);
    netScore = netScore - (1 * (1 - license));
    return netScore;
}