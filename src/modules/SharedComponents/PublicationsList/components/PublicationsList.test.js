import PublicationsList from './PublicationsList';
import { myRecordsList } from 'mock/data';

function setup(testProps = {}) {
    const props = {
        publicationsList: testProps.publicationsList || [], // : PropTypes.array,
        customActions: testProps.customActions || [], // : PropTypes.array,
        showDefaultActions: testProps.showDefaultActions || false, // : PropTypes.bool
        ...testProps,
    };
    return getElement(PublicationsList, props);
}

describe('PublicationsList', () => {
    it('renders empty component', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders component with items', () => {
        const wrapper = setup({ publicationsList: myRecordsList.data });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders component with custom subset actions', () => {
        const test = [];
        const wrapper = setup({
            publicationsListSubset: ['test'],
            subsetCustomActions: test,
        });
        expect(
            wrapper.instance().renderPublicationCitation(0, {
                rek_pid: 'test',
            }).props.customActions,
        ).toBe(test);
    });
});
