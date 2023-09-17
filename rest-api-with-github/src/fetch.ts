import axios from 'axios';

const personalAccessToken = process.env.GITHUB_TOKEN; // personalAccessToken stored locally

interface METRIC_1 {
    ClosedIssuesInLastTwoWeeks: number;
    OpenIssues: number;
}

async function fetch_METRIC_1(apiLink: string): Promise<METRIC_1 | null> {
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const sinceDate = twoWeeksAgo.toISOString();
    
    let allClosedIssues: any[] = [];
    
    async function fetchPage(pageNumber: number) {
        const response = await axios.get(`${apiLink}/issues?state=closed&since=${sinceDate}&page=${pageNumber}&per_page=100`, {
            headers: {
                Authorization: `token ${personalAccessToken}`,
            },
        });

        if (response.status === 200) {
            allClosedIssues = allClosedIssues.concat(response.data);
            
        } else {
            console.error('Failed to fetch data from the GitHub API');
            return null;
        }
    }
    
    await fetchPage(1);
    let page = 2;
    while (true) {
        await fetchPage(page);
        if (allClosedIssues.length < page * 100) {
            break;
        }
        page++;
    }
    
    const response2 = await axios.get(apiLink, {
        headers: {
            Authorization: `token ${personalAccessToken}`,
        },
    });
    
    const Response_ClosedIssuesInLastTwoWeeks = allClosedIssues.length;
    const someData: METRIC_1 = {
        ClosedIssuesInLastTwoWeeks: Response_ClosedIssuesInLastTwoWeeks,
        OpenIssues: response2.data.open_issues,
    };
    return someData;

};

export { fetch_METRIC_1 };