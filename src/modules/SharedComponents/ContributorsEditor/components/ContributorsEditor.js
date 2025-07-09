import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import { hasAtLeastOneItemSelected, isArrayDeeplyEqual } from '../../../../helpers/general';
import { locale } from 'locale';

export class ContributorsEditor extends PureComponent {
    static propTypes = {
        author: PropTypes.object,
        canEdit: PropTypes.bool,
        forceSelectable: PropTypes.bool,
        classes: PropTypes.object,
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
        required: PropTypes.bool,
        shouldHandleAffiliations: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        showIdentifierLookup: PropTypes.bool,
        showRoleInput: PropTypes.bool,
        record: PropTypes.object,
        maintainSelected: PropTypes.bool,
        actions: PropTypes.any,
        useFormReducer: PropTypes.bool,
        scaleOfSignificance: PropTypes.array,
    };

    static defaultProps = {
        maintainSelected: false,
        canEdit: false,
        forceSelectable: false,
        editMode: false,
        hideDelete: false,
        hideReorder: false,
        isNtro: false,
        locale: {
            errorTitle: 'Error',
            errorMessage: 'Unable to add an item with the same identifier.',
        },
        showContributorAssignment: false,
        showIdentifierLookup: false,
        showRoleInput: false,
        useFormReducer: false,
        scaleOfSignificance: [],
    };

    constructor(props) {
        super(props);
        const items = this.getContributorsWithAffiliationsFromProps(props);
        this.state = {
            contributors: items,
            error: this.props.required && !hasAtLeastOneItemSelected(items) && locale.validationErrors.authorRequired,
            errorMessage: '',
            isCurrentAuthorSelected: false,
            contributorIndexSelectedToEdit: null,
            scaleOfSignificance: this.buildInitialScaleOfSignificance(props),
        };
        this.props.onChange?.(this.state.contributors);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.input?.value !== this.props.input?.value) {
            const items = this.getContributorsWithAffiliationsFromProps(this.props);
            this.setState({
                contributors: items,
                error:
                    this.props.required && !hasAtLeastOneItemSelected(items) && locale.validationErrors.authorRequired,
            });
        }
        // notify parent component when local state has been updated, eg contributors added/removed/reordered
        if (!isArrayDeeplyEqual(prevState?.contributors, this.state?.contributors)) {
            this.props.onChange?.(this.state.contributors);
        }
        const updated = diff(this.props.scaleOfSignificance, prevProps.scaleOfSignificance);
        if (this.props.useFormReducer) {
            if (Object.keys(updated).length > 0) {
                this.state.scaleOfSignificance = this.props.scaleOfSignificance;
            } else {
                this.state.scaleOfSignificance = this.handleSoSChange(
                    prevState.contributors,
                    this.state.contributors,
                    this.props.scaleOfSignificance,
                );
            }
        }
    }
    buildInitialScaleOfSignificance = props => {
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
            });
        return ScaleOfSignificance;
    };

    getContributorsFromProps = props => {
        if (props.input && props.input.name && props.input.value) {
            return props.input.value instanceof Immutable.List ? props.input.value.toJS() : props.input.value;
        }

        return [];
    };

    getContributorsWithAffiliationsFromProps = props => {
        const authors = this.getContributorsFromProps(props);
        if (authors.every(author => !!author.affiliations)) return authors;

        const affiliations = props.record?.fez_author_affiliation ?? [];
        return authors.map(author => {
            return {
                ...author,
                affiliations: affiliations.filter(affiliation => affiliation.af_author_id === author.aut_id),
            };
        });
    };

    addContributor = contributor => {
        const index =
            this.state.contributorIndexSelectedToEdit !== null
                ? this.state.contributorIndexSelectedToEdit
                : this.state.contributors.length;
        /* istanbul ignore else */
        if (index < this.state.contributors.length && this.props.canEdit) {
            const isEditedContributorAuthorIdInTheList =
                this.state.contributors.filter(
                    (item, itemIndex) =>
                        !!contributor.aut_id && item.aut_id === contributor.aut_id && index !== itemIndex,
                ).length > 0;
            if (isEditedContributorAuthorIdInTheList) {
                this.setState({
                    errorMessage: this.props.locale.errorMessage,
                });
                return;
            }
        } else if (
            this.state.contributors.filter(item => {
                return !!contributor.aut_id && item.aut_id === contributor.aut_id;
            }).length > 0
        ) {
            this.setState({
                errorMessage: this.props.locale.errorMessage,
            });
            return;
        }
        const isContributorACurrentAuthor = contributor.uqIdentifier === `${this.props.author?.aut_id}`;
        // if the contributor being updated is the author of the publication, we should keep its authorId
        const isUpdatingPublicationAuthor =
            this.props.canEdit &&
            contributor.selected &&
            parseInt(contributor.authorId, 10) === parseInt(this.props.author?.aut_id, 10);

        /* istanbul ignore next */
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index).map(contrib => ({
                    ...contrib,
                    selected: isContributorACurrentAuthor ? false : contrib.selected,
                    ...(!this.props.isNtro ? { selected: contrib.selected } : {}),
                    authorId:
                        isContributorACurrentAuthor && contrib.authorId === this.props.author.aut_id
                            ? null
                            : contrib.authorId,
                })),
                {
                    ...contributor,
                    disabled:
                        this.props.editMode && !isContributorACurrentAuthor && !!parseInt(contributor.uqIdentifier, 10),
                    selected: !this.props.editMode && isContributorACurrentAuthor,
                    ...(!this.props.isNtro ? { selected: contributor.selected } : {}),
                    authorId:
                        isContributorACurrentAuthor || isUpdatingPublicationAuthor ? this.props.author.aut_id : null,
                    required: contributor.required || false,
                },
                ...this.state.contributors.slice(index + 1).map(contrib => ({
                    ...contrib,
                    selected: isContributorACurrentAuthor ? false : contrib.selected,
                    ...(!this.props.isNtro ? { selected: contrib.selected } : {}),
                    authorId:
                        isContributorACurrentAuthor && contrib.authorId === this.props.author.aut_id
                            ? null
                            : contrib.authorId,
                })),
            ],
            errorMessage: '',
            isCurrentAuthorSelected: this.state.isCurrentAuthorSelected || isContributorACurrentAuthor,
            contributorIndexSelectedToEdit: null,
        });
    };

    moveUpContributor = (contributor, index) => {
        /* istanbul ignore next */
        if (index === 0) return;
        const nextContributor = this.state.contributors[index - 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index - 1),
                contributor,
                nextContributor,
                ...this.state.contributors.slice(index + 1),
            ],
        });
    };

    moveDownContributor = (contributor, index) => {
        /* istanbul ignore next */
        if (index === this.state.contributors.length - 1) return;
        const nextContributor = this.state.contributors[index + 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index),
                nextContributor,
                contributor,
                ...this.state.contributors.slice(index + 2),
            ],
        });
    };

    deleteContributor = (contributor, index) => {
        this.setState({
            contributors: this.state.contributors.filter((_, i) => i !== index),
            isCurrentAuthorSelected:
                this.state.isCurrentAuthorSelected &&
                this.props.author &&
                contributor.aut_id !== this.props.author.aut_id,
        });
    };

    deleteAllContributors = () => {
        this.setState({
            contributors: [],
            isCurrentAuthorSelected: false,
        });
    };

    assignContributor = index => {
        const newContributors =
            (!this.state.isCurrentAuthorSelected &&
                this.state.contributors.map((item, itemIndex) => ({
                    ...item,
                    selected: !item.selected && index === itemIndex,
                    // eslint-disable-next-line camelcase
                    authorId: (!item.selected && index === itemIndex && this.props.author?.aut_id) || null,
                }))) ||
            /* istanbul ignore next */ this.state.contributors;

        this.setState({
            contributors: newContributors,
        });
    };

    selectContributor = index => {
        this.setState(prevState => ({
            contributors: prevState.contributors.map((contributor, itemIndex) => ({
                ...contributor,
                ...(!this.props.maintainSelected ? { selected: index === itemIndex } : {}),
                // selected: index === itemIndex,
            })),
            contributorIndexSelectedToEdit: index,
        }));
    };

    renderContributorRows = () => {
        const {
            contributorEditorId,
            canEdit,
            forceSelectable,
            disabled,
            hideDelete,
            hideReorder,
            locale,
            showContributorAssignment,
            showIdentifierLookup,
            showRoleInput,
        } = this.props;

        const { contributors, isCurrentAuthorSelected } = this.state;
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
                onSelect={!canEdit || forceSelectable ? this.assignContributor : null}
                onEdit={this.selectContributor}
                onDelete={this.deleteContributor}
                onMoveDown={this.moveDownContributor}
                onMoveUp={this.moveUpContributor}
                required={contributor.required}
                enableSelect={(showContributorAssignment && !isCurrentAuthorSelected) || forceSelectable}
                showIdentifierLookup={showIdentifierLookup}
                showRoleInput={showRoleInput}
                contributorRowId={`${contributorEditorId}-list-row`}
            />
        ));
    };

    renderContributorForm = (editProps = {}) => {
        const { contributorIndexSelectedToEdit } = this.state;
        const contributor = this.state.contributors[contributorIndexSelectedToEdit];
        const formProps = {
            ...this.props,
            ...editProps,
            isContributorAssigned: !!this.state.contributors.length,
            locale: (this.props.locale.form || {}).locale,
            contributor,
            displayCancel: this.props.canEdit, // admin can cancel and clear the edit form
            canEdit: this.props.canEdit,
        };
        return (
            <ContributorForm
                key={
                    this.state.contributorIndexSelectedToEdit !== null && this.state.contributorIndexSelectedToEdit >= 0
                        ? `contributor-form-edit-${this.state.contributorIndexSelectedToEdit}`
                        : 'contributor-form-add'
                }
                onSubmit={this.addContributor}
                contributorFormId={this.props.contributorEditorId}
                {...formProps}
            />
        );
    };

    handleSoSChange = (oldContribs, newContribs) => {
        const updated = diff(oldContribs, newContribs);
        if (Object.keys(updated).length < 1) {
            return this.state.scaleOfSignificance;
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
                    newList = [...this.state.scaleOfSignificance, newItem];
                } else {
                    newList = [newItem];
                }
            } else if (oldContribs.length > newContribs.length) {
                let found = false;
                newList = [...this.state.scaleOfSignificance];
                oldContribs.map((contributor, index) => {
                    if (!found && JSON.stringify(contributor) !== JSON.stringify(newContribs[index])) {
                        newList.splice(index, 1);
                        found = true;
                    }
                });
            } else {
                const changedIndexes = [];
                const scaleOfSignificance = [...this.state.scaleOfSignificance];
                this.state.scaleOfSignificance.length > 0 &&
                    newContribs.length === this.state.scaleOfSignificance.length &&
                    newContribs.map((contrib, index) => {
                        if (contrib.nameAsPublished !== this.state.scaleOfSignificance[index].author.rek_author) {
                            changedIndexes.push(index);
                        }
                    });

                if (changedIndexes.length === 1) {
                    // Its a name change - no order change
                    scaleOfSignificance[changedIndexes[0]].author.rek_author =
                        newContribs[changedIndexes[0]].nameAsPublished;
                }
                if (changedIndexes.length === 2) {
                    // It's an order change

                    scaleOfSignificance[changedIndexes[0]] = this.state.scaleOfSignificance[changedIndexes[1]];
                    scaleOfSignificance[changedIndexes[1]] = this.state.scaleOfSignificance[changedIndexes[0]];
                }

                newList = scaleOfSignificance;
            }
            this.props.actions.updateAdminScaleSignificance(newList);

            return newList;
        }
    };

    handleAuthorsListChange = contributors => {
        this.setState({
            contributors,
        });
    };

    render() {
        const {
            contributorEditorId,
            disabled,
            canEdit,
            editMode,
            hideDelete,
            isNtro,
            isAdmin,
            meta,
            showContributorAssignment,
            showIdentifierLookup,
            showRoleInput,
            useFormReducer,
        } = this.props;

        const { contributors, errorMessage, contributorIndexSelectedToEdit } = this.state;

        let error = meta?.error || this.state.error;
        if (!!meta?.error?.props) {
            error = React.Children.map(meta.error.props.children, (child, index) => {
                return child.type ? React.cloneElement(child, { key: index }) : child;
            });
        }

        if (isAdmin) {
            return this.props.shouldHandleAffiliations ? (
                <AuthorsListWithAffiliates
                    contributorEditorId={contributorEditorId}
                    disabled={disabled}
                    list={contributors}
                    onChange={this.handleAuthorsListChange}
                    showRoleInput={showRoleInput}
                    locale={this.props.locale}
                    isNtro={isNtro}
                    useFormReducer={useFormReducer}
                />
            ) : (
                <AuthorsList
                    contributorEditorId={contributorEditorId}
                    disabled={disabled}
                    list={contributors}
                    onChange={this.handleAuthorsListChange}
                    showRoleInput={showRoleInput}
                    locale={this.props.locale}
                    isNtro={isNtro}
                    useFormReducer={useFormReducer}
                />
            );
        }

        return (
            <div className={'contributorEditor'} id={`${contributorEditorId}-list-editor`}>
                <Grid container spacing={1}>
                    {errorMessage && (
                        <Grid item xs={12}>
                            <Alert title={this.props.locale.errorTitle} message={errorMessage} type="warning" />
                        </Grid>
                    )}
                    {!editMode && (
                        <Grid item xs={12}>
                            {this.renderContributorForm()}
                        </Grid>
                    )}
                </Grid>
                {contributors.length > 0 && (
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <List style={{ marginBottom: 0 }}>
                                <ContributorRowHeader
                                    {...(this.props.locale.header || {})}
                                    disabled={disabled}
                                    canEdit={canEdit}
                                    hideDelete={hideDelete}
                                    isInfinite={contributors.length > 20}
                                    isNtro={isNtro}
                                    onDeleteAll={this.deleteAllContributors}
                                    showContributorAssignment={showContributorAssignment}
                                    showIdentifierLookup={showIdentifierLookup}
                                    showRoleInput={showRoleInput}
                                />
                            </List>
                            <List
                                id={`${contributorEditorId}-list`}
                                data-analyticsid={`${contributorEditorId}-list`}
                                data-testid={`${contributorEditorId}-list`}
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
                                {this.renderContributorRows()}
                            </List>
                            {editMode && contributorIndexSelectedToEdit !== null && (
                                <div style={{ marginTop: 24 }}>
                                    {this.renderContributorForm({
                                        disableNameAsPublished: true,
                                        enableUqIdentifierOnAffiliationChange: false,
                                    })}
                                </div>
                            )}
                        </Grid>
                    </Grid>
                )}
                {error && (
                    <Typography color="error" variant="caption" data-testid={`${contributorEditorId}-error`}>
                        {error}
                    </Typography>
                )}
            </div>
        );
    }
}

export const mapStateToProps = state => ({
    author: state && state.get('accountReducer') ? state.get('accountReducer').author : null,
    record: state && state.get('viewRecordReducer') ? state.get('viewRecordReducer').recordToView : null,
    ...(state && state.get('adminScaleOfSignificanceReducer') ? state.get('adminScaleOfSignificanceReducer') : null),
});

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributorsEditor);
