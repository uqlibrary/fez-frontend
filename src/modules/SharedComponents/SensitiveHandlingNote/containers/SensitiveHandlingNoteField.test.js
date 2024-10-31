import React from 'react';
import { render, userEvent, FormProviderWrapper, preview } from 'test-utils';

import SensitiveHandlingNoteField from './SensitiveHandlingNoteField';

function setup(testProps = {}, renderer = render) {
    const { values = {}, methods = {}, ...rest } = testProps;
    const props = {
        ...rest,
    };

    return renderer(
        <FormProviderWrapper
            values={{
                ...values,
            }}
            methods={methods}
        >
            <SensitiveHandlingNoteField {...props} />
        </FormProviderWrapper>,
    );
}

describe('SensitiveHandlingNoteField', () => {
    it('should render default view', () => {
        const { getByTestId } = setup({});
        userEvent.click(getByTestId('rek-sensitive-handling-note-id-select'));
        preview.debug();
    });

    it('should render disabled view', () => {
        const render = setup({ disabled: true });
        expect(render.getRenderOutput()).toMatchSnapshot();
    });
});
