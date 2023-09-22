// Imports
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const personalAccessToken = process.env.GITHUB_TOKEN; // personalAccessToken stored locally

// different metrics from the GitHub API
// format of comments:
// description, specific-description?  [for-which-metric]
interface MetricData {
    totalPullers365: number; // number of active contributors, last 365 days [bus factor]
    mostPulls365: number; // most active contributor's pull request count, last 365 days [bus factor]
    totalPulls365: number; // number of pull requests, last 365 days [bus factor]
    issuesClosed: number; // number of closed issues [correctness]
    issuesTotal: number; // total number of issues [correctness]
    issuesClosed30: number; // number of closed issues, last 30 days [correctness]
    issuesTotal30: number; // total number of issues, last 30 days [correctness]
    issuesClosed14: number; // number of closed issues, last 14 days [responsive maintainer]
    issuesOpen: number; // number of open issues [responsive maintainer]
}

// vars
let totalPullers365 = 0; // number of active contributors, last 365 days [bus factor]
let mostPulls365 = 0; // most active contributor's pull request count, last 365 days [bus factor]
let totalPulls365 = 0; // number of pull requests, last 365 days [bus factor]
let issuesClosed = 0; // number of closed issues [correctness]
let issuesTotal = 0; // total number of issues [correctness]
let issuesClosed30 = 0; // number of closed issues, last 30 days [correctness]
let issuesTotal30 = 0; // total number of issues, last 30 days [correctness]
let issuesClosed14 = 0; // number of closed issues, last 14 days [responsive maintainer]
let issuesOpen = 0; // number of open issues [responsive maintainer]

// Creates 3 dates and configures it to be:
const date14 = new Date();
const date30 = new Date();
const date365 = new Date();
date14.setDate(date14.getDate() - 14); // (Today - 14 Days) ~ 2 weeks
date30.setDate(date30.getDate() - 30); // (Today - 30 Days) ~ 1 month
date365.setDate(date365.getDate() - 365); // (Today - 365 Days) ~ 1 year

async function fetch_METRICS(apiLink: string): Promise<MetricData> {

    // Function to fetch issues
    async function fetchIssues() {

        // GitHub's REST API considers every pull request an issue, but not every issue is a pull request.
        // For this reason, "Issues" endpoints may return both issues and pull requests in the response.
        let issuesAppearingAsPullRequests = 0;
        let pageNumberIssue = 1;

        while (true) {

            const responseIssue = await axios.get(`${apiLink}/issues?state=all&page=${pageNumberIssue}&per_page=100`, {
                headers: {
                    Authorization: `token ${personalAccessToken}`,
                },
            });

            const issuesClosed_Array = responseIssue.data // number of closed issues [correctness]
            .filter((issue: any) => !(issue.pull_request))
            .filter((issue: any) => issue.state == 'closed');

            const issuesTotal_Array = responseIssue.data // total number of issues [correctness]
            .filter((issue: any) => !(issue.pull_request));

            const issuesClosed30_Array = responseIssue.data // number of closed issues, last 30 days [correctness]
            .filter((issue: any) => !(issue.pull_request))
            .filter((issue: any) => issue.state == 'closed')
            .filter((issue: any) => new Date(issue.created_at) >= date30);

            const issuesTotal30_Array = responseIssue.data // total number of issues, last 30 days [correctness]
            .filter((issue: any) => !(issue.pull_request))
            .filter((issue: any) => new Date(issue.created_at) >= date30);

            const issuesClosed14_Array = responseIssue.data // number of closed issues, last 14 days [responsive maintainer]
            .filter((issue: any) => !(issue.pull_request))
            .filter((issue: any) => issue.state == 'closed')
            .filter((issue: any) => new Date(issue.created_at) >= date14);

            const issuesOpen_Array = responseIssue.data // number of open issues [responsive maintainer]
            .filter((issue: any) => !(issue.pull_request))
            .filter((issue: any) => issue.state == 'open');

            issuesClosed += issuesClosed_Array.length;
            issuesTotal += issuesTotal_Array.length;
            issuesClosed30 += issuesClosed30_Array.length;
            issuesTotal30 += issuesClosed30_Array.length;
            issuesClosed14 += issuesClosed14_Array.length;
            issuesOpen += issuesOpen_Array.length;

            // console.log(`Completed Issues: ${issuesTotal}`)

            if (responseIssue.data.length < 100) {
                break;
            }
            pageNumberIssue++;
        }

        console.log(`issuesClosed : ${issuesClosed}`);
        console.log(`issuesTotal : ${issuesTotal}`);
        console.log(`issuesClosed30 : ${issuesClosed30}`);
        console.log(`issuesTotal30 : ${issuesTotal30}`);
        console.log(`issuesClosed14 : ${issuesClosed14}`);
        console.log(`issuesOpen : ${issuesOpen}`);

    }

    async function fetchPulls() {

        let pageNumberPull = 1;
        let contributors: string[] = [];
        let highestOccurrence = 0;
        let highestOccurrenceUsername = '';

        while (true) {

            const responsePull = await axios.get(`${apiLink}/pulls?page=${pageNumberPull}&per_page=100`, {
                headers: {
                    Authorization: `token ${personalAccessToken}`,
                },
            });

            const usernamesThisFetch = responsePull.data
            .filter((pull_request: any) => new Date(pull_request.created_at) >= date365)
            .map((pull_request: any) => pull_request.user.login);

            totalPulls365 += usernamesThisFetch.length

            usernamesThisFetch.forEach((username: string) => {
                contributors.push(username);
            });

            // console.log(`Completed Pull Requests (From Last Year): ${totalPulls365}`)

            if (responsePull.data.length < 100) {
                break;
            }
            pageNumberPull++;
        }

        const usernameCounts: { [username: string]: number } = {};
        contributors.forEach((username) => {
            if (usernameCounts[username]) {
                usernameCounts[username]++;
            } else {
                usernameCounts[username] = 1;
            }
        });

        const uniqueUsernames = Object.keys(usernameCounts);
        uniqueUsernames.forEach((username) => {
            if (usernameCounts[username] > highestOccurrence) {
                highestOccurrence = usernameCounts[username];
                highestOccurrenceUsername = username;
            }
        });

        totalPullers365 = uniqueUsernames.length;
        mostPulls365 = highestOccurrence;

        console.log(`totalPullers365 : ${totalPullers365}`);
        console.log(`mostPulls365 : ${mostPulls365}`);
        console.log(`totalPulls365 : ${totalPulls365}`);

    }

    fetchIssues();
    fetchPulls();

    let exportMetric: MetricData = {
        totalPullers365: totalPullers365, // number of active contributors, last 365 days [bus factor]
        mostPulls365: mostPulls365, // most active contributor's pull request count, last 365 days [bus factor]
        totalPulls365: totalPulls365, // number of pull requests, last 365 days [bus factor]
        issuesClosed: issuesClosed, // number of closed issues [correctness]
        issuesTotal: issuesTotal, // total number of issues [correctness]
        issuesClosed30: issuesClosed30, // number of closed issues, last 30 days [correctness]
        issuesTotal30: issuesTotal30, // total number of issues, last 30 days [correctness]
        issuesClosed14: issuesClosed14, // number of closed issues, last 14 days [responsive maintainer]
        issuesOpen: issuesOpen, // number of open issues [responsive maintainer]
    };

    return exportMetric;

}

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

export { fetch_METRICS, getLink, convertLink };