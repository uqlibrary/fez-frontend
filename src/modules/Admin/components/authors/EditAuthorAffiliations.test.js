import React from 'react';
import EditAuthorAffiliations, { actionHandler } from './EditAuthorAffiliations';
import { render, WithReduxStore } from 'test-utils';
import locale from 'locale/components';
import { NON_HERDC_ID, ACTIONS } from 'helpers/authorAffiliations';
import * as OrgActions from 'actions/organisationalUnits';

const defaultReducerState = {
    organisationalUnitsReducer: {
        organisationUnits: null,
        organisationUnitsLoaded: false,
        organisationUnitsLoading: false,
        organisationUnitsFailed: false,
    },
    suggestedOrganisationalUnitsReducer: {
        suggestedAuthorId: null,
        suggestedOrganisationUnits: null,
        suggestedOrganisationUnitsLoaded: false,
        suggestedOrganisationUnitsLoading: false,
        suggestedOrganisationUnitsFailed: false,
    },
};

function setup(props = {}, initialState = {}, renderMethod = render) {
    const tempLocale = locale.components.authorsList('');
    const {
        field: {
            form: {
                locale: { affiliations: affiliationsLocale },
            },
        },
    } = tempLocale;

    const testProps = {
        rowData: {},
        locale: affiliationsLocale,
        onChange: jest.fn(),
        setEditing: jest.fn(),
        ...props,
    };
    const state = {
        ...defaultReducerState,
        ...initialState,
    };

    return renderMethod(
        <WithReduxStore initialState={{ ...state }}>
            <EditAuthorAffiliations {...testProps} />
        </WithReduxStore>,
    );
}

describe('EditAuthorAffiliations', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
    });

    it('renders', () => {
        const { getByTestId } = setup();
        expect(getByTestId('affiliationCancelBtn')).toBeInTheDocument();
        expect(getByTestId('affiliationSaveBtn')).toBeInTheDocument();
    });

    it('renders a loading message and call API', async () => {
        const rowData = { aut_id: 3 };

        const loadOrganisationalUnitsFn = jest.spyOn(OrgActions, 'loadOrganisationalUnits');
        const loadSuggestedOrganisationalUnitsFn = jest.spyOn(OrgActions, 'loadSuggestedOrganisationalUnitByAuthorId');

        // first pass, loading show be shown
        const { getByText, queryByText, rerender } = setup({
            rowData,
        });

        expect(loadOrganisationalUnitsFn).toHaveBeenCalled();
        expect(loadSuggestedOrganisationalUnitsFn).toHaveBeenCalledWith(3);

        setup(
            { rowData },
            {
                organisationalUnitsReducer: {
                    ...defaultReducerState.organisationalUnitsReducer,
                    organisationUnitsLoading: true,
                },
            },
            rerender,
        );

        expect(getByText('Loading Organisational Units')).toBeInTheDocument();

        // second pass, when orgs have loaded but suggested orgs havent yet
        // loading message should still be visible
        setup(
            { rowData },
            {
                organisationalUnitsReducer: {
                    ...defaultReducerState.organisationalUnitsReducer,
                    organisationUnits: [],
                    organisationUnitsLoaded: true,
                    organisationUnitsLoading: false,
                },
                suggestedOrganisationalUnitsReducer: {
                    ...defaultReducerState.suggestedOrganisationalUnitsReducer,
                    suggestedOrganisationUnitsLoading: true,
                },
            },
            rerender,
        );
        expect(getByText('Loading Organisational Units')).toBeInTheDocument();

        // third pass, when suggested orgs have loaded.
        // No message should be shown now.
        setup(
            { rowData },
            {
                organisationalUnitsReducer: {
                    ...defaultReducerState.organisationalUnitsReducer,
                    organisationUnits: [],
                    organisationUnitsLoaded: true,
                    organisationUnitsLoading: false,
                },
                suggestedOrganisationalUnitsReducer: {
                    ...defaultReducerState.suggestedOrganisationalUnitsReducer,
                    suggestedAuthorId: 3,
                    suggestedOrganisationUnits: [],
                    suggestedOrganisationUnitsLoading: false,
                    suggestedOrganisationUnitsLoaded: true,
                },
            },
            rerender,
        );
        expect(queryByText('Loading Organisational Units')).not.toBeInTheDocument();

        // fourth pass, when loading a different author
        // Should call the api again
        setup(
            { rowData: { aut_id: 4 } },
            {
                organisationalUnitsReducer: {
                    ...defaultReducerState.organisationalUnitsReducer,
                    organisationUnits: [],
                    organisationUnitsLoaded: true,
                    organisationUnitsLoading: false,
                },
                suggestedOrganisationalUnitsReducer: {
                    ...defaultReducerState.suggestedOrganisationalUnitsReducer,
                    suggestedAuthorId: 3,
                    suggestedOrganisationUnits: [],
                    suggestedOrganisationUnitsLoading: false,
                    suggestedOrganisationUnitsLoaded: true,
                },
            },
            rerender,
        );
        expect(loadSuggestedOrganisationalUnitsFn).toHaveBeenCalledWith(4);
        expect(getByText('Loading Organisational Units')).toBeInTheDocument();
    });

    it('renders two affiliation rows and recalculates %', async () => {
        const organisationalUnitList = {
            organisationUnits: [
                {
                    org_id: 1,
                    org_extdb_name: 'hr',
                    org_extdb_id: 1,
                    org_ext_table: null,
                    org_title: 'Test organisation',
                    org_is_current: 1,
                    org_desc: null,
                    org_image_filename: null,
                },
            ],
            organisationUnitsLoaded: true,
            organisationUnitsLoading: false,
            organisationUnitsFailed: false,
        };
        const suggestedOrganisationalUnitList = {
            suggestedAuthorId: 88844,
            suggestedOrganisationUnits: [
                {
                    aut_id: 88844,
                    org_title: 'Test suggested organisation',
                    org_id: 2,
                },
            ],
            suggestedOrganisationUnitsLoaded: true,
            suggestedOrganisationUnitsLoading: false,
            suggestedOrganisationUnitsFailed: false,
        };
        const rowData = {
            creatorRole: '',
            uqIdentifier: '88844',
            aut_display_name: 'Robertson, Avril A. B. Not 100%',
            affiliation: 'NotUQ',
            aut_org_username: 'uqarob15',
            nameAsPublished: 'Robertson, Avril A. B. not 100%',
            uqUsername: 'uqarob15',
            aut_student_username: '',
            aut_id: 88844,
            orgaff: 'University of Queensland',
            orgtype: '',
            affiliations: [
                {
                    af_id: 478894,
                    af_pid: 'UQ:871c1f8',
                    af_author_id: 88844,
                    af_percent_affiliation: 50000,
                    af_org_id: 1,
                    af_status: 1,
                    fez_author: {
                        aut_id: 88844,
                        aut_display_name: 'Robertson, Avril A. B.',
                    },
                    fez_org_structure: {
                        org_id: 1,
                        org_title: 'Test organisation',
                    },
                },
                {
                    af_id: 478895,
                    af_pid: 'UQ:871c1f8',
                    af_author_id: 88844,
                    af_percent_affiliation: 40000,
                    af_org_id: 2,
                    af_status: 1,
                    fez_author: {
                        aut_id: 88844,
                        aut_display_name: 'Robertson, Avril A. B.',
                    },
                    fez_org_structure: {
                        org_id: 2,
                        org_title: 'Test suggested organisation',
                    },
                },
            ],
            id: 6,
        };

        const { getByTestId } = setup(
            {
                rowData,
            },
            {
                organisationalUnitsReducer: { ...organisationalUnitList },
                suggestedOrganisationalUnitsReducer: { ...suggestedOrganisationalUnitList },
            },
        );

        expect(getByTestId('orgChip-1')).toHaveTextContent('50%');
        expect(getByTestId('orgChip-2')).toHaveTextContent('50%');

        expect(getByTestId('orgSelect-1-input')).toHaveValue('Test organisation');
        expect(getByTestId('orgSelect-2-input')).toHaveValue('Test suggested organisation');

        expect(getByTestId('affiliationCancelBtn')).toBeInTheDocument();
        expect(getByTestId('affiliationSaveBtn')).toBeInTheDocument();
    });

    it('renders Non-HERDC affiliation rows and recalculates %', async () => {
        const onChange = jest.fn();
        const setEditing = jest.fn();

        const organisationalUnitList = {
            organisationUnits: [
                {
                    org_id: NON_HERDC_ID,
                    org_extdb_name: 'hr',
                    org_extdb_id: 1,
                    org_ext_table: null,
                    org_title: 'NON-HERDC',
                    org_is_current: 1,
                    org_desc: null,
                    org_image_filename: null,
                },
            ],
            organisationUnitsLoaded: true,
            organisationUnitsLoading: false,
            organisationUnitsFailed: false,
        };
        const suggestedOrganisationalUnitList = {
            suggestedAuthorId: 88844,
            suggestedOrganisationUnits: [
                {
                    aut_id: 88844,
                    org_title: 'First suggested organisation',
                    org_id: 2,
                },
            ],
            suggestedOrganisationUnitsLoaded: true,
            suggestedOrganisationUnitsLoading: false,
            suggestedOrganisationUnitsFailed: false,
        };
        const rowData = {
            creatorRole: '',
            uqIdentifier: '88844',
            aut_display_name: 'Robertson, Avril A. B. Not 100%',
            affiliation: 'NotUQ',
            aut_org_username: 'uqarob15',
            nameAsPublished: 'Robertson, Avril A. B. not 100%',
            uqUsername: 'uqarob15',
            aut_student_username: '',
            aut_id: 88844,
            orgaff: 'University of Queensland',
            orgtype: '',
            affiliations: [
                {
                    af_id: 478894,
                    af_pid: 'UQ:871c1f8',
                    af_author_id: 88844,
                    af_percent_affiliation: 50000,
                    af_org_id: NON_HERDC_ID,
                    af_status: 1,
                    fez_author: {
                        aut_id: 88844,
                        aut_display_name: 'Robertson, Avril A. B.',
                    },
                    fez_org_structure: {
                        org_id: NON_HERDC_ID,
                        org_title: '!NON-HERDC',
                    },
                },
                {
                    af_id: 478895,
                    af_pid: 'UQ:871c1f8',
                    af_author_id: 88844,
                    af_percent_affiliation: 50000,
                    af_org_id: 2,
                    af_status: 1,
                    fez_author: {
                        aut_id: 88844,
                        aut_display_name: 'Robertson, Avril A. B.',
                    },
                    fez_org_structure: {
                        org_id: 2,
                        org_title: 'First suggested organisation',
                    },
                },
            ],
            id: 6,
        };

        const { getByTestId } = setup(
            {
                rowData,
                onChange,
                setEditing,
            },
            {
                organisationalUnitsReducer: { ...organisationalUnitList },
                suggestedOrganisationalUnitsReducer: { ...suggestedOrganisationalUnitList },
            },
        );

        expect(getByTestId(`orgChip-${NON_HERDC_ID}`)).toHaveTextContent('100%'); // code should recalc the non herdc entry to 100%
        expect(getByTestId('orgChip-2')).toHaveTextContent('0%'); // code should recalc the other org to 0%
        expect(getByTestId(`orgSelect-${NON_HERDC_ID}-input`)).toHaveValue('NON-HERDC');
        expect(getByTestId('orgSelect-2-input')).toHaveValue('First suggested organisation');

        expect(getByTestId('affiliationCancelBtn')).toBeInTheDocument();
        expect(getByTestId('affiliationSaveBtn')).toBeInTheDocument();
        getByTestId('affiliationSaveBtn').click();

        expect(onChange).toHaveBeenCalled();
        expect(setEditing).toHaveBeenCalledWith(expect.objectContaining({ editing: false }));
    });

    describe('actionHandler', () => {
        it('handles change action', () => {
            const dispatchFn = jest.fn();
            const currentAffiliation = {
                af_org_id: 1,
                fez_org_structure: {
                    org_id: 1,
                    org_name: 'Test Name',
                },
            };
            const organisation = {
                org_id: 2,
                org_name: 'Updated Name',
            };
            actionHandler[ACTIONS.CHANGE](dispatchFn, currentAffiliation, organisation);
            expect(dispatchFn).toHaveBeenCalledWith({
                type: ACTIONS.CHANGE,
                affiliation: {
                    af_org_id: 2,
                    fez_org_structure: {
                        org_id: 2,
                        org_name: 'Updated Name',
                    },
                },
            });
        });

        it('handles delete action', () => {
            const dispatchFn = jest.fn();
            actionHandler[ACTIONS.DELETE](dispatchFn, 2);
            expect(dispatchFn).toHaveBeenCalledWith({
                type: ACTIONS.DELETE,
                index: 2,
            });
        });

        it('handles add action', () => {
            const dispatchFn = jest.fn();
            const rowData = {
                aut_id: 1,
                aut_display_name: 'Test author',
            };
            const organisation = {
                org_id: 2,
                org_name: 'Test organisation',
            };
            actionHandler[ACTIONS.ADD](dispatchFn, rowData, organisation);
            expect(dispatchFn).toHaveBeenCalledWith({
                type: ACTIONS.ADD,
                affiliation: expect.objectContaining({
                    af_author_id: 1,
                    af_org_id: 2,
                    af_status: 1,
                    fez_author: {
                        aut_display_name: 'Test author',
                        aut_id: 1,
                    },
                    fez_org_structure: {
                        org_id: 2,
                        org_name: 'Test organisation',
                    },
                }),
            });
        });

        it('handled non-HERDC action', () => {
            const dispatchFn = jest.fn();
            const rowData = {
                aut_id: 1,
                aut_display_name: 'Test author',
            };
            const organisation = {
                org_id: 2,
                org_name: 'Test organisation',
            };
            const suggestedOrganisation = {
                org_id: 3,
                org_name: 'Suggested organisation',
            };
            actionHandler[ACTIONS.NONHERDC](dispatchFn, rowData, organisation, suggestedOrganisation);
            expect(dispatchFn).toHaveBeenCalledWith({
                nonHerdcAffiliation: expect.objectContaining({
                    af_author_id: 1,
                    af_org_id: 2,
                    af_status: 1,
                    fez_author: {
                        aut_display_name: 'Test author',
                        aut_id: 1,
                    },
                    fez_org_structure: {
                        org_id: 2,
                        org_name: 'Test organisation',
                    },
                }),
                suggestedAffiliation: expect.objectContaining({
                    af_author_id: 1,
                    af_org_id: 3,
                    af_status: 1,
                    fez_author: {
                        aut_display_name: 'Test author',
                        aut_id: 1,
                    },
                    fez_org_structure: {
                        org_id: 3,
                        org_name: 'Suggested organisation',
                    },
                }),
                type: 'nonherdc',
            });
        });
    });
});
