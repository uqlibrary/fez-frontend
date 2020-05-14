import {
    IssnRowItemTemplate,
    getValidSherpa,
    getSherpaLink,
    getValidUlrichs,
    mapStateToProps,
} from './IssnRowItemTemplate';
import React from 'react';

function setup(testProps = {}, args = { isShallow: true }) {
    const props = {
        item: {},
        actions: {
            getSherpaFromIssn: jest.fn(),
            getUlrichsFromIssn: jest.fn(),
        },
        classes: {},
        ...testProps,
    };
    return getElement(IssnRowItemTemplate, props, args);
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
            const wrapper = setup({});
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render a value', () => {
            const wrapper = setup({
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
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should skip missing ulrichs or sherparomeo', () => {
            const issn = '1235-1235';
            const wrapper = setup({
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
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(actionSherpa).toHaveBeenCalledWith(issn);
            expect(actionUlrichs).toHaveBeenCalledWith(issn);
        });

        it('should render link data from API', () => {
            const wrapper = setup({
                item: {
                    key: '1234-1234',
                    value: {
                        sherpaRomeo: { link: '1234' },
                        ulrichs: { link: '1234' },
                    },
                },
            });
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should attempt to get new link data after an edit', () => {
            const wrapper = setup({
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
            });
            wrapper.setProps({
                item: {
                    key: '1212-1212',
                },
            });
            expect(actionSherpa).toHaveBeenCalledWith('1212-1212');
            expect(actionUlrichs).toHaveBeenCalledWith('1212-1212');
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
                    srm_issn: '1234-0002',
                    srm_journal_name: '',
                },
                '1234-0003': {
                    srm_issn: '1234-0003',
                    srm_journal_name: 'Not found in Sherpa Romeo',
                },
            };

            const item1 = props.item;
            expect(getValidSherpa(sherpaRomeo, item1)).toEqual(expected);

            const item2 = '1234-0002';
            expect(getValidSherpa(sherpaRomeo, item2)).toEqual(false);

            const item3 = '1234-0003';
            expect(getValidSherpa(sherpaRomeo, item3)).toBe(false);
        });

        it('should use a fallback link for Sherpa Romeo', () => {
            expect(getSherpaLink()).toBe('');

            const sherpaData = {
                srm_colour: 'green',
                srm_journal_link: '',
                srm_issn: '1234-5678',
            };
            expect(getSherpaLink(sherpaData)).toBe('http://www.sherpa.ac.uk/romeo/search.php?issn=1234-5678');

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

        it('should mapStateToProps', () => {
            const stateObj = {
                sherpaLoadFromIssnError: {},
                sherpaRomeo: {},
                ulrichs: {},
                ulrichsLoadFromIssnError: {},
            };

            const recordToView = {
                fez_record_search_key_issn: [],
            };

            // On initial render
            const state1 = {
                get: key =>
                    key === 'issnLinksReducer'
                        ? stateObj
                        : {
                            recordToView,
                        },
            };
            expect(mapStateToProps(state1, props)).toEqual({
                hasPreload: false,
                item: {
                    key: props.item,
                    value: {
                        sherpaRomeo: {},
                        ulrichs: {},
                    },
                },
                loadingSherpaFromIssn: false,
                loadingUlrichsFromIssn: false,
            });

            // After api return
            const sherpaLink = 'http://v2.sherpa.ac.uk/id/publication/9999999';
            const ulrichsLinkPrefix =
                'http://ezproxy.library.uq.edu.au/login?url=http://ulrichsweb.serialssolutions.com/title/';
            const ulrichsTitleId = '12345678';
            const state2 = {
                get: key => {
                    switch (key) {
                        case 'issnLinksReducer':
                            return {
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
                            };

                        case 'viewRecordReducer':
                            return {
                                recordToView,
                            };
                        default:
                            break;
                    }
                    return {};
                },
            };
            expect(mapStateToProps(state2, props)).toEqual({
                hasPreload: false,
                item: {
                    key: props.item,
                    value: {
                        sherpaRomeo: {
                            link: sherpaLink,
                        },
                        ulrichs: {
                            link: `${ulrichsLinkPrefix}${ulrichsTitleId}`,
                            title: 'Testing 2',
                        },
                    },
                },
                loadingSherpaFromIssn: false,
                loadingUlrichsFromIssn: false,
            });

            // Empty Ulrichs title
            const state3 = {
                get: key => {
                    switch (key) {
                        case 'issnLinksReducer':
                            return {
                                ...stateObj,
                                ulrichs: {
                                    [props.item]: {
                                        ulr_issn: props.item,
                                        ulr_title_id: ulrichsTitleId,
                                    },
                                },
                            };

                        case 'viewRecordReducer':
                            return {
                                recordToView,
                            };
                        default:
                            break;
                    }
                    return {};
                },
            };
            expect(mapStateToProps(state3, props)).toEqual({
                hasPreload: false,
                item: {
                    key: props.item,
                    value: {
                        sherpaRomeo: {},
                        ulrichs: {
                            link: `${ulrichsLinkPrefix}${ulrichsTitleId}`,
                            title: '',
                        },
                    },
                },
                loadingSherpaFromIssn: false,
                loadingUlrichsFromIssn: false,
            });

            // With preloaded data
            const recordWithIssnData = {
                fez_record_search_key_issn: [
                    {
                        rek_issn: props.item,
                        fez_sherpa_romeo: {
                            srm_issn: props.item,
                            srm_journal_link: sherpaLink,
                        },
                        fez_ulrichs: {
                            ulr_issn: props.item,
                            ulr_title_id: ulrichsTitleId,
                        },
                    },
                ],
            };
            const state4 = {
                get: key =>
                    key === 'issnLinksReducer'
                        ? stateObj
                        : {
                            recordToView: recordWithIssnData,
                        },
            };
            const resolvedItem = {
                key: props.item,
                value: {
                    sherpaRomeo: {
                        link: sherpaLink,
                    },
                    ulrichs: {
                        link: `${ulrichsLinkPrefix}${ulrichsTitleId}`,
                        title: '',
                    },
                },
            };
            expect(mapStateToProps(state4, props)).toEqual({
                hasPreload: true,
                item: resolvedItem,
                loadingSherpaFromIssn: false,
                loadingUlrichsFromIssn: false,
            });

            // After reorder
            const fullItemProps = { item: resolvedItem };
            expect(mapStateToProps(state4, fullItemProps)).toEqual({
                hasPreload: true,
                item: resolvedItem,
                loadingSherpaFromIssn: false,
                loadingUlrichsFromIssn: false,
            });

            // With empty preloaded data
            const state5 = {
                get: key =>
                    key === 'issnLinksReducer'
                        ? stateObj
                        : {
                            recordToView: {
                                fez_record_search_key_issn: [
                                    {
                                        rek_issn: props.item,
                                    },
                                ],
                            },
                        },
            };
            expect(mapStateToProps(state5, props)).toEqual({
                hasPreload: true,
                item: {
                    key: props.item,
                    value: {
                        sherpaRomeo: {
                            link: '',
                        },
                        ulrichs: {
                            title: '',
                        },
                    },
                },
                loadingSherpaFromIssn: false,
                loadingUlrichsFromIssn: false,
            });

            // For a new record
            const state6 = {
                get: key => (key === 'issnLinksReducer' ? stateObj : {}),
            };
            expect(mapStateToProps(state6, props)).toEqual({
                hasPreload: false,
                item: {
                    key: props.item,
                    value: {
                        sherpaRomeo: {
                            link: '',
                        },
                        ulrichs: {
                            title: '',
                        },
                    },
                },
                loadingSherpaFromIssn: false,
                loadingUlrichsFromIssn: false,
            });
        });
    });
});
