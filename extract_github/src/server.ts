// Imports
import { fetch_METRIC_1, getLink, convertLink } from './fetch';

// If there's a link for a npm package, set the flag to true and add the link
const npmLink = 'https://www.npmjs.com/package/browserify';
var npmFlag = true;

(async () => {

    if (npmFlag) { 
        const githubLink = await Promise.resolve(getLink(npmLink));   // Calling the getLink function to get the GitHub API link
        const guthubApiLink = convertLink(githubLink);
    } 
    else {  // If there's no link for a npm package, add GitHub API link
        
        // Link for any repo
        const githubApiLink = 'https://api.github.com/repos/facebook/react';
        // Calling the main fetch function for Metric 1
        const userData = await fetch_METRIC_1(githubApiLink);

        // Printing the results of fetch_METRIC_1
        if (userData) {
            console.log('GitHub Repo Data:');
            console.log('ClosedIssuesInLastTwoWeeks:', userData.ClosedIssuesInLastTwoWeeks);
            console.log('OpenIssues:', userData.OpenIssues);
        } else {
            console.log('Failed to fetch GitHub user data.');
        }
    }
})();