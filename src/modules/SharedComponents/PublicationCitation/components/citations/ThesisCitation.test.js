import React from 'react';
import ThesisCitation from './ThesisCitation';
import { thesis } from 'mock/data/testing/records';
import { render, WithRouter } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        publication: testProps.publication || {},
    };
    return render(
        <WithRouter>
            <ThesisCitation {...props} />
        </WithRouter>,
    );
}

describe('ThesisCitation renders ', () => {
    it('component with empty publication', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('component with a mock espace record', () => {
        const { container } = setup({ publication: thesis });
        expect(container).toMatchSnapshot();
    });

    it('component with an empty doi view', () => {
        const { container } = setup({
            publication: {
                ...thesis,
                fez_record_search_key_doi: { rek_doi: null },
            },
        });
        expect(container).toMatchSnapshot();
    });
});
