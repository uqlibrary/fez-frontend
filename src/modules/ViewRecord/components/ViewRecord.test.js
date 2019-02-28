import ViewRecord from './ViewRecord';
import {mockRecordToFix, ntro} from 'mock/data/testing/records';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        match: testProps.match || { params: {pid: 'UQ:12344'}},
        actions: testProps.actions || {
            loadRecordToView: jest.fn(),
            clearRecordToView: jest.fn()
        }
    };
    return getElement(ViewRecord, props, isShallow);
}

describe('Component ViewRecord ', () => {
    it('should render default props', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loader', () => {
        const wrapper = setup({loadingRecordToView: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error', () => {
        const wrapper = setup({recordToViewError: 'PID not found'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render record view', () => {
        const wrapper = setup({recordToView: mockRecordToFix});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render components for empty record', () => {
        const wrapper = setup({recordToView: {}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render record view without a title', () => {
        const wrapper = setup({recordToView: mockRecordToFix, hideTitle: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should load record to view', () => {
        const testMethod = jest.fn();
        const wrapper = setup({
            actions: {loadRecordToView: testMethod},
            match: { params: {pid: 'UQ:111'}}
        });
        expect(testMethod).toHaveBeenCalledWith('UQ:111');
    });

    it('should reset component when component is unmounted', () => {
        const wrapper = setup({});
        wrapper.instance().componentWillUnmount();
        expect(wrapper.instance().props.actions.clearRecordToView).toHaveBeenCalled();
    });

    it('should have componentWillReceiveProps load updated pid', () => {
        const wrapper = setup({});
        const test = jest.spyOn(wrapper.instance().props.actions, 'loadRecordToView');
        const newProps = {
            match: {
                params: {
                    pid: 'UQ:12345'
                }
            }
        };
        wrapper.instance().componentWillReceiveProps(newProps);
        expect(test).toBeCalledWith(newProps.match.params.pid);

        // test else branch
        test.mockClear(); // Reset the called counter from earlier tests
        wrapper.instance().componentWillReceiveProps(wrapper.instance().props);
        expect(test).toHaveBeenCalledTimes(0);
    });

    it('should not load a record unnecessarily', () => {
        const wrapper = setup({ recordToView: {} });
        const test = jest.spyOn(wrapper.instance().props.actions, 'loadRecordToView');
        test.mockClear();
        wrapper.instance().componentDidMount();
        expect(test).toHaveBeenCalledTimes(0);
    });

    it('should render NTRO Details', () => {
        const wrapper = setup({
            recordToView: ntro,
            loadingRecordToView: false,
            recordToViewError: '',
            account: {
                canMasquerade: true
            }
        });
        expect(wrapper.find('NtroDetails').length).toBe(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
