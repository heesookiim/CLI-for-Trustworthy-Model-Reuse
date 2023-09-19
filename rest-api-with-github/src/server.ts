// Imports
import { fetch_METRIC_data } from './fetch';

// Link for any repo
const githubApiLink = 'https://api.github.com/repos/facebook/react';

(async () => {
    // Calling the main fetch function for Metric 1
    const metric1 = await fetch_METRIC_data(githubApiLink);

    // Printing the results of fetch_METRIC_1
    if (metric1) {
        console.log('ClosedIssuesInLastTwoWeeks:', metric1.ClosedIssuesInLastTwoWeeks);
        console.log('OpenIssues:', metric1.OpenIssues);
    } else {
        console.log('Failed to fetch GitHub metric1.');
    }
})();
