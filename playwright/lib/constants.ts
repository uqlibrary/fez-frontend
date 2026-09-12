export const baseURL = `http://localhost:${process.env.PORT || 3000}`;
// Per-test istanbul coverage is split: each partial holds only the hit counts (s/f/b) keyed by file
// and structure hash; the invariant structure (statementMap/fnMap/branchMap) is written once per file
// to the sibling structure dir. The ReportMerger rejoins them (see collectCoverageAsync / ReportMerger).
export const istanbulReportPartialsDir = 'coverage/playwright/partials';
export const istanbulStructureDir = 'coverage/playwright-structure';
