import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import ContributorRowHeader from './ContributorRowHeader';
import ContributorRow from './ContributorRow';
import ContributorForm from './ContributorForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

export class ContributorsEditor extends PureComponent {
    static propTypes = {
        author: PropTypes.object,
        classes: PropTypes.object,
        disabled: PropTypes.bool,
        hideDelete: PropTypes.bool,
        hideReorder: PropTypes.bool,
        input: PropTypes.object,
        isNtro: PropTypes.bool,
        locale: PropTypes.object,
        meta: PropTypes.object,
        onChange: PropTypes.func,
        required: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        showIdentifierLookup: PropTypes.bool,
        showRoleInput: PropTypes.bool,
        editMode: PropTypes.bool,
        canEdit: PropTypes.bool,
    };

    static defaultProps = {
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
        editMode: false,
        canEdit: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            contributors: this.getContributorsFromProps(props),
            errorMessage: '',
            isCurrentAuthorSelected: false,
            contributorIndexSelectedToEdit: null,
        };
    }

    componentWillUpdate = (nextProps, nextState) => {
        // notify parent component when local state has been updated, eg contributors added/removed/reordered
        if (this.props.onChange) {
            this.props.onChange(nextState.contributors);
        }
    };

    getContributorsFromProps = props => {
        if (props.input && props.input.name && props.input.value) {
            return props.input.value instanceof Immutable.List ? props.input.value.toJS() : props.input.value;
        }

        return [];
    };

    addContributor = contributor => {
        // only unique identifiers can be added
        if (
            this.state.contributors.filter(item => {
                return !!contributor.aut_id && item.aut_id === contributor.aut_id;
            }).length > 0
        ) {
            this.setState({
                errorMessage: this.props.locale.errorMessage,
            });
        } else {
            contributor.disabled = !!contributor.uqIdentifier;

            this.setState(
                {
                    contributors: [...this.state.contributors, contributor],
                    errorMessage: '',
                    isCurrentAuthorSelected:
                        this.state.isCurrentAuthorSelected ||
                        (this.props.author && contributor.uqIdentifier === `${this.props.author.aut_id}`),
                },
                () => {
                    // try to automatically select contributor if they are a current author
                    if (this.props.author && contributor.uqIdentifier === `${this.props.author.aut_id}`) {
                        const index = this.state.contributors.length - 1;
                        this.assignContributor(index);
                    }
                },
            );
        }
    };

    updateContributor = (contributor, index) => {
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index),
                { ...contributor, selected: false, required: false },
                ...this.state.contributors.slice(index + 1),
            ],
            contributorIndexSelectedToEdit: null,
        });
    };

    moveUpContributor = (contributor, index) => {
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
                (this.props.author && contributor.aut_id !== this.props.author.aut_id),
        });
    };

    deleteAllContributors = () => {
        this.setState({
            contributors: [],
            isCurrentAuthorSelected: false,
        });
    };

    assignContributor = index => {
        const newContributors = this.state.contributors.map((item, itemIndex) => ({
            ...item,
            selected:
                (this.props.author && item.aut_id === this.props.author.aut_id) ||
                (!item.selected && index === itemIndex),
            authorId: index === itemIndex && this.props.author ? this.props.author.aut_id : null,
        }));
        this.setState({
            contributors: newContributors,
        });
    };

    selectContributor = index => {
        this.setState(prevState => ({
            contributors: prevState.contributors.map((contributor, itemIndex) => ({
                ...contributor,
                selected: index === itemIndex,
            })),
            contributorIndexSelectedToEdit: index,
        }));
    };

    renderContributorRows = () => {
        const { canEdit, disabled, hideDelete, hideReorder, showContributorAssignment, locale } = this.props;

        const { contributors, isCurrentAuthorSelected } = this.state;

        return contributors.map((contributor, index) => (
            <ContributorRow
                {...(locale.row || {})}
                canEdit={canEdit}
                canMoveDown={index !== contributors.length - 1}
                canMoveUp={index !== 0}
                contributor={contributor}
                contributorSuffix={locale.contributorSuffix}
                disabled={disabled}
                hideDelete={hideDelete}
                hideReorder={hideReorder}
                index={index}
                className={'ContributorRow'}
                key={`ContributorRow_${index}`}
                onSelect={this.assignContributor}
                onEdit={this.selectContributor}
                onDelete={this.deleteContributor}
                onMoveDown={this.moveDownContributor}
                onMoveUp={this.moveUpContributor}
                showContributorAssignment={
                    showContributorAssignment && !isCurrentAuthorSelected && contributor.disabled !== true
                }
                required={contributor.required}
            />
        ));
    };

    renderContributorForm = (onSubmit, index) => {
        const formProps = {
            ...this.props,
            isContributorAssigned: !!this.state.contributors.length,
            locale: (this.props.locale.form || {}).locale,
            onSubmit: contributor => onSubmit(contributor, index),
        };

        if (this.props.canEdit) {
            formProps.contributor = this.state.contributors[index];
            formProps.disableNameAsPublished = true;
            formProps.enableUqIdentifierOnAffiliationChange = false;
        }

        return <ContributorForm {...formProps} />;
    };

    render() {
        const {
            classes,
            disabled,
            hideDelete,
            isNtro,
            meta,
            showContributorAssignment,
            showIdentifierLookup,
            showRoleInput,
        } = this.props;

        const { contributors, errorMessage, contributorIndexSelectedToEdit } = this.state;

        let error = null;
        if ((meta || {}).error) {
            error =
                !!meta.error.props &&
                React.Children.map(meta.error.props.children, (child, index) => {
                    return child.type ? React.cloneElement(child, { key: index }) : child;
                });
        }

        return (
            <div>
                {errorMessage && <Alert title={this.props.locale.errorTitle} message={errorMessage} type="warning" />}
                {!this.props.editMode && this.renderContributorForm(this.addContributor)}
                {contributors.length > 0 && (
                    <Grid container spacing={8}>
                        <Grid item xs={12}>
                            <List style={{ marginBottom: 0 }}>
                                <ContributorRowHeader
                                    {...(this.props.locale.header || {})}
                                    disabled={disabled}
                                    hideDelete={hideDelete}
                                    isInfinite={contributors.length > 3}
                                    isNtro={isNtro}
                                    onDeleteAll={this.deleteAllContributors}
                                    showContributorAssignment={showContributorAssignment}
                                    showIdentifierLookup={showIdentifierLookup}
                                    showRoleInput={showRoleInput}
                                />
                            </List>
                            <List
                                classes={{
                                    root: `ContributorList ${classes.list} ${
                                        contributors.length > 3 ? classes.scroll : ''
                                    }`,
                                }}
                            >
                                {this.renderContributorRows()}
                            </List>
                            {this.props.editMode && contributorIndexSelectedToEdit !== null && (
                                <div style={{ marginTop: 24 }}>
                                    {this.renderContributorForm(this.updateContributor, contributorIndexSelectedToEdit)}
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
    }
}

export const mapStateToProps = state => {
    return {
        author: state && state.get('accountReducer') ? state.get('accountReducer').author : null,
    };
};

export const styles = () => ({
    list: {
        width: '100%',
        margin: '0',
        maxHeight: 225,
        overflow: 'hidden',
        marginBottom: 16,
    },
    scroll: {
        overflowY: 'scroll',
    },
});

export default withStyles(styles)(connect(mapStateToProps)(ContributorsEditor));
