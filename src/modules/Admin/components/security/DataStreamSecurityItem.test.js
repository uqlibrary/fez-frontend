import React from 'react';
import DataStreamSecurityItem, { isSame } from './DataStreamSecurityItem';
import { rtlRender, fireEvent, cleanup, waitFor } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        disabled: false,
        classes: {
            dataStreamFileBlock: 'dataStreamFileBlock',
            dataStreamFileName: 'dataStreamFileName',
        },
        dataStream: {
            dsi_dsid: 'test.jpg',
            dsi_security_policy: 2,
            dsi_security_inherited: 1,
        },
        index: 0,
        initialDataStream: {
            dsi_dsid: 'test.jpg',
            dsi_security_policy: 2,
            dsi_security_inherited: 1,
        },
        inheritedSecurity: 2,
        onSecurityChange: jest.fn(),
        policyDropdownLabel: 'Test Policy Dropdown Label',
        ...testProps,
    };
    return rtlRender(<DataStreamSecurityItem {...props} />);
}

describe('DataStreamSecurityItem component', () => {
    afterEach(() => cleanup);

    it('should render default view with inherited security', () => {
        const { asFragment } = setup();
        expect(asFragment()).toMatchSnapshot();
    });
    it('should render default view with overridden security', () => {
        const { asFragment } = setup({
            dataStream: {
                dsi_dsid: 'test.jpg',
                dsi_security_policy: 2,
                dsi_security_inherited: 0,
            },
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('should change security value for the file', async () => {
        const { getByText, getByTestId } = setup({
            dataStream: {
                dsi_dsid: 'test.jpg',
                dsi_security_policy: 1,
                dsi_security_inherited: 0,
            },
        });

        fireEvent.mouseDown(getByTestId('dsi-security-policy-0-select'));

        const menu = await waitFor(() => getByTestId('dsi-security-policy-0-options'));

        fireEvent.click(getByText(/public/i, menu));

        expect(getByText('Public')).toBeInTheDocument();
    });

    it('should change security value for the file back to inherited', async () => {
        const { getByText, getByTestId } = setup({
            dataStream: {
                dsi_dsid: 'test.jpg',
                dsi_security_policy: 1,
                dsi_security_inherited: 0,
            },
        });

        fireEvent.mouseDown(getByTestId('dsi-security-policy-0-select'));

        const menu = await waitFor(() => getByTestId('dsi-security-policy-0-options'));

        fireEvent.click(getByText(/Theses Assessors/i, menu));

        expect(getByText('Theses Assessors')).toBeInTheDocument();
    });

    describe('isSame callback function', () => {
        it('should return true if current props are same as previous props', () => {
            expect(
                isSame(
                    { disabled: true, dataStream: { dsi_security_policy: 2 } },
                    { disabled: true, dataStream: { dsi_security_policy: 2 } },
                ),
            ).toBeTruthy();
        });

        it('should return false if props do not match', () => {
            expect(
                isSame(
                    { disabled: true, dataStream: { dsi_security_policy: 2 } },
                    { disabled: false, dataStream: { dsi_security_policy: 2 } },
                ),
            ).toBeFalsy();
        });
    });

    it('should render view for a subsequent file', () => {
        const { asFragment } = setup({
            dataStream: {
                dsi_dsid: 'test.jpg',
                dsi_security_policy: 2,
                dsi_security_inherited: 0,
                dsi_embargo_date: '2099-01-01',
            },
            index: 2,
        });
        expect(asFragment()).toMatchSnapshot();
    });
});
