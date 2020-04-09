import React from 'react';
import DataStreamSecuritySelector, { isSame } from './DataStreamSecuritySelector';
import { rtlRender, fireEvent, cleanup, waitForElement } from 'test-utils';

function setup(testProps = {}) {
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
            overridePolicyPrompt: 'Override datastream security policy',
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
    return rtlRender(<DataStreamSecuritySelector {...props} />);
}

describe('DataStreamSecuritySelector component', () => {
    afterEach(() => cleanup);

    it('should render default view', () => {
        const { asFragment, getByText } = setup({
            meta: {
                initial: {
                    toJS: () => [
                        {
                            dsi_dsid: 'test4.txt',
                            dsi_security_policy: 1,
                        },
                    ],
                },
            },
        });
        expect(asFragment()).toMatchSnapshot();
        expect(getByText(/test4.txt/)).toHaveAttribute('title', 'test4.txt');
        expect(getByText(/Administrator/i)).toHaveAttribute('id', 'Override datastream security policy');
        expect(getByText(/Administrator/i)).toHaveAttribute('role', 'button');
    });

    it('should change security value for the file', async() => {
        const { getByText, getByTestId } = setup({
            meta: {
                initial: {
                    toJS: () => [
                        {
                            dsi_dsid: 'test5.txt',
                            dsi_security_policy: 1,
                        },
                    ],
                },
            },
        });

        fireEvent.mouseDown(getByText(/Administrator/i));
        const menu = await waitForElement(() => getByTestId('menu-test5.txt'));

        fireEvent.mouseDown(getByText(/public/i, menu));
        expect(getByText(/public/i, menu)).toHaveAttribute('role', 'option');
    });

    it('should not display datastream security selected in dropdown', () => {
        const { asFragment } = setup({
            meta: {
                initial: {
                    toJS: () => [
                        {
                            dsi_dsid: 'test6.txt',
                            dsi_security_policy: 1,
                            dsi_embargo_date: '2015-12-01',
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

        let fragment = asFragment();
        expect(fragment).toMatchDiffSnapshot((fragment = asFragment()));
    });

    describe('isSame callback function', () => {
        it('should return true if current props are same as previous props', () => {
            expect(isSame({ disabled: true }, { disabled: true })).toBeTruthy();
        });

        it('should return false if props do not match', () => {
            expect(isSame({ disabled: true }, { disabled: false })).toBeFalsy();
        });
    });
});
