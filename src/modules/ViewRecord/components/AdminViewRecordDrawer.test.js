import React from 'react';
import AdminViewRecordDrawer from './AdminViewRecordDrawer';
import mediaQuery from 'css-mediaquery';
import { render, WithRouter, WithReduxStore, waitFor, act, fireEvent } from 'test-utils';
import locale from 'locale/pages';
import { default as recordWithAuthorAffiliates } from 'mock/data/records/recordWithAuthorAffiliates';
import { default as recordWithoutAuthorAffiliates } from 'mock/data/records/recordWithoutAuthorAffiliates';
import fields from 'locale/viewRecord';
import { createDefaultDrawerDescriptorObject } from 'helpers/adminViewRecordObject';

function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
}
const txt = locale.pages.viewRecord;
const setup = (props = {}, renderer = render) => {
    const content =
        props.content ??
        createDefaultDrawerDescriptorObject(
            txt.adminRecordData.drawer.sectionTitles,
            recordWithAuthorAffiliates,
            fields.viewRecord.adminViewRecordDrawerFields,
        );
    const obj = {
        content: content,
        handleDrawerToggle: jest.fn(),
        open: false,
        mobileOpen: false,
        ...props,
    };
    return renderer(
        <WithRouter>
            <WithReduxStore>
                <AdminViewRecordDrawer {...obj} />
            </WithReduxStore>
        </WithRouter>,
    );
};

describe('AdminViewRecordDrawer', () => {
    const DESKTOP = 0;
    const MOBILE = 1;
    it('should render hidden desktop and mobile admin drawers by default', () => {
        // will show error in console when undefining open flags as proptypes requires them to be set
        const { getByTestId, getAllByTestId } = setup({ open: undefined, mobileOpen: undefined });
        expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
        expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
        expect(getAllByTestId('adminRecordDrawerCloseBtn')[DESKTOP]).not.toBeVisible();
        expect(getAllByTestId('adminRecordDrawerCloseBtn')[MOBILE]).not.toBeVisible();
    });
    it('should show affiliates section with the text "Yes" when affiliates are available', () => {
        // will show error in console when undefining open flags as proptypes requires them to be set
        const { getByTestId, getAllByTestId } = setup({ open: undefined, mobileOpen: undefined });
        expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
        expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
        getAllByTestId('drawer-content-value-2-1').forEach(section => expect(section).toHaveTextContent('Yes'));
    });
    it('should show affiliates section with the text "No" when no affiliates are available', () => {
        const content = createDefaultDrawerDescriptorObject(
            txt.adminRecordData.drawer.sectionTitles,
            recordWithoutAuthorAffiliates,
            fields.viewRecord.adminViewRecordDrawerFields,
        );
        // will show error in console when undefining open flags as proptypes requires them to be set
        const { getByTestId, getAllByTestId } = setup({
            open: undefined,
            mobileOpen: undefined,
            content: content,
        });

        expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
        expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
        getAllByTestId('drawer-content-value-2-1').forEach(section => expect(section).toHaveTextContent('No'));
    });
    it('should render visible desktop admin drawer at >mobile breakpoint', () => {
        const { getByTestId, getAllByTestId } = setup({ open: true });
        expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
        expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
        expect(getAllByTestId('adminRecordDrawerCloseBtn')[DESKTOP]).toBeVisible();
        expect(getAllByTestId('adminRecordDrawerCloseBtn')[MOBILE]).not.toBeVisible();
    });
    it('should render mobile admin drawer at mobile breakpoint', () => {
        window.matchMedia = createMatchMedia(320);
        const { getByTestId, getAllByTestId } = setup({ mobileOpen: true });
        expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();
        expect(getByTestId('adminViewRecordDrawerMobile')).toBeInTheDocument();
        expect(getAllByTestId('adminRecordDrawerCloseBtn')[DESKTOP]).not.toBeVisible();
        expect(getAllByTestId('adminRecordDrawerCloseBtn')[MOBILE]).toBeVisible();
    });
    it('should call the clipboard copy function when a copy icon is clicked', async () => {
        const { getByTestId, getAllByTestId, queryByTestId } = setup({ open: true });
        Object.assign(navigator, {
            clipboard: {
                writeText: () => {
                    return Promise.resolve();
                },
            },
        });
        jest.spyOn(navigator.clipboard, 'writeText');

        expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getAllByTestId('drawer-clipboard-button-4-1')[DESKTOP]);
        });

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('000381303000009');

        waitFor(() => getByTestId('copied-text-snackbar'));
        await waitFor(() => {
            expect(queryByTestId('copied-text-snackbar')).not.toBeInTheDocument();
        });
    });
    it('should show error message if clipboard is unavailable', async () => {
        const { getByTestId, getAllByTestId } = setup({ open: true });
        Object.assign(navigator, {
            clipboard: undefined,
        });

        expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getAllByTestId('drawer-clipboard-button-4-1')[DESKTOP]);
        });

        waitFor(() => getByTestId('copied-text-snackbar'));
        expect(getByTestId('copied-text-snackbar')).toHaveTextContent(txt.adminRecordData.clipboard.unavailable);
    });
    it('should show error message if copying to clipboard fails', async () => {
        const { getByTestId, getAllByTestId } = setup({ open: true });
        Object.assign(navigator, {
            clipboard: {
                writeText: () => {
                    return Promise.reject('Test fail');
                },
            },
        });

        expect(getByTestId('adminViewRecordDrawerDesktop')).toBeInTheDocument();

        act(() => {
            fireEvent.click(getAllByTestId('drawer-clipboard-button-4-1')[DESKTOP]);
        });

        waitFor(() => {
            expect(getByTestId('copied-text-snackbar')).toHaveTextContent('Test fail');
        });
    });
});
