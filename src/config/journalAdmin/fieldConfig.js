/* eslint-disable max-len */
import Immutable from 'immutable';
import { validation } from 'config';
import locale from 'locale/components';
import { IssnForm, NewListEditorField } from 'modules/SharedComponents/Toolbox/ListEditor';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { IssnRowItemTemplate } from 'modules/SharedComponents/Toolbox/ListEditor';

import { default as InfoSection } from 'modules/ViewJournal/components/Section';
import { viewJournalConfig } from 'config/viewJournal';

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
        abbreviatedTitle: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_jcr_scie_abbrev_title',
                name: 'adminSection.abbreviatedTitle',
                fullWidth: true,
                label: 'ISO abbreviated title',
                placeholder: '',
                disabled: true,
                inputProps: { readOnly: true },
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
            component: RichEditorField,
            componentProps: {
                name: 'adminSection.advisoryStatement',
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
            },
        },
        uqData: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'uqData',
                name: 'uqdataSection',
                sectionConfig: viewJournalConfig.uqData,
                wrapped: false,
            },
        },
        doaj: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'doaj',
                name: 'doajSection',
                sectionConfig: viewJournalConfig.doaj,
                wrapped: false,
            },
        },
        indexed: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'indexed',
                name: 'indexedSection',
                sectionConfig: viewJournalConfig.index,
                wrapped: false,
            },
        },
    },
    override: {},
};
