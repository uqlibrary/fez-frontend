import PublicationCitation from './PublicationCitation';
import {mockRecordToFix} from 'mock/data/testing/records';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        publication: testProps.publication || mockRecordToFix,
        // showDefaultActions: PropTypes.bool,
        // showSources: PropTypes.bool,
        // customActions: PropTypes.array,
        // className: PropTypes.string,
        history: testProps.history || {push: jest.fn()},
        actions: testProps.actions || {
            setFixRecord: jest.fn(),
            setRecordToView: jest.fn()
        }
    };
    return getElement(PublicationCitation, props, isShallow);
}

describe('PublicationCitation ', () => {
    it('should render component with default item', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with default actions', () => {
        const wrapper = setup({showDefaultActions: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with custom actions', () => {
        const wrapper = setup({
            customActions: [
                {
                    label: 'Claim now',
                    handleAction: jest.fn()
                },
                {
                    label: 'Not mine',
                    handleAction: jest.fn()
                },
                {
                    label: 'View stats',
                    handleAction: jest.fn()
                }
            ]});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component with publication from multiple sources', () => {
        const publicationWithSources = {...mockRecordToFix, "sources": [{source: "espace", id: "UQ:224457"}]};
        const wrapper = setup({publication: publicationWithSources, showSources: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should check if props changed', () => {
        const wrapper = setup({});
        let shouldUpdate = wrapper.instance().shouldComponentUpdate({publication: {...mockRecordToFix, "sources": [{source: "espace", id: "UQ:224457"}]}});
        expect(shouldUpdate).toBeTruthy();

        shouldUpdate = wrapper.instance().shouldComponentUpdate({publication: {...mockRecordToFix}});
        expect(shouldUpdate).toBeFalsy();
    });

    it('should handle view record link', () => {
        const wrapper = setup({});
        wrapper.instance().viewRecord({preventDefault: jest.fn()});
        expect(wrapper.instance().props.history.push).toHaveBeenCalled();
        expect(wrapper.instance().props.actions.setRecordToView).toHaveBeenCalled();
    });

    it('should handle default actions', () => {
        const wrapper = setup({showDefaultActions: true});
        wrapper.instance()._handleDefaultActions('fixRecord');
        expect(wrapper.instance().props.history.push).toHaveBeenCalled();
        expect(wrapper.instance().props.actions.setFixRecord).toHaveBeenCalled();

        wrapper.instance()._handleDefaultActions('shareRecord');
        // TODO
        wrapper.instance()._handleDefaultActions('NAN');
        // TODO
    });
});
