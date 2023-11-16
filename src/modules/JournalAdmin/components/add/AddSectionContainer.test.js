import AddSectionContainer, { mapStateToProps } from './AddSectionContainer';
import Immutable from 'immutable';

function setup(testProps = {}, args = {}) {
    const props = {
        ...testProps,
    };

    return renderComponent(AddSectionContainer, props, args);
}

describe('AddSectionContainer component', () => {
    it('should render default view', () => {
        const render = setup(
            {},
            { isShallow: true, requiresStore: true, store: global.setupStoreForMount(Immutable.Map({})).store },
        );
        expect(render.getRenderOutput()).toMatchSnapshot();
    });

    it('should map state to props when empty objects are passed in', () => {
        expect(mapStateToProps({}, {})).toEqual({
            disableSubmit: true,
            disabled: undefined,
            docTypeSubTypeCombo: null,
            formValues: Immutable.Map({}),
            hasDefaultDocTypeSubType: false,
            hasSubtypes: false,
            publicationSubtype: null,
            publicationSubtypeItems: [],
            subtypes: null,
        });
    });

    it('should map state to props', () => {
        const state = {
            form: {
                AdminWorkForm: {
                    values: {
                        rek_display_type: 177,
                        adminSection: {
                            rek_subtype: 'Creative Work - Textual',
                            collections: [
                                {
                                    id: 'UQ:3838',
                                    value: 'School of Languages and Cultures Publications',
                                },
                            ],
                        },
                    },
                },
            },
        };
        expect(mapStateToProps(state, { disabled: true })).toMatchSnapshot();

        // Use a doctype from NEW_DOCTYPES_OPTIONS
        state.form.AdminWorkForm.values.rek_display_type = 1005;
        expect(mapStateToProps(state, { disabled: true })).toMatchSnapshot();
    });
});
