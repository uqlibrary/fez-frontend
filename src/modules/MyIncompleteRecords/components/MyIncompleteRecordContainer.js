import React from 'react';
import PropTypes from 'prop-types';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import {
    ORG_TYPE_NOT_SET,
    DOCUMENT_TYPE_BOOK_CHAPTER,
    DOCUMENT_TYPE_JOURNAL_ARTICLE,
    CPEE_NTRO_SUBTYPES,
    LP_NTRO_SUBTYPES,
    NTRO_SUBTYPES
} from 'config/general';
import { leftJoin } from 'helpers/general';
import { locale } from 'locale';
import { authorAffiliationRequired } from 'config/validation';
import { default as pagesLocale } from 'locale/pages';
import {incompleteRecord} from 'config';

import MyIncompleteRecordForm from './MyIncompleteRecordForm';

export default class MyIncompleteRecordContainer extends React.Component {
    static propTypes = {
        recordToFix: PropTypes.object,
        author: PropTypes.object,

        accountAuthorLoading: PropTypes.bool,
        loadingRecordToFix: PropTypes.bool,

        disableInitialGrants: PropTypes.bool,
        account: PropTypes.object,

        match: PropTypes.shape({
            params: PropTypes.shape({
                pid: PropTypes.string.isRequired
            })
        }),
        actions: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            ntroFieldProps: {},
            initialValues: {},
            isNtro: false,
            isAuthorLinked: true
        };
    }

    componentDidMount() {
        if (
            !this.props.recordToFix &&
            !!this.props.actions.loadRecordToFix
        ) {
            this.props.actions.loadRecordToFix(this.props.match.params.pid);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { recordToFix, author } = nextProps;
        (nextProps.recordToFix !== this.props.recordToFix) &&
            this.setState({
                ntroFieldProps: this.getNtroFieldFlags(recordToFix, author),
                initialValues: this.getInitialValues(recordToFix, author),
                isNtro: !!recordToFix.rek_subtype &&
                    !!NTRO_SUBTYPES.includes(recordToFix.rek_subtype),
                isAuthorLinked: this.isAuthorLinked(recordToFix, author),
                hasAnyFiles: recordToFix.fez_datastream_info.filter(this.isFileValid).length > 0
            });
    }

    componentWillUnmount() {
        // clear previously selected recordToFix for a fix
        this.props.actions.clearFixRecord();
    }

    isLoggedInUserLinked = (author, recordToFix, searchKey, subkey) => {
        return !!author &&
            !!recordToFix &&
            recordToFix[searchKey] &&
            recordToFix[searchKey].length > 0
            && recordToFix[searchKey].some(authorId => (
                authorId[subkey] === author.aut_id
            ))
        ;
    };

    isAuthorLinked = (recordToFix, author) => {
        const isAuthorLinked = this.isLoggedInUserLinked(
            author,
            recordToFix,
            'fez_record_search_key_author_id',
            'rek_author_id'
        );
        const isContributorLinked = this.isLoggedInUserLinked(
            author,
            recordToFix,
            'fez_record_search_key_contributor_id',
            'rek_contributor_id'
        );

        return isAuthorLinked || isContributorLinked;
    };

    getInitialValues = (recordToFix, author) => {
        const { account: { canMasquerade }} = this.props;

        const grants = recordToFix.fez_record_search_key_grant_agency.map((grantAgency, index) => ({
            grantAgencyName: grantAgency.rek_grant_agency,
            grantId: recordToFix.fez_record_search_key_grant_id &&
                recordToFix.fez_record_search_key_grant_id.length > 0 &&
                recordToFix.fez_record_search_key_grant_id[index] &&
                recordToFix.fez_record_search_key_grant_id[index].rek_grant_id || '',
            grantAgencyType: recordToFix.fez_record_search_key_grant_agency_type &&
                recordToFix.fez_record_search_key_grant_agency_type.length > 0 &&
                recordToFix.fez_record_search_key_grant_agency_type[index] &&
                recordToFix.fez_record_search_key_grant_agency_type[index].rek_grant_agency_type || ORG_TYPE_NOT_SET,
            disabled: this.props.disableInitialGrants
        }));

        const affiliationDataMap = [
            {
                infoArray: recordToFix.fez_record_search_key_author,
                key: 'rek_author_order'
            },
            {
                infoArray: recordToFix.fez_record_search_key_author_affiliation_name,
                key: 'rek_author_affiliation_name_order'
            },
            {
                infoArray: recordToFix.fez_record_search_key_author_affiliation_type,
                key: 'rek_author_affiliation_type_order'
            },
        ];

        const authors = affiliationDataMap
            .reduce((authors, affiliationData) => leftJoin(
                authors,
                affiliationData.infoArray,
                'rek_author_id_order',
                affiliationData.key
            ), recordToFix.fez_record_search_key_author_id)
            .map((authorAffiliation) => ({
                affiliation: authorAffiliation.rek_author_affiliation_name === locale.global.orgTitle ? 'UQ' : 'NotUQ',
                creatorRole: '',
                nameAsPublished: authorAffiliation.rek_author,
                orgaff: authorAffiliation.rek_author_affiliation_name || '',
                orgtype: (authorAffiliation.rek_author_affiliation_type && String(authorAffiliation.rek_author_affiliation_type)) || '',
                uqIdentifier: String(authorAffiliation.rek_author_id),
                disabled: authorAffiliation.rek_author_id && authorAffiliation.rek_author_id !== author.aut_id,
            }))
            .map(authorAffiliation => ({
                ...authorAffiliation,
                required: authorAffiliationRequired(authorAffiliation, author)}
            ));

        const initialContributionStatements = canMasquerade && recordToFix.fez_record_search_key_creator_contribution_statement || [];
        const initialSignificance = canMasquerade && recordToFix.fez_record_search_key_significance || [];

        const languages = (
            recordToFix &&
            (recordToFix.fez_record_search_key_language || []).length > 0 &&
            recordToFix.fez_record_search_key_language.map(lang => lang.rek_language)
        ) || ['eng'];

        return {
            grants,
            authorsAffiliation: authors,
            languages,
            initialContributionStatements,
            initialSignificance
        };
    }

    getCurrentAuthorOrder = (recordToFix, author) => {
        const currentAuthor = recordToFix && recordToFix.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === author.aut_id);
        return currentAuthor.length > 0 && currentAuthor[0].rek_author_id_order;
    };

    getNtroFieldFlags = (recordToFix, author) => {
        const currentAuthorOrder = this.getCurrentAuthorOrder(recordToFix, author);

        return {
            hideAbstract: !!recordToFix.rek_formatted_abstract || !!recordToFix.rek_description,
            hideLanguage: (recordToFix.fez_record_search_key_language || []).length !== 0,
            hidePeerReviewActivity: (recordToFix.fez_record_search_key_quality_indicator || []).length !== 0,
            hideExtent: (
                [ DOCUMENT_TYPE_BOOK_CHAPTER, DOCUMENT_TYPE_JOURNAL_ARTICLE ].includes(recordToFix.rek_display_type_lookup) ||
                !!(recordToFix.fez_record_search_key_total_pages || {}).rek_total_pages
            ),
            hideAudienceSize: (
                ![ ...LP_NTRO_SUBTYPES, ...CPEE_NTRO_SUBTYPES ].includes(recordToFix.rek_subtype) ||
                !!(recordToFix.fez_record_search_key_audience_size || {}).rek_audience_size
            ),
            showSignificance: (
                (recordToFix.fez_record_search_key_significance || []).length === 0 ||
                recordToFix.fez_record_search_key_significance.filter(item => (
                    item.rek_significance_order === currentAuthorOrder &&
                    !item.rek_significance
                )).length > 0
            ),
            showContributionStatement: (
                (recordToFix.fez_record_search_key_creator_contribution_statement || []).length === 0 ||
                recordToFix.fez_record_search_key_creator_contribution_statement.filter(item => (
                    item.rek_creator_contribution_statement_order === currentAuthorOrder &&
                    (
                        !item.rek_creator_contribution_statement ||
                        item.rek_creator_contribution_statement === '' ||
                        item.rek_creator_contribution_statement === locale.global.defaultAuthorDataPlaceholder
                    )
                )).length > 0
            )
        };
    };

    isFileValid = (dataStream) => {
        const {files: {blacklist}} = incompleteRecord;
        return !dataStream.dsi_dsid.match(blacklist.namePrefixRegex)
            && (!dataStream.dsi_label || !dataStream.dsi_label.match(new RegExp(blacklist.descriptionKeywordsRegex, 'gi')))
            && dataStream.dsi_state === 'A';
    };

    render() {
        const txt = pagesLocale.pages.incompletePublication;
        const { accountAuthorLoading, loadingRecordToFix } = this.props;

        // display loading spinner
        if (accountAuthorLoading || loadingRecordToFix) return (<InlineLoader message={txt.loadingMessage} />);

        return (
            <MyIncompleteRecordForm {...this.state} {...this.props} />
        );
    }
}
