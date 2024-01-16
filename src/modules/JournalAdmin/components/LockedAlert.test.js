import React from 'react';
import LockedAlert from './LockedAlert';
import { rtlRender, fireEvent, withRedux } from 'test-utils';
import { useJournalContext, useAccountContext } from 'context';
import { adminUnlockJournal } from 'actions';

jest.mock('../../../context');
jest.mock('../../../actions');

const setup = (testProps = {}) => {
    return rtlRender(withRedux()(<LockedAlert {...testProps} />));
};

describe('LockedAlert', () => {
    beforeEach(() => {
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                jnl_jid: 12,
                jnl_title: 'This is test record',
                jnl_editing_user: 'uqtest',
                jnl_editing_user_lookup: 'UQ',
            },
        }));

        useAccountContext.mockImplementation(() => ({
            account: {
                id: 'uqadmin',
            },
        }));
        adminUnlockJournal.mockImplementation(() => jest.fn());
    });

    it('should render error alert as expected', () => {
        const { getByText } = setup();
        expect(
            getByText(
                'This work is currently being edited by UQ (uqtest). Make sure that you confirm with this user before ignoring the work lock as it may cause work overwrite issues.',
            ),
        ).toBeInTheDocument();
    });

    it('should not render alert for the first editing user', () => {
        useAccountContext.mockImplementation(() => ({
            account: {
                id: 'uqtest',
            },
        }));
        const { getByTestId } = setup();

        expect(getByTestId('no-alert')).toBeInTheDocument();
    });

    it('should call alert action to unlock record', () => {
        const { getByTestId } = setup();
        fireEvent.click(getByTestId('action-button'));
        expect(adminUnlockJournal).toBeCalled();
    });
});
