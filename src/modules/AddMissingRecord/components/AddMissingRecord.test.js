import React from 'react';
import AddMissingRecord from './AddMissingRecord';
import { pathConfig } from 'config/pathConfig';
import { render, WithReduxStore, WithRouter } from 'test-utils';

const mockUseNavigate = jest.fn();
let mockUseLocation = { pathname: '/' };

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useLocation: () => mockUseLocation,
}));

function setup(testProps = {}) {
    const props = {
        ...testProps,

        rawSearchQuery: testProps.rawSearchQuery || '',
        addRecordStep: testProps.addRecordStep || jest.fn(),
        author: testProps.author || null,
        actions: testProps.actions || {},
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
    afterEach(() => {
        mockUseNavigate.mockClear();
    });

    it('method getStepperIndex should return step [0] and Stepper should render the 1st step', () => {
        mockUseLocation = { pathname: pathConfig.records.add.find };
        const props = {
            addRecordStep: () => <span />,
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });

    it('method getStepperIndex should return step [1] and Stepper should render the 2nd step', () => {
        mockUseLocation = { pathname: pathConfig.records.add.results };
        const props = {
            rawSearchQuery: 'This is a test',
            addRecordStep: () => <span />,
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });

    it('should return 0 when landing on invalid location with tokens not equal to 3', () => {
        mockUseLocation = { pathname: `${pathConfig.records.add.results}/test` };
        const props = {
            rawSearchQuery: 'This is a test',
            addRecordStep: () => <span />,
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });

    it('method getStepperIndex should return step [2] and Stepper should render the 3rd step', () => {
        mockUseLocation = { pathname: pathConfig.records.add.new };

        const props = {
            addRecordStep: () => <span />,
        };
        const { container } = setup({ ...props });
        expect(container).toMatchSnapshot();
    });

    it(
        'should call back to step [0] (records/add/find) when there is no ' +
            'rawSearchQuery defined when landing on records/add/results',
        () => {
            mockUseLocation = { pathname: pathConfig.records.add.results };
            const props = {
                rawSearchQuery: null,
                addRecordStep: () => <span />,
            };
            setup({ ...props });
            expect(mockUseNavigate).toBeCalledWith(pathConfig.records.add.find, { replace: true });
        },
    );
});
