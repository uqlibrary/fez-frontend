import React from 'react';
import FieldGridItem from './FieldGridItem';
import { rtlRender, WithReduxStore, FormProviderWrapper } from 'test-utils';

// Mock the RichEditorField to avoid lazy loading in tests
jest.mock('modules/SharedComponents/RichEditor', () => ({
    RichEditorField: require('modules/SharedComponents/RichEditor/components/RichEditor').default,
}));

jest.mock('../../../../context');
import { useRecordContext } from 'context';

global.console = {
    ...global.console,
    warn: jest.fn(),
};

const setup = ({ values, ...testProps } = {}) => {
    const props = {
        ...testProps,
        group: [1],
    };

    const inputValues = {
        rek_title: 'Test title',
        ...values,
    };

    return rtlRender(
        <WithReduxStore>
            <FormProviderWrapper
                values={{
                    ...inputValues,
                }}
            >
                <FieldGridItem {...props} />
            </FormProviderWrapper>
        </WithReduxStore>,
    );
};

describe('FieldGridItem', () => {
    beforeEach(() => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
            },
        }));
    });

    afterEach(() => {
        useRecordContext.mockReset();
    });

    it('should render default view', () => {
        const { container } = setup({
            field: 'rek_title',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render default view for a composed field', () => {
        const { container } = setup({
            field: 'sensitiveHandlingNote',
        });
        expect(container).toMatchSnapshot();
    });

    it('should render with correct props', () => {
        useRecordContext.mockImplementation(() => ({
            record: {
                rek_pid: 'UQ:123456',
                rek_title: 'This is test record',
                rek_subtype: 'Creative Work - Visual Art',
            },
        }));

        const { container } = setup({
            field: 'editors',
        });
        expect(container).toMatchSnapshot();
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
        useRecordContext.mockImplementation(() => ({
            record: {},
        }));
    });

    it('should render default view', () => {
        const { container } = setup({
            field: 'rek_title',
        });
        expect(container).toMatchSnapshot();
    });
});
