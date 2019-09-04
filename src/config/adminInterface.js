import Immutable from 'immutable';

import { validation } from 'config';
import { PUBLICATION_TYPE_BOOK_CHAPTER, PUBLICATION_TYPE_JOURNAL_ARTICLE, ORG_TYPE_NOT_SET } from 'config/general';

import locale from 'locale/components';
import { default as formLocale } from 'locale/publicationForm';
import { viewRecordsConfig } from 'config';

import { AttachedFilesField } from 'modules/SharedComponents/Toolbox/AttachedFilesField';
import { CollectionField } from 'modules/SharedComponents/LookupFields';
import { ContentIndicatorsField } from 'modules/SharedComponents/Toolbox/ContentIndicatorsField';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { FilteredFieldOfResearchListField } from 'modules/SharedComponents/LookupFields';
import { GrantListEditorField } from 'modules/SharedComponents/GrantListEditor';
import { HerdcCodeField } from 'modules/SharedComponents/Toolbox/HerdcCodeField';
import { HerdcStatusField } from 'modules/SharedComponents/Toolbox/HerdcStatusField';
import { RefereedSourceField } from 'modules/SharedComponents/Toolbox/RefereedSourceField';
import { InstitutionalStatusField } from 'modules/SharedComponents/Toolbox/InstitutionalStatusField';
import { LanguageField } from 'modules/SharedComponents/Toolbox/LanguageField';
import {
    LinkInfoListEditorField,
    ListEditorField,
    ScaleOfSignificanceListEditorField,
} from 'modules/SharedComponents/Toolbox/ListEditor';
import { PublicationSubtypeField } from 'modules/SharedComponents/PublicationSubtype';
import { PubmedDocTypesField } from 'modules/SharedComponents/Toolbox/PubmedDocTypesField';
import { QualityIndicatorField } from 'modules/SharedComponents/Toolbox/QualityIndicatorField';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { ScopusDocTypesField } from 'modules/SharedComponents/Toolbox/ScopusDocTypesField';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { WoSDocTypesField } from 'modules/SharedComponents/Toolbox/WoSDocTypesField';

export const fieldConfig = {
    rek_title: {
        component: RichEditorField,
        componentProps: {
            name: 'bibliographicSection.rek_title',
            title: 'Formatted title',
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            format: value => Immutable.Map(value),
            validate: [validation.required],
            required: true,
        },
    },
    rek_herdc_notes: {
        component: RichEditorField,
        componentProps: {
            name: 'adminSection.rek_herdc_notes',
            title: 'HERDC notes',
            disabled: true,
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            format: value => Immutable.Map(value),
        },
    },
    internalNotes: {
        component: RichEditorField,
        componentProps: {
            name: 'adminSection.internalNotes',
            title: 'Internal notes',
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            format: value => Immutable.Map(value),
        },
    },
    fez_record_search_key_isi_loc: {
        component: GenericTextField,
        componentProps: {
            name: 'identifiersSection.fez_record_search_key_isi_loc.rek_isi_loc',
            fullWidth: true,
            label: 'WoS ID',
            placeholder: '',
        },
    },
    fez_record_search_key_scopus_id: {
        component: GenericTextField,
        componentProps: {
            name: 'identifiersSection.fez_record_search_key_scopus_id.rek_scopus_id',
            fullWidth: true,
            label: 'Scopus ID',
            placeholder: '',
        },
    },
    fez_record_search_key_pubmed_id: {
        component: GenericTextField,
        componentProps: {
            name: 'identifiersSection.fez_record_search_key_pubmed_id.rek_pubmed_id',
            fullWidth: true,
            label: 'PubMed ID',
            placeholder: '',
        },
    },
    fez_record_search_key_pubmed_central_id: {
        component: GenericTextField,
        componentProps: {
            name: 'identifiersSection.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id',
            fullWidth: true,
            label: 'PMC ID',
            placeholder: '',
        },
    },
    rek_wok_doc_type: {
        component: WoSDocTypesField,
        componentProps: {
            name: 'identifiersSection.rek_wok_doc_type',
            label: 'WoS doc type(s)',
            placeholder: '',
        },
    },
    rek_scopus_doc_type: {
        component: ScopusDocTypesField,
        componentProps: {
            name: 'identifiersSection.rek_scopus_doc_type',
            label: 'Scopus doc type(s)',
            placeholder: '',
        },
    },
    rek_pubmed_doc_type: {
        component: PubmedDocTypesField,
        componentProps: {
            name: 'identifiersSection.rek_pubmed_doc_type',
            label: 'PubMed doc type(s)',
            placeholder: '',
        },
    },
    links: {
        component: LinkInfoListEditorField,
        componentProps: {
            name: 'identifiersSection.links',
            label: 'Link',
            placeholder: '',
            locale: locale.components.linkListForm.field,
        },
    },
    rek_description: {
        component: RichEditorField,
        componentProps: {
            name: 'bibliographicSection.rek_description',
            title: 'Abstract/Description',
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            format: value => Immutable.Map(value),
            validate: [validation.required],
        },
    },
    rek_date: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliogrphicSection.rek_date',
            label: 'Publication date',
            placeholder: 'Date of publication',
            required: true,
            fullWidth: true,
        },
    },
    collections: {
        component: CollectionField,
        componentProps: {
            floatingLabelText: 'Member of collections',
            hintText: 'Begin typing to select and add collection(s)',
            name: 'additionalInformationSection.collections',
        },
    },
    rek_subtype: {
        component: PublicationSubtypeField,
        componentProps: {
            name: 'bibliographicSection.rek_subtype',
            label: 'Work sub-type',
            required: true,
            placeholder: '',
        },
    },
    languages: {
        component: LanguageField,
        componentProps: {
            name: 'bibliographicSection.languages',
            label: 'Language',
            required: true,
            placeholder: '',
            multiple: true,
        },
    },
    fez_record_search_key_journal_name: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_journal_name.rek_journal_name',
            fullWidth: true,
            label: 'Journal name',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_book_title: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_book_title.rek_book_title',
            fullWidth: true,
            label: 'Book title',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_native_script_book_title: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_native_script_book_title.rek_native_script_book_title',
            fullWidth: true,
            label: 'Native script book title',
            placeholder: '',
            validate: [validation.required],
        },
    },
    fez_record_search_key_roman_script_book_title: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_roman_script_book_title.rek_roman_script_book_title',
            fullWidth: true,
            label: 'Roman script book title',
            placeholder: '',
            validate: [validation.required],
        },
    },
    fez_record_search_key_translated_book_title: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_translated_book_title.rek_translated_book_title',
            fullWidth: true,
            label: 'Translated book title',
            placeholder: '',
            validate: [validation.required],
        },
    },
    fez_record_search_key_doi: {
        component: GenericTextField,
        componentProps: {
            name: 'identifiersSection.fez_record_search_key_doi.rek_doi',
            fullWidth: true,
            label: 'DOI',
            placeholder: '',
        },
    },
    fez_record_search_key_place_of_publication: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_place_of_publication.rek_place_of_publication',
            fullWidth: true,
            label: 'Place of publication',
            placeholder: '',
        },
    },
    fez_record_search_key_publisher: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_publisher.rek_publisher',
            fullWidth: true,
            label: 'Publisher name',
            placeholder: '',
        },
    },
    fez_record_search_key_volume_number: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_volume_number.rek_volume_number',
            fullWidth: true,
            label: 'Volume',
            placeholder: '',
        },
    },
    fez_record_search_key_issue_number: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_issue_number.rek_issue_number',
            fullWidth: true,
            label: 'Issue',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_article_number: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_article_number.rek_article_number',
            fullWidth: true,
            label: 'Article number',
            placeholder: '',
        },
    },
    fez_record_search_key_start_page: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_start_page.rek_start_page',
            fullWidth: true,
            label: 'Start page',
            placeholder: '',
        },
    },
    fez_record_search_key_end_page: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_end_page.rek_end_page',
            fullWidth: true,
            label: 'End page',
            placeholder: '',
        },
    },
    fez_record_search_key_oa_embargo_days: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days',
            fullWidth: true,
            label: 'DOI embargo days',
            placeholder: '',
            required: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_keywords: {
        component: ListEditorField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_keywords',
            required: true,
            maxInputLength: 111,
            searchKey: {
                value: 'rek_keywords',
                order: 'rek_keywords_order',
            },
            locale: locale.components.keywordsForm.field,
        },
    },
    fez_record_search_key_issn: {
        component: ListEditorField,
        componentProps: {
            remindToAdd: true,
            name: 'bibliographicSection.fez_record_search_key_issn',
            isValid: validation.isValidIssn,
            searchKey: {
                value: 'rek_issn',
                order: 'rek_issn_order',
            },
            locale: locale.components.issnForm.field,
        },
    },
    fez_record_search_key_isbn: {
        component: ListEditorField,
        componentProps: {
            remindToAdd: true,
            name: 'bibliographicSection.fez_record_search_key_isbn',
            isValid: validation.isValidIsbn,
            searchKey: {
                value: 'rek_isbn',
                order: 'rek_isbn_order',
            },
            locale: locale.components.isbnForm.field,
        },
    },
    fez_record_search_key_ismn: {
        component: ListEditorField,
        componentProps: {
            remindToAdd: true,
            name: 'bibliographicSection.fez_record_search_key_ismn',
            isValid: validation.isValidIsmn,
            searchKey: {
                value: 'rek_ismn',
                order: 'rek_ismn_order',
            },
            locale: locale.components.ismnForm.field,
        },
    },
    fez_record_search_key_edition: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_edition.rek_edition',
            fullWidth: true,
            label: 'Edition',
            placeholder: '',
        },
    },
    fez_record_search_key_series: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_series.rek_series',
            fullWidth: true,
            label: 'Series',
            placeholder: '',
        },
    },
    fez_record_search_key_chapter_number: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_chapter_number.rek_chapter_number',
            fullWidth: true,
            label: 'Chapter number',
            placeholder: '',
        },
    },
    fez_record_search_key_total_pages: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_total_pages.rek_total_pages',
            fullWidth: true,
            label: 'Total pages / Extent',
            placeholder: '',
        },
    },
    subjects: {
        component: FilteredFieldOfResearchListField,
        componentProps: {
            name: 'bibliographicSection.subjects',
            searchKey: {
                value: 'rek_subject',
                order: 'rek_subject_order',
            },
            locale: locale.components.subjectForm.field,
            distinctOnly: true,
        },
    },
    fez_record_search_key_refereed_source: {
        component: RefereedSourceField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_refereed_source.rek_refereed_source',
            label: 'Refereed source',
        },
    },
    languageOfJournalName: {
        component: LanguageField,
        componentProps: {
            name: 'bibliographicSection.languageOfJournalName',
            label: 'Language of journal name',
            placeholder: '',
            required: true,
            multiple: true,
            validate: [validation.required],
        },
    },
    languageOfBookTitle: {
        component: LanguageField,
        componentProps: {
            name: 'bibliographicSection.languageOfBookTitle',
            label: 'Language of book title',
            placeholder: '',
            multiple: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_native_script_journal_name: {
        component: GenericTextField,
        componentProps: {
            name:
                'bibliographicSection.fez_record_search_key_native_script_journal_name.rek_native_script_journal_name',
            label: 'Native script journal name',
            placeholder: '',
            fullWidth: true,
        },
    },
    fez_record_search_key_roman_script_journal_name: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_roman_script_journal_name.rek_roman_script_journal_name',
            label: 'Roman script journal name',
            placeholder: '',
            fullWidth: true,
        },
    },
    fez_record_search_key_translated_journal_name: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_translated_journal_name.rek_translated_journal_name',
            label: 'Translated journal name',
            placeholder: '',
            fullWidth: true,
        },
    },
    languageOfTitle: {
        component: LanguageField,
        componentProps: {
            name: 'bibliographicSection.languageOfTitle',
            label: 'Language of title',
            placeholder: '',
            required: true,
            multiple: true,
            validate: [validation.required],
        },
    },
    fez_record_search_key_native_script_title: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_native_script_title.rek_native_script_title',
            label: 'Native script title',
            placeholder: '',
            fullWidth: true,
        },
    },
    fez_record_search_key_roman_script_title: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_roman_script_title.rek_roman_script_title',
            label: 'Roman script title',
            placeholder: '',
            fullWidth: true,
        },
    },
    fez_record_search_key_translated_title: {
        component: GenericTextField,
        componentProps: {
            name: 'bibliographicSection.fez_record_search_key_translated_title.rek_translated_title',
            label: 'Translated title',
            placeholder: '',
            fullWidth: true,
        },
    },
    authors: {
        component: ContributorsEditorField,
        componentProps: {
            name: 'authorsSection.authors',
            showIdentifierLookup: true,
            showContributorAssignment: true,
            locale: formLocale.journalArticle.authors.field,
            validate: [validation.authorRequired],
            editMode: true,
        },
    },
    files: {
        component: FileUploadField,
        componentProps: {
            name: 'filesSection.files',
            requireOpenAccessStatus: true,
        },
    },
    contentIndicators: {
        component: ContentIndicatorsField,
        componentProps: {
            name: 'additionalInformationSection.contentIndicators',
            label: locale.components.contentIndicators.label,
            multiple: true,
            fullWidth: true,
        },
    },
    fez_record_search_key_herdc_code: {
        component: HerdcCodeField,
        componentProps: {
            name: 'additionalInformationSection.fez_record_search_key_herdc_code.rek_herdc_code',
            label: 'Category code',
        },
    },
    fez_record_search_key_herdc_status: {
        component: HerdcStatusField,
        componentProps: {
            name: 'additionalInformationSection.fez_record_search_key_herdc_status.rek_herdc_status',
            label: 'Category code status',
        },
    },
    fez_record_search_key_institutional_status: {
        component: InstitutionalStatusField,
        componentProps: {
            name: 'additionalInformationSection.fez_record_search_key_institutional_status.rek_institutional_status',
            label: 'Institutional status',
        },
    },
    additionalNotes: {
        component: RichEditorField,
        componentProps: {
            name: 'additionalInformationSection.additionalNotes',
            title: 'Additional notes',
            titleProps: {
                variant: 'caption',
                style: {
                    opacity: 0.666,
                },
            },
            height: 100,
            format: value => Immutable.Map(value),
        },
    },
    significanceAndContributionStatement: {
        component: ScaleOfSignificanceListEditorField,
        componentProps: {
            name: 'ntroSection.significanceAndContributionStatement',
            label: 'Scale/significance of work - Contribution statement',
            placeholder: '',
            locale: locale.components.scaleOfSignificanceListForm.field,
        },
    },
    qualityIndicators: {
        component: QualityIndicatorField,
        componentProps: {
            name: 'ntroSection.qualityIndicators',
            label: 'Quality indicators',
            multiple: true,
        },
    },
    grants: {
        component: GrantListEditorField,
        componentProps: {
            name: 'grantInformationSection.grants',
        },
    },
    fez_datastream_info: {
        component: AttachedFilesField,
        componentProps: {
            name: 'filesSection.fez_datastream_info',
            locale: { ...locale.components.attachedFiles, title: 'Attached files' },
            canEdit: true,
        },
    },
};

export const adminInterfaceConfig = {
    [PUBLICATION_TYPE_JOURNAL_ARTICLE]: {
        admin: () => [
            {
                groups: [
                    ['internalNotes'],
                    ['rek_herdc_notes'],
                    // ['fez_record_search_key_retracted']
                ],
            },
        ],
        identifiers: () => [
            {
                title: 'Manage identifiers',
                groups: [
                    ['fez_record_search_key_doi'],
                    ['fez_record_search_key_isi_loc', 'rek_wok_doc_type'],
                    ['fez_record_search_key_scopus_id', 'rek_scopus_doc_type'],
                    ['fez_record_search_key_pubmed_id', 'rek_pubmed_doc_type'],
                ],
            },
            {
                title: 'Manage links',
                groups: [['links']],
            },
        ],
        bibliographic: (isLote = false) => [
            {
                title: 'Title',
                groups: [
                    ['rek_title'],
                    ...(isLote
                        ? [
                            ['languageOfTitle'],
                            ['fez_record_search_key_native_script_title'],
                            ['fez_record_search_key_translated_title'],
                            ['fez_record_search_key_roman_script_title'],
                        ]
                        : []),
                    ['languages'],
                ],
            },
            {
                title: 'Journal name',
                groups: [
                    ['fez_record_search_key_journal_name'],
                    ...(isLote
                        ? [
                            ['languageOfJournalName'],
                            ['fez_record_search_key_native_script_journal_name'],
                            ['fez_record_search_key_translated_journal_name'],
                            ['fez_record_search_key_roman_script_journal_name'],
                        ]
                        : []),
                    ['rek_subtype'],
                    // ['fez_record_search_key_doi', 'fez_record_search_key_oa_embargo_days']
                ],
            },
            {
                title: 'ISSN',
                groups: [['fez_record_search_key_issn']],
            },
            {
                title: 'ISBN',
                groups: [['fez_record_search_key_isbn']],
            },
            {
                title: 'Bibliographic',
                groups: [
                    ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                    [
                        'fez_record_search_key_volume_number',
                        'fez_record_search_key_issue_number',
                        'fez_record_search_key_article_number',
                    ],
                    [
                        'fez_record_search_key_start_page',
                        'fez_record_search_key_end_page',
                        'fez_record_search_key_total_pages',
                    ],
                    ['rek_date'],
                    // ['rek_date_available'],
                    // ['rek_refereed_source'],
                    // ['fez_record_search_key_succeeds'],
                    ['rek_description'],
                ],
            },
            {
                title: 'Keywords',
                groups: [['fez_record_search_key_keywords']],
            },
            {
                title: 'Subject',
                groups: [['subjects']],
            },
        ],
        authors: () => [
            {
                title: 'Authors',
                groups: [['authors']],
            },
        ],
        additionalInformation: () => [
            {
                title: 'Additional information',
                groups: [
                    ['collections'],
                    ['rek_subtype'],
                    ['additionalNotes'],
                    [
                        'fez_record_search_key_herdc_code',
                        'fez_record_search_key_herdc_status',
                        'fez_record_search_key_institutional_status',
                    ],
                    ['contentIndicators'],
                ],
            },
        ],
        files: () => [
            {
                groups: [['fez_datastream_info']],
            },
            {
                title: 'Files',
                groups: [['files']],
            },
        ],
        ntro: () => [
            {
                title: 'Scale/Significance of work & Creator contribution statement',
                groups: [['significanceAndContributionStatement']],
            },
            {
                title: 'ISMN',
                groups: [['fez_record_search_key_ismn']],
            },
            {
                title: 'Quality indicators',
                groups: [['qualityIndicators']],
            },
        ],
        grantInformation: () => [
            {
                title: 'Grant information',
                groups: [['grants']],
            },
        ],
    },
    [PUBLICATION_TYPE_BOOK_CHAPTER]: {
        admin: () => [
            {
                groups: [['internalNotes']],
            },
        ],
        identifiers: () => [
            {
                title: 'Manage identifiers',
                groups: [
                    ['fez_record_search_key_doi'],
                    ['fez_record_search_key_isi_loc', 'rek_wok_doc_type'],
                    ['fez_record_search_key_scopus_id', 'rek_scopus_doc_type'],
                    ['fez_record_search_key_pubmed_id', 'rek_pubmed_doc_type'],
                    ['fez_record_search_key_pubmed_central_id'],
                ],
            },
            {
                title: 'Manage links',
                groups: [['links']],
            },
        ],
        bibliographic: (isLote = false) => [
            {
                title: 'Book chapter title',
                groups: [
                    ['rek_title'],
                    ...(isLote
                        ? [
                            ['fez_record_search_key_native_script_title'],
                            ['fez_record_search_key_roman_script_title'],
                            ['fez_record_search_key_translated_title'],
                            ['languageOfTitle'],
                        ]
                        : []),
                ],
            },
            {
                title: 'Book title',
                groups: [
                    ['fez_record_search_key_book_title'],
                    ...(isLote
                        ? [
                            ['fez_record_search_key_native_script_book_title'],
                            ['fez_record_search_key_roman_script_book_title'],
                            ['fez_record_search_key_translated_book_title'],
                            ['languageOfBookTitle'],
                        ]
                        : []),
                ],
            },
            {
                title: 'Language of work',
                groups: [['languages']],
            },
            {
                title: 'ISBN',
                groups: [['fez_record_search_key_isbn']],
            },
            {
                title: 'ISSN',
                groups: [['fez_record_search_key_issn']],
            },
            {
                title: 'Publication',
                groups: [
                    ['fez_record_search_key_place_of_publication', 'fez_record_search_key_publisher'],
                    ['fez_record_search_key_edition', 'fez_record_search_key_series'],
                    ['fez_record_search_key_volume_number', 'fez_record_search_key_chapter_number'],
                    [
                        'fez_record_search_key_start_page',
                        'fez_record_search_key_total_pages',
                        'fez_record_search_key_end_page',
                    ],
                    ['rek_date'],
                ],
            },
            {
                title: 'Abstract/Description',
                groups: [['rek_description']],
            },
            {
                title: 'Keyword(s)',
                groups: [['fez_record_search_key_keywords']],
            },
            {
                title: 'Subject',
                groups: [['subjects']],
            },
            {
                title: 'Refereed source',
                groups: [['fez_record_search_key_refereed_source']],
            },
        ],
        authors: () => [
            {
                title: 'Authors',
                groups: [['authors']],
            },
        ],
        additionalInformation: () => [
            {
                title: 'Additional information',
                groups: [
                    ['collections'],
                    ['rek_subtype'],
                    [
                        'fez_record_search_key_herdc_code',
                        'fez_record_search_key_herdc_status',
                        'fez_record_search_key_institutional_status',
                    ],
                    ['contentIndicators'],
                    ['additionalNotes'],
                ],
            },
        ],
        files: () => [
            {
                title: 'Files',
                groups: [['files']],
            },
        ],
        ntro: () => [
            {
                title: 'Scale/Significance of work & Creator research statement',
                groups: [['significanceAndContributionStatement']],
            },
            {
                title: 'ISMN',
                groups: [['fez_record_search_key_ismn']],
            },
            {
                title: 'Quality indicators',
                groups: [['qualityIndicators']],
            },
        ],
        grantInformation: () => [
            {
                title: 'Grant information',
                groups: [['grants']],
            },
        ],
    },
};

export const valueExtractor = {
    rek_title: {
        getValue: record => ({
            plainText: record.rek_title,
            htmlText: record.rek_formatted_title || record.rek_title,
        }),
    },
    rek_description: {
        getValue: record => ({
            plainText: record.rek_description,
            htmlText: record.rek_formatted_abstract || record.rek_description,
        }),
    },
    rek_date: {
        getValue: record => record.rek_date,
    },
    rek_subtype: {
        getValue: record => record.rek_subtype,
    },
    languages: {
        getValue: record => record.fez_record_search_key_language.map(language => language.rek_language),
    },
    fez_record_search_key_journal_name: {
        getValue: record => ({ ...record.fez_record_search_key_journal_name }),
    },
    fez_record_search_key_book_title: {
        getValue: record => ({ ...record.fez_record_search_key_book_title }),
    },
    fez_record_search_key_place_of_publication: {
        getValue: record => ({
            ...record.fez_record_search_key_place_of_publication,
        }),
    },
    fez_record_search_key_publisher: {
        getValue: record => ({ ...record.fez_record_search_key_publisher }),
    },
    fez_record_search_key_volume_number: {
        getValue: record => ({ ...record.fez_record_search_key_volume_number }),
    },
    fez_record_search_key_issue_number: {
        getValue: record => ({ ...record.fez_record_search_key_issue_number }),
    },
    fez_record_search_key_article_number: {
        getValue: record => ({ ...record.fez_record_search_key_article_number }),
    },
    fez_record_search_key_start_page: {
        getValue: record => ({ ...record.fez_record_search_key_start_page }),
    },
    fez_record_search_key_end_page: {
        getValue: record => ({ ...record.fez_record_search_key_end_page }),
    },
    fez_record_search_key_oa_embargo_days: {
        getValue: record => ({
            ...record.fez_record_search_key_oa_embargo_days,
        }),
    },
    fez_record_search_key_total_pages: {
        getValue: record => ({
            ...record.fez_record_search_key_total_pages,
        }),
    },
    collections: {
        getValue: record =>
            record.fez_record_search_key_ismemberof.map(collection => ({
                id: collection.rek_ismemberof,
                value: collection.rek_ismemberof_lookup,
            })),
    },
    fez_record_search_key_keywords: {
        getValue: record => [...record.fez_record_search_key_keywords],
    },
    fez_record_search_key_issn: {
        getValue: record => [...record.fez_record_search_key_issn],
    },
    fez_record_search_key_isbn: {
        getValue: record => [...record.fez_record_search_key_isbn],
    },
    fez_record_search_key_ismn: {
        getValue: record => [...record.fez_record_search_key_ismn],
    },
    fez_record_search_key_edition: {
        getValue: record => ({ ...record.fez_record_search_key_edition }),
    },
    fez_record_search_key_series: {
        getValue: record => ({ ...record.fez_record_search_key_series }),
    },
    fez_record_search_key_chapter_number: {
        getValue: record => ({ ...record.fez_record_search_key_chapter_number }),
    },
    subjects: {
        getValue: record =>
            record.fez_record_search_key_subject.map(subject => ({
                rek_value: {
                    key: subject.rek_subject,
                    value: subject.rek_subject_lookup,
                },
                rek_order: subject.rek_subject_order,
            })),
    },
    fez_record_search_key_refereed_source: {
        getValue: record => ({ ...record.fez_record_search_key_refereed_source }),
    },
    languageOfJournalName: {
        getValue: record =>
            record.fez_record_search_key_language_of_journal_name.map(
                language => language.rek_language_of_journal_name,
            ),
    },
    fez_record_search_key_native_script_journal_name: {
        getValue: record => ({ ...record.fez_record_search_key_native_script_journal_name }),
    },
    fez_record_search_key_roman_script_journal_name: {
        getValue: record => ({ ...record.fez_record_search_key_roman_script_journal_name }),
    },
    fez_record_search_key_translated_journal_name: {
        getValue: record => ({ ...record.fez_record_search_key_translated_journal_name }),
    },
    languageOfBookTitle: {
        getValue: record =>
            record.fez_record_search_key_language_of_book_title.map(language => language.rek_language_of_book_title),
    },
    fez_record_search_key_native_script_book_title: {
        getValue: record => ({ ...record.fez_record_search_key_native_script_book_title }),
    },
    fez_record_search_key_roman_script_book_title: {
        getValue: record => ({ ...record.fez_record_search_key_roman_script_book_title }),
    },
    fez_record_search_key_translated_book_title: {
        getValue: record => ({ ...record.fez_record_search_key_translated_book_title }),
    },
    languageOfTitle: {
        getValue: record =>
            record.fez_record_search_key_language_of_title.map(language => language.rek_language_of_title),
    },
    fez_record_search_key_native_script_title: {
        getValue: record => (record.fez_record_search_key_native_script_title || {}).rek_native_script_title,
    },
    fez_record_search_key_roman_script_title: {
        getValue: record => (record.fez_record_search_key_roman_script_title || {}).rek_roman_script_title,
    },
    fez_record_search_key_translated_title: {
        getValue: record => (record.fez_record_search_key_translated_title || {}).rek_translated_title,
    },
    fez_record_search_key_doi: {
        getValue: record => ({ ...record.fez_record_search_key_doi }),
    },
    fez_record_search_key_isi_loc: {
        getValue: record => ({ ...record.fez_record_search_key_isi_loc }),
    },
    fez_record_search_key_scopus_id: {
        getValue: record => ({ ...record.fez_record_search_key_scopus_id }),
    },
    fez_record_search_key_pubmed_id: {
        getValue: record => ({ ...record.fez_record_search_key_pubmed_id }),
    },
    fez_record_search_key_pubmed_central_id: {
        getValue: record => ({ ...record.fez_record_search_key_pubmed_central_id }),
    },
    rek_wok_doc_type: {
        getValue: record => record.rek_wok_doc_type,
    },
    rek_scopus_doc_type: {
        getValue: record => record.rek_scopus_doc_type,
    },
    rek_pubmed_doc_type: {
        getValue: record => record.rek_pubmed_doc_type,
    },
    links: {
        getValue: record =>
            (record.fez_record_search_key_link || []).map(link => ({
                rek_order: link.rek_link_order,
                rek_value: {
                    key: link.rek_link,
                    value: record.fez_record_search_key_link_description
                        .filter(description => description.rek_link_description_order === link.rek_link_order)
                        .reduce((pv, cv) => cv.rek_link_description, ''),
                },
            })),
    },
    authors: {
        getValue: record => {
            const authors = (record.fez_record_search_key_author || []).reduce(
                (authorsObject, author) => ({
                    ...authorsObject,
                    [author.rek_author_order]: author,
                }),
                {},
            );

            const authorIds = (record.fez_record_search_key_author_id || []).reduce(
                (authorIdsObject, authorId) => ({
                    ...authorIdsObject,
                    [authorId.rek_author_id_order]: authorId,
                }),
                {},
            );

            const authorAffiliationNames = (record.fez_record_search_key_author_affiliation_name || []).reduce(
                (authorAffiliationsObject, authorAffiliationName) => ({
                    ...authorAffiliationsObject,
                    [authorAffiliationName.rek_author_affiliation_name_order]: authorAffiliationName,
                }),
                {},
            );

            const authorAffiliationTypes = (record.fez_record_search_key_author_affiliation_type || []).reduce(
                (authorAffiliationTypesObject, authorAffiliationType) => ({
                    ...authorAffiliationTypesObject,
                    [authorAffiliationType.rek_author_affiliation_type_order]: authorAffiliationType,
                }),
                {},
            );

            return (record.fez_record_search_key_author || []).map(({ rek_author_order: order }) => ({
                nameAsPublished: (authors[order] || {}).rek_author,
                creatorRole: '',
                uqIdentifier: `${(authorIds[order] || {}).rek_author_id}` || '',
                authorId: (authorIds[order] || {}).rek_author_id || 0,
                orgaff: (authorAffiliationNames[order] || {}).rek_author_affiliation_name || 'Missing',
                orgtype: `${(authorAffiliationTypes[order] || {}).rek_author_affiliation_type}` || '',
                affiliation: (!!(authorIds[order] || {}).rek_author_id && 'UQ') || 'NotUQ',
            }));
        },
    },
    contentIndicators: {
        getValue: record =>
            (record.fez_record_search_key_content_indicator || {}).map(
                contentIndicator => contentIndicator.rek_content_indicator,
            ),
    },
    fez_record_search_key_herdc_code: {
        getValue: record => ({ ...record.fez_record_search_key_herdc_code }),
    },
    fez_record_search_key_herdc_status: {
        getValue: record => ({ ...record.fez_record_search_key_herdc_status }),
    },
    fez_record_search_key_institutional_status: {
        getValue: record => ({ ...record.fez_record_search_key_institutional_status }),
    },
    additionalNotes: {
        getValue: record => ({
            plainText: (record.fez_record_search_key_notes || {}).rek_notes,
            htmlText: (record.fez_record_search_key_notes || {}).rek_notes,
        }),
    },
    significanceAndContributionStatement: {
        getValue: record => {
            const authors = (record.fez_record_search_key_author || []).reduce(
                (authorsObject, author) => ({
                    ...authorsObject,
                    [author.rek_author_order]: author,
                }),
                {},
            );

            const significanceScales = (record.fez_record_search_key_significance || []).reduce(
                (significanceScalesObject, significance) => ({
                    ...significanceScalesObject,
                    [significance.rek_significance_order]: significance,
                }),
                {},
            );

            const contributionStatements = (record.fez_record_search_key_creator_contribution_statement || []).reduce(
                (contributionStatementsObject, contributionStatement) => ({
                    ...contributionStatementsObject,
                    [contributionStatement.rek_creator_contribution_statement_order]: contributionStatement,
                }),
                {},
            );

            return (record.fez_record_search_key_author || []).map(({ rek_author_order: order }) => {
                return {
                    rek_order: order,
                    rek_value: {
                        key: (significanceScales[order] || {}).rek_significance || 0,
                        value: {
                            plainText:
                                (contributionStatements[order] || {}).rek_creator_contribution_statement || 'Missing',
                            htmlText:
                                (contributionStatements[order] || {}).rek_creator_contribution_statement || 'Missing',
                        },
                        author: authors[order],
                    },
                };
            });
        },
    },
    qualityIndicators: {
        getValue: record => {
            return (record.fez_record_search_key_quality_indicator || []).map(item => item.rek_quality_indicator);
        },
    },
    grants: {
        getValue: record => {
            const grantAgencyNames = (record.fez_record_search_key_grant_agency || []).reduce(
                (grantAgencyNamesObject, grantAgencyName) => ({
                    ...grantAgencyNamesObject,
                    [grantAgencyName.rek_grant_agency_order]: grantAgencyName,
                }),
                {},
            );
            const grantIds = (record.fez_record_search_key_grant_id || []).reduce(
                (grantIdsObject, grantId) => ({
                    ...grantIdsObject,
                    [grantId.rek_grant_id_order]: grantId,
                }),
                {},
            );
            const grantAgencyTypes = (record.fez_record_search_key_grant_agency_type || []).reduce(
                (grantAgencyTypesObject, grantAgencyType) => ({
                    ...grantAgencyTypesObject,
                    [grantAgencyType.rek_grant_agency_type_order]: grantAgencyType,
                }),
                {},
            );

            return record.fez_record_search_key_grant_agency.map(({ rek_grant_agency_order: order }) => ({
                grantAgencyName: grantAgencyNames[order].rek_grant_agency,
                grantId: (grantIds[order] || {}).rek_grant_id || '',
                grantAgencyType: (grantAgencyTypes[order] || {}).rek_grant_agency_type || ORG_TYPE_NOT_SET,
            }));
        },
    },
    files: {
        getValue: () => [],
    },
    fez_datastream_info: {
        getValue: record => {
            return (record.fez_datastream_info || []).filter(validation.isFileValid(viewRecordsConfig, true));
        },
    },
};
