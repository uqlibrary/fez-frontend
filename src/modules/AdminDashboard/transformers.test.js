import {
    transformSystemAlertRequest,
    transformQuickLinkUpdateRequest,
    transformQuickLinkReorderRequest,
    transformUrlToPlatform,
} from './transformers';

import { SYSTEM_ALERT_ACTION } from './config';

import * as General from 'config/general';

describe('transformers', () => {
    describe('transformSystemAlertRequest', () => {
        const user = { id: 456 };
        it('should transform resolve action', () => {
            const row = {
                sat_id: 123,
                sat_assigned_to: 'user@example.com',
            };
            const action = SYSTEM_ALERT_ACTION.RESOLVE;
            const transformedRequest = transformSystemAlertRequest({ user, action, row });

            expect(transformedRequest).toEqual({
                sat_id: 123,
                sat_resolved_date: '2017-06-30 00:00',
                sat_resolved_by: 456,
            });
        });

        it('should transform assign action', () => {
            const row = {
                sat_id: 123,
                sat_resolved_date: '2024-05-28',
                sat_resolved_by: 456,
                sat_assigned_to: 'user@example.com',
            };
            const action = 'other';

            const transformedRequest = transformSystemAlertRequest({ user, action, row });

            expect(transformedRequest).toEqual({
                sat_id: 123,
                sat_assigned_to: 'user@example.com',
            });
        });

        it('should transform reassign action', () => {
            const row = {
                sat_id: 123,
                sat_resolved_date: '2024-05-28',
                sat_resolved_by: 456,
                sat_assigned_to: 0,
            };
            const action = SYSTEM_ALERT_ACTION.ASSIGN;

            const transformedRequest = transformSystemAlertRequest({ user, action, row });

            expect(transformedRequest).toEqual({
                sat_id: 123,
                sat_assigned_to: null,
                sat_assigned_date: '2017-06-30 00:00',
            });
        });
    });

    describe('transformQuickLinkUpdateRequest', () => {
        const oldEnv = process.env.NODE_ENV;
        afterEach(() => {
            process.env.NODE_ENV = oldEnv;
        });

        it('should transform quick link reorder data', () => {
            const data = {
                qlk_id: 1,
                qlk_title: 'Test title',
                qlk_link: 'Test link',
                qlk_order: 3,
                extra1: 'should delete',
            };

            const transformedRequest = transformQuickLinkUpdateRequest(data);

            expect(transformedRequest).toEqual({ qlk_id: 1, qlk_title: 'Test title', qlk_link: 'Test link' });
        });

        it('should transform quick link reorder data', () => {
            const data = {
                qlk_id: 1,
                qlk_title: 'Test title',
                qlk_link: 'Test link',
                qlk_order: 3,
                extra1: 'should delete',
            };

            const transformedRequest = transformQuickLinkUpdateRequest(data);

            expect(transformedRequest).toEqual({ qlk_id: 1, qlk_title: 'Test title', qlk_link: 'Test link' });
        });

        it('should transform quick link urls', () => {
            General.IS_PRODUCTION = true;

            const data = {
                qlk_id: 1,
                qlk_title: 'Test title',
                qlk_link: `${General.STAGING_URL}/test.html`,
                qlk_order: 3,
                extra1: 'should delete',
            };

            // should convert staging to prod
            let transformedRequest = transformQuickLinkUpdateRequest(data);
            expect(transformedRequest).toEqual({
                qlk_id: 1,
                qlk_title: 'Test title',
                qlk_link: `${General.PRODUCTION_URL}/test.html`,
            });

            // should leave prod as-is
            data.qlk_link = `${General.PRODUCTION_URL}/test.html`;
            transformedRequest = transformQuickLinkUpdateRequest(data);
            expect(transformedRequest).toEqual({
                qlk_id: 1,
                qlk_title: 'Test title',
                qlk_link: `${General.PRODUCTION_URL}/test.html`,
            });

            General.IS_PRODUCTION = false;
            data.qlk_link = `${General.PRODUCTION_URL}/test.html`;
            transformedRequest = transformQuickLinkUpdateRequest(data);
            expect(transformedRequest).toEqual({
                qlk_id: 1,
                qlk_title: 'Test title',
                qlk_link: `${General.STAGING_URL}/test.html`,
            });

            // should leave prod as-is
            data.qlk_link = `${General.STAGING_URL}/test.html`;
            transformedRequest = transformQuickLinkUpdateRequest(data);
            expect(transformedRequest).toEqual({
                qlk_id: 1,
                qlk_title: 'Test title',
                qlk_link: `${General.STAGING_URL}/test.html`,
            });
        });
    });

    describe('transformQuickLinkReorderRequest', () => {
        it('should transform quick link reorder data', () => {
            const data = [
                { qlk_id: 1, qlk_order: 3, extra1: 'should delete' },
                { qlk_id: 2, qlk_order: 1, qlk_extra2: 'should delete' },
                { qlk_id: 3, qlk_order: 2, extra3: 'should delete' },
            ];

            const transformedRequest = transformQuickLinkReorderRequest(data);

            expect(transformedRequest).toEqual([
                { qlk_id: 1, qlk_order: 3 },
                { qlk_id: 2, qlk_order: 1 },
                { qlk_id: 3, qlk_order: 2 },
            ]);
        });
    });

    describe('transformUrlToPlatform', () => {
        const oldVal = General.IS_PRODUCTION;
        afterEach(() => {
            General.IS_PRODUCTION = oldVal;
        });
        it('should transform staging to prod links', () => {
            General.IS_PRODUCTION = true;
            expect(transformUrlToPlatform(`${General.STAGING_URL}/test.html`)).toEqual(
                `${General.PRODUCTION_URL}/test.html`,
            );
            expect(transformUrlToPlatform(`${General.PRODUCTION_URL}/test.html`)).toEqual(
                `${General.PRODUCTION_URL}/test.html`,
            );
            // if not staging or prod, nothing is transformed
            expect(transformUrlToPlatform('http://dev-espace.library.uq.edu.au/test.html')).toEqual(
                'http://dev-espace.library.uq.edu.au/test.html',
            );
        });
        it('should transform prod links to staging', () => {
            General.IS_PRODUCTION = false;
            expect(transformUrlToPlatform(`${General.PRODUCTION_URL}/test.html`)).toEqual(
                `${General.STAGING_URL}/test.html`,
            );
            // if not staging or prod, nothing is transformed
            expect(transformUrlToPlatform('http://dev-espace.library.uq.edu.au/test.html')).toEqual(
                'http://dev-espace.library.uq.edu.au/test.html',
            );
        });
    });
});
