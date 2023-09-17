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
const fetch_1 = require("./fetch");
const githubApiLink = 'https://api.github.com/repos/facebook/react';
(() => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield (0, fetch_1.fetch_METRIC_1)(githubApiLink);
    if (userData) {
        console.log('GitHub Repo Data:');
        console.log('ClosedIssuesInLastTwoWeeks:', userData.ClosedIssuesInLastTwoWeeks);
        console.log('OpenIssues:', userData.OpenIssues);
    }
    else {
        console.log('Failed to fetch GitHub user data.');
    }
}))();
