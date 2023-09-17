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
exports.fetch_METRIC_1 = void 0;
const axios_1 = __importDefault(require("axios"));
const personalAccessToken = process.env.GITHUB_TOKEN; // personalAccessToken stored locally
function fetch_METRIC_1(apiLink) {
    return __awaiter(this, void 0, void 0, function* () {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const sinceDate = twoWeeksAgo.toISOString();
        let allClosedIssues = [];
        function fetchPage(pageNumber) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.get(`${apiLink}/issues?state=closed&since=${sinceDate}&page=${pageNumber}&per_page=100`, {
                    headers: {
                        Authorization: `token ${personalAccessToken}`,
                    },
                });
                if (response.status === 200) {
                    allClosedIssues = allClosedIssues.concat(response.data);
                }
                else {
                    console.error('Failed to fetch data from the GitHub API');
                    return null;
                }
            });
        }
        yield fetchPage(1);
        let page = 2;
        while (true) {
            yield fetchPage(page);
            if (allClosedIssues.length < page * 100) {
                break;
            }
            page++;
        }
        const response2 = yield axios_1.default.get(apiLink, {
            headers: {
                Authorization: `token ${personalAccessToken}`,
            },
        });
        const Response_ClosedIssuesInLastTwoWeeks = allClosedIssues.length;
        const someData = {
            ClosedIssuesInLastTwoWeeks: Response_ClosedIssuesInLastTwoWeeks,
            OpenIssues: response2.data.open_issues,
        };
        return someData;
    });
}
exports.fetch_METRIC_1 = fetch_METRIC_1;
;
