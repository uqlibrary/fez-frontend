import PublicationsList from './PublicationsList';
import {myRecordsList} from 'mock/data';

function setup(testProps, isShallow = true){
    const props = {
        publicationsList: testProps.publicationsList || [], // : PropTypes.array,
        customActions: testProps.customActions || [], // : PropTypes.array,
        showDefaultActions: testProps.showDefaultActions || false, // : PropTypes.bool
        ...testProps
    };
    return getElement(PublicationsList, props, isShallow);
}

describe('PublicationsList renders ', () => {
    it('renders empty component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders component with items', () => {
        const wrapper = setup({publicationsList: myRecordsList.data});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
