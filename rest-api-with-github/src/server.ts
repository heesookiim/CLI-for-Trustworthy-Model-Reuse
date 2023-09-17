// Imports
import { fetch_METRIC_1 } from './fetch';

// Link for any repo
const githubApiLink = 'https://api.github.com/repos/facebook/react';

(async () => {
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
})();
