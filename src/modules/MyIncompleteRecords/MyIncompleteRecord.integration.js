/* eslint-disable */
import React from 'react';
import { MyIncompleteRecord } from '.';
import Immutable from 'immutable';
import { UQ352045, UQ716942_uqagrinb } from 'mock/data/records';
import { uqrdav10, uqagrinb } from 'mock/data/account';
import {
    rtlRender,
    fireEvent,
    cleanup,
    withRedux,
    withRouter,
    getByTestId
} from 'test-utils';

const initialState = (accountReducer, recordToFix) => Immutable.Map({
    accountReducer,
    fixRecordReducer: {
        recordToFix,
        loadingRecordToFix: false,
        recordToFixError: null
    }
});

describe('MyIncompleteRecord form', () => {
    afterEach(cleanup);
    it('Creative Work:Live Performance of Creative Work - Music should allow user to update work', () => {
        const route = '/records/UQ:352045/incomplete';
        const {
            container,
            asFragment,
            getByText
        } = rtlRender(withRedux(initialState(uqrdav10, UQ352045))(withRouter({route})(<MyIncompleteRecord/>)));

        let fragment = asFragment();
        expect(getByTestId(container, 'update-my-work')).toHaveAttribute('disabled');

        fireEvent.click(getByTestId(container, 'significance'));
        fireEvent.click(getByText(/Major/));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId(container, 'rek-audience-size'));
        fireEvent.click(getByText(/less than 100/i));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId(container, 'quality-indicators'));
        fireEvent.click(getByText(/commissioned by external body/i));
        fireEvent.click(container);
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        expect(getByTestId(container, 'delete-author-0')).toHaveAttribute('disabled');
        expect(getByTestId(container, 'delete-author-1')).toHaveAttribute('disabled');
        expect(getByTestId(container, 'delete-author-2')).toHaveAttribute('disabled');
        expect(getByTestId(container, 'delete-author-3')).toHaveAttribute('disabled');

        fireEvent.click(getByTestId(container, 'contributor-editor-row-0'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        expect(getByTestId(container, 'submit-author')).toHaveAttribute('disabled');

        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.change(getByTestId(container, 'org-affiliation-name'), {target: {value: 'test'}});
        fireEvent.click(getByTestId(container, 'org-affiliation-type'));
        fireEvent.click(getByText('Government'));
        expect(getByTestId(container, 'submit-author')).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId(container, 'submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId(container, 'contributor-editor-row-1'));
        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId(container, 'org-affiliation-selector'));
        fireEvent.click(getByText(/^uq$/i));
        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId(container, 'submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId(container, 'contributor-editor-row-2'));
        expect(fragment).toMatchDiffSnapshot(fragment);

        fireEvent.click(getByTestId(container, 'contributor-editor-row-3'));
        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId(container, 'org-affiliation-selector'));
        fireEvent.click(getByText(/^uq$/i));
        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId(container, 'submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());
    });

    it('UQ:716942 - Creative Work:Live Performance of Creative Work - Music should allow user to update work', () => {
        const route = '/records/UQ:716942/incomplete';
        const {
            container,
            asFragment,
            getByText
        } = rtlRender(withRedux(initialState(uqagrinb, UQ716942_uqagrinb))(withRouter({route})(<MyIncompleteRecord/>)));

        let fragment = asFragment();
        expect(getByTestId(container, 'update-my-work')).toHaveAttribute('disabled');

        fireEvent.click(getByTestId(container, 'significance'));
        fireEvent.click(getByText(/Major/));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.change(getByTestId(container, 'rek-total-pages'), {target: {value: '10'}});
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId(container, 'rek-audience-size'));
        fireEvent.click(getByText(/less than 100/i));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId(container, 'quality-indicators'));
        fireEvent.click(getByText(/commissioned by external body/i));
        fireEvent.click(container);
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        expect(getByTestId(container, 'delete-author-0')).toHaveAttribute('disabled');
        expect(getByTestId(container, 'delete-author-1')).toHaveAttribute('disabled');
        expect(getByTestId(container, 'delete-author-2')).toHaveAttribute('disabled');
        expect(getByTestId(container, 'delete-author-3')).toHaveAttribute('disabled');

        fireEvent.click(getByTestId(container, 'contributor-editor-row-0'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId(container, 'contributor-editor-row-1'));
        expect(getByTestId(container, 'submit-author')).toHaveAttribute('disabled');
        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttributeValue('value', 'Grinberg, Anna');
        fireEvent.click(getByTestId(container, 'org-affiliation-selector'));
        fireEvent.click(getByText(/^uq$/i));
        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId(container, 'submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId(container, 'contributor-editor-row-2'));
        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.change(getByTestId(container, 'org-affiliation-name'), {target: {value: 'test'}});
        fireEvent.click(getByTestId(container, 'org-affiliation-type'));
        fireEvent.click(getByText('Government'));
        expect(getByTestId(container, 'submit-author')).not.toHaveAttribute('disabled');
        fireEvent.click(getByTestId(container, 'submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId(container, 'contributor-editor-row-3'));
        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId(container, 'org-affiliation-selector'));
        fireEvent.click(getByText(/^uq$/i));
        expect(getByTestId(container, 'authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId(container, 'submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());
    });
});