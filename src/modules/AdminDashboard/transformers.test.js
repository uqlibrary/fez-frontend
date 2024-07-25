import {
    transformSystemAlertRequest,
    transformQuickLinkUpdateRequest,
    transformQuickLinkReorderRequest,
} from './transformers';

import { SYSTEM_ALERT_ACTION } from './config';

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

        it('should transform sat_assigned_to action', () => {
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
    });

    describe('transformQuickLinkUpdateRequest', () => {
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
});
