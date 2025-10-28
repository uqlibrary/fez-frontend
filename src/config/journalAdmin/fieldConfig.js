import Immutable from 'immutable';
import { validation } from 'config';
import locale from 'locale/components';
import { IssnForm, NewListEditorField } from 'modules/SharedComponents/Toolbox/ListEditor';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { IssnRowItemTemplate } from 'modules/SharedComponents/Toolbox/ListEditor';

import { default as InfoSection } from 'modules/ViewJournal/components/Section';
import { getAbbrevTitle, viewJournalConfig } from 'config/viewJournal';
import AdvisoryStatementFields from 'modules/JournalAdmin/components/AdvisoryStatementFields';

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
        refereed: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_refereed',
                name: 'adminSection.refereed',
                fullWidth: true,
                label: 'Refereed',
                placeholder: '',
                disabled: true,
                inputProps: { readOnly: true },
                required: false,
            },
        },
        publicationYear: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_publication_year',
                name: 'adminSection.publicationYear',
                fullWidth: true,
                label: 'First year of publication',
                placeholder: '',
                disabled: true,
                inputProps: { readOnly: true },
                required: false,
            },
        },
        publicationFrequency: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_publication_frequency',
                name: 'adminSection.publicationFrequency',
                fullWidth: true,
                label: 'Frequency of publication',
                placeholder: '',
                disabled: true,
                inputProps: { readOnly: true },
                required: false,
            },
        },
        publicationFormats: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_formats',
                name: 'adminSection.publicationFormats',
                fullWidth: true,
                label: 'Journal formats available',
                placeholder: '',
                disabled: true,
                inputProps: { readOnly: true },
                required: false,
            },
        },
        description: {
            component: GenericTextField,
            componentProps: {
                name: 'adminSection.description',
                label: 'Description',
                fullWidth: true,
                multiline: true,
                rows: 3,
                textFieldId: 'jnl_description',
                disabled: true,
                inputProps: { readOnly: true },
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
        readAndPublish: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'readAndPublish',
                name: 'readAndPublishSection',
                sectionConfig: viewJournalConfig.readAndPublish,
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
