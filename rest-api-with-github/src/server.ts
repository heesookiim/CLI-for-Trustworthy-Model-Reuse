import axios from 'axios';
import { fetch_METRIC_1 } from './fetch';

// Link for any repo
const githubApiLink = 'https://api.github.com/repos/facebook/react';

(async () => {
    const userData = await fetch_METRIC_1(githubApiLink);

    if (userData) {
        console.log('GitHub Repo Data:');
        console.log('ClosedIssuesInLastTwoWeeks:', userData.ClosedIssuesInLastTwoWeeks);
        console.log('OpenIssues:', userData.OpenIssues);
    } else {
        console.log('Failed to fetch GitHub user data.');
    }
})();
