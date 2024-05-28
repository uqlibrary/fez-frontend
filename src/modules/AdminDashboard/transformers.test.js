import { transformSystemAlertRequest, transformQuickLinkReorderRequest } from './transformers';

describe('transformers', () => {
    describe('transformSystemAlertRequest', () => {
        it('should transform resolve action', () => {
            const row = {
                id: 123,
                resolved_date: '2024-05-28',
                resolved_id: 456,
                assigned_to: 'user@example.com',
            };
            const action = 'resolve';

            const transformedRequest = transformSystemAlertRequest(action, row);

            expect(transformedRequest).toEqual({
                id: 123,
                resolved_date: '2024-05-28',
                resolved_id: 456,
            });
        });

        it('should transform assigned_to action', () => {
            const row = {
                id: 123,
                resolved_date: '2024-05-28',
                resolved_id: 456,
                assigned_to: 'user@example.com',
            };
            const action = 'other';

            const transformedRequest = transformSystemAlertRequest(action, row);

            expect(transformedRequest).toEqual({
                id: 123,
                assigned_to: 'user@example.com',
            });
        });
    });

    describe('transformQuickLinkReorderRequest', () => {
        it('should transform quick link reorder data', () => {
            const data = [
                { id: 1, order: 3, extra1: 'should delete' },
                { id: 2, order: 1, extra2: 'should delete' },
                { id: 3, order: 2, extra3: 'should delete' },
            ];

            const transformedRequest = transformQuickLinkReorderRequest(data);

            expect(transformedRequest).toEqual([
                { id: 1, order: 3 },
                { id: 2, order: 1 },
                { id: 3, order: 2 },
            ]);
        });
    });
});
