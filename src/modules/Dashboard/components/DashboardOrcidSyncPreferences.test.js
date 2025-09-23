import React from 'react';
import { render, screen, fireEvent } from 'test-utils';

import DashboardOrcidSyncPreferences from './DashboardOrcidSyncPreferences';
import { locale as pagesLocale } from '../../../locale';

const setup = (props = {}) => {
    return render(<DashboardOrcidSyncPreferences {...props} />);
};

describe('DashboardOrcidSyncPreferences', () => {
    it('renders the component and label', () => {
        setup();
        expect(screen.getByTestId('orcid-sync-preferences-panel')).toBeInTheDocument();
        expect(
            screen.getByLabelText(pagesLocale.pages.dashboard.header.dashboardOrcidSyncPreferences.labels.switch),
        ).toBeInTheDocument();
    });

    it('renders switch as checked when checked={true}', () => {
        setup({ checked: true });
        const switchInput = screen.getByRole('switch');
        expect(switchInput).toBeChecked();
    });

    it('renders switch as disabled when disabled={true}', () => {
        setup({ disabled: true });
        const switchInput = screen.getByRole('switch');
        expect(switchInput).toBeDisabled();
    });

    it('calls onChange when toggled', () => {
        const handleChange = jest.fn();
        setup({ checked: false, onChange: handleChange });
        const switchInput = screen.getByRole('switch');

        fireEvent.click(switchInput);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(true);
    });
});
