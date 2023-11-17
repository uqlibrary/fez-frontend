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
                inputProps: { readOnly: true },
                required: false,
            },
        },
        abbreviatedTitle: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_jcr_scie_abbrev_title',
                name: 'adminSection.jnl_abbrev_title',
                fullWidth: true,
                label: 'ISO abbreviated title',
                placeholder: '',
                inputProps: { readOnly: true },
                required: false,
            },
        },
        publisher: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_publisher',
                name: 'adminSection.jnl_publisher',
                fullWidth: true,
                label: 'Publisher',
                placeholder: '',
                inputProps: { readOnly: true },
                required: false,
            },
        },
        refereed: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_refereed',
                name: 'adminSection.jnl_refereed',
                fullWidth: true,
                label: 'Refereed',
                placeholder: '',
                inputProps: { readOnly: true },
                required: false,
            },
        },
        publicationYear: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_publication_year',
                name: 'adminSection.jnl_publication_year',
                fullWidth: true,
                label: 'First year of publication',
                placeholder: '',
                inputProps: { readOnly: true },
                required: false,
            },
        },
        publicationFrequency: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_publication_frequency',
                name: 'adminSection.jnl_publication_frequency',
                fullWidth: true,
                label: 'Frequency of publication',
                placeholder: '',
                inputProps: { readOnly: true },
                required: false,
            },
        },
        publicationFormats: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_formats',
                name: 'adminSection.jnl_formats',
                fullWidth: true,
                label: 'Journal formats available',
                placeholder: '',
                inputProps: { readOnly: true },
                required: false,
            },
        },
        description: {
            component: GenericTextField,
            componentProps: {
                name: 'adminSection.jnl_description',
                label: 'Description',
                fullWidth: true,
                multiline: true,
                rows: 3,
                textFieldId: 'jnl_description',
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
                disabled: true,
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
                canAdd: false,
                canEdit: false,
                disabled: true,
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
                sectionConfig: viewJournalConfig.uqData,
                wrapped: false,
            },
        },
        doaj: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'doaj',
                sectionConfig: viewJournalConfig.doaj,
                wrapped: false,
            },
        },
        indexed: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'indexed',
                sectionConfig: viewJournalConfig.index,
                wrapped: false,
            },
        },
    },
    override: {},
};
