// Imports
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

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

async function getLink(npmLink: string) {
    try {
        // Fetch the content of the npm package page
        const response = await axios.get(npmLink);

        if (response.status === 200) {
            const html = response.data;

            // Use regular expression to find the GitHub repository link
            const githubRepoMatch = html.match(/"repository"\s*:\s*"([^"]+)"/);

            if (githubRepoMatch && githubRepoMatch[1]) {
                // Construct the GitHub link from the matched repository URL
                const repositoryUrl = githubRepoMatch[1].replace(/^git\+/, '').replace(/\.git$/, '');
                return repositoryUrl;
            }
        }
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }

    // Return null if the GitHub link couldn't be retrieved
    return null;
}

function convertLink(githubLink: string) {
    // Split the GitHub link into 3 parts
    const linkParts = githubLink.split('/');
    console.log(`GitHub link parts: ${linkParts}`);
    // The owner of the repository is the second part
    const owner = linkParts[3];

    // The name of the repository is the third part
    const repoName = linkParts[4];

    // Construct the GitHub API link from the owner and repository name
    const githubApiLink = `https://api.github.com/repos/${owner}/${repoName}`;

    console.log(`GitHub API link: ${githubApiLink}`);
    return githubApiLink;
} 

export { fetch_METRIC_data, getLink, convertLink };