import { customRedirector } from './useQueryRedirector';

describe('useQueryRedirector', () => {
    describe('customRedirector', () => {
        const rules = {
            rule1: {
                condition: '1',
                assert: ({ value, condition, account }) => {
                    return (
                        account &&
                        account?.canMasquerade &&
                        account?.canMasqueradeType === 'full' &&
                        value === condition
                    );
                },
                to: { url: 'test/path', options: { replace: true } },
            },
        };
        const account = { canMasquerade: true, canMasqueradeType: 'full' };
        const location = { search: '?rule1=1' };

        it('returns expected results', () => {
            // happy path
            expect(customRedirector({ account, rules, location })).toEqual({
                url: 'test/path',
                options: { replace: true },
            });

            // happy path where non-first option is a match
            const rulesMatchSecond = { ...rules };
            rulesMatchSecond.rule2 = {
                condition: '1',
                assert: ({ value, condition, account }) => {
                    return (
                        account &&
                        account?.canMasquerade &&
                        account?.canMasqueradeType === 'full' &&
                        value === condition
                    );
                },
                to: { url: 'test/path/rule2' },
            };
            const locationSecond = { ...location };
            locationSecond.search = '?rule2=1';
            expect(customRedirector({ account, rules: rulesMatchSecond, location: locationSecond })).toEqual({
                url: 'test/path/rule2',
            });

            // happy path where there's multiple matching rules but only the first match is returned
            const locationThird = { ...location };
            locationThird.search = '?rule1=1&rule2=1';
            expect(customRedirector({ account, rules: rulesMatchSecond, location: locationThird })).toEqual({
                url: 'test/path',
                options: { replace: true },
            });

            // non-matching condition check
            const rulesMismatchCondition = { ...rules };
            rulesMismatchCondition.rule1.condition = 'invalid';
            expect(customRedirector({ account, rules: rulesMismatchCondition, location })).toBeNull();

            // non-matching url switch in rules
            const rulesNonmatchingSwitch = { ...rules };
            rulesNonmatchingSwitch.rule2 = rules.rule1;
            delete rulesNonmatchingSwitch.rule1;
            expect(customRedirector({ account, rules: rulesNonmatchingSwitch, location })).toBeNull();

            // non-matching url switch in search
            const nonMatchingSearchLocation = { ...location };
            nonMatchingSearchLocation.search = '?invalid=1';
            expect(customRedirector({ account, rules, location: nonMatchingSearchLocation })).toBeNull();

            // account without full masquerade privs
            const readonlyMasquareAccount = { ...account };
            readonlyMasquareAccount.canMasqueradeType = 'readonly';
            expect(customRedirector({ account: readonlyMasquareAccount, rules, location })).toBeNull();

            // account without full masquerade privs
            const noMasquareAccount = { ...account };
            noMasquareAccount.canMasquerade = false;
            expect(customRedirector({ account: noMasquareAccount, rules, location })).toBeNull();

            // no account provided
            expect(customRedirector({ rules, location })).toBeNull();

            // no rules provided
            expect(customRedirector({ account, location })).toBeNull();

            // no location provided
            expect(customRedirector({ account, rules })).toBeNull();

            // nothing provided
            expect(customRedirector()).toBeNull();
        });
    });
});
