import {CustomStepper} from './Stepper';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        ...testProps
    };
    return getElement(CustomStepper, props, isShallow);
}

describe('Add record stepper tests', () => {

    it('should render steps and activate step 1', () => {
        const values = {
            activeStep: 0,
            steps: [
                {label: 'Step 1'},
                {label: 'Step 2'},
                {label: 'Step 3'}
            ]
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render steps and activate step 2', () => {
        const values = {
            activeStep: 1,
            steps: [
                {label: 'Step 1'},
                {label: 'Step 2'},
                {label: 'Step 3'}
            ]
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render steps and activate step 3', () => {
        const values = {
            activeStep: 2,
            steps: [
                {label: 'Step 1'},
                {label: 'Step 2'},
                {label: 'Step 3'}
            ]
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render steps and activate step 3', () => {
        const values = {
            activeStep: 0,
            steps: [
                {label: 'Step 1'},
                {label: 'Step 2'},
                {label: 'Step 3'}
            ]
        };
        const wrapper = setup(values);
        const shouldUpdate = wrapper.instance().shouldComponentUpdate({...values, activeStep: 1});
        expect(shouldUpdate).toBe(true);
        const shouldUpdate2 = wrapper.instance().shouldComponentUpdate({...values, activeStep: 0});
        expect(shouldUpdate2).toBe(false);
    });
});
