import {ContributorsEditor} from './ContributorsEditor';
import {authorsSearch} from 'mock/data';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        author: testProps.author || { aut_id: 1 }, // : PropTypes.object,
        // showIdentifierLookup: PropTypes.bool,
        // showContributorAssignment: PropTypes.bool,
        // className: PropTypes.string,
        // disabled: PropTypes.bool,
        // meta: PropTypes.object,
        // author: PropTypes.object,
        // onChange: PropTypes.func,
        // locale: PropTypes.object,
        // input: PropTypes.object
    };
    return getElement(ContributorsEditor, props, isShallow);
}

describe('ContributorsEditor tests ', () => {
    it('rendering full component with a defined className', () => {
        const wrapper = setup({ className: 'requiredField' }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('rendering full component with identifier lookup', () => {
        const wrapper = setup({ showIdentifierLookup: true }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('appending a contributor to the list', () => {
        const wrapper = setup({});
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({displayName: "J.Smith"});
        expect(wrapper.state().contributors.length).toEqual(1);
    });

    it('appending a contributor with identifier to the list', () => {
        const wrapper = setup({});
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({displayName: "J.Smith", ...authorsSearch.data[0]});
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
    });

    it('appending a contributor with duplicate identifier to the list', () => {
        const wrapper = setup({});
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({displayName: "J.Smith", ...authorsSearch.data[0]});
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
        wrapper.instance().addContributor({displayName: "J.Smith II", ...authorsSearch.data[0]});
        expect(wrapper.state().contributors.length).toEqual(1);
    });

    it('appending a contributor with identifier who is a current author to the list', () => {
        const wrapper = setup({ author: authorsSearch.data[0] });
        expect(wrapper.state().contributors.length).toEqual(0);
        wrapper.instance().addContributor({displayName: "J.Smith", ...authorsSearch.data[0]});
        expect(wrapper.state().contributors.length).toEqual(1);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(true);
    });

    it('assigning a contributor to current author', () => {
        const wrapper = setup({});
        wrapper.setState({ contributors: [{}, {}, {}], isCurrentAuthorSelected: false });
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[0].selected).toBeFalsy();
        wrapper.instance().assignContributor({}, 0);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[0].selected).toEqual(true);
    });

    it('deleting a contributor from the list', () => {
        const wrapper = setup({});
        wrapper.setState({ contributors: [ {}, {}, {}], isCurrentAuthorSelected: true });
        expect(wrapper.state().contributors.length).toEqual(3);
        wrapper.instance().deleteContributor({}, 0);
        expect(wrapper.state().contributors.length).toEqual(2);
    });

    it('deleting all contributors from a list', () => {
        const wrapper = setup({});
        wrapper.setState({ contributors: [ {}, {}, {}], isCurrentAuthorSelected: true });
        expect(wrapper.state().contributors.length).toEqual(3);
        wrapper.instance().deleteAllContributors();
        expect(wrapper.state().contributors.length).toEqual(0);
        expect(wrapper.state().isCurrentAuthorSelected).toEqual(false);
    });

    it('moving up a contributor', () => {
        const wrapper = setup({});
        wrapper.setState({ contributors: [ {displayName: 1}, {displayName: 2}, {displayName: 3}]});
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(2);
        wrapper.instance().moveUpContributor({}, 1);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(1);
    });

    it('moving down a contributor', () => {
        const wrapper = setup({});
        wrapper.setState({ contributors: [ {displayName: 1}, {displayName: 2}, {displayName: 3}]});
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(2);
        wrapper.instance().moveDownContributor({}, 1);
        expect(wrapper.state().contributors.length).toEqual(3);
        expect(wrapper.state().contributors[1].displayName).toEqual(3);
    });
});
