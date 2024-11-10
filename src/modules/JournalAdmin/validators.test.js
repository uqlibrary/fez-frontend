import { validateResolver } from './validators';

describe('validateResolver', () => {
    it('should return expected results', async () => {
        await expect(
            validateResolver({
                adminSection: {
                    jnl_publisher: 'American Public Health Association',
                    jnl_title: null,
                },
            }),
        ).resolves.toStrictEqual({
            errors: {
                adminSection: {
                    jnl_title: 'Journal title is required',
                },
            },
            values: {},
        });
        await expect(
            validateResolver({
                adminSection: {
                    jnl_publisher: null,
                    jnl_title: 'A title',
                },
            }),
        ).resolves.toStrictEqual({
            errors: {
                adminSection: {
                    jnl_publisher: 'Journal publisher is required',
                },
            },
            values: {},
        });
        await expect(
            validateResolver({
                adminSection: {
                    jnl_publisher: null,
                    jnl_title: null,
                },
            }),
        ).resolves.toStrictEqual({
            errors: {
                adminSection: {
                    jnl_publisher: 'Journal publisher is required',
                    jnl_title: 'Journal title is required',
                },
            },
            values: {},
        });
        await expect(
            validateResolver({
                adminSection: {
                    jnl_publisher: 'American Public Health Association',
                    jnl_title: 'A title',
                },
            }),
        ).resolves.toStrictEqual({
            errors: {},
            values: {
                adminSection: {
                    jnl_publisher: 'American Public Health Association',
                    jnl_title: 'A title',
                },
            },
        });
    });
});
