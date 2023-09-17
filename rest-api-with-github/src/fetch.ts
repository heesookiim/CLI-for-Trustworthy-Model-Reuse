// Imports
import axios from 'axios';

const personalAccessToken = process.env.GITHUB_TOKEN; // personalAccessToken stored locally

// Responsive Maintainer
interface METRIC_1 {
    // Variables in the formula
    ClosedIssuesInLastTwoWeeks: number; // (1) Number of closed issues in the past 2 weeks
    OpenIssues: number; // (2) Total number of open issues.
}

async function fetch_METRIC_1(apiLink: string): Promise<METRIC_1 | null> {
    
    // Creates a new date and configures it to be (Today - 14 Days) ~ 2 weeks
    // Sets it as ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ) which GitHub's API recognizes
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const sinceDate = twoWeeksAgo.toISOString();
    
    // Creates an empty array
    let allClosedIssues: any[] = [];
    
    // Function to fetch one page of closed issues
    async function fetchPage(pageNumber: number) {

        // Once you're in the issues page, it has the following filtering:
        // (1) state = closed [the issue has to be closed]
        // (2) since = the date specified [2 weeks ago]
        // (3) page = which page of the data you're in [starts with 1]
        // (4) per_page = has 100 issues page instead of default
        const response = await axios.get(`${apiLink}/issues?state=closed&since=${sinceDate}&page=${pageNumber}&per_page=100`, {
            headers: {
                // Completes the request with the personal access token
                Authorization: `token ${personalAccessToken}`,
            },
        });

        // If some response has been received, the response is added to the array
        if (response.status === 200) {
            allClosedIssues = allClosedIssues.concat(response.data);
        } else {
            console.error('Failed to fetch data from the GitHub API');
        }
    }
    
    // calls the fetchPage function to get the closed issues for the first page.
    await fetchPage(1);
    let page = 2;
    // while loop to move on to the next pages
    while (true) {
        await fetchPage(page);
        if (allClosedIssues.length < page * 100) {
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
    
    // getting the number of closed issues from the length of the response
    const Response_ClosedIssuesInLastTwoWeeks = allClosedIssues.length;
    const someData: METRIC_1 = {
        ClosedIssuesInLastTwoWeeks: Response_ClosedIssuesInLastTwoWeeks,
        OpenIssues: response2.data.open_issues, // getting the number of open issues from the base link of the repo
    };
    return someData;

};

export { fetch_METRIC_1 };