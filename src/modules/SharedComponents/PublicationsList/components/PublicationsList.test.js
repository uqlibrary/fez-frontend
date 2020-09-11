import React from 'react';
import PublicationsList from './PublicationsList';
import { myRecordsList } from 'mock/data';
import { render, WithRouter, WithReduxStore } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        publicationsList: testProps.publicationsList || [], // : PropTypes.array,
        customActions: testProps.customActions || [], // : PropTypes.array,
        showDefaultActions: testProps.showDefaultActions || false, // : PropTypes.bool
        ...testProps,
    };
    return render(
        <WithReduxStore>
            <WithRouter>
                <PublicationsList {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('PublicationsList', () => {
    it('renders empty component', () => {
        const { asFragment } = setup();
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders component with items', () => {
        const { asFragment } = setup({ publicationsList: myRecordsList.data });
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders component with custom subset actions', () => {
        const test = [];
        const { asFragment } = setup({
            publication: { rek_pid: 'UQ:111111' },
            publicationsListSubset: ['UQ:222222'],
            subsetCustomActions: test,
        });
        expect(asFragment()).toMatchSnapshot();
    });
});
