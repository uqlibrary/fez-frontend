import { CustomStepper } from './Stepper';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        steps: [],
        ...testProps,
    };
    return getElement(CustomStepper, props, isShallow);
}

describe('Add record stepper tests', () => {
    const steps = [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }];

    it('should render steps with specific active step', () => {
        let values;
        let wrapper;
        for (let step = 0; step < steps.length; step++) {
            values = {
                activeStep: step,
                steps,
            };
            wrapper = setup(values);
            expect(toJson(wrapper)).toMatchSnapshot();
        }
    });

    it('should properly detect if component needs update', () => {
        const values = {
            activeStep: 0,
            steps,
        };
        const wrapper = setup(values);
        const shouldUpdate = wrapper.instance().shouldComponentUpdate({ ...values, activeStep: 1 });
        expect(shouldUpdate).toBe(true);
        const shouldUpdate2 = wrapper.instance().shouldComponentUpdate({ ...values, activeStep: 0 });
        expect(shouldUpdate2).toBe(false);
    });
});
