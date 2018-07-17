import Stepper from './Stepper';

function setup(testProps, isShallow = true) {
    const props = {...testProps};
    return getElement(Stepper, props, isShallow);
}

describe('Add record stepper tests', () => {
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
});
