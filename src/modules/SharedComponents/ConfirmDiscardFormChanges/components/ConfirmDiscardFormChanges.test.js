import React from 'react';
import { rtlRender } from 'test-utils';
import { ConfirmDiscardFormChanges } from './ConfirmDiscardFormChanges';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return rtlRender(<ConfirmDiscardFormChanges {...props} />);
}

describe('ConfirmDiscardFormChanges', () => {
    it('should set function to prompt to discard form changes', () => {
        global.window.onbeforeunload = null;
        setup({
            dirty: true,
            submitSucceeded: false,
        });

        expect(global.window.onbeforeunload).not.toBeNull();

        global.window.onbeforeunload(new Event('beforeunload'));
    });

    it('should not set function to prompt to discard form changes', () => {
        global.window.onbeforeunload = null;

        setup({
            dirty: true,
            submitSucceeded: true,
        });

        expect(global.window.onbeforeunload).toBeNull();
    });
});
