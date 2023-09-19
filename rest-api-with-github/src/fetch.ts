// Imports
import axios from 'axios';

const personalAccessToken = process.env.GITHUB_TOKEN; // personalAccessToken stored locally

// Responsive Maintainer
interface METRIC_1 {
    // Variables in the formula
    ClosedIssuesInLastTwoWeeks: number; // (1) Number of closed issues in the past 2 weeks
    OpenIssues: number; // (2) Total number of open issues.
}

async function fetch_METRIC_data(apiLink: string): Promise<METRIC_1 | null> {
    
    // Creates a new date and configures it to be (Today - 14 Days) ~ 2 weeks
    // Sets it as ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ) which GitHub's API recognizes
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const sinceDate = twoWeeksAgo.toISOString();
    
    // Creates an empty array
    let allClosedIssues: any[] = [];
    let allPulls: any[] = [];
    // GitHub's REST API considers every pull request an issue, but not every issue is a pull request.
    // For this reason, "Issues" endpoints may return both issues and pull requests in the response.
    let issuesAppearingAsPullRequests = 0;
    
    // Function to fetch one page of closed issues
    async function fetchIssuesPage(pageNumber: number) {

        // Once you're in the issues page, it has the following filtering:
        // (1) state = closed [the issue has to be closed]
        // (2) since = the date specified [2 weeks ago]
        // (3) page = which page of the data you're in [starts with 1]
        // (4) per_page = has 100 issues page instead of default
        const issueResponse = await axios.get(`${apiLink}/issues?state=closed&since=${sinceDate}&page=${pageNumber}&per_page=100`, {
            headers: {
                // Completes the request with the personal access token
                Authorization: `token ${personalAccessToken}`,
            },
        });

        // If some response has been received, the response is added to the array
        if (issueResponse.status === 200) {
            allClosedIssues = allClosedIssues.concat(issueResponse.data);
        } else {
            console.error('Failed to fetch data from the GitHub API');
        }
    }

    async function fetchPullsPage(pageNumber: number) {

        // Once you're in the pulls page, it has the following filtering:
        // (1) page = which page of the data you're in [starts with 1]
        // (2) per_page = has 100 pulls page instead of default
        const pullsResponse = await axios.get(`${apiLink}/pulls?page=${pageNumber}&per_page=100`, {
            headers: {
                // Completes the request with the personal access token
                Authorization: `token ${personalAccessToken}`,
            },
        });

        // If some response has been received, the response is added to the array
        if (pullsResponse.status === 200) {
            allPulls = allPulls.concat(pullsResponse.data);
        } else {
            console.error('Failed to fetch data from the GitHub API');
        }
    }
    
    // calls the fetchPage function to get the closed issues for the first page.
    await fetchIssuesPage(1);
    let page = 2;
    // while loop to move on to the next pages
    while (true) {
        await fetchIssuesPage(page);
        if (allClosedIssues.length < page * 100) {
            break;
        }
        page++;
    }
    
    // calls the fetchPage function to get the closed issues for the first page.
    await fetchPullsPage(1);
    page = 2;
    // while loop to move on to the next pages
    while (true) {
        await fetchPullsPage(page);
        if (allPulls.length < page * 100) {
            break;
        }
        page++;
    }

    // getting the number of open issues from the base link of the repo
    const response2 = await axios.get(apiLink, {
        headers: {
            Authorization: `token ${personalAccessToken}`,
        },
    });
    
    const m1: METRIC_1 = {
        ClosedIssuesInLastTwoWeeks: allClosedIssues.length,
        OpenIssues: response2.data.open_issues - allPulls.length,
    };

    return m1;
};

export { fetch_METRIC_data };