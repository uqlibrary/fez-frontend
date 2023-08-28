import React from 'react';
import ThirdPartyLookupTool from './ThirdPartyLookupTool';
import { render, WithReduxStore, WithRouter } from 'test-utils';

function setup(testProps) {
    const props = {
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <WithRouter>
                <ThirdPartyLookupTool {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('ThirdPartyLookupTool containers', () => {
    it('should mount', () => {
        setup({});
    });
});
