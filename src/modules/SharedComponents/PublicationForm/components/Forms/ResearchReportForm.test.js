jest.dontMock('./ResearchReportForm');

import ResearchReportForm from './ResearchReportForm';
import { NTRO_SUBTYPE_RREB_PUBLIC_SECTOR } from 'config/general';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
    };
    return getElement(ResearchReportForm, props);
}

describe('ResearchReportForm renders ', () => {
    it('component', () => {
        const testProps = {
            formValues: {
                get: jest.fn(),
            },
        };
        const wrapper = setup(testProps);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('component with 12 input fields', () => {
        const testProps = {
            formValues: {
                get: jest.fn(),
            },
        };
        const wrapper = setup(testProps);
        expect(wrapper.find('Field').length).toEqual(14);
    });

    it('component with all fields disabled', () => {
        const testProps = {
            formValues: {
                get: jest.fn(),
            },
            submitting: true,
        };
        const wrapper = setup(testProps);
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        });
    });

    it('should normalize total pages field', () => {
        const testProps = {
            formValues: {
                get: jest.fn(),
            },
        };
        const wrapper = setup(testProps);
        expect(wrapper.instance().getNumbersOnly('Four')).toBe('');
        expect(wrapper.instance().getNumbersOnly('12Three')).toBe('12');
        expect(wrapper.instance().getNumbersOnly('  01Three')).toBe('01');
        expect(wrapper.instance().getNumbersOnly('124')).toBe('124');
    });

    it('component with 4 input fields for NTRO', () => {
        const testProps = {
            formValues: {
                get: jest.fn(),
            },
            isNtro: true,
        };
        const wrapper = setup(testProps);
        expect(wrapper.find('Field').length).toEqual(11);
        expect(
            wrapper
                .find('NtroFields')
                .dive()
                .find('Field').length,
        ).toEqual(6);
    });

    it('should render validation required', () => {
        const wrapper = setup({
            formValues: {
                get: key => {
                    const values = {
                        rek_subtype: NTRO_SUBTYPE_RREB_PUBLIC_SECTOR,
                    };
                    return values[key];
                },
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
