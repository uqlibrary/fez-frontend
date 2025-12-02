import React from 'react';
import MyEditorialAppointmentsList from './MyEditorialAppointmentsList';
import { render, userEvent, WithReduxStore, createMatchMedia } from 'test-utils';

jest.mock('@mui/material/Popper', () => {
    const actualReact = jest.requireActual('react');
    return {
        __esModule: true,
        default: actualReact.forwardRef(({ children, ...props }, ref) => (
            <div ref={ref} data-testid="popper-mock" {...props}>
                {typeof children === 'function' ? children({ placement: 'bottom' }) : children}
            </div>
        )),
    };
});

jest.mock('@mui/material/Tooltip', () => ({
    __esModule: true,
    default: ({ children, title }) => (
        <div title={title} data-testid="tooltip-mock">
            {children}
        </div>
    ),
}));

function setup(testProps = {}) {
    const props = {
        list: [],
        handleRowAdd: jest.fn(data => Promise.resolve(data)),
        handleRowUpdate: jest.fn(data => Promise.resolve(data)),
        handleRowDelete: jest.fn(() => Promise.resolve()),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <MyEditorialAppointmentsList {...props} />
        </WithReduxStore>,
    );
}

describe('MyEditorialAppointmentsList', () => {
    describe('mobile coverage', () => {
        beforeEach(() => {
            window.matchMedia = createMatchMedia(320);
        });
        it('should show mobile add dialog', async () => {
            const { getByTestId, findByTestId } = setup({
                list: [],
            });
            await userEvent.click(getByTestId('my-editorial-appointments-add-new-editorial-appointment'));
            await findByTestId('my-editorial-appointments-dialog-add-new-editorial-appointment');
        });
        it('should show mobile edit dialog', async () => {
            const { getByTestId, findByTestId } = setup({
                list: [
                    {
                        eap_id: 1,
                        eap_journal_name: 'test',
                        eap_jnl_id: 1234,
                        eap_role_cvo_id: '454148',
                        eap_start_year: '2006',
                        eap_end_year: '2026',
                        eap_role_name: 'Guest Editor',
                    },
                ],
            });
            await userEvent.click(getByTestId('my-editorial-appointments-list-row-0-edit-this-editorial-appointment'));
            await findByTestId('my-editorial-appointments-dialog-edit-this-editorial-appointment');
        });
    });
});
