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
                canEdit: false,
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
                canEdit: false,
            },
        },
        publisher: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_publisher',
                name: 'adminSection.jnl_publisher',
                fullWidth: false,
                label: 'Publisher',
                placeholder: '',
                canEdit: false,
            },
        },
        ulr_refereed: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_refereed',
                name: 'adminSection.jnl_refereed',
                fullWidth: false,
                label: 'Refereed',
                placeholder: '',
                canEdit: false,
            },
        },
        publicationYear: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_publication_year',
                name: 'adminSection.jnl_publication_year',
                fullWidth: false,
                label: 'First year of publication',
                placeholder: '',
                canEdit: false,
            },
        },
        publicationFrequency: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'jnl_publication_frequency',
                name: 'adminSection.jnl_publication_frequency',
                fullWidth: false,
                label: 'Frequency of publication',
                placeholder: '',
                canEdit: false,
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
                canEdit: false,
            },
        },
        description: {
            component: RichEditorField,
            componentProps: {
                name: 'adminSection.jnl_description',
                title: 'Description',
                titleProps: {
                    variant: 'caption',
                    style: {
                        opacity: 0.666,
                    },
                },
                height: 100,
                format: value => Immutable.Map(value),
                richEditorId: 'jnl-description',
                canEdit: false,
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
                canEdit: false,
                ListEditorForm: IssnForm,
                rowItemTemplate: IssnRowItemTemplate,
                ListEditorItemTemplate: IssnRowItemTemplate,
                getItemSelectedToEdit: (list, index) =>
                    (!!list[index] && !!list[index].key && list[index].key) || list[index] || null,
            },
        },
        uqData: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'uqdata',
                sectionConfig: viewJournalConfig.uqData,
                preRendered: true,
            },
        },
        doaj: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'doaj',
                sectionConfig: viewJournalConfig.doaj,
                preRendered: true,
            },
        },
        indexed: {
            component: InfoSection,
            componentProps: {
                sectionKey: 'indexed',
                sectionConfig: viewJournalConfig.indexed,
                preRendered: true,
            },
        },
    },
};
