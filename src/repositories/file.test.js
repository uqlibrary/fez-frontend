import { getFileUploadMetadata, putUploadFile } from './file';
import * as repositories from 'repositories';
import { locale } from 'locale';
import * as actions from 'actions/actionTypes';
import {
    FILE_ACCESS_CONDITION_CLOSED,
    FILE_ACCESS_CONDITION_INHERIT,
    FILE_ACCESS_CONDITION_OPEN,
    FILE_SECURITY_POLICY_ADMIN,
    FILE_SECURITY_POLICY_EVIDENCE_ASSESSORS,
    FILE_SECURITY_POLICY_PUBLIC,
} from 'modules/SharedComponents/Toolbox/FileUploader/config';
import MockDate from 'mockdate';

describe('File repository', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        mockActionsStore.clearActions();
    });

    it('can uploading a file successfully', async () => {
        mockApi
            .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
            .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
            .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
            .reply(200, 'File has been uploaded');

        await expect(putUploadFile('PID:111111', { name: 'a.txt' }, mockActionsStore.dispatch)).resolves.toEqual(
            'File has been uploaded',
        );
    });

    it('can set appropriate metadata based on the selected access condition', () => {
        MockDate.set('2020-02-19T12:00:00.000Z', 10);
        const testCases = [
            {
                input: { access_condition_id: FILE_ACCESS_CONDITION_OPEN },
                output: { dsi_security_policy: FILE_ACCESS_CONDITION_OPEN, dsi_security_inherited: 0 },
            },
            {
                input: { access_condition_id: FILE_ACCESS_CONDITION_OPEN, date: '2020-02-19T00:00:00+10:00' },
                output: { dsi_security_policy: FILE_ACCESS_CONDITION_OPEN, dsi_security_inherited: 0 },
            },
            {
                input: { access_condition_id: FILE_ACCESS_CONDITION_OPEN, date: '2020-02-20T12:00:00+10:00' },
                output: {
                    dsi_security_policy: FILE_ACCESS_CONDITION_CLOSED,
                    dsi_embargo_date: '2020-02-20',
                    dsi_security_inherited: 0,
                },
            },
            {
                input: { access_condition_id: FILE_ACCESS_CONDITION_CLOSED },
                output: { dsi_security_policy: FILE_ACCESS_CONDITION_CLOSED, dsi_security_inherited: 0 },
            },
            {
                input: { access_condition_id: FILE_ACCESS_CONDITION_INHERIT },
                output: { dsi_security_policy: FILE_ACCESS_CONDITION_OPEN, dsi_security_inherited: 1 },
            },
            {
                input: { access_condition_id: FILE_ACCESS_CONDITION_INHERIT, description: 'TEST DESCRIPTION' },
                output: {
                    dsi_security_policy: FILE_ACCESS_CONDITION_OPEN,
                    dsi_security_inherited: 1,
                    dsi_label: 'TEST DESCRIPTION',
                },
            },
        ];
        testCases.forEach(testCase => expect(getFileUploadMetadata(testCase.input, [])).toEqual(testCase.output));
        MockDate.reset();
    });

    it('correctly leaves file description for null metadata', () => {
        const testCase = {
            input: { access_condition_id: FILE_ACCESS_CONDITION_OPEN, description: null },
            output: { dsi_security_policy: FILE_ACCESS_CONDITION_OPEN, dsi_security_inherited: 0, dsi_label: null },
        };
        expect(getFileUploadMetadata(testCase.input, [])).toEqual(testCase.output);
    });

    it('correctly sets file description for provided metadata', () => {
        const testCase = {
            input: { access_condition_id: FILE_ACCESS_CONDITION_OPEN, description: 'test' },
            output: { dsi_security_policy: FILE_ACCESS_CONDITION_OPEN, dsi_security_inherited: 0, dsi_label: 'test' },
        };
        expect(getFileUploadMetadata(testCase.input, [])).toEqual(testCase.output);
    });
    it('can set appropriate metadata based on the selected security policy', () => {
        MockDate.set('2020-02-19T12:00:00.000Z', 10);
        const testCases = [
            {
                input: { security_policy: FILE_SECURITY_POLICY_ADMIN },
                output: { dsi_security_inherited: 0, dsi_security_policy: FILE_SECURITY_POLICY_ADMIN },
            },
            {
                input: { security_policy: FILE_SECURITY_POLICY_EVIDENCE_ASSESSORS },
                output: { dsi_security_inherited: 0, dsi_security_policy: FILE_SECURITY_POLICY_EVIDENCE_ASSESSORS },
            },
            {
                input: { security_policy: FILE_SECURITY_POLICY_PUBLIC, date: '2020-02-19T00:00:00+10:00' },
                output: { dsi_security_inherited: 0, dsi_security_policy: FILE_SECURITY_POLICY_PUBLIC },
            },
            {
                input: { security_policy: FILE_SECURITY_POLICY_PUBLIC, date: '2020-02-20T12:00:00+10:00' },
                output: {
                    dsi_security_inherited: 0,
                    dsi_security_policy: FILE_SECURITY_POLICY_PUBLIC,
                    dsi_embargo_date: '2020-02-20',
                },
            },
        ];
        testCases.forEach(testCase => expect(getFileUploadMetadata(testCase.input, [])).toEqual(testCase.output));
        MockDate.reset();
    });

    it('dispatches an upload failed action for uploading a file', async () => {
        mockApi
            .onPost(repositories.routes.FILE_UPLOAD_API().apiUrl)
            .reply(200, ['s3-ap-southeast-2.amazonaws.com'])
            .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
            .reply(500);

        const expectedActions = [
            'APP_ALERT_SHOW',
            `${actions.FILE_UPLOAD_FAILED}@a.txt`,
            actions.FILE_UPLOAD_STARTED,
            'APP_ALERT_SHOW',
            `${actions.FILE_UPLOAD_FAILED}@a.txt`,
        ];

        await expect(putUploadFile('PID:111111', { name: 'a.txt' }, mockActionsStore.dispatch)).rejects.toMatchObject(
            locale.global.errorMessages[500],
        );
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
