import { AttachedFilesField } from './AttachedFilesField';
import { cleanup } from 'test-utils';

jest.mock('../../../../context');
import { useFormValuesContext } from 'context';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        input: {},
        ...testProps,
    };

    return getElement(AttachedFilesField, props, args);
}

describe('DataStreamSecuritySelector component with mockContext', () => {
    afterEach(() => cleanup);

    it('should render with form data', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                fez_datastream_info: [
                    {
                        dsi_dsid: 'test1.txt',
                        dsi_security_policy: 1,
                        dsi_embargo_date: '2099-01-01',
                    },
                ],
            },
        }));

        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
