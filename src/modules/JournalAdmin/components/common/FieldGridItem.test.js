import React from 'react';
import { rtlRender, WithReduxStore } from 'test-utils';
import FieldGridItem from './FieldGridItem';
import { reduxForm } from 'redux-form';

jest.mock('../../../../context');
import { useFormValuesContext, useJournalContext } from 'context';

global.console = {
    ...global.console,
    warn: jest.fn(),
};

const WithReduxForm = reduxForm({ form: 'testForm' })(FieldGridItem);

const setup = (testProps = {}, renderer = rtlRender) => {
    const props = {
        ...testProps,
        group: [1],
    };

    return renderer(
        <WithReduxStore>
            <WithReduxForm {...props} />
        </WithReduxStore>,
    );
};

describe('FieldGridItem', () => {
    beforeEach(() => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                jnl_title: 'Test title',
            },
        }));
        useJournalContext.mockImplementation(() => ({
            journalDetails: {
                jnl_jid: 12,
                jnl_title: 'This is a test title',
            },
            jnlDisplayType: 'adminjournal',
        }));
    });

    afterEach(() => {
        useFormValuesContext.mockReset();
        useJournalContext.mockReset();
    });

    it('should render default view', () => {
        const { getByTestId } = setup({
            field: 'jnl_title',
        });
        expect(getByTestId('jnl_title-input')).toBeInTheDocument();
    });

    it('should handle missing field config', () => {
        setup({
            field: 'fake_field',
        });
        expect(global.console.warn).toHaveBeenCalledWith('No field config found for', 'fake_field');
    });
});

describe('FieldGridItem without record', () => {
    beforeEach(() => {
        useFormValuesContext.mockImplementation(() => ({
            formValues: {
                jnl_title: 'Test title',
            },
        }));
        useJournalContext.mockImplementation(() => ({
            journalDetails: {},
        }));
    });

    it('should render default view', () => {
        const { getByTestId } = setup({
            field: 'jnl_title',
        });
        expect(getByTestId('jnl_title-input')).toBeInTheDocument();
    });
});
