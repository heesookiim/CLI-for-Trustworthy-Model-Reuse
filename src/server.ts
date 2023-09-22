// Imports
import { data } from './calculations';
import { fetch_METRIC_data, getLink, convertLink } from './fetch';
import { logger } from './logging_cfg'

// If there's a link for a npm package, set the flag to true and add the link
export async function API(link: string, npmFlag: boolean): Promise<data> {
    //var npmFlag = true;
    //link = 'https://www.npmjs.com/package/browserify';
    if (npmFlag) { 
        link = await Promise.resolve(getLink(link));   // Calling the getLink function to get the GitHub API link
    }

    //githubApiLink = 'https://api.github.com/repos/facebook/react';
    const githubApiLink: string = convertLink(link);
    console.log(githubApiLink);

    let rawData: data = {contrubtorMostPullRequests: 0, totalPullRequests: 0, activeContributors: 0,
        totalClosedIssues: 0, totalissues: 0, totalClosedIssuesMonth: 0, totalIssuesMonth: 0,
        quickStart: 0, examples: 0, usage: 0, closedIssues: 0, openIssues: 0, licenses: []};
    
    // Link for any repo
    // Calling the main fetch function for Metric 1
    const userData = await fetch_METRIC_data(githubApiLink);

    // Printing the results of fetch_METRIC_1
    if (userData) {
        rawData.closedIssues = userData.ClosedIssuesInLastTwoWeeks;
        rawData.openIssues = userData.OpenIssues;
        /*console.log('GitHub Repo Data:');
        console.log('ClosedIssuesInLastTwoWeeks:', userData.ClosedIssuesInLastTwoWeeks);
        console.log('OpenIssues:', userData.OpenIssues);*/
        logger.log('info', 'Fetched Github user data');
    } else {
        logger.log('info', 'Failed to fetch GitHub user data');        
    }

    return rawData;
}