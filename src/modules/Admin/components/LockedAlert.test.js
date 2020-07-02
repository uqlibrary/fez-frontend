import React from 'react';
import LockedAlert from './LockedAlert';
import { rtlRender, fireEvent, withRedux } from 'test-utils';
import { useRecordContext } from 'context';
import { unlockRecordToView } from 'actions';

jest.mock('../../../context');
jest.mock('../../../actions');

const setup = () => {
    return rtlRender(withRedux()(<LockedAlert />));
};

describe('LockedAlert', () => {
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_display_type_lookup: 'Journal Article',
                rek_display_type: 179,
                rek_editing_user: 'uqtest',
                rek_editing_user_lookup: 'UQ',
            },
        }));

        unlockRecordToView.mockImplementation(() => jest.fn());
    });

    it('should render alert as expected', () => {
        const { getByText } = setup();
        expect(
            getByText(
                'This work is currently being edited by UQ (uqtest). Make sure that you confirm with this user before ignoring the record lock as it may cause record overwrite issues.',
            ),
        ).toBeInTheDocument();
    });

    it('should call alert action to unlock record', () => {
        const { getByTestId } = setup();
        fireEvent.click(getByTestId('action-button'));
        expect(unlockRecordToView).toBeCalled();
    });
});
