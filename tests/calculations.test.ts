import { module } from '../src/fileio';
import { data, BusFactor, Correctness, RampUp, ResponsiveMaintainer, License, NetScore } from '../src/calculations';

// basic test for BusFactor
test('BusFactor', () => {
    let rawData: data = {contrubtorMostPullRequests: 10, totalPullRequests: 100, activeContributors: 20,
                         totalClosedIssues: 0, totalissues: 0, totalClosedIssuesMonth: 0, totalIssuesMonth: 0,
                         quickStart: 0, examples: 0, usage: 0, closedIssues: 0, openIssues: 0, licenses: []};
    expect(BusFactor(rawData)).toBe(0.9);
});
