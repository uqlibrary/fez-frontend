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

function contextSetup(testProps) {
    return {
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
        ...testProps,
    };
}

describe('DataStreamSecuritySelector component with mockContext', () => {
    afterEach(() => cleanup);

    it('should render with loaded file data', () => {
        useFormValuesContext.mockImplementation(() => contextSetup());

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

describe('DataStreamSecuritySelector handling disabled component', () => {
    it('should display datastreams correctly as disabled', () => {
        useFormValuesContext.mockImplementation(() =>
            contextSetup({
                formValues: {
                    dataStreams: new List([
                        {
                            dsi_dsid: 'test7.txt',
                            disabled: true,
                        },
                    ]),
                },
            }),
        );
        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display datastreams correctly as disabled when props set to disabled', () => {
        useFormValuesContext.mockImplementation(() =>
            contextSetup({
                formValues: {
                    dataStreams: new List([
                        {
                            dsi_dsid: 'test9.txt',
                        },
                    ]),
                },
            }),
        );
        const wrapper = setup({
            disabled: true,
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display datastreams correctly as not disabled when nothing says to disable', () => {
        useFormValuesContext.mockImplementation(() =>
            contextSetup({
                formValues: {
                    dataStreams: new List([
                        {
                            dsi_dsid: 'test10.txt',
                        },
                    ]),
                },
            }),
        );
        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
