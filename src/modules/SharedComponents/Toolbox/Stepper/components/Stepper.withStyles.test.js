import CustomStepper from './Stepper';

function setup(testProps, isShallow = true) {
    const props = {
        activeStep: 0,
        classes: {},
        steps: [],
        ...testProps
    };
    return getElement(CustomStepper, props, isShallow);
}

describe('Component Stepper with Styles', () => {

    const steps = [
        {label: 'Step 1'},
        {label: 'Step 2'},
        {label: 'Step 3'}
    ];

    it('should render properly', () => {
        const wrapper = setup({
            steps
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});