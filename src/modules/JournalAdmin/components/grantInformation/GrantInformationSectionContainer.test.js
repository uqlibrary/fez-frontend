import { GrantInformationSectionContainer, mapStateToProps } from './GrantInformationSectionContainer';
import Immutable from 'immutable';

jest.mock('../../../../context');
import { useFormValuesContext } from 'context';

const setup = (testProps = {}, args = { isShallow: true }) => {
    const props = {
        formValues: {
            toJS: jest.fn(() => ({})),
        },
        ...testProps,
    };

    return renderComponent(GrantInformationSectionContainer, props, args);
};

describe('GrantInformationSectionContainer', () => {
    beforeEach(() => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                filesSection: 'Test',
            },
        }));
    });

    afterEach(() => {
        useFormValuesContext.mockReset();
    });

    it('should render properly', () => {
        const render = setup({});

        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should map state to props', () => {
        expect(mapStateToProps({}, {})).toEqual({
            formValues: Immutable.Map({}),
        });
    });
});
