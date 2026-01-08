import Immutable from 'immutable';
import { validation } from 'config';
import locale from 'locale/components';
import { BOOLEAN_OPTIONS, CAPPED_OPTIONS, S2O_OPTIONS } from 'config/general';
import { journalAdminFields } from 'locale/journalAdminFields';
import { IssnForm, NewListEditorField, IssnRowItemTemplate } from 'modules/SharedComponents/Toolbox/ListEditor';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { default as InfoSection } from 'modules/ViewJournal/components/Section';
import { getAbbrevTitle, viewJournalConfig } from 'config/viewJournal';
import AdvisoryStatementFields from 'modules/JournalAdmin/components/AdvisoryStatementFields';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';

export default {
    default: {
        jnl_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_title',
                name: 'adminSection.jnl_title',
                fullWidth: true,
                label: 'Title',
                placeholder: '',
                required: true,
            },
        },
        jnl_abbrev_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_abbrev_title',
                name: 'adminSection.jnl_abbrev_title',
                fullWidth: true,
                label: 'ISO abbreviated title',
                placeholder: '',
                required: false,
            },
        },
        jnl_publisher: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_publisher',
                name: 'adminSection.jnl_publisher',
                fullWidth: true,
                label: 'Publisher',
                placeholder: '',
                required: true,
            },
        },
        jnl_is_refereed: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'adminSection.jnl_is_refereed',
                genericSelectFieldId: 'jnl_is_refereed',
                fullWidth: true,
                itemsList: BOOLEAN_OPTIONS,
                ...journalAdminFields.refereed,
            },
        },
        jnl_start_year: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_start_year',
                name: 'adminSection.jnl_start_year',
                fullWidth: true,
                label: 'First year of publication',
                placeholder: '',
                required: false,
            },
        },
        jnl_frequency: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_frequency',
                name: 'adminSection.jnl_frequency',
                fullWidth: true,
                label: 'Frequency of publication',
                placeholder: '',
                required: false,
            },
        },
        jnl_formats: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_formats',
                name: 'adminSection.jnl_formats',
                fullWidth: true,
                label: 'Journal formats available',
                placeholder: '',
                required: false,
            },
        },
        jnl_description: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_description',
                name: 'adminSection.jnl_description',
                label: 'Description',
                fullWidth: true,
                multiline: true,
                rows: 3,
                required: false,
            },
        },
        advisoryStatement: {
            composed: true,
            component: AdvisoryStatementFields,
            componentProps: {
                type: {
                    name: 'adminSection.advisoryStatement.type',
                    floatingLabelText: 'Advisory statement Type / default statement',
                    id: 'jnl_advisory_statement_type',
                    required: false,
                },
                text: {
                    name: 'adminSection.advisoryStatement.text',
                    title: 'Advisory statement',
                    titleProps: {
                        variant: 'caption',
                        style: {
                            opacity: 0.666,
                        },
                    },
                    height: 100,
                    format: value => Immutable.Map(value),
                    richEditorId: 'jnl-advisory-statement',
                    canEdit: true,
                    required: false,
                    noRef: true,
                },
            },
        },
        issns: {
            component: NewListEditorField,
            componentProps: {
                remindToAdd: true,
                name: 'bibliographicSection.issns',
                isValid: validation.isValidIssn,
                listEditorId: 'jnl_issn_jid',
                locale: locale.components.issnForm.field,
                inputNormalizer: value => {
                    const newValue = value.replace('-', '');
                    return newValue.length >= 5 ? [newValue.slice(0, 4), '-', newValue.slice(4)].join('') : newValue;
                },
                canAdd: true,
                canEdit: true,
                ListEditorForm: IssnForm,
                rowItemTemplate: IssnRowItemTemplate,
                ListEditorItemTemplate: IssnRowItemTemplate,
                getItemSelectedToEdit: (list, index) =>
                    (!!list[index] && !!list[index].key && list[index].key) || list[index] || null,
                required: false,
                noRef: true,
            },
        },
        readAndPublishPublisher: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_read_and_publish_publisher',
                name: 'readAndPublishSection.readAndPublishPublisher',
                fullWidth: true,
                label: 'Publisher',
                placeholder: '',
                required: false,
            },
        },
        capped: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'readAndPublishSection.capped',
                genericSelectFieldId: 'jnl_read_and_publish_is_capped',
                itemsList: CAPPED_OPTIONS,
                ...journalAdminFields.capped,
            },
        },
        discounted: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'readAndPublishSection.discounted',
                genericSelectFieldId: 'jnl_read_and_publish_is_discounted',
                itemsList: BOOLEAN_OPTIONS,
                ...journalAdminFields.discounted,
            },
        },
        s2o: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'readAndPublishSection.s2o',
                genericSelectFieldId: 'jnl_read_and_publish_is_s2o',
                itemsList: S2O_OPTIONS,
                ...journalAdminFields.s2o,
            },
        },
        readAndPublishLastUpdated: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_read_and_publish_source_date',
                name: 'readAndPublishSection.readAndPublishLastUpdated',
                fullWidth: true,
                label: 'Last updated date',
                placeholder: '',
                required: false,
                disabled: true,
            },
        },
        uqData: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'uqData',
                name: 'uqDataSection',
                sectionConfig: viewJournalConfig.uqConnections,
                wrapped: false,
                noRef: true,
            },
        },
        doaj: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'doaj',
                name: 'doajSection',
                sectionConfig: viewJournalConfig.doaj,
                wrapped: false,
                noRef: true,
            },
        },
        listed: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'listed',
                name: 'listedSection',
                sectionConfig: viewJournalConfig.listed,
                wrapped: false,
                noRef: true,
            },
        },
    },
    override: {
        ['adminjournal']: {
            jnl_abbrev_title: ({ journalDetails }) => ({
                placeholder: journalDetails ? getAbbrevTitle(journalDetails) : '',
            }),
        },
    },
};
