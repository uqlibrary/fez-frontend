import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { useSelector } from 'react-redux';
import * as actions from 'actions';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import ContributorRowHeader from './ContributorRowHeader';
import ContributorRow from './ContributorRow';
import ContributorForm from './ContributorForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import AuthorsListWithAffiliates from 'modules/Admin/components/authors/AuthorsListWithAffiliates';
import AuthorsList from 'modules/Admin/components/authors/AuthorsList';

import { diff } from 'deep-object-diff';
import { isArrayDeeplyEqual } from '../../../../helpers/general';

export const getContributorsFromProps = input => {
    if (input?.name && input?.value) {
        const ret = input.value instanceof Immutable.List ? input.value.toJS() : input.value;
        return Array.isArray(ret) ? ret : [];
    }
    return [];
};

export const getContributorsWithAffiliationsFromProps = (input, record) => {
    const authors = getContributorsFromProps(input);
    console.log(input, authors);
    if (authors.every(author => !!author.affiliations)) return authors;

    const affiliations = record?.fez_author_affiliation ?? [];
    return authors.map(author => ({
        ...author,
        affiliations: affiliations.filter(affiliation => affiliation.af_author_id === author.aut_id),
    }));
};

export const buildInitialScaleOfSignificance = props => {
    if (!props.isNtro) return [];

    const ScaleOfSignificance = [];
    props.record?.fez_record_search_key_significance &&
        props.record?.fez_record_search_key_significance.length > 0 &&
        props.record?.fez_record_search_key_significance.map((item, index) => {
            // check here for the length of the significance vs the authors.
            /* istanbul ignore else */
            if (props.record?.fez_record_search_key_author.length >= index + 1) {
                ScaleOfSignificance[index] = {};
                ScaleOfSignificance[index].id = item.rek_significance_id;
                ScaleOfSignificance[index].key = item.rek_significance;
                ScaleOfSignificance[index].value = {
                    plainText:
                        props.record?.fez_record_search_key_creator_contribution_statement[index]
                            ?.rek_creator_contribution_statement || /* istanbul ignore next */ 'Missing',
                    htmlText:
                        props.record?.fez_record_search_key_creator_contribution_statement[index]
                            ?.rek_creator_contribution_statement || /* istanbul ignore next */ 'Missing',
                };
                ScaleOfSignificance[index].author = {
                    rek_author_id:
                        props.record?.fez_record_search_key_author[index]?.rek_author_id ||
                        /* istanbul ignore next */ 0,
                    rek_author_pid:
                        props.record?.fez_record_search_key_author[index]?.rek_author_pid ||
                        /* istanbul ignore next */ null,
                    rek_author:
                        props.record?.fez_record_search_key_author[index]?.rek_author ||
                        /* istanbul ignore next */ null,
                    rek_author_order: index + 1,
                };
            }
        });
    // create a default scale if there's no records in there.
    (!props.record?.fez_record_search_key_significance ||
        props.record?.fez_record_search_key_significance?.length === 0) &&
        props.record?.fez_record_search_key_author?.map((item, index) => {
            ScaleOfSignificance[index] = {};
            ScaleOfSignificance[index].id = 0;
            ScaleOfSignificance[index].key = 0;
            ScaleOfSignificance[index].value = {
                plainText: 'Missing',
                htmlText: 'Missing',
            };
            ScaleOfSignificance[index].author = {
                rek_author_id:
                    props.record?.fez_record_search_key_author[index]?.rek_author_id || /* istanbul ignore next */ 0,
                rek_author_pid:
                    props.record?.fez_record_search_key_author[index]?.rek_author_pid ||
                    /* istanbul ignore next */ null,
                rek_author:
                    props.record?.fez_record_search_key_author[index]?.rek_author || /* istanbul ignore next */ null,
                rek_author_order: index + 1,
            };
        });
    return ScaleOfSignificance;
};

export const handleSoSChange = (oldContribs, newContribs, scaleOfSignificance) => {
    const updated = diff(oldContribs, newContribs);
    if (Object.keys(updated).length < 1) {
        return scaleOfSignificance;
    } else {
        // First check for length changes - that means either a new contrib is added, or one is deleted.
        // Check if one is Added.
        let newList = [];
        if (oldContribs.length < newContribs.length) {
            // Add a SoS to the list.
            const newItem = {
                id: 0,
                key: 0,
                value: {
                    plainText: 'Missing',
                    htmlText: 'Missing',
                },
                author: {
                    rek_author: newContribs[newContribs.length - 1].nameAsPublished,
                },
            };
            if (newContribs.length > 1) {
                newList = [...scaleOfSignificance, newItem];
            } else {
                newList = [newItem];
            }
        } else if (oldContribs.length > newContribs.length) {
            let found = false;
            newList = [...scaleOfSignificance];
            oldContribs.map((contributor, index) => {
                if (!found && JSON.stringify(contributor) !== JSON.stringify(newContribs[index])) {
                    newList.splice(index, 1);
                    found = true;
                }
            });
        } else {
            const changedIndexes = [];
            const newScaleOfSignificance = [...scaleOfSignificance];
            newScaleOfSignificance.length > 0 &&
                newContribs.length === newScaleOfSignificance.length &&
                newContribs.map((contrib, index) => {
                    if (contrib.nameAsPublished !== newScaleOfSignificance[index].author.rek_author) {
                        changedIndexes.push(index);
                    }
                });

            if (changedIndexes.length === 1) {
                // Its a name change - no order change
                newScaleOfSignificance[changedIndexes[0]].author.rek_author =
                    newContribs[changedIndexes[0]].nameAsPublished;
            }
            if (changedIndexes.length === 2) {
                // It's an order change

                newScaleOfSignificance[changedIndexes[0]] = newScaleOfSignificance[changedIndexes[1]];
                newScaleOfSignificance[changedIndexes[1]] = newScaleOfSignificance[changedIndexes[0]];
            }

            newList = newScaleOfSignificance;
        }
        actions.updateAdminScaleSignificance(newList);

        return newList;
    }
};

const ContributorsEditor = props => {
    const {
        canEdit = false,
        forceSelectable = false,
        contributorEditorId,
        disabled,
        editMode = false,
        hideDelete = false,
        hideReorder = false,
        input,
        isNtro = false,
        isAdmin,
        locale = {
            errorTitle: 'Error',
            errorMessage: 'Unable to add an item with the same identifier.',
        },
        meta,
        onChange,
        shouldHandleAffiliations,
        showContributorAssignment = false,
        showIdentifierLookup = false,
        showRoleInput = false,
        maintainSelected = false,
        useFormReducer = false,
    } = props;
    const [contributors, setContributors] = useState([]);
    const [scaleOfSignificance, setScaleOfSignificance] = useState([]);
    const [contributorIndexSelectedToEdit, setContributorIndexSelectedToEdit] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isCurrentAuthorSelected, setIsCurrentAuthorSelected] = useState(false);
    const [prevValue, setPrevValue] = useState([]);

    const author = useSelector(state => state.get('accountReducer').author || null);
    const record = useSelector(state => state.get('viewRecordReducer').recordToView || null);
    const { scaleOfSignificance: scaleOfSignificanceFromProps = /* istanbul ignore next */ [] } = useSelector(
        state => state.get('adminScaleOfSignificanceReducer') || /* istanbul ignore next */ {},
    );

    console.log(props, record);
    // useEffect(() => {
    //     console.log('mount');
    //     const newContributors = getContributorsWithAffiliationsFromProps(input, record);
    //     setContributors(newContributors);
    //     const newScaleOfSignificance = buildInitialScaleOfSignificance({ record, isNtro });
    //     setScaleOfSignificance(newScaleOfSignificance);
    //     setPrevValue(Array.isArray(input?.value) ? input.value : []);
    //     onChange?.(newContributors);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        console.log('update');
        const propsInputValue = Array.isArray(input?.value) ? input.value : [];
        const newContributors = getContributorsWithAffiliationsFromProps(input, record);
        if (!isArrayDeeplyEqual(propsInputValue, prevValue)) {
            console.log('input update', propsInputValue, prevValue);
            setPrevValue(propsInputValue);
            setContributors(newContributors);
        }

        // if (!isArrayDeeplyEqual(newContributors, contributors)) {
        //     console.log('parent update', { newContributors, contributors });
        //     onChange?.(newContributors);
        // }

        if (useFormReducer) {
            const updated = diff(scaleOfSignificance, scaleOfSignificanceFromProps);
            if (Object.keys(updated).length > 0) {
                setScaleOfSignificance(scaleOfSignificanceFromProps);
            } else {
                const updatedScaleOfSignificance = handleSoSChange(
                    contributors,
                    newContributors,
                    scaleOfSignificanceFromProps,
                );
                setScaleOfSignificance(updatedScaleOfSignificance);
            }
        }
    }, [
        contributors,
        input,
        onChange,
        prevValue,
        record,
        scaleOfSignificance,
        scaleOfSignificanceFromProps,
        useFormReducer,
    ]);

    const addContributor = useCallback(
        contributor => {
            const index =
                contributorIndexSelectedToEdit !== null ? contributorIndexSelectedToEdit : contributors.length;

            const isDuplicate = contributors.some(
                (item, itemIndex) =>
                    !!contributor.aut_id &&
                    item.aut_id === contributor.aut_id &&
                    (index >= contributors.length || index !== itemIndex),
            );

            if (isDuplicate) {
                setErrorMessage(locale.errorMessage);
                return;
            }

            const isContributorACurrentAuthor = author && contributor.uqIdentifier === `${author.aut_id}`;

            const updatedContributors = [
                ...contributors.slice(0, index).map(contrib => ({
                    ...contrib,
                    selected: isContributorACurrentAuthor ? false : contrib.selected,
                    ...(!isNtro ? { selected: contrib.selected } : {}),
                    authorId:
                        isContributorACurrentAuthor && contrib.authorId === author.aut_id ? null : contrib.authorId,
                })),
                {
                    ...contributor,
                    disabled: editMode && !isContributorACurrentAuthor && !!parseInt(contributor.uqIdentifier, 10),
                    selected: !editMode && isContributorACurrentAuthor,
                    ...(!isNtro ? { selected: contributor.selected } : {}),
                    authorId: isContributorACurrentAuthor ? author.aut_id : null,
                    required: contributor.required || false,
                },
                ...contributors.slice(index + 1).map(contrib => ({
                    ...contrib,
                    selected: isContributorACurrentAuthor ? false : contrib.selected,
                    ...(!isNtro ? { selected: contrib.selected } : {}),
                    authorId:
                        isContributorACurrentAuthor && contrib.authorId === author.aut_id ? null : contrib.authorId,
                })),
            ];

            setContributors(updatedContributors);
            setErrorMessage('');
            setIsCurrentAuthorSelected(isCurrentAuthorSelected || isContributorACurrentAuthor);
            setContributorIndexSelectedToEdit(null);
        },
        [
            author,
            contributors,
            contributorIndexSelectedToEdit,
            editMode,
            isCurrentAuthorSelected,
            isNtro,
            locale.errorMessage,
        ],
    );

    const moveUpContributor = (contributor, index) => {
        if (index === 0) return;
        const nextContributor = contributors[index - 1];
        setContributors([
            ...contributors.slice(0, index - 1),
            contributor,
            nextContributor,
            ...contributors.slice(index + 1),
        ]);
    };

    const moveDownContributor = (contributor, index) => {
        if (index === contributors.length - 1) return;
        const nextContributor = contributors[index + 1];
        setContributors([
            ...contributors.slice(0, index),
            nextContributor,
            contributor,
            ...contributors.slice(index + 2),
        ]);
    };

    const deleteContributor = (contributor, index) => {
        setContributors(contributors.filter((_, i) => i !== index));
        setIsCurrentAuthorSelected(isCurrentAuthorSelected && author && contributor.aut_id !== author.aut_id);
    };

    const deleteAllContributors = () => {
        setContributors([]);
        setIsCurrentAuthorSelected(false);
    };

    const assignContributor = index => {
        const newContributors =
            (!isCurrentAuthorSelected &&
                contributors.map((item, itemIndex) => ({
                    ...item,
                    selected: !item.selected && index === itemIndex,
                    authorId: (!item.selected && index === itemIndex && author?.aut_id) || null,
                }))) ||
            contributors;

        setContributors(newContributors);
    };

    const selectContributor = index => {
        setContributors(prevContributors =>
            prevContributors.map((contributor, itemIndex) => ({
                ...contributor,
                ...(!maintainSelected ? { selected: index === itemIndex } : {}),
            })),
        );
        setContributorIndexSelectedToEdit(index);
    };

    const renderContributorRows = () => {
        return contributors.map((contributor, index) => (
            <ContributorRow
                {...(locale.row || {})}
                canEdit={canEdit}
                canMoveDown={index !== contributors.length - 1}
                canMoveUp={index !== 0}
                contributor={contributor}
                disabled={disabled}
                hideDelete={hideDelete}
                hideReorder={hideReorder}
                index={index}
                className={'ContributorRow'}
                key={`ContributorRow_${index}`}
                onSelect={!canEdit || forceSelectable ? assignContributor : null}
                onEdit={selectContributor}
                onDelete={deleteContributor}
                onMoveDown={moveDownContributor}
                onMoveUp={moveUpContributor}
                required={contributor.required}
                enableSelect={(showContributorAssignment && !isCurrentAuthorSelected) || forceSelectable}
                showIdentifierLookup={showIdentifierLookup}
                showRoleInput={showRoleInput}
                contributorRowId={`${contributorEditorId}-list-row`}
            />
        ));
    };

    const renderContributorForm = (editProps = {}) => {
        const contributor = contributors[contributorIndexSelectedToEdit];
        const formProps = {
            ...props,
            ...editProps,
            isContributorAssigned: !!contributors.length,
            locale: (locale.form || {}).locale,
            contributor,
            displayCancel: canEdit,
            canEdit,
        };
        return (
            <ContributorForm
                key={
                    contributorIndexSelectedToEdit !== null && contributorIndexSelectedToEdit >= 0
                        ? `contributor-form-edit-${contributorIndexSelectedToEdit}`
                        : 'contributor-form-add'
                }
                onSubmit={addContributor}
                contributorFormId={props.contributorEditorId}
                {...formProps}
            />
        );
    };

    const handleAuthorsListChange = contributors => {
        setContributors(contributors);
        onChange?.(contributors);
    };

    let error = null;
    if ((meta || {}).error) {
        error =
            !!meta.error.props &&
            React.Children.map(meta.error.props.children, (child, index) => {
                return child.type ? React.cloneElement(child, { key: index }) : child;
            });
    }

    if (isAdmin) {
        console.log({
            record,
            shouldHandleAffiliations,
            contributors,
            scaleOfSignificance,
            contributorIndexSelectedToEdit,
            errorMessage,
            isCurrentAuthorSelected,
            prevValue,
        });
        return shouldHandleAffiliations ? (
            <AuthorsListWithAffiliates
                contributorEditorId={contributorEditorId}
                disabled={disabled}
                list={contributors}
                onChange={handleAuthorsListChange}
                showRoleInput={showRoleInput}
                locale={locale}
                isNtro={isNtro}
                useFormReducer={useFormReducer}
            />
        ) : (
            <AuthorsList
                contributorEditorId={contributorEditorId}
                disabled={disabled}
                list={contributors}
                onChange={handleAuthorsListChange}
                showRoleInput={showRoleInput}
                locale={locale}
                isNtro={isNtro}
                useFormReducer={useFormReducer}
            />
        );
    }
    return (
        <div className={'contributorEditor'} id={`${props.contributorEditorId}-list-editor`}>
            <Grid container spacing={1}>
                {errorMessage && (
                    <Grid item xs={12}>
                        <Alert title={locale.errorTitle} message={errorMessage} type="warning" />
                    </Grid>
                )}
                {!editMode && (
                    <Grid item xs={12}>
                        {renderContributorForm()}
                    </Grid>
                )}
            </Grid>
            {contributors.length > 0 && (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <List style={{ marginBottom: 0 }}>
                            <ContributorRowHeader
                                {...(locale.header || {})}
                                disabled={disabled}
                                canEdit={canEdit}
                                hideDelete={hideDelete}
                                isInfinite={contributors.length > 20}
                                isNtro={isNtro}
                                onDeleteAll={deleteAllContributors}
                                showContributorAssignment={props.showContributorAssignment}
                                showIdentifierLookup={props.showIdentifierLookup}
                                showRoleInput={props.showRoleInput}
                            />
                        </List>
                        <List
                            id={`${props.contributorEditorId}-list`}
                            data-analyticsid={`${props.contributorEditorId}-list`}
                            data-testid={`${props.contributorEditorId}-list`}
                            sx={theme => ({
                                width: '100%',
                                margin: '0',
                                maxHeight: '225px',
                                overflowX: 'hidden',
                                overflowY: 'hidden',
                                marginBottom: 2,
                                [theme.breakpoints.down('md')]: {
                                    overflowY: 'scroll',
                                },
                                ...(contributors.length > 3 && { overflowY: 'scroll' }),
                            })}
                            classes={{
                                root: 'ContributorList',
                            }}
                        >
                            {renderContributorRows()}
                        </List>
                        {editMode && contributorIndexSelectedToEdit !== null && (
                            <div style={{ marginTop: 24 }}>
                                {renderContributorForm({
                                    disableNameAsPublished: true,
                                    enableUqIdentifierOnAffiliationChange: false,
                                })}
                            </div>
                        )}
                    </Grid>
                </Grid>
            )}
            {(meta || {}).error && (
                <Typography color="error" variant="caption">
                    {error || meta.error}
                </Typography>
            )}
        </div>
    );
};

ContributorsEditor.propTypes = {
    canEdit: PropTypes.bool,
    forceSelectable: PropTypes.bool,
    contributorEditorId: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    editMode: PropTypes.bool,
    hideDelete: PropTypes.bool,
    hideReorder: PropTypes.bool,
    input: PropTypes.object,
    isNtro: PropTypes.bool,
    isAdmin: PropTypes.bool,
    locale: PropTypes.object,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    shouldHandleAffiliations: PropTypes.bool,
    showContributorAssignment: PropTypes.bool,
    showIdentifierLookup: PropTypes.bool,
    showRoleInput: PropTypes.bool,
    maintainSelected: PropTypes.bool,
    useFormReducer: PropTypes.bool,
};

export default React.memo(ContributorsEditor);
