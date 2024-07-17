import React from 'react';
import { CustomStepper } from './Stepper';
import { rtlRender } from 'test-utils';
import * as Hook from 'hooks/useWidth';

function setup(testProps, renderMethod = rtlRender) {
    const props = {
        classes: {},
        steps: [],
        ...testProps,
    };
    return renderMethod(<CustomStepper {...props} />);
}

describe('Add record stepper tests', () => {
    beforeEach(() => {
        const useWidth = jest.spyOn(Hook, 'useWidth');

        useWidth.mockImplementation(() => 'sm');
    });
    const steps = [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }];

    it('should render steps with specific active step', () => {
        let values;
        for (let step = 0; step < steps.length; step++) {
            values = {
                activeStep: step,
                steps,
            };

            const { container } = setup(values);
            expect(container).toMatchSnapshot();
        }
    });

    it('should properly detect if component needs update', () => {
        const values = {
            activeStep: 0,
            steps,
        };
        const { container, rerender } = setup(values);
        setup({ ...values, activeStep: 1 }, rerender);
        expect(container).toMatchSnapshot();
        setup({ ...values, activeStep: 0 }, rerender);
        expect(container).toMatchSnapshot();
        setup({ steps: [{ label: 'Step 1' }, { label: 'Step 2' }], activeStep: 0 }, rerender);
        expect(container).toMatchSnapshot();
    });
});
