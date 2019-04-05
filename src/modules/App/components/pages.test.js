import * as pages from './pages';

describe('Lazy-loaded components', () => {

    it('should return skeleton object', () => {
        const expectation = '{"key":null,"ref":null,"props":{"load":{}},"_owner":null,"_store":{}}';

        expect(JSON.stringify(pages.FixRecord())).toEqual(expectation);
        expect(JSON.stringify(pages.ClaimRecord())).toEqual(expectation);
        expect(JSON.stringify(pages.PossiblyMyRecords())).toEqual(expectation);
        expect(JSON.stringify(pages.Dashboard())).toEqual(expectation);
        expect(JSON.stringify(pages.Orcid())).toEqual(expectation);
        expect(JSON.stringify(pages.GoogleScholar())).toEqual(expectation);
        expect(JSON.stringify(pages.ThesisSubmission())).toEqual(expectation);
        expect(JSON.stringify(pages.SbsSubmission())).toEqual(expectation);
        expect(JSON.stringify(pages.ViewRecord())).toEqual(expectation);
        expect(JSON.stringify(pages.AddDataCollection())).toEqual(expectation);
        expect(JSON.stringify(pages.ThirdPartyLookupTool())).toEqual(expectation);
        expect(JSON.stringify(pages.Prototype())).toEqual(expectation);
        expect(JSON.stringify(pages.Admin())).toEqual(expectation);
    });

});
