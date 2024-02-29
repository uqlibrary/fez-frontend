import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Map } from 'immutable';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import {
    AFFILIATION_TYPE_NOT_UQ,
    AFFILIATION_TYPE_UQ,
    CPEE_NTRO_SUBTYPES,
    DOCUMENT_TYPE_BOOK_CHAPTER,
    DOCUMENT_TYPE_JOURNAL_ARTICLE,
    LP_NTRO_SUBTYPES,
    NTRO_SUBTYPES,
    ORG_TYPE_NOT_SET,
} from 'config/general';
import { isAdded } from 'helpers/datastreams';
import { leftJoin } from 'helpers/general';
import { locale } from 'locale';
import { authorAffiliationRequired } from 'config/validation';
import { default as pagesLocale } from '../locale';
import { incompleteRecord } from 'config';
import MyIncompleteRecordForm, { FORM_NAME } from './MyIncompleteRecordForm';
import { loadRecordToFix, clearFixRecord } from 'actions';
import { getFormSyncErrors } from 'redux-form/immutable';
import { userIsAdmin } from 'hooks';

const getInitialValues = (recordToFix, author, isAdmin, disableInitialGrants) => {
    const grants = recordToFix.fez_record_search_key_grant_agency?.map((grantAgency, index) => ({
        grantAgencyName: grantAgency.rek_grant_agency,
        grantId:
            (recordToFix.fez_record_search_key_grant_id &&
                recordToFix.fez_record_search_key_grant_id.length > 0 &&
                recordToFix.fez_record_search_key_grant_id[index] &&
                recordToFix.fez_record_search_key_grant_id[index].rek_grant_id) ||
            '',
        grantAgencyType:
            (recordToFix.fez_record_search_key_grant_agency_type &&
                recordToFix.fez_record_search_key_grant_agency_type.length > 0 &&
                recordToFix.fez_record_search_key_grant_agency_type[index] &&
                recordToFix.fez_record_search_key_grant_agency_type[index].rek_grant_agency_type) ||
            ORG_TYPE_NOT_SET,
        disabled: disableInitialGrants,
    }));

    const affiliationDataMap = [
        {
            infoArray: recordToFix.fez_record_search_key_author,
            key: 'rek_author_order',
        },
        {
            infoArray: recordToFix.fez_record_search_key_author_affiliation_name,
            key: 'rek_author_affiliation_name_order',
        },
        {
            infoArray: recordToFix.fez_record_search_key_author_affiliation_type,
            key: 'rek_author_affiliation_type_order',
        },
    ];

    const authors = affiliationDataMap
        .reduce(
            (authors, affiliationData) =>
                leftJoin(authors, affiliationData.infoArray, 'rek_author_id_order', affiliationData.key),
            recordToFix.fez_record_search_key_author_id,
        )
        .map(authorAffiliation => ({
            affiliation:
                authorAffiliation.rek_author_affiliation_name === locale.global.orgTitle
                    ? AFFILIATION_TYPE_UQ
                    : AFFILIATION_TYPE_NOT_UQ,
            creatorRole: '',
            nameAsPublished: authorAffiliation.rek_author,
            orgaff: authorAffiliation.rek_author_affiliation_name || '',
            orgtype:
                (authorAffiliation.rek_author_affiliation_type &&
                    String(authorAffiliation.rek_author_affiliation_type)) ||
                '',
            uqIdentifier: String(authorAffiliation.rek_author_id),
            disabled: authorAffiliation.rek_author_id && authorAffiliation.rek_author_id !== author.aut_id,
        }))
        .map(authorAffiliation => ({
            ...authorAffiliation,
            required: authorAffiliationRequired(authorAffiliation, author),
        }));

    const initialContributionStatements =
        (isAdmin && recordToFix.fez_record_search_key_creator_contribution_statement) || [];
    const initialSignificance = (isAdmin && recordToFix.fez_record_search_key_significance) || [];

    const languages = (recordToFix &&
        (recordToFix.fez_record_search_key_language || []).length > 0 &&
        recordToFix.fez_record_search_key_language.map(lang => lang.rek_language)) || ['eng'];

    return {
        grants,
        authorsAffiliation: authors,
        languages,
        initialContributionStatements,
        initialSignificance,
    };
};

const getCurrentAuthorOrder = (recordToFix, author) => {
    const currentAuthor =
        recordToFix &&
        recordToFix.fez_record_search_key_author_id.filter(authorId => authorId.rek_author_id === author.aut_id);
    return !!currentAuthor && currentAuthor.length > 0 && currentAuthor[0].rek_author_id_order;
};

const getNtroFieldFlags = (recordToFix, author) => {
    const currentAuthorOrder = getCurrentAuthorOrder(recordToFix, author);
    const significance = (recordToFix.fez_record_search_key_significance || []).filter(
        item => item.rek_significance_order === currentAuthorOrder,
    );
    const contributionStatement = (recordToFix.fez_record_search_key_creator_contribution_statement || []).filter(
        item => item.rek_creator_contribution_statement_order === currentAuthorOrder,
    );

    return {
        hideAbstract: !!recordToFix.rek_formatted_abstract || !!recordToFix.rek_description,
        hideLanguage: (recordToFix.fez_record_search_key_language || []).length !== 0,
        hidePeerReviewActivity: (recordToFix.fez_record_search_key_quality_indicator || []).length !== 0,
        hideExtent:
            [DOCUMENT_TYPE_BOOK_CHAPTER, DOCUMENT_TYPE_JOURNAL_ARTICLE].includes(recordToFix.rek_display_type_lookup) ||
            !!(recordToFix.fez_record_search_key_total_pages || {}).rek_total_pages,
        hideAudienceSize:
            ![...LP_NTRO_SUBTYPES, ...CPEE_NTRO_SUBTYPES].includes(recordToFix.rek_subtype) ||
            !!(recordToFix.fez_record_search_key_audience_size || {}).rek_audience_size,
        showSignificance: significance.length === 0 || (significance.length > 0 && !significance[0].rek_significance),
        showContributionStatement:
            contributionStatement.length === 0 ||
            (contributionStatement.length > 0 &&
                (!contributionStatement[0].rek_creator_contribution_statement ||
                    contributionStatement[0].rek_creator_contribution_statement === '' ||
                    contributionStatement[0].rek_creator_contribution_statement ===
                        locale.global.defaultAuthorDataPlaceholder)),
    };
};

const isFileValid = dataStream => {
    const {
        files: { blacklist },
    } = incompleteRecord;
    return !dataStream.dsi_dsid.match(blacklist.namePrefixRegex) && isAdded(dataStream);
};

const isLoggedInUserLinked = (author, recordToFix, searchKey, subkey) => {
    return (
        !!author &&
        !!recordToFix &&
        recordToFix[searchKey] &&
        recordToFix[searchKey].length > 0 &&
        recordToFix[searchKey].some(authorId => authorId[subkey] === author.aut_id)
    );
};

const getIsAuthorLinked = (recordToFix, author) => {
    const isAuthorLinked = isLoggedInUserLinked(
        author,
        recordToFix,
        'fez_record_search_key_author_id',
        'rek_author_id',
    );
    const isContributorLinked = isLoggedInUserLinked(
        author,
        recordToFix,
        'fez_record_search_key_contributor_id',
        'rek_contributor_id',
    );

    return isAuthorLinked || isContributorLinked;
};

export const MyIncompleteRecordContainer = ({ disableInitialGrants, ...rest }) => {
    const dispatch = useDispatch();
    const isAdmin = userIsAdmin();
    const { pid } = useParams();

    /* Reading reducers */
    const recordToFix = useSelector(state => state.get('fixRecordReducer').recordToFix);
    const loadingRecordToFix = useSelector(state => state.get('fixRecordReducer').loadingRecordToFix);
    const account = useSelector(state => state.get('accountReducer').account);
    const author = useSelector(state => state.get('accountReducer').author);
    const accountAuthorLoading = useSelector(state => state.get('accountReducer').accountAuthorLoading);

    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const disableSubmit = !!formErrors && !(formErrors instanceof Map) && Object.keys(formErrors).length > 0;

    /* Initial state */
    const [ntroFieldProps, setNtroFieldProps] = React.useState({});
    const [initialValues, setInitialValues] = React.useState({});
    const [isNtro, setIsNtro] = React.useState(false);
    const [hasAnyFiles, setHasAnyFiles] = React.useState(false);
    const [isAuthorLinked, setIsAuthorLinked] = React.useState(true);

    const txt = pagesLocale;

    React.useEffect(() => {
        !recordToFix && !!loadRecordToFix && dispatch(loadRecordToFix(pid));

        return () => dispatch(clearFixRecord());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!!recordToFix) {
            setNtroFieldProps(getNtroFieldFlags(recordToFix, author));
            setInitialValues(getInitialValues(recordToFix, author, isAdmin, disableInitialGrants));
            setIsNtro(!!recordToFix.rek_subtype && !!NTRO_SUBTYPES.includes(recordToFix.rek_subtype));
            setHasAnyFiles(recordToFix.fez_datastream_info.filter(isFileValid).length > 0);
            setIsAuthorLinked(getIsAuthorLinked(recordToFix, author));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recordToFix]);

    if (accountAuthorLoading || loadingRecordToFix) {
        return <InlineLoader message={txt.loadingMessage} />;
    }

    return (
        <MyIncompleteRecordForm
            key={JSON.stringify(initialValues)}
            ntroFieldProps={ntroFieldProps}
            initialValues={initialValues}
            isNtro={isNtro}
            hasAnyFiles={hasAnyFiles}
            isAuthorLinked={isAuthorLinked}
            disableInitialGrants={disableInitialGrants}
            disableSubmit={disableSubmit}
            account={account}
            author={author}
            recordToFix={recordToFix}
            {...rest}
        />
    );
};

MyIncompleteRecordContainer.propTypes = {
    disableInitialGrants: PropTypes.bool,
    match: PropTypes.shape({
        params: PropTypes.shape({
            pid: PropTypes.string.isRequired,
        }),
    }),
};

export default React.memo(MyIncompleteRecordContainer);
