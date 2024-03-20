import React from 'react';
import { DashboardAuthorProfile } from './DashboardAuthorProfile';
import * as mock from 'mock/data';
import { render, WithRouter, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        authorDetails: mock.authorDetails.uqresearcher,
        author: mock.currentAuthor.uqresearcher.data,
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <DashboardAuthorProfile {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Dashboard Author Profile test', () => {
    it('Render the authors profile as expected for a UQ researcher)', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('Renders empty div if there is no profile loaded', () => {
        const { container } = setup({
            authorDetails: null,
            author: null,
        });
        expect(container).toMatchSnapshot();
    });

    it('Renders empty div if there is no profile but profile image exists', () => {
        const { container } = setup({
            authorDetails: { uqr_id: null, image_exists: 1 },
            author: { title: null, aut_fname: null, aut_lname: null, aut_id: null },
        });
        expect(container).toMatchSnapshot();
    });
});
