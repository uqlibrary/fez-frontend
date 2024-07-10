import React from 'react';
import { FileUploadRow } from './FileUploadRow';
import { render, WithReduxStore, fireEvent, within } from 'test-utils';
import moment from 'moment';

import * as Hook from 'hooks/useWidth';

const useWidth = jest.spyOn(Hook, 'useWidth');
function setup(testProps = {}) {
    const props = {
        index: 0,
        isAdmin: false,
        uploadedFile: { name: 'a.txt', size: 100 },
        requireOpenAccessStatus: true,
        onDelete: jest.fn(),
        onAccessConditionChange: jest.fn(),
        onEmbargoDateChange: jest.fn(),
        ...testProps,
    };

    return render(
        <WithReduxStore>
            <FileUploadRow {...props} />
        </WithReduxStore>,
    );
}

describe('FileUploadRow', () => {
    beforeEach(() => {
        useWidth.mockImplementation(() => 'md');
    });
    it('renders with uploaded file', () => {
        const { container } = setup();

        expect(container).toMatchSnapshot();
    });

    it('call prop to update file metadata with closed access', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        file.date = '2017-01-01';
        const { getByRole, getByLabelText } = setup({
            requireOpenAccessStatus: true,
            onAccessConditionChange: testFunction,
            uploadedFile: file,
            index: 0,
        });

        fireEvent.mouseDown(getByLabelText('Select access conditions'));
        fireEvent.click(getByRole('option', { name: 'Closed Access' }));
        expect(testFunction).toHaveBeenCalledWith(file, 0, 1);
    });

    it('call prop to update file description', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        file.date = '2017-01-01';
        const { getByTestId } = setup({
            requireOpenAccessStatus: true,
            onFileDescriptionChange: testFunction,
            uploadedFile: file,
            index: 0,
        });
        fireEvent.change(getByTestId('dsi-label-upload-0-input'), { target: { value: 'Test Description' } });
        expect(testFunction).toHaveBeenCalledWith(file, 0, 'Test Description');
    });

    it('call prop to update file metadata with open access', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        file.date = '2017-01-01';
        const { getByRole, getByLabelText } = setup({
            requireOpenAccessStatus: true,
            onAccessConditionChange: testFunction,
            uploadedFile: file,
            index: 0,
        });

        fireEvent.mouseDown(getByLabelText('Select access conditions'));
        fireEvent.click(getByRole('option', { name: 'Open Access' }));
        expect(testFunction).toHaveBeenCalledWith(file, 0, 5);
    });

    it('call prop to update file metadata with non-public security policy', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        file.date = '2017-01-01';
        const { getByRole, getByLabelText } = setup({
            requireOpenAccessStatus: true,
            isAdmin: true,
            onSecurityPolicyChange: testFunction,
            uploadedFile: file,
            index: 0,
        });

        fireEvent.mouseDown(getByLabelText('Select security policy'));
        fireEvent.click(getByRole('option', { name: 'Administrators' }));
        expect(testFunction).toHaveBeenCalledWith(file, 0, 1);
    });

    it('call prop to update file metadata with public security policy', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        file.date = '2017-01-01';
        const { getByRole, getByLabelText } = setup({
            requireOpenAccessStatus: true,
            isAdmin: true,
            onSecurityPolicyChange: testFunction,
            uploadedFile: file,
            index: 0,
        });

        fireEvent.mouseDown(getByLabelText('Select security policy'));
        fireEvent.click(getByRole('option', { name: 'Public' }));
        expect(testFunction).toHaveBeenCalledWith(file, 0, 5);
    });

    it('call prop to update file metadata with open access date', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        file.date = '2017-01-01';
        file.access_condition_id = 5;
        const { getByTestId } = setup({
            onEmbargoDateChange: testFunction,
            uploadedFile: file,
            index: 0,
        });
        fireEvent.change(within(getByTestId('dsi-embargo-date-0-input')).getByRole('textbox'), {
            target: { value: '01/01/2016' },
        });

        expect(testFunction).toHaveBeenCalledWith(file, 0, moment('01/01/2016', 'DD/MM/YYYY', true));
    });

    it('call prop to move file down', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        const { getByTestId } = setup({
            onOrderDownClick: testFunction,
            uploadedFile: file,
            index: 0,
        });
        fireEvent.click(getByTestId('new-file-upload-down-0'));
        expect(testFunction).toHaveBeenCalled();
    });

    it('call prop to move file up', () => {
        const testFunction = jest.fn();
        const file = new File([''], 'a.txt');
        const { getByTestId } = setup({
            onOrderUpClick: testFunction,
            uploadedFile: file,
            index: 1,
        });
        fireEvent.click(getByTestId('new-file-upload-up-1'));
        expect(testFunction).toHaveBeenCalled();
    });

    it('should show confirmation and delete file', () => {
        useWidth.mockImplementation(() => 'xs');
        const onDeleteFn = jest.fn();
        const { container, getByTestId } = setup({
            onDelete: onDeleteFn,
        });
        expect(container).toMatchSnapshot();
        fireEvent.click(getByTestId('dsi-dsid-0-delete'));
        fireEvent.click(getByTestId('confirm-dsi-dsid-delete'));
        expect(onDeleteFn).toHaveBeenCalled();
    });
});
