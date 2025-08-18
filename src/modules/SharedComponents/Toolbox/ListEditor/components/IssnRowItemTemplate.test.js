import React from 'react';
import {
    IssnRowItemTemplate,
    getValidSherpa,
    getSherpaLink,
    getValidUlrichs,
    mapStateToProps,
} from './IssnRowItemTemplate';
import { rtlRender } from 'test-utils';
import { ULRICHS_URL_PREFIX } from '../../../../../config/general';

function setup(testProps = {}, renderer = rtlRender) {
    const props = {
        item: {
            key: '0000-0000',
            value: {
                sherpaRomeo: {},
                ulrichs: {},
            },
        },
        actions: {
            getSherpaFromIssn: jest.fn(),
            getUlrichsFromIssn: jest.fn(),
        },
        ...testProps,
    };
    return renderer(<IssnRowItemTemplate {...props} />);
}

describe('IssnRowItemTemplate', () => {
    describe('renderer', () => {
        let mockUseEffect;
        let actionSherpa;
        let actionUlrichs;

        beforeAll(() => {
            actionSherpa = jest.fn();
            actionUlrichs = jest.fn();
        });

        beforeEach(() => {
            mockUseEffect = jest.spyOn(React, 'useEffect');
            mockUseEffect.mockImplementation(f => f());
        });

        afterEach(() => {
            mockUseEffect.mockRestore();
            actionSherpa.mockClear();
            actionUlrichs.mockClear();
        });

        it('should render default view', () => {
            const { asFragment } = setup();
            expect(asFragment()).toMatchInlineSnapshot(`
                <DocumentFragment>
                  <span
                    class="MuiTypography-root MuiTypography-body2 css-1omq3q2-MuiTypography-root"
                  >
                    0000-0000
                  </span>
                </DocumentFragment>
            `);
        });

        it('should render a value', () => {
            const { getByTestId } = setup({
                item: {
                    key: '1234-1234',
                    value: {
                        ulrichs: {
                            link: 'http://example.com/ulrichs?id=1234',
                        },
                        sherpaRomeo: {
                            link: 'http://example.com/sherpa?issn=1234-1234',
                        },
                    },
                },
            });

            const sherpaRomeo = getByTestId('sherparomeo-link');
            expect(sherpaRomeo).toHaveTextContent('SHERPA/RoMEO');
            expect(sherpaRomeo.href).toEqual('http://example.com/sherpa?issn=1234-1234');
            expect(sherpaRomeo.title).toEqual("Check publisher's OA archiving policy");

            const ulrichs = getByTestId('ulrichs-link');
            expect(ulrichs).toHaveTextContent('Ulrichs');
            expect(ulrichs.href).toEqual('http://example.com/ulrichs?id=1234');
            expect(ulrichs.title).toEqual('Link to http://example.com/ulrichs?id=1234 will open in a new window.');
        });

        it('should skip missing ulrichs or sherparomeo', () => {
            const issn = '1235-1235';
            setup({
                item: {
                    key: issn,
                    value: {
                        ulrichs: {
                            link: '',
                        },
                        sherpaRomeo: {
                            link: '',
                        },
                    },
                },
                actions: {
                    getSherpaFromIssn: actionSherpa,
                    getUlrichsFromIssn: actionUlrichs,
                },
            });
            expect(actionSherpa).toHaveBeenCalledWith(issn);
            expect(actionUlrichs).toHaveBeenCalledWith(issn);
        });

        it('should render link data from API', () => {
            setup({
                item: {
                    key: '1234-1234',
                    value: {
                        sherpaRomeo: { link: '1234' },
                        ulrichs: { link: '1234' },
                    },
                },
                hasPreload: true,
            });
            expect(actionSherpa).toHaveBeenCalledTimes(0);
        });

        it('should attempt to get new link data after an edit', () => {
            const { rerender } = setup({
                item: {
                    key: '1234-1234',
                    value: {
                        sherpaRomeo: { link: '1234' },
                        ulrichs: { link: '1234' },
                    },
                },
                hasPreload: true,
                actions: {
                    getSherpaFromIssn: actionSherpa,
                    getUlrichsFromIssn: actionUlrichs,
                },
            });
            expect(actionSherpa).toHaveBeenCalledTimes(0);
            setup(
                {
                    item: {
                        key: '1212-1212',
                        value: {
                            sherpaRomeo: {},
                            ulrichs: {},
                        },
                    },
                    actions: {
                        getSherpaFromIssn: actionSherpa,
                        getUlrichsFromIssn: actionUlrichs,
                    },
                },
                rerender,
            );
            expect(actionSherpa).toHaveBeenCalledWith('1212-1212');
            expect(actionUlrichs).toHaveBeenCalledWith('1212-1212');
        });

        it('should render memoised component', () => {
            const { rerender } = setup({
                item: {
                    key: '1234-1234',
                    value: {
                        sherpaRomeo: { link: '1234' },
                        ulrichs: { link: '1234' },
                    },
                },
                hasPreload: false,
                actions: {
                    getSherpaFromIssn: actionSherpa,
                    getUlrichsFromIssn: actionUlrichs,
                },
            });
            expect(actionSherpa).toHaveBeenCalledWith('1234-1234');
            expect(actionUlrichs).toHaveBeenCalledWith('1234-1234');
            expect(actionSherpa).toHaveBeenCalledTimes(1);
            expect(actionUlrichs).toHaveBeenCalledTimes(1);
            actionSherpa.mockClear();
            actionUlrichs.mockClear();
            setup(
                {
                    item: {
                        key: '1234-1234',
                        value: {
                            sherpaRomeo: { link: '1234' },
                            ulrichs: { link: '1234' },
                        },
                    },
                    actions: {
                        getSherpaFromIssn: actionSherpa,
                        getUlrichsFromIssn: actionUlrichs,
                    },
                },
                rerender,
            );
            expect(actionSherpa).toHaveBeenCalledTimes(0);
            expect(actionUlrichs).toHaveBeenCalledTimes(0);
        });
    });

    describe('helpers', () => {
        const props = {
            item: '1234-0001',
        };
        it('should find valid Sherpa matches', () => {
            const expected = {
                srm_issn: props.item,
                srm_journal_name: 'Testing 1',
            };
            const sherpaRomeo = {
                [props.item]: {
                    ...expected,
                },
                '1234-0002': {
                    srm_issn: '1234-0003',
                },
            };

            const item1 = props.item;
            expect(getValidSherpa(sherpaRomeo, item1)).toEqual(expected);

            const item2 = '1234-0002';
            expect(getValidSherpa(sherpaRomeo, item2)).toEqual(false);
        });

        it('should use a fallback link for Sherpa Romeo', () => {
            const sherpaData = {
                srm_colour: 'green',
                srm_journal_name: 'Testing',
                srm_journal_link: '',
                srm_issn: '1234-5678',
            };
            expect(getSherpaLink(sherpaData)).toBe('https://www.sherpa.ac.uk/romeo/search.php?issn=1234-5678');

            sherpaData.srm_colour = 'gray';
            expect(getSherpaLink(sherpaData)).toBe('');

            sherpaData.srm_journal_link = 'http://example.com';
            expect(getSherpaLink(sherpaData)).toBe('http://example.com');
        });

        it('should find valid Ulrichs matches', () => {
            const expected = {
                ulr_issn: props.item,
                ulr_title: 'Testing 1',
            };
            const ulrichsData = {
                [props.item]: {
                    ...expected,
                },
                '1234-0002': {
                    ulr_issn: '1234-0002',
                    ulr_title: '',
                },
            };

            const item1 = props.item;
            expect(getValidUlrichs(ulrichsData, item1)).toEqual(expected);

            const item2 = '1234-0002';
            expect(getValidUlrichs(ulrichsData, item2)).toEqual(false);

            const item3 = '1234-0003';
            expect(getValidUlrichs(ulrichsData, item3)).toBe(undefined);
        });

        describe('mapStateToProps', () => {
            const stateObj = {
                sherpaLoadFromIssnError: {},
                sherpaRomeo: {},
                ulrichs: {},
                ulrichsLoadFromIssnError: {},
            };

            const sherpaLink = 'http://v2.sherpa.ac.uk/id/publication/9999999';
            const ulrichsTitleId = '12345678';

            it('should return props for initial render', () => {
                const state = {
                    get: () => stateObj,
                };
                expect(mapStateToProps(state, props)).toEqual({
                    hasPreload: false,
                    item: {
                        key: props.item,
                        value: {
                            sherpaRomeo: {
                                link: '',
                            },
                            ulrichs: {
                                link: '',
                                title: '',
                            },
                        },
                    },
                });
            });

            it('should return props after api return', () => {
                const state = {
                    get: () => ({
                        ...stateObj,
                        sherpaRomeo: {
                            [props.item]: {
                                srm_issn: props.item,
                                srm_journal_name: 'Testing 1',
                                srm_journal_link: sherpaLink,
                            },
                        },
                        ulrichs: {
                            [props.item]: {
                                ulr_issn: props.item,
                                ulr_title: 'Testing 2',
                                ulr_title_id: ulrichsTitleId,
                            },
                        },
                    }),
                };
                expect(mapStateToProps(state, props)).toEqual({
                    hasPreload: false,
                    item: {
                        key: props.item,
                        value: {
                            sherpaRomeo: {
                                link: sherpaLink,
                            },
                            ulrichs: {
                                link: `${ULRICHS_URL_PREFIX}${ulrichsTitleId}`,
                                title: 'Testing 2',
                            },
                        },
                    },
                });
            });

            it('should render props for empty Ulrichs title', () => {
                const state = {
                    get: () => ({
                        ...stateObj,
                        ulrichs: {
                            [props.item]: {
                                ulr_issn: props.item,
                                ulr_title_id: ulrichsTitleId,
                            },
                        },
                    }),
                };
                expect(mapStateToProps(state, props)).toEqual({
                    hasPreload: false,
                    item: {
                        key: props.item,
                        value: {
                            sherpaRomeo: {
                                link: '',
                            },
                            ulrichs: {
                                link: `${ULRICHS_URL_PREFIX}${ulrichsTitleId}`,
                                title: '',
                            },
                        },
                    },
                });
            });

            it('should return props for an entry marked "Not found in Sherpa Romeo"', () => {
                const state = {
                    get: () => ({
                        ...stateObj,
                        sherpaRomeo: {
                            [props.item]: {
                                srm_issn: props.item,
                                srm_journal_name: 'Not found in Sherpa Romeo',
                                srm_colour: 'Not found in Sherpa Romeo',
                                srm_journal_link: null,
                                srm_json: null,
                            },
                        },
                        ulrichs: {},
                    }),
                };
                expect(mapStateToProps(state, props)).toEqual({
                    hasPreload: false,
                    item: {
                        key: props.item,
                        value: {
                            sherpaRomeo: {
                                link: '',
                            },
                            ulrichs: {
                                link: '',
                                title: '',
                            },
                        },
                    },
                });
            });

            it('should return props for preloaded data', () => {
                const state = {
                    get: () => stateObj,
                };
                const preloadedProps = {
                    item: {
                        key: props.item,
                        value: {
                            fez_sherpa_romeo: {
                                srm_issn: props.item,
                                srm_journal_link: sherpaLink,
                                srm_journal_name: 'Testing 1',
                            },
                            fez_ulrichs: {
                                ulr_issn: props.item,
                                ulr_title_id: ulrichsTitleId,
                                ulr_title: 'Testing 2',
                            },
                        },
                        hasPreload: true,
                    },
                };
                expect(mapStateToProps(state, preloadedProps)).toEqual({
                    hasPreload: true,
                    item: {
                        key: props.item,
                        value: {
                            sherpaRomeo: {
                                link: sherpaLink,
                            },
                            ulrichs: {
                                link: `${ULRICHS_URL_PREFIX}${ulrichsTitleId}`,
                                title: 'Testing 2',
                            },
                        },
                    },
                });
            });
        });
    });
});
