/* eslint-disable max-len */
import Immutable from 'immutable';
import { validation, DATASET_ACCESS_CONDITIONS_OPTIONS } from 'config';
import locale from 'locale/components';
import {
    ALL_LICENCES,
    ALTERNATE_GENRE,
    ANDS_COLLECTION_TYPE_OPTIONS,
    INSTITUTIONAL_STATUS,
    LANGUAGE,
    OA_STATUS,
    OA_STATUS_TYPE,
    PUBMED_DOC_TYPES,
    QUALITY_INDICATORS,
    REFEREED_SOURCES,
    SCOPUS_DOC_TYPES,
    WOS_DOC_TYPES,
    COLLECTION_VIEW_TYPE,
    AUTHOR_EXTERNAL_IDENTIFIER_TYPE,
    SUSTAINABLE_DEVELOPMENT_GOAL_VOCAB_ID,
} from 'config/general';
import { selectFields } from 'locale/selectFields';
import { default as formLocale } from 'locale/publicationForm';
import {
    AIATSIS_CODES_VOCAB_ID,
    FIELD_OF_RESEARCH_VOCAB_ID,
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
    PUBLICATION_TYPE_CREATIVE_WORK,
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_DESIGN,
    PUBLICATION_TYPE_DIGILIB_IMAGE,
    PUBLICATION_TYPE_GENERIC_DOCUMENT,
    PUBLICATION_TYPE_IMAGE,
    PUBLICATION_TYPE_INSTRUMENT,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_MANUSCRIPT,
    PUBLICATION_TYPE_PATENT,
    PUBLICATION_TYPE_PREPRINT,
    PUBLICATION_TYPE_RESEARCH_REPORT,
    PUBLICATION_TYPE_THESIS,
    PUBLICATION_TYPE_VIDEO_DOCUMENT,
} from 'config/general';

import { AttributionIncompleteField } from 'modules/SharedComponents/Toolbox/AttributionIncompleteField';

import { AttachedFilesField } from 'modules/SharedComponents/Toolbox/AttachedFilesField';
import { AudienceSizeField } from 'modules/SharedComponents/Toolbox/AudienceSizeField';
import {
    AuthorIdField,
    CollectionField,
    FieldOfResearchListField,
    JournalIdField,
    OrgUnitNameField,
    OrgNameField,
    RelatedDatasetAndPublicationListField,
    SeriesField,
} from 'modules/SharedComponents/LookupFields';
import { ThesisSubtypeSelectField } from 'modules/SharedComponents/SelectFields';
import { ContentIndicatorsField } from 'modules/SharedComponents/Toolbox/ContentIndicatorsField';
import { ContributorsEditorField } from 'modules/SharedComponents/ContributorsEditor';
import { CopyrightAgreementField } from 'modules/SharedComponents/Toolbox/CopyrightAgreementField';
import { PartialDateField } from 'modules/SharedComponents/Toolbox/PartialDate';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { GeoCoordinatesField } from 'modules/SharedComponents/Toolbox/GeoCoordinatesField';
import { GrantListEditorField } from 'modules/SharedComponents/GrantListEditor';
import { HerdcCodeField } from 'modules/SharedComponents/Toolbox/HerdcCodeField';
import { HerdcStatusField } from 'modules/SharedComponents/Toolbox/HerdcStatusField';
import {
    IssnForm,
    LinkInfoListEditorField,
    ListEditorField,
    NewListEditorField,
    KeywordsForm,
    AlternateIdentifierListEditorField,
} from 'modules/SharedComponents/Toolbox/ListEditor';
import { RelatedServiceListEditorField } from 'modules/SharedComponents/RelatedServiceListEditor';
import { ScaleOfSignificanceListEditorField } from 'modules/SharedComponents/ScaleOfSignificanceListEditor';
import { PublicationSubtypeField } from 'modules/SharedComponents/PublicationSubtype';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { IssnRowItemTemplate } from 'modules/SharedComponents/Toolbox/ListEditor';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import SensitiveHandlingNoteField from '../../modules/SharedComponents/SensitiveHandlingNote/containers/SensitiveHandlingNoteField';
import { CommunityField } from 'modules/SharedComponents/LookupFields/containers/CommunityField';
import { SustainableDevelopmentGoalListField } from '../../modules/SharedComponents/LookupFields/containers/SustainableDevelopmentGoalListField';

const transformCollectionView = () =>
    COLLECTION_VIEW_TYPE.map(viewType => {
        return { value: viewType.id, text: viewType.label };
    });

export default {
    default: {
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
                richEditorId: 'rek-title',
                singleLine: true,
                textOnlyOnPaste: false,
            },
        },
        internalNotes: {
            component: RichEditorField,
            componentProps: {
                name: 'notesSection.internalNotes',
                title: 'Internal notes (admin)',
                titleProps: {
                    variant: 'caption',
                    style: {
                        opacity: 0.666,
                    },
                },
                height: 100,
                format: value => Immutable.Map(value),
                richEditorId: 'ain-notes',
            },
        },
        fez_record_search_key_isi_loc: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-isi-loc',
                name: 'identifiersSection.fez_record_search_key_isi_loc.rek_isi_loc',
                fullWidth: true,
                label: 'WoS ID',
                placeholder: '',
            },
        },
        fez_record_search_key_scopus_id: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-scopus-id',
                name: 'identifiersSection.fez_record_search_key_scopus_id.rek_scopus_id',
                fullWidth: true,
                label: 'Scopus ID',
                placeholder: '',
            },
        },
        fez_record_search_key_pubmed_id: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-pubmed-id',
                name: 'identifiersSection.fez_record_search_key_pubmed_id.rek_pubmed_id',
                fullWidth: true,
                label: 'PubMed ID',
                placeholder: '',
            },
        },
        fez_record_search_key_pubmed_central_id: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-pubmed-central-id',
                name: 'identifiersSection.fez_record_search_key_pubmed_central_id.rek_pubmed_central_id',
                fullWidth: true,
                label: 'PubMed Central ID',
                placeholder: '',
            },
        },
        rek_wok_doc_type: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'identifiersSection.rek_wok_doc_type',
                genericSelectFieldId: 'rek-wok-doc-type',
                itemsList: WOS_DOC_TYPES,
                ...selectFields.wokDocType,
            },
        },
        rek_scopus_doc_type: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'identifiersSection.rek_scopus_doc_type',
                genericSelectFieldId: 'rek-scopus-doc-type',
                itemsList: SCOPUS_DOC_TYPES,
                ...selectFields.scopusDocType,
            },
        },
        rek_pubmed_doc_type: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'identifiersSection.rek_pubmed_doc_type',
                genericSelectFieldId: 'rek-pubmed-doc-type',
                itemsList: PUBMED_DOC_TYPES,
                ...selectFields.pubmedDocType,
            },
        },
        links: {
            component: LinkInfoListEditorField,
            componentProps: {
                name: 'identifiersSection.links',
                label: 'Link',
                placeholder: '',
                locale: locale.components.linkListForm.field,
                listEditorId: 'rek-link',
                canEdit: true,
            },
        },
        alternateIdentifiers: {
            component: AlternateIdentifierListEditorField,
            componentProps: {
                name: 'identifiersSection.alternateIdentifiers',
                label: 'Alternate Identifier',
                placeholder: '',
                locale: locale.components.alternateIdentifierForm.field,
                listEditorId: 'rek-alternate-identifier',
                canEdit: true,
            },
        },
        rek_description: {
            component: RichEditorField,
            componentProps: {
                name: 'bibliographicSection.rek_description',
                title: 'Abstract / Description',
                titleProps: {
                    variant: 'caption',
                    style: {
                        opacity: 0.666,
                    },
                },
                height: 100,
                format: value => Immutable.Map(value),
                richEditorId: 'rek-description',
                textOnlyOnPaste: false,
            },
        },
        rek_date: {
            component: PartialDateField,
            componentProps: {
                name: 'bibliographicSection.rek_date',
                label: 'Publication date',
                floatingTitle: 'Publication date',
                required: true,
                fullWidth: true,
                validate: [validation.required],
                allowPartial: true,
                partialDateFieldId: 'rek-date',
            },
        },
        communities: {
            component: CommunityField,
            componentProps: {
                floatingLabelText: 'Member of communities',
                hintText: 'Begin typing to select and add communities',
                name: 'adminSection.communities',
                id: 'member-of-communities-input',
                required: true,
                fullWidth: true,
                validate: [validation.requiredList],
                communityFieldId: 'rek-ismemberof',
            },
        },
        reason: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'reason',
                name: 'reasonSection.reason',
                fullWidth: true,
                label: 'Reason for Edit (optional - will be added to object history)',
                placeholder: 'Reason for Edit',
            },
        },
        rek_ci_notice_attribution_incomplete: {
            component: AttributionIncompleteField,
            componentProps: {
                name: 'notesSection.rek_ci_notice_attribution_incomplete',
                label: 'Attribution Incomplete',
                placeholder: 'Attribution Incomplete Placeholder',
                attributionIncompleteFieldId: 'rek_ci_notice_attribution_incomplete',
                attributionIncompleteStatement: 'Attribution Incomplete',
                attributionIncompleteDetail:
                    'Determines if the record or collection is to be CI labelled Attribution Incomplete.',
            },
        },
        fez_record_search_key_collection_view_type: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_collection_view_type.rek_collection_view_type',
                itemsList: transformCollectionView(),
                multiple: false,
                genericSelectFieldId: 'collection-view-type',
                ...selectFields.collectionViewType,
            },
        },
        collections: {
            component: CollectionField,
            componentProps: {
                floatingLabelText: 'Member of collection',
                hintText: 'Begin typing to select and add collection(s)',
                name: 'adminSection.collections',
                id: 'member-of-collections-input',
                required: true,
                fullWidth: true,
                validate: [validation.requiredList],
                collectionFieldId: 'rek-ismemberof',
            },
        },

        rek_subtype: {
            component: PublicationSubtypeField,
            componentProps: {
                name: 'adminSection.rek_subtype',
                label: 'Work sub-type',
                required: true,
                placeholder: '',
                validate: [validation.required],
            },
        },
        languages: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'bibliographicSection.languages',
                multiple: true,
                itemsList: LANGUAGE,
                genericSelectFieldId: 'rek-language',
                ...selectFields.language,
            },
        },
        fez_record_search_key_audience_size: {
            component: AudienceSizeField,
            componentProps: {
                name: 'ntroSection.fez_record_search_key_audience_size.rek_audience_size',
                fullWidth: true,
                label: 'Audience size',
            },
        },
        fez_record_search_key_journal_name: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-journal-name',
                name: 'bibliographicSection.fez_record_search_key_journal_name.rek_journal_name',
                fullWidth: true,
                label: 'Journal name',
                placeholder: '',
                required: true,
                validate: [validation.required],
            },
        },
        fez_matched_journals: {
            component: JournalIdField,
            componentProps: {
                name: 'bibliographicSection.fez_matched_journals',
                fullWidth: true,
                floatingLabelText: 'Journal Id',
                placeholder: '',
                clearOnInputClear: true,
                getOptionLabel: option => (!!option && !!option.id && String(option.id)) || '',
            },
        },
        fez_record_search_key_book_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-book-title',
                name: 'bibliographicSection.fez_record_search_key_book_title.rek_book_title',
                fullWidth: true,
                label: 'Book title',
                placeholder: '',
                required: true,
                validate: [validation.required],
            },
        },
        fez_record_search_key_conference_name: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-conference-name',
                name: 'bibliographicSection.fez_record_search_key_conference_name.rek_conference_name',
                fullWidth: true,
                label: 'Conference name',
                placeholder: 'Conference name',
                required: true,
                validate: [validation.required],
            },
        },
        fez_record_search_key_proceedings_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-proceedings-title',
                name: 'bibliographicSection.fez_record_search_key_proceedings_title.rek_proceedings_title',
                fullWidth: true,
                label: 'Proceedings title',
                placeholder: 'Proceedings title',
            },
        },
        fez_record_search_key_native_script_book_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-native-script-book-title',
                name:
                    'bibliographicSection.fez_record_search_key_native_script_book_title.rek_native_script_book_title',
                fullWidth: true,
                label: 'Native script book title',
                placeholder: '',
            },
        },
        fez_record_search_key_roman_script_book_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-roman-script-book-title',
                name: 'bibliographicSection.fez_record_search_key_roman_script_book_title.rek_roman_script_book_title',
                fullWidth: true,
                label: 'Roman script book title',
                placeholder: '',
            },
        },
        fez_record_search_key_translated_book_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-translated-book-title',
                name: 'bibliographicSection.fez_record_search_key_translated_book_title.rek_translated_book_title',
                fullWidth: true,
                label: 'Translated book title',
                placeholder: '',
            },
        },
        fez_record_search_key_native_script_conference_name: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-native-script-conference-name',
                name:
                    'bibliographicSection.fez_record_search_key_native_script_conference_name.rek_native_script_conference_name',
                fullWidth: true,
                label: 'Native script conference name',
                placeholder: 'Native script conference name',
            },
        },
        fez_record_search_key_roman_script_conference_name: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-roman-script-conference-name',
                name:
                    'bibliographicSection.fez_record_search_key_roman_script_conference_name.rek_roman_script_conference_name',
                fullWidth: true,
                label: 'Roman script conference name',
                placeholder: 'Roman script conference name',
            },
        },
        fez_record_search_key_translated_conference_name: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-translated-conference-name',
                name:
                    'bibliographicSection.fez_record_search_key_translated_conference_name.rek_translated_conference_name',
                fullWidth: true,
                label: 'Translated conference name',
                placeholder: 'Translated conference name',
            },
        },
        fez_record_search_key_native_script_proceedings_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-native-script-proceedings-title',
                name:
                    'bibliographicSection.fez_record_search_key_native_script_proceedings_title.rek_native_script_proceedings_title',
                fullWidth: true,
                label: 'Native script proceedings title',
                placeholder: 'Native script proceedings title',
            },
        },
        fez_record_search_key_roman_script_proceedings_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-roman-script-proceedings-title',
                name:
                    'bibliographicSection.fez_record_search_key_roman_script_proceedings_title.rek_roman_script_proceedings_title',
                fullWidth: true,
                label: 'Roman script proceedings title',
                placeholder: 'Roman script proceedings title',
            },
        },
        fez_record_search_key_translated_proceedings_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-translated-proceedings-title',
                name:
                    'bibliographicSection.fez_record_search_key_translated_proceedings_title.rek_translated_proceedings_title',
                fullWidth: true,
                label: 'Translated proceedings title',
                placeholder: 'Translated proceedings title',
            },
        },
        fez_record_search_key_doi: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-doi',
                name: 'identifiersSection.fez_record_search_key_doi.rek_doi',
                fullWidth: true,
                label: 'DOI',
                placeholder: '',
                validate: [validation.doi],
            },
        },
        fez_record_search_key_place_of_publication: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-place-of-publication',
                name: 'bibliographicSection.fez_record_search_key_place_of_publication.rek_place_of_publication',
                fullWidth: true,
                label: 'Place of publication',
                placeholder: '',
            },
        },
        fez_record_search_key_publisher: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-publisher',
                name: 'bibliographicSection.fez_record_search_key_publisher.rek_publisher',
                fullWidth: true,
                label: 'Publisher name',
                placeholder: '',
            },
        },
        fez_record_search_key_volume_number: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-volume-number',
                name: 'bibliographicSection.fez_record_search_key_volume_number.rek_volume_number',
                fullWidth: true,
                label: 'Volume',
                placeholder: '',
            },
        },
        fez_record_search_key_issue_number: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-issue-number',
                name: 'bibliographicSection.fez_record_search_key_issue_number.rek_issue_number',
                fullWidth: true,
                label: 'Issue',
                placeholder: '',
            },
        },
        fez_record_search_key_article_number: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-article-number',
                name: 'bibliographicSection.fez_record_search_key_article_number.rek_article_number',
                fullWidth: true,
                label: 'Article number',
                placeholder: '',
            },
        },
        fez_record_search_key_patent_number: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-patent-number',
                name: 'bibliographicSection.fez_record_search_key_patent_number.rek_patent_number',
                fullWidth: true,
                label: 'Patent number',
                placeholder: '',
            },
        },
        fez_record_search_key_start_page: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-start-page',
                name: 'bibliographicSection.fez_record_search_key_start_page.rek_start_page',
                fullWidth: true,
                label: 'Start page',
                placeholder: '',
            },
        },
        fez_record_search_key_end_page: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-end-page',
                name: 'bibliographicSection.fez_record_search_key_end_page.rek_end_page',
                fullWidth: true,
                label: 'End page',
                placeholder: '',
            },
        },
        fez_record_search_key_oa_embargo_days: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-oa-embargo-days',
                name: 'bibliographicSection.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days',
                fullWidth: true,
                label: 'DOI embargo days',
                placeholder: '',
                required: true,
                validate: [validation.required],
            },
        },
        fez_record_search_key_keywords: {
            component: NewListEditorField,
            componentProps: {
                scrollListHeight: 250,
                scrollList: true,
                name: 'bibliographicSection.fez_record_search_key_keywords',
                searchKey: {
                    value: 'rek_keywords',
                    order: 'rek_keywords_order',
                },
                listEditorId: 'rek-keywords',
                locale: locale.components.keywordsForm.field,
                canEdit: true,
                ListEditorForm: KeywordsForm,
            },
        },
        issns: {
            component: NewListEditorField,
            componentProps: {
                remindToAdd: true,
                name: 'bibliographicSection.issns',
                isValid: validation.isValidIssn,
                listEditorId: 'rek-issn',
                locale: locale.components.issnForm.field,
                inputNormalizer: value => {
                    const newValue = value.replace('-', '');
                    return newValue.length >= 5 ? [newValue.slice(0, 4), '-', newValue.slice(4)].join('') : newValue;
                },
                canEdit: true,
                ListEditorForm: IssnForm,
                rowItemTemplate: IssnRowItemTemplate,
                ListEditorItemTemplate: IssnRowItemTemplate,
                getItemSelectedToEdit: (list, index) =>
                    (!!list[index] && !!list[index].key && list[index].key) || list[index] || null,
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
                listEditorId: 'rek-isbn',
                locale: locale.components.isbnForm.field,
                canEdit: true,
            },
        },
        fez_record_search_key_ismn: {
            component: ListEditorField,
            componentProps: {
                remindToAdd: true,
                name: 'identifiersSection.fez_record_search_key_ismn',
                isValid: validation.isValidIsmn,
                searchKey: {
                    value: 'rek_ismn',
                    order: 'rek_ismn_order',
                },
                listEditorId: 'rek-ismn',
                locale: locale.components.ismnForm.field,
                canEdit: true,
            },
        },
        fez_record_search_key_isrc: {
            component: ListEditorField,
            componentProps: {
                remindToAdd: true,
                name: 'identifiersSection.fez_record_search_key_isrc',
                isValid: validation.isValidIsrc,
                searchKey: {
                    value: 'rek_isrc',
                    order: 'rek_isrc_order',
                },
                locale: locale.components.isrcForm.field,
                canEdit: true,
                listEditorId: 'rek-isrc',
            },
        },
        fez_record_search_key_edition: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-edition',
                name: 'bibliographicSection.fez_record_search_key_edition.rek_edition',
                fullWidth: true,
                label: 'Edition',
                placeholder: '',
            },
        },
        fez_record_search_key_series: {
            component: SeriesField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_series.rek_series',
                fullWidth: true,
                label: 'Series',
                placeholder: '',
                multiline: true,
                floatingLabelText: 'Series',
                showClear: true,
                clearOnInputClear: true,
            },
        },
        fez_record_search_key_chapter_number: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-chapter-number',
                name: 'bibliographicSection.fez_record_search_key_chapter_number.rek_chapter_number',
                fullWidth: true,
                label: 'Chapter number',
                placeholder: '',
            },
        },
        fez_record_search_key_raid: {
            component: ListEditorField,
            componentProps: {
                remindToAdd: true,
                name: 'bibliographicSection.fez_record_search_key_raid',
                isValid: validation.raid,
                searchKey: {
                    value: 'rek_raid',
                    order: 'rek_raid_order',
                },
                listEditorId: 'rek-raid',
                locale: locale.components.raidForm.field,
                canEdit: true,
            },
        },
        fez_record_search_key_total_pages: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-total-pages',
                name: 'bibliographicSection.fez_record_search_key_total_pages.rek_total_pages',
                fullWidth: true,
                label: 'Total pages / Extent',
                placeholder: '',
            },
        },
        subjects: {
            component: FieldOfResearchListField,
            componentProps: {
                name: 'bibliographicSection.subjects',
                locale: locale.components.subjectForm.field,
                distinctOnly: true,
                category: [FIELD_OF_RESEARCH_VOCAB_ID, AIATSIS_CODES_VOCAB_ID].join(','),
                canEdit: true,
                listEditorId: 'rek-subjects',
            },
        },
        fez_record_search_key_sdg_source: {
            component: SustainableDevelopmentGoalListField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_sdg_source',
                locale: locale.components.sustainableDevelopmentGoal.field,
                distinctOnly: true,
                category: SUSTAINABLE_DEVELOPMENT_GOAL_VOCAB_ID,
                canEdit: false,
                listEditorId: 'rek-sustainable-development-goal',
            },
        },
        fez_record_search_key_refereed_source: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_refereed_source.rek_refereed_source',
                genericSelectFieldId: 'rek-refereed-source',
                itemsList: REFEREED_SOURCES,
                ...selectFields.refereedSource,
            },
        },
        languageOfJournalName: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'bibliographicSection.languageOfJournalName',
                multiple: true,
                genericSelectFieldId: 'rek-language-of-journal-name',
                itemsList: LANGUAGE,
                ...selectFields.languageOfJournalName,
            },
        },
        languageOfBookTitle: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'bibliographicSection.languageOfBookTitle',
                multiple: true,
                genericSelectFieldId: 'rek-language-of-book-title',
                itemsList: LANGUAGE,
                ...selectFields.languageOfBookTitle,
            },
        },
        languageOfConferenceName: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'bibliographicSection.languageOfConferenceName',
                multiple: true,
                fullWidth: true,
                genericSelectFieldId: 'rek-language-of-conference-name',
                itemsList: LANGUAGE,
                ...selectFields.languageOfConferenceName,
            },
        },
        languageOfProceedingsTitle: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'bibliographicSection.languageOfProceedingsTitle',
                multiple: true,
                fullWidth: true,
                genericSelectFieldId: 'rek-language-of-proceedings-title',
                itemsList: LANGUAGE,
                ...selectFields.languageOfProceedingsTitle,
            },
        },
        fez_record_search_key_conference_location: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-conference-location',
                name: 'bibliographicSection.fez_record_search_key_conference_location.rek_conference_location',
                label: 'Conference location',
                placeholder: 'Conference location',
                required: true,
                fullWidth: true,
                validate: [validation.required],
            },
        },
        fez_record_search_key_conference_dates: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-conference-dates',
                name: 'bibliographicSection.fez_record_search_key_conference_dates.rek_conference_dates',
                label: 'Conference dates',
                placeholder: 'Conference dates',
                required: true,
                fullWidth: true,
                validate: [validation.required],
            },
        },
        languageOfTitle: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'bibliographicSection.languageOfTitle',
                multiple: true,
                genericSelectFieldId: 'rek-language-of-title',
                itemsList: LANGUAGE,
                ...selectFields.languageOfTitle,
            },
        },
        fez_record_search_key_native_script_journal_name: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-native-script-journal-name',
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
                textFieldId: 'rek-roman-script-journal-name',
                name:
                    'bibliographicSection.fez_record_search_key_roman_script_journal_name.rek_roman_script_journal_name',
                label: 'Roman script journal name',
                placeholder: '',
                fullWidth: true,
            },
        },
        fez_record_search_key_translated_journal_name: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-translated-journal-name',
                name: 'bibliographicSection.fez_record_search_key_translated_journal_name.rek_translated_journal_name',
                label: 'Translated journal name',
                placeholder: '',
                fullWidth: true,
            },
        },
        fez_record_search_key_native_script_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-native-script-title',
                name: 'bibliographicSection.fez_record_search_key_native_script_title.rek_native_script_title',
                label: 'Native script title',
                placeholder: '',
                fullWidth: true,
            },
        },
        fez_record_search_key_roman_script_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-roman-script-title',
                name: 'bibliographicSection.fez_record_search_key_roman_script_title.rek_roman_script_title',
                label: 'Roman script title',
                placeholder: '',
                fullWidth: true,
            },
        },
        fez_record_search_key_translated_title: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-translated-title',
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
                locale: locale.components.authorsList('author').field,
                contributorEditorId: 'rek-author',
                isAdmin: true,
                shouldHandleAffiliations: false,
                useFormReducer: true,
            },
        },
        authorsWithAffiliations: {
            component: ContributorsEditorField,
            componentProps: {
                name: 'authorsSection.authorsWithAffiliations',
                showIdentifierLookup: true,
                locale: locale.components.authorsList('author').field,
                contributorEditorId: 'rek-author',
                isAdmin: true,
                shouldHandleAffiliations: true,
                useFormReducer: false,
            },
        },
        editors: {
            component: ContributorsEditorField,
            componentProps: {
                name: 'authorsSection.editors',
                showIdentifierLookup: true,
                locale: locale.components.authorsList('editor').field,
                isAdmin: true,
                contributorEditorId: 'rek-contributor',
            },
        },
        files: {
            component: FileUploadField,
            componentProps: {
                name: 'filesSection.files',
                requireOpenAccessStatus: true,
                isAdmin: true,
            },
        },
        contentIndicators: {
            component: ContentIndicatorsField,
            componentProps: {
                name: 'adminSection.contentIndicators',
                label: locale.components.contentIndicators.label,
                multiple: true,
                fullWidth: true,
                canUnselect: true,
            },
        },
        fez_record_search_key_herdc_code: {
            component: HerdcCodeField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_herdc_code.rek_herdc_code',
                label: 'Category code',
            },
        },
        fez_record_search_key_herdc_status: {
            component: HerdcStatusField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_herdc_status.rek_herdc_status',
                label: 'Category code status',
            },
        },
        fez_record_search_key_institutional_status: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_institutional_status.rek_institutional_status',
                itemsList: INSTITUTIONAL_STATUS,
                genericSelectFieldId: 'rek-institutional-status',
                canUnselect: true,
                ...selectFields.institutionalStatus,
            },
        },
        fez_record_search_key_oa_status_type: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_oa_status_type.rek_oa_status_type',
                genericSelectFieldId: 'rek-oa-status-type',
                itemsList: [{ value: '0', text: 'None' }, ...OA_STATUS_TYPE],
                canUnselect: true,
                ...selectFields.oaStatusType,
            },
        },
        fez_record_search_key_oa_status: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_oa_status.rek_oa_status',
                genericSelectFieldId: 'rek-oa-status',
                itemsList: OA_STATUS,
                canUnselect: true,
                ...selectFields.oaStatus,
            },
        },
        additionalNotes: {
            component: RichEditorField,
            componentProps: {
                name: 'notesSection.additionalNotes',
                title: 'Additional notes (public)',
                titleProps: {
                    variant: 'caption',
                    color: 'primary',
                    style: {
                        fontWeight: 600,
                    },
                },
                height: 100,
                format: value => Immutable.Map(value),
                richEditorId: 'rek-notes',
            },
        },
        advisoryStatement: {
            component: RichEditorField,
            componentProps: {
                name: 'filesSection.advisoryStatement',
                title: 'Advisory statement',
                titleProps: {
                    variant: 'caption',
                    style: {
                        opacity: 0.666,
                    },
                },
                height: 100,
                format: value => Immutable.Map(value),
                richEditorId: 'rek-advisory-statement',
            },
        },
        sensitiveHandlingNote: {
            isComposed: true,
            component: SensitiveHandlingNoteField,
            componentProps: {
                name: 'filesSection.sensitiveHandlingNote',
            },
        },
        fez_record_search_key_transcript: {
            component: RichEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_transcript',
                title: 'Transcript',
                titleProps: {
                    variant: 'caption',
                    style: {
                        opacity: 0.666,
                    },
                },
                height: 100,
                format: value => Immutable.Map(value),
                richEditorId: 'rek-transcript',
            },
        },
        significanceAndContributionStatement: {
            component: ScaleOfSignificanceListEditorField,
            componentProps: {
                name: 'ntroSection.significanceAndContributionStatement',
                label: 'Scale/significance of work - Contribution statement',
                placeholder: '',
                locale: locale.components.scaleOfSignificanceListAdminForm.field,
                canEdit: true,
            },
        },
        qualityIndicators: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'ntroSection.qualityIndicators',
                genericSelectFieldId: 'rek-quality-indicator',
                itemsList: QUALITY_INDICATORS,
                multiple: true,
                ...selectFields.qualityIndicators,
            },
        },
        relatedServices: {
            component: RelatedServiceListEditorField,
            componentProps: {
                name: 'relatedServicesSection.relatedServices',
                canEdit: true,
            },
        },
        grants: {
            component: GrantListEditorField,
            componentProps: {
                name: 'grantInformationSection.grants',
                canEdit: true,
            },
        },
        fez_datastream_info: {
            component: AttachedFilesField,
            componentProps: {
                name: 'filesSection.fez_datastream_info',
                locale: { ...locale.components.attachedFiles, title: 'Attached files' },
                canEdit: true,
                validate: [validation.validFileNames],
            },
        },
        rek_copyright: {
            component: CopyrightAgreementField,
            componentProps: {
                name: 'filesSection.rek_copyright',
                label: 'Copyright Agreement',
                placeholder: '',
                validate: [validation.required],
                copyrightAgreementFieldId: 'rek-copyright',
                copyrightAgreement:
                    'Depositors of metadata (i.e. abstracts / bibliographic content) must tick this declaration box to facilitate the required workflow but the declaration DOES NOT APPLY to these deposits. [This a temporary measure awaiting redesign of the deposit process].',
            },
        },
        fez_record_search_key_date_available: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-date-available',
                name: 'bibliographicSection.fez_record_search_key_date_available.rek_date_available',
                label: 'Year available',
                fullWidth: true,
                validate: [validation.dateTimeYear],
            },
        },
        fez_record_search_key_date_recorded: {
            component: PartialDateField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_date_recorded.rek_date_recorded',
                label: 'Recording date',
                floatingTitle: 'Recording date',
                fullWidth: true,
                allowPartial: false,
                clearable: true,
                dateFormat: 'YYYY-MM-DD',
                partialDateFieldId: 'rek-date-recorded',
            },
        },
        fez_record_search_key_isderivationof: {
            component: RelatedDatasetAndPublicationListField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_isderivationof',
                searchKey: { value: 'rek_isderivationof', order: 'rek_isderivationof_order' },
                locale: {
                    form: formLocale.addDataset.information.optionalDatasetDetails.fieldLabels.relatedDatasets,
                },
                height: 50,
                canEdit: true,
                listEditorId: 'rek-isderivationof',
            },
        },
        locations: {
            component: ListEditorField,
            componentProps: {
                name: 'identifiersSection.locations',
                title: 'Locations',
                searchKey: {
                    value: 'rek_location',
                    order: 'rek_location_order',
                },
                listEditorId: 'rek-location',
                locale: locale.components.locationForm.field,
            },
        },
        fez_record_search_key_location: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-location',
                name: 'bibliographicSection.fez_record_search_key_location[0].rek_location',
                title: 'Locations',
                fullWidth: true,
                label: locale.components.placeOfRecordingForm.field.form.locale.inputFieldLabel,
                locale: locale.components.placeOfRecordingForm.field,
            },
        },
        fez_record_search_key_identifier: {
            component: ListEditorField,
            componentProps: {
                name: 'identifiersSection.fez_record_search_key_identifier',
                title: 'Identifiers',
                searchKey: {
                    value: 'rek_identifier',
                    order: 'rek_identifier_order',
                },
                listEditorId: 'rek-identifier',
                locale: locale.components.identifierForm.field,
            },
        },
        fez_record_search_key_source: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-source',
                name: 'bibliographicSection.fez_record_search_key_source.rek_source',
                fullWidth: true,
                label: 'Source',
                placeholder: '',
                multiline: true,
            },
        },
        fez_record_search_key_rights: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-rights',
                name: 'bibliographicSection.fez_record_search_key_rights.rek_rights',
                fullWidth: true,
                label: 'Copyright notice',
                placeholder: '',
                multiline: true,
                required: true,
                validate: [validation.required],
            },
        },
        fez_record_search_key_acknowledgements: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-acknowledgements',
                name: 'bibliographicSection.fez_record_search_key_acknowledgements.rek_acknowledgements',
                fullWidth: true,
                label: 'Acknowledgements',
                multiline: true,
                placeholder: '',
            },
        },
        fez_record_search_key_length: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-length',
                name: 'bibliographicSection.fez_record_search_key_length.rek_length',
                fullWidth: true,
                label: 'Length',
                placeholder: '',
            },
        },
        fez_record_search_key_license: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_license.rek_license',
                itemsList: ALL_LICENCES,
                genericSelectFieldId: 'rek-license',
                ...selectFields.license,
            },
        },
        fez_record_search_key_original_format: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-original-format',
                name: 'bibliographicSection.fez_record_search_key_original_format.rek_original_format',
                fullWidth: true,
                label: 'Original format',
                multiline: true,
                placeholder: '',
            },
        },
        fez_record_search_key_alternate_genre: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_alternate_genre',
                itemsList: ALTERNATE_GENRE,
                genericSelectFieldId: 'rek-alternate-genre',
                multiple: true,
                ...selectFields.alternateGenre,
            },
        },
        rek_genre: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-genre',
                name: 'bibliographicSection.rek_genre',
                fullWidth: true,
                label: 'Type',
            },
        },
        rek_genre_type: {
            component: ThesisSubtypeSelectField,
            componentProps: {
                name: 'bibliographicSection.rek_genre_type',
                fullWidth: true,
                label: 'Thesis type',
                required: true,
                validate: [validation.required],
                genericSelectFieldId: 'rek-genre-type',
            },
        },
        geoCoordinates: {
            component: GeoCoordinatesField,
            componentProps: {
                name: 'bibliographicSection.geoCoordinates',
                fullWidth: true,
                label: 'Geographic area',
                isSearch: true,
            },
        },
        fez_record_search_key_access_conditions: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_access_conditions.rek_access_conditions',
                id: 'data-collection-access-selector',
                required: true,
                validate: [validation.required],
                itemsList: DATASET_ACCESS_CONDITIONS_OPTIONS,
                genericSelectFieldId: 'rek-access-conditions',
                ...formLocale.addDataset.information.accessAndLicensing.fieldLabels.accessConditions,
            },
        },
        fez_record_search_key_type_of_data: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_type_of_data',
                searchKey: {
                    value: 'rek_type_of_data',
                    order: 'rek_type_of_data_order',
                },
                listEditorId: 'rek-type-of-data',
                locale: locale.components.typeOfDataForm.field,
                canEdit: true,
            },
        },
        fez_record_search_key_data_volume: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-data-volume',
                name: 'bibliographicSection.fez_record_search_key_data_volume.rek_data_volume',
                fullWidth: true,
                label: 'Data volume',
            },
        },
        fez_record_search_key_software_required: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_software_required',
                searchKey: {
                    value: 'rek_software_required',
                    order: 'rek_software_required_order',
                },
                listEditorId: 'rek-software-required',
                locale: locale.components.softwareRequiredForm.field,
                canEdit: true,
            },
        },
        fez_record_search_key_related_datasets: {
            component: RichEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_related_datasets',
                title: 'Other related datasets',
                titleProps: {
                    variant: 'caption',
                    style: {
                        opacity: 0.666,
                    },
                },
                format: value => Immutable.Map(value),
                richEditorId: 'rek-related-datasets',
            },
        },
        fez_record_search_key_related_publications: {
            component: RichEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_related_publications',
                title: 'Other related publications',
                titleProps: {
                    variant: 'caption',
                    style: {
                        opacity: 0.666,
                    },
                },
                format: value => Immutable.Map(value),
                richEditorId: 'rek-related-publications',
            },
        },
        fez_record_search_key_isdatasetof: {
            component: RelatedDatasetAndPublicationListField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_isdatasetof',
                searchKey: { value: 'rek_isdatasetof', order: 'rek_isdatasetof_order' },
                locale: {
                    form: formLocale.addDataset.information.optionalDatasetDetails.fieldLabels.relatedDatasets,
                },
                canEdit: true,
                listEditorId: 'rek-isdatasetof',
            },
            height: 50,
        },
        contactName: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-contributor',
                name: 'adminSection.contactName',
                fullWidth: true,
                required: true,
                validate: [validation.required],
                ...formLocale.addDataset.information.dataset.fieldLabels.contactName,
            },
        },
        contactNameId: {
            component: AuthorIdField,
            componentProps: {
                name: 'adminSection.contactNameId',
                authorIdFieldId: 'rek-contributor-id',
                fullWidth: true,
                showClear: true,
                ...formLocale.addDataset.information.dataset.fieldLabels.contactId,
            },
        },
        contactEmail: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-contact-details-email',
                name: 'adminSection.contactEmail',
                fullWidth: true,
                required: true,
                validate: [validation.required, validation.email],
                ...formLocale.addDataset.information.dataset.fieldLabels.contactEmail,
            },
        },
        fez_record_search_key_ands_collection_type: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_ands_collection_type.rek_ands_collection_type',
                itemsList: ANDS_COLLECTION_TYPE_OPTIONS,
                genericSelectFieldId: 'rek-ands-collection-type',
                required: true,
                validate: [validation.required],
                ...selectFields.andsCollectionType,
            },
        },
        ownerIdentifier: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-contributor-identifier',
                name: 'adminSection.ownerIdentifier',
                fullWidth: true,
                label: 'Owner Identifier',
                placeholder: "Type owner's identifier",
            },
        },
        ownerIdentifierType: {
            component: NewGenericSelectField,
            componentProps: {
                name: 'adminSection.ownerIdentifierType',
                itemsList: AUTHOR_EXTERNAL_IDENTIFIER_TYPE,
                genericSelectFieldId: 'rek-contributor-identifier-type',
                label: 'Select an identifier type',
            },
        },
        fez_record_search_key_project_name: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-project-name',
                name: 'adminSection.fez_record_search_key_project_name.rek_project_name',
                fullWidth: true,
                ...formLocale.addDataset.information.project.fieldLabels.projectName,
            },
        },
        fez_record_search_key_project_id: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-project-id',
                name: 'adminSection.fez_record_search_key_project_id.rek_project_id',
                fullWidth: true,
                ...formLocale.addDataset.information.project.fieldLabels.projectId,
            },
        },
        fez_record_search_key_project_description: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-project-description',
                name: 'adminSection.fez_record_search_key_project_description.rek_project_description',
                fullWidth: true,
                height: 100,
                required: true,
                validate: [validation.required],
                rows: 5,
                multiline: true,
                ...formLocale.addDataset.information.project.fieldLabels.projectDescription,
            },
        },
        fez_record_search_key_project_start_date: {
            component: PartialDateField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_project_start_date.rek_project_start_date',
                label: 'Project start date',
                floatingTitle: 'Project start date',
                fullWidth: true,
                allowPartial: true,
                partialDateFieldId: 'rek-project-start-date',
                required: true,
            },
        },
        fez_record_search_key_start_date: {
            component: PartialDateField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_start_date.rek_start_date',
                label: 'Start date',
                floatingTitle: 'Start date',
                fullWidth: true,
                allowPartial: true,
                partialDateFieldId: 'rek-start-date',
            },
        },
        fez_record_search_key_end_date: {
            component: PartialDateField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_end_date.rek_end_date',
                label: 'End date',
                floatingTitle: 'End date',
                fullWidth: true,
                allowPartial: true,
                partialDateFieldId: 'rek-end-date',
            },
        },
        fez_record_search_key_time_period_start_date: {
            component: PartialDateField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_time_period_start_date.rek_time_period_start_date',
                label: 'Time coverage start date',
                floatingTitle: 'Time coverage start date',
                fullWidth: true,
                allowPartial: true,
                partialDateFieldId: 'rek-time-period-start-date',
            },
        },
        fez_record_search_key_time_period_end_date: {
            component: PartialDateField,
            componentProps: {
                name: 'adminSection.fez_record_search_key_time_period_end_date.rek_time_period_end_date',
                label: 'Time coverage end date',
                floatingTitle: 'Time coverage end date',
                fullWidth: true,
                allowPartial: true,
                partialDateFieldId: 'rek-time-period-end-date',
            },
        },
        fez_record_search_key_org_name: {
            component: OrgNameField,
            componentProps: {
                fullWidth: true,
                label: 'Institution',
                name: 'bibliographicSection.fez_record_search_key_org_name.rek_org_name',
                placeholder: '',
                floatingLabelText: 'Institution',
            },
        },
        fez_record_search_key_org_unit_name: {
            component: OrgUnitNameField,
            componentProps: {
                fullWidth: true,
                label: 'School, Centre or Institute',
                name: 'bibliographicSection.fez_record_search_key_org_unit_name.rek_org_unit_name',
                floatingLabelText: 'School, Centre or Institute',
                showClear: true,
            },
        },
        fez_record_search_key_report_number: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-report-number',
                fullWidth: true,
                label: 'Report number',
                name: 'bibliographicSection.fez_record_search_key_report_number.rek_report_number',
                placeholder: '',
            },
        },
        fez_record_search_key_parent_publication: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-parent-publication',
                fullWidth: true,
                label: 'Parent Publication',
                name: 'bibliographicSection.fez_record_search_key_parent_publication.rek_parent_publication',
                multiline: true,
                placeholder: '',
            },
        },
        fez_record_search_key_newspaper: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-newspaper',
                fullWidth: true,
                label: 'Newspaper',
                name: 'bibliographicSection.fez_record_search_key_newspaper.rek_newspaper',
                placeholder: '',
            },
        },
        fez_record_search_key_resource_type: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-resource-type',
                fullWidth: true,
                label: 'Resource type',
                name: 'adminSection.fez_record_search_key_resource_type.rek_resource_type',
                placeholder: '',
            },
        },
        fez_record_search_key_section: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-section',
                fullWidth: true,
                label: 'Section',
                name: 'bibliographicSection.fez_record_search_key_section.rek_section',
                placeholder: '',
            },
        },
        fez_record_search_key_translated_newspaper: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-translated-newspaper',
                fullWidth: true,
                label: 'Translated newspaper',
                name: 'bibliographicSection.fez_record_search_key_translated_newspaper.rek_translated_newspaper',
                placeholder: '',
            },
        },
        fez_record_search_key_scale: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-scale',
                fullWidth: true,
                label: 'Scale',
                name: 'bibliographicSection.fez_record_search_key_scale.rek_scale',
                placeholder: '',
            },
        },
        fez_record_search_key_job_number: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-job-number',
                fullWidth: true,
                label: 'Job number',
                name: 'bibliographicSection.fez_record_search_key_job_number.rek_job_number',
                placeholder: '',
            },
        },
        fez_record_search_key_period: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_period',
                title: 'Periods',
                searchKey: {
                    value: 'rek_period',
                    order: 'rek_period_order',
                },
                listEditorId: 'rek-period',
                locale: locale.components.periodForm.field,
            },
        },
        fez_record_search_key_structural_systems: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_structural_systems',
                title: 'Structural systems',
                searchKey: {
                    value: 'rek_structural_systems',
                    order: 'rek_structural_systems_order',
                },
                listEditorId: 'rek-structural-systems',
                locale: locale.components.structuralSystemsForm.field,
            },
        },
        fez_record_search_key_style: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_style',
                title: 'Styles',
                searchKey: {
                    value: 'rek_style',
                    order: 'rek_style_order',
                },
                listEditorId: 'rek-style',
                locale: locale.components.styleForm.field,
            },
        },
        fez_record_search_key_subcategory: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_subcategory',
                title: 'Subcategories',
                searchKey: {
                    value: 'rek_subcategory',
                    order: 'rek_subcategory_order',
                },
                listEditorId: 'rek-subcategory',
                locale: locale.components.subcategoryForm.field,
            },
        },
        fez_record_search_key_surrounding_features: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_surrounding_features',
                title: 'Surrounding features',
                searchKey: {
                    value: 'rek_surrounding_features',
                    order: 'rek_surrounding_features_order',
                },
                listEditorId: 'rek-surrounding-features',
                locale: locale.components.surroundingFeaturesForm.field,
            },
        },
        fez_record_search_key_interior_features: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_interior_features',
                title: 'Interior features',
                searchKey: {
                    value: 'rek_interior_features',
                    order: 'rek_interior_features_order',
                },
                listEditorId: 'rek-interior-features',
                locale: locale.components.interiorFeaturesForm.field,
            },
        },
        fez_record_search_key_date_photo_taken: {
            component: PartialDateField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_date_photo_taken.rek_date_photo_taken',
                label: 'Date photo taken',
                floatingTitle: 'Date photo taken',
                fullWidth: true,
                allowPartial: true,
                partialDateFieldId: 'rek-date-photo-taken',
            },
        },
        fez_record_search_key_date_scanned: {
            component: PartialDateField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_date_scanned.rek_date_scanned',
                label: 'Date photo scanned',
                floatingTitle: 'Date photo scanned',
                fullWidth: true,
                allowPartial: true,
                partialDateFieldId: 'rek-date-scanned',
            },
        },
        fez_record_search_key_building_materials: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_building_materials',
                title: 'Interior features',
                searchKey: {
                    value: 'rek_building_materials',
                    order: 'rek_building_materials_order',
                },
                listEditorId: 'rek-building-materials',
                locale: locale.components.buildingMaterialsForm.field,
            },
        },
        fez_record_search_key_category: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_category',
                title: 'Category',
                searchKey: {
                    value: 'rek_category',
                    order: 'rek_category_order',
                },
                listEditorId: 'rek-category',
                locale: locale.components.categoryForm.field,
            },
        },
        fez_record_search_key_condition: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_condition',
                title: 'Conditions',
                searchKey: {
                    value: 'rek_condition',
                    order: 'rek_condition_order',
                },
                listEditorId: 'rek-condition',
                locale: locale.components.conditionForm.field,
            },
        },
        fez_record_search_key_construction_date: {
            component: GenericTextField,
            componentProps: {
                textFieldId: 'rek-construction-date',
                name: 'bibliographicSection.fez_record_search_key_construction_date.rek_construction_date',
                label: 'Construction date',
                placeholder: 'Construction date',
                fullWidth: true,
            },
        },
        fez_record_search_key_alternative_title: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_alternative_title',
                title: 'Alternative titles',
                searchKey: {
                    value: 'rek_alternative_title',
                    order: 'rek_alternative_title_order',
                },
                listEditorId: 'rek-alternative-title',
                locale: locale.components.alternativeTitleForm.field,
            },
        },
        fez_record_search_key_architectural_features: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_architectural_features',
                title: 'Alternative titles',
                searchKey: {
                    value: 'rek_architectural_features',
                    order: 'rek_architectural_features_order',
                },
                listEditorId: 'rek-architectural-features',
                locale: locale.components.architecturalFeaturesForm.field,
            },
        },
        fez_record_search_key_instrument_type: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_instrument_type',
                title: 'Instrument Type',
                searchKey: {
                    value: 'rek_instrument_type',
                    order: 'rek_instrument_type_order',
                },
                listEditorId: 'rek-instrument-type',
                locale: locale.components.instrumentTypeForm.field,
                canEdit: true,
            },
        },
        fez_record_search_key_model: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_model',
                title: 'Model',
                searchKey: {
                    value: 'rek_model',
                    order: 'rek_model_order',
                },
                listEditorId: 'rek-model',
                locale: locale.components.modelForm.field,
                canEdit: true,
            },
        },
        fez_record_search_key_measured_variable: {
            component: ListEditorField,
            componentProps: {
                name: 'bibliographicSection.fez_record_search_key_measured_variable',
                title: 'Measured Variable',
                searchKey: {
                    value: 'rek_measured_variable',
                    order: 'rek_measured_variable_order',
                },
                listEditorId: 'rek-measured-variable',
                locale: locale.components.measuredVariableForm.field,
                canEdit: true,
            },
        },
        architects: {
            component: ContributorsEditorField,
            componentProps: {
                name: 'authorsSection.architects',
                showIdentifierLookup: true,
                locale: locale.components.authorsList('architect').field,
                isAdmin: true,
                contributorEditorId: 'rek-architect-name',
            },
        },
        creators: {
            component: ContributorsEditorField,
            componentProps: {
                name: 'authorsSection.creators',
                showIdentifierLookup: true,
                locale: locale.components.authorsList('creator').field,
                isAdmin: true,
                contributorEditorId: 'rek-creator-name',
            },
        },
        supervisors: {
            component: ContributorsEditorField,
            componentProps: {
                name: 'authorsSection.supervisors',
                showIdentifierLookup: true,
                locale: locale.components.authorsList('supervisor').field,
                isAdmin: true,
                contributorEditorId: 'rek-supervisor',
            },
        },
    },
    override: {
        [PUBLICATION_TYPE_CONFERENCE_PAPER]: {
            fez_record_search_key_journal_name: () => ({
                required: false,
                validate: null,
            }),
        },
        [PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS]: {
            fez_record_search_key_contributors: () => ({
                required: false,
                validate: null,
            }),
        },
        [PUBLICATION_TYPE_AUDIO_DOCUMENT]: {
            rek_date: () => ({
                label: 'Date',
                placeholder: 'Date',
            }),
        },
        [PUBLICATION_TYPE_BOOK]: {
            fez_record_search_key_publisher: () => ({
                required: true,
                validate: [validation.required],
            }),
            fez_record_search_key_place_of_publication: () => ({
                required: true,
                validate: [validation.required],
            }),
            authors: ({ isNtro }) => ({ isNtro }),
            fez_record_search_key_original_format: () => ({
                label: 'Physical description',
            }),
            grants: () => ({ ...locale.components.grants }),
        },
        [PUBLICATION_TYPE_BOOK_CHAPTER]: {
            fez_record_search_key_publisher: () => ({
                required: true,
                validate: [validation.required],
            }),
            fez_record_search_key_place_of_publication: () => ({
                required: true,
                validate: [validation.required],
            }),
            fez_record_search_key_start_page: () => ({
                required: true,
                validate: [validation.required],
            }),
            fez_record_search_key_end_page: () => ({
                required: true,
                validate: [validation.required],
            }),
            authors: ({ isNtro }) => ({ isNtro }),
            fez_record_search_key_original_format: () => ({
                label: 'Physical description',
            }),
            grants: () => ({ ...locale.components.grants }),
        },
        [PUBLICATION_TYPE_CREATIVE_WORK]: {
            grants: () => ({ ...locale.components.grants }),
            fez_record_search_key_original_format: () => ({
                label: 'Physical description',
            }),
            fez_record_search_key_place_of_publication: () => ({
                required: true,
                validate: [validation.required],
            }),
            authors: ({ isNtro }) => ({ isNtro }),
            editors: ({ isNtro }) => ({
                ...(isNtro ? { locale: { ...locale.components.authorsList('contributor').field } } : {}),
            }),
        },
        [PUBLICATION_TYPE_DATA_COLLECTION]: {
            rek_copyright: () => ({
                label: 'Deposit agreement',
                copyrightAgreement: formLocale.addDataset.information.agreement.text,
            }),
            fez_record_search_key_project_name: () => ({
                required: true,
                validate: [validation.required],
            }),
            fez_record_search_key_rights: () => ({
                required: false,
                validate: [],
                name: 'adminSection.fez_record_search_key_rights.rek_rights',
            }),
            fez_record_search_key_start_date: () => ({
                label: 'Collection start date',
            }),
            fez_record_search_key_end_date: () => ({
                label: 'Collection end date',
                name: 'adminSection.fez_record_search_key_end_date.rek_end_date',
            }),
            authors: () => ({
                showRoleInput: true,
                locale: locale.components.authorsList('creator').field,
            }),
            rek_description: () => ({
                required: true,
                validate: [validation.required],
            }),
            fez_record_search_key_publisher: () => ({
                required: true,
                validate: [validation.required],
            }),
            subjects: () => ({
                required: true,
                validate: [validation.requiredList],
            }),
            fez_record_search_key_license: () => ({
                required: true,
                name: 'adminSection.fez_record_search_key_license.rek_license',
                validate: [validation.required],
            }),
            fez_record_search_key_type_of_data: () => ({
                locale: locale.components.typeOfDataForm.fieldDataset,
            }),
        },
        [PUBLICATION_TYPE_DESIGN]: {
            fez_record_search_key_original_format: ({ isNonNtro = false }) => ({
                label: isNonNtro ? 'Original format' : 'Physical description',
            }),
            fez_record_search_key_rights: ({ isNonNtro = false }) => ({
                label: isNonNtro ? 'Rights' : 'Copyright notice',
            }),
            fez_record_search_key_project_name: () => ({
                name: 'bibliographicSection.fez_record_search_key_project_name.rek_project_name',
            }),
            fez_record_search_key_publisher: () => ({
                validate: [validation.required],
            }),
            fez_record_search_key_place_of_publication: () => ({
                validate: [validation.required],
            }),
            fez_record_search_key_project_start_date: () => ({
                validate: [validation.required],
            }),
            authors: ({ isNtro }) => ({
                isNtro,
                locale: { ...locale.components.authorsList('designer').field },
            }),
            editors: () => ({
                locale: { ...locale.components.authorsList('contributor').field },
            }),
            fez_record_search_key_location: () => ({
                label: locale.components.locationForm.field.form.locale.inputFieldLabel,
            }),
            grants: () => ({ ...locale.components.grants }),
        },
        [PUBLICATION_TYPE_DIGILIB_IMAGE]: {
            authors: () => ({
                locale: locale.components.authorsList('photographer').field,
            }),
        },
        [PUBLICATION_TYPE_GENERIC_DOCUMENT]: {
            rek_date: () => ({
                label: 'Date',
                placeholder: 'Date',
            }),
        },
        [PUBLICATION_TYPE_IMAGE]: {
            rek_date: () => ({
                label: 'Date',
                placeholder: 'Date',
            }),
        },
        [PUBLICATION_TYPE_INSTRUMENT]: {
            authors: () => ({
                showRoleInput: false,
                showExternalIdentifierInput: true,
                locale: locale.components.authorsList('manufacturer').field,
            }),
            contactName: () => ({
                label: 'Owner Name',
                placeholder: 'Type the name of owner for this instrument',
            }),
            contactNameId: () => ({
                floatingLabelText: 'Owner UQ Id',
                placeholder: 'Type to search UQ ID of owner for this instrument',
            }),
            contactEmail: () => ({
                label: 'Owner Email',
                placeholder: 'Type the email address of owner for this instrument',
            }),
            ownerIdentifier: () => ({
                validate: [
                    (value, allValues) => {
                        const type = allValues.get('adminSection')?.get('ownerIdentifierType');
                        const validateMethod = AUTHOR_EXTERNAL_IDENTIFIER_TYPE.find(item => item.value === type);
                        return validateMethod ? validation[validateMethod.text.toLowerCase()](value) : undefined;
                    },
                ],
            }),
            fez_record_search_key_end_date: () => ({
                name: 'adminSection.fez_record_search_key_end_date.rek_end_date',
            }),
            fez_record_search_key_model: () => ({
                validate: [validation.requiredList],
                required: true,
            }),
            fez_record_search_key_instrument_type: () => ({
                validate: [validation.requiredList],
                required: true,
            }),
            rek_description: () => ({
                required: true,
            }),
        },
        [PUBLICATION_TYPE_JOURNAL_ARTICLE]: {
            authors: ({ isNtro }) => ({ isNtro }),
            grants: () => ({ ...locale.components.grants }),
        },
        [PUBLICATION_TYPE_MANUSCRIPT]: {
            rek_date: () => ({
                label: 'Date',
                placeholder: 'Date',
            }),
        },
        [PUBLICATION_TYPE_PREPRINT]: {
            rek_date: ({ isCreate }) => ({
                label: 'Date',
                placeholder: 'Date',
                required: isCreate,
            }),
        },
        [PUBLICATION_TYPE_PATENT]: {
            rek_date: () => ({
                label: 'Date of issue',
                placeholder: 'Date of issue',
            }),
            fez_record_search_key_publisher: () => ({
                label: 'Patent owner',
            }),
        },
        [PUBLICATION_TYPE_RESEARCH_REPORT]: {
            fez_record_search_key_org_unit_name: () => ({
                label: 'School, centre, or institute',
                floatingLabelText: 'School, centre, or institute',
                required: false,
                validate: [],
            }),
            fez_record_search_key_place_of_publication: () => ({
                required: true,
                validate: [validation.required],
            }),
            authors: ({ isNtro }) => ({ isNtro }),
            editors: () => ({ locale: { ...locale.components.authorsList('contributor').field } }),
            fez_record_search_key_location: () => ({
                label: locale.components.locationForm.field.form.locale.inputFieldLabel,
            }),
            grants: () => ({ ...locale.components.grants }),
        },
        [PUBLICATION_TYPE_THESIS]: {
            fez_record_search_key_org_unit_name: () => ({
                label: 'School, centre, or institute',
                floatingLabelText: 'School, centre, or institute',
                required: true,
                validate: [validation.required],
            }),
        },
        [PUBLICATION_TYPE_VIDEO_DOCUMENT]: {
            rek_date: () => ({
                label: 'Date',
                placeholder: 'Date',
            }),
        },
    },
};
