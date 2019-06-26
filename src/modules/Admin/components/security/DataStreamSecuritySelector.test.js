import React from 'react';
import DataStreamSecuritySelector, { isSame } from './DataStreamSecuritySelector';
import {
    rtlRender,
    fireEvent,
    cleanup,
    waitForElement
} from 'test-utils';

function setup(testProps = {}) {
    const props = {
        disabled: false,
        classes: {
            dataStreamFileBlock: 'dataStreamFileBlock',
            dataStreamFileName: 'dataStreamFileName'
        },
        input: {
            onChange: jest.fn()
        },
        meta: {
            initial: {
                toJS: () => ([])
            }
        },
        text: {
            overridePrompt: 'Override datastream security policy'
        },
        collections: [{
            parent: {
                rek_datastream_policy: 3
            }
        }, {
            parent: {
                rek_datastream_policy: 5
            }
        }, {
            parent: {
                rek_datastream_policy: 1
            }
        }],
        ...testProps
    };
    return rtlRender(<DataStreamSecuritySelector {...props} />);
}

describe('DataStreamSecuritySelector component', () => {
    afterEach(() => cleanup);

    it('should render default view', () => {
        const { asFragment, getByText } = setup({
            meta: {
                initial: {
                    toJS: () => ([{
                        dsi_dsid: 'test.txt',
                        dsi_security_policy: 1
                    }])
                }
            }
        });
        expect(asFragment()).toMatchSnapshot();
        expect(getByText(/test.txt/)).toHaveAttribute('title', 'test.txt');
        expect(getByText(/Administrator/i)).toHaveAttribute('id', 'select-test.txt');
        expect(getByText(/Administrator/i)).toHaveAttribute('role', 'button');
    });

    it('should change security value for the file', async () => {
        const { asFragment, getByText, getByTestId } = setup({
            meta: {
                initial: {
                    toJS: () => ([{
                        dsi_dsid: 'test.txt',
                        dsi_security_policy: 1
                    }])
                }
            }
        });

        let fragment = asFragment();
        fireEvent.click(getByText(/Administrator/i));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());
        const menu = await waitForElement(() => getByTestId('menu-test.txt'));

        fireEvent.click(getByText(/public/i, menu));
        expect(fragment).toMatchDiffSnapshot(asFragment());
        expect(getByText(/public/i)).toHaveAttribute('id', 'select-test.txt');
        expect(getByText(/public/i)).toHaveAttribute('role', 'button');
    });

    describe('isSame callback function', () => {
        it('should return true if current props are same as previous props', () => {
            expect(isSame(
                { disabled: true },
                { disabled: true }
            )).toBeTruthy();
        });

        it('should return false if props do not match', () => {
            expect(isSame(
                { disabled: true },
                { disabled: false }
            )).toBeFalsy();
        });
    });
});