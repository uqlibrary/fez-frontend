import DataStreamSecuritySelector from './DataStreamSecuritySelector';
import { cleanup } from 'test-utils';
import { List } from 'immutable';

jest.mock('../../../../context');
import { useFormValuesContext } from 'context';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        disabled: false,
        classes: {
            dataStreamFileBlock: 'dataStreamFileBlock',
            dataStreamFileName: 'dataStreamFileName',
        },
        input: {
            onChange: jest.fn(),
        },
        meta: {
            initial: {
                toJS: () => [],
            },
        },
        text: {
            overridePrompt: 'Override datastream security policy',
        },
        collections: [
            {
                parent: {
                    rek_datastream_policy: 3,
                },
            },
            {
                parent: {
                    rek_datastream_policy: 5,
                },
            },
            {
                parent: {
                    rek_datastream_policy: 1,
                },
            },
        ],
        ...testProps,
    };
    return getElement(DataStreamSecuritySelector, props, args);
}

describe('DataStreamSecuritySelector component with mockContext', () => {
    afterEach(() => cleanup);

    it('should render with loaded file data', () => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                dataStreams: new List([
                    {
                        dsi_dsid: 'test1.txt',
                        dsi_security_policy: 1,
                    },
                ]),
                rek_security_inherited: 1,
                rek_security_policy: 5,
                rek_datastream_policy: 5,
            },
        }));

        const wrapper = setup({
            meta: {
                initial: {
                    toJS: () => [
                        {
                            dsi_dsid: 'test4.txt',
                            dsi_security_policy: 1,
                            datastreams: [],
                        },
                    ],
                },
            },
            collections: [
                {
                    parent: {
                        rek_datastream_policy: 1,
                    },
                },
                {
                    rek_pid: 'UQ:111111',
                },
            ],
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
