import PublicationSearchForm from './PublicationSearchForm';
import {locale} from 'locale';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        locale: {
            title: 'Search for your publication',
            fieldLabels: {
                search: 'Enter DOI, Pubmed Id or Title'
            }
        }
    };
    return getElement(PublicationSearchForm, props, isShallow);
}

describe('PublicationSearchForm renders ', () => {
    it('component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('Field').length).toEqual(1);
        expect(wrapper.find('RaisedButton').length).toEqual(1);
    });
});
