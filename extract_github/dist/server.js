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
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const fetch_1 = require("./fetch");
// If there's a link for a npm package, set the flag to true and add the link
const npmLink = 'https://www.npmjs.com/package/browserify';
var npmFlag = true;
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (npmFlag) {
        const githubLink = yield Promise.resolve((0, fetch_1.getLink)(npmLink)); // Calling the getLink function to get the GitHub API link
        const guthubApiLink = (0, fetch_1.convertLink)(githubLink);
    }
    else { // If there's no link for a npm package, add GitHub API link
        // Link for any repo
        const githubApiLink = 'https://api.github.com/repos/facebook/react';
        // Calling the main fetch function for Metric 1
        const userData = yield (0, fetch_1.fetch_METRIC_1)(githubApiLink);
        // Printing the results of fetch_METRIC_1
        if (userData) {
            console.log('GitHub Repo Data:');
            console.log('ClosedIssuesInLastTwoWeeks:', userData.ClosedIssuesInLastTwoWeeks);
            console.log('OpenIssues:', userData.OpenIssues);
        }
        else {
            console.log('Failed to fetch GitHub user data.');
        }
    }
}))();
