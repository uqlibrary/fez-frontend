import { locale } from 'locale';

describe('Component ThirdPartyLookupTool', () => {
    it('have a valid set of live form data in components.js', () => {
        // these fields must be in the locale for thirdPartyLookupTools
        expect(locale.components.thirdPartyLookupTools.display).toHaveProperty('title');
        expect(locale.components.thirdPartyLookupTools.display.title).not.toEqual('');
        expect(locale.components.thirdPartyLookupTools.display).toHaveProperty('loadingMessage');
        expect(locale.components.thirdPartyLookupTools.display.loadingMessage).not.toEqual('');

        expect(locale.components.thirdPartyLookupTools.forms.length).toBeGreaterThan(0);
        locale.components.thirdPartyLookupTools.forms.map(form => {
            expect(form).toHaveProperty('apiType');
            expect(form).toHaveProperty('lookupLabel');
            expect(form).toHaveProperty('primaryField.heading');
            if (!!form.secondaryField) {
                // if they include a secondary field then it must have a heading
                expect(form).toHaveProperty('secondaryField.heading');
            }
            expect(form).toHaveProperty('isMinimised');
        });
    });
});
