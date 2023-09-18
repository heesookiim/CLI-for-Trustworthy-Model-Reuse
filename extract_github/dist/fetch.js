"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLink = exports.fetch_METRIC_1 = void 0;
// Imports
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const personalAccessToken = process.env.GITHUB_TOKEN; // personalAccessToken stored locally
function fetch_METRIC_1(apiLink) {
    return __awaiter(this, void 0, void 0, function* () {
        // Creates a new date and configures it to be (Today - 14 Days) ~ 2 weeks
        // Sets it as ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ) which GitHub's API recognizes
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const sinceDate = twoWeeksAgo.toISOString();
        // Creates an empty array
        let allClosedIssues = [];
        // Function to fetch one page of closed issues
        function fetchPage(pageNumber) {
            return __awaiter(this, void 0, void 0, function* () {
                // Once you're in the issues page, it has the following filtering:
                // (1) state = closed [the issue has to be closed]
                // (2) since = the date specified [2 weeks ago]
                // (3) page = which page of the data you're in [starts with 1]
                // (4) per_page = has 100 issues page instead of default
                const response = yield axios_1.default.get(`${apiLink}/issues?state=closed&since=${sinceDate}&page=${pageNumber}&per_page=100`, {
                    headers: {
                        // Completes the request with the personal access token
                        Authorization: `token ${personalAccessToken}`,
                    },
                });
                // If some response has been received, the response is added to the array
                if (response.status === 200) {
                    allClosedIssues = allClosedIssues.concat(response.data);
                }
                else {
                    console.error('Failed to fetch data from the GitHub API');
                }
            });
        }
        // calls the fetchPage function to get the closed issues for the first page.
        yield fetchPage(1);
        let page = 2;
        // while loop to move on to the next pages
        while (true) {
            yield fetchPage(page);
            if (allClosedIssues.length < page * 100) {
                break;
            }
            page++;
        }
        // getting the number of open issues from the base link of the repo
        const response2 = yield axios_1.default.get(apiLink, {
            headers: {
                Authorization: `token ${personalAccessToken}`,
            },
        });
        // getting the number of closed issues from the length of the response
        const Response_ClosedIssuesInLastTwoWeeks = allClosedIssues.length;
        const someData = {
            ClosedIssuesInLastTwoWeeks: Response_ClosedIssuesInLastTwoWeeks,
            OpenIssues: response2.data.open_issues, // getting the number of open issues from the base link of the repo
        };
        return someData;
    });
}
exports.fetch_METRIC_1 = fetch_METRIC_1;
;
function getLink(npmLink) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch the content of the npm package page
            const response = yield axios_1.default.get(npmLink);
            if (response.status === 200) {
                const html = response.data;
                // Use regular expression to find the GitHub repository link
                const githubRepoMatch = html.match(/"repository"\s*:\s*"([^"]+)"/);
                if (githubRepoMatch && githubRepoMatch[1]) {
                    // Construct the GitHub link from the matched repository URL
                    const repositoryUrl = githubRepoMatch[1].replace(/^git\+/, '').replace(/\.git$/, '');
                    console.log(`GitHub repository URL: ${repositoryUrl}`);
                    return repositoryUrl;
                }
            }
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
        }
        // Return null if the GitHub link couldn't be retrieved
        return null;
    });
}
exports.getLink = getLink;
