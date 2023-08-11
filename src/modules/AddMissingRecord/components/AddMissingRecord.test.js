import React from 'react';
import AddMissingRecord from './AddMissingRecord';
import { pathConfig } from 'config/pathConfig';
import { render, WithReduxStore, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,

        rawSearchQuery: testProps.rawSearchQuery || '',
        addRecordStep: testProps.addRecordStep || jest.fn(),
        location: testProps.location || {
            pathname: '',
        },
        match: testProps.match || {},
        author: testProps.author || null,
        actions: testProps.actions || {},
        history: testProps.history || {
            push: jest.fn(),
        },
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <AddMissingRecord {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Component AddMissingRecord', () => {
    it('method getStepperIndex should return step [0] and Stepper should render the 1st step', () => {
        const props = {
            location: { pathname: pathConfig.records.add.find },
            addRecordStep: () => <span />,
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });

    it('method getStepperIndex should return step [1] and Stepper should render the 2nd step', () => {
        const props = {
            rawSearchQuery: 'This is a test',
            location: { pathname: pathConfig.records.add.results },
            addRecordStep: () => <span />,
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });

    it('should return 0 when landing on invalid location with tokens not equal to 3', () => {
        const props = {
            rawSearchQuery: 'This is a test',
            location: { pathname: `${pathConfig.records.add.results}/test` },
            addRecordStep: () => <span />,
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });

    it('method getStepperIndex should return step [2] and Stepper should render the 3rd step', () => {
        const props = {
            location: { pathname: pathConfig.records.add.new },
            addRecordStep: () => <span />,
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });

    it(
        'should call back to step [0] (records/add/find) when there is no ' +
            'rawSearchQuery defined when landing on records/add/results',
        () => {
            const testReplace = jest.fn();
            const props = {
                rawSearchQuery: null,
                history: { replace: testReplace },
                location: { pathname: pathConfig.records.add.results },
                match: { path: pathConfig.records.add.results },
                addRecordStep: () => <span />,
            };
            setup({ ...props });
            expect(testReplace).toBeCalledWith(pathConfig.records.add.find);
        },
    );
});
