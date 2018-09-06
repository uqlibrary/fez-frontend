import React, {PureComponent, Fragment} from 'react';
import {compose} from 'recompose';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {connect} from 'react-redux';
import ContributorRowHeader from './ContributorRowHeader';
import ContributorRow from './ContributorRow';
import ContributorForm from './ContributorForm';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {List, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

export class ContributorsEditor extends PureComponent {
    static propTypes = {
        showIdentifierLookup: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        meta: PropTypes.object,
        author: PropTypes.object,
        onChange: PropTypes.func,
        locale: PropTypes.object,
        input: PropTypes.object,
        classes: PropTypes.object
    };

    static defaultProps = {
        showIdentifierLookup: false,
        showContributorAssignment: false,
        locale: {
            errorTitle: 'Error',
            errorMessage: 'Unable to add an item with the same identifier.'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            contributors: this.getContributorsFromProps(props),
            isCurrentAuthorSelected: false,
            errorMessage: ''
        };
    }

    componentWillUpdate(nextProps, nextState) {
        // notify parent component when local state has been updated, eg contributors added/removed/reordered
        if (this.props.onChange) {
            this.props.onChange(nextState.contributors);
        }
    }

    getContributorsFromProps = (props) => {
        if (props.input && props.input.name && props.input.value) {
            return props.input.value instanceof Immutable.List ? props.input.value.toJS() : props.input.value;
        }

        return [];
    };

    addContributor = (contributor) => {
        // only unique identifiers can be added
        if (this.state.contributors.filter(item => {
            return !!contributor.aut_id && item.aut_id === contributor.aut_id;
        }).length > 0) {
            this.setState({
                errorMessage: this.props.locale.errorMessage
            });
        } else {
            contributor.disabled = !!contributor.aut_id;

            this.setState({
                contributors: [ ...this.state.contributors, contributor],
                errorMessage: '',
                isCurrentAuthorSelected: this.state.isCurrentAuthorSelected || (this.props.author && contributor.aut_id === this.props.author.aut_id)
            }, () => {
                // try to automatically select contributor if they are a current author
                if (this.props.author && contributor.aut_id === this.props.author.aut_id) {
                    this.assignContributor(contributor, this.state.contributors.length - 1);
                }
            });
        }
    }

    moveUpContributor = (contributor, index) => {
        if (index === 0) return;
        const nextContributor = this.state.contributors[index - 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index - 1),
                contributor, nextContributor,
                ...this.state.contributors.slice(index + 1)]
        });
    }

    moveDownContributor = (contributor, index) => {
        if (index === (this.state.contributors.length - 1)) return;
        const nextContributor = this.state.contributors[index + 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index),
                nextContributor, contributor,
                ...this.state.contributors.slice(index + 2)]
        });
    }

    deleteContributor = (contributor, index) => {
        this.setState({
            contributors: this.state.contributors.filter((_, i) => i !== index),
            isCurrentAuthorSelected: this.state.isCurrentAuthorSelected && (this.props.author && contributor.aut_id !== this.props.author.aut_id)
        });
    }

    deleteAllContributors = () => {
        this.setState({
            contributors: [],
            isCurrentAuthorSelected: false
        });
    }

    assignContributor = (contributor, index) => {
        const newContributors = this.state.contributors.map((item, itemIndex) => (
            {
                ...item,
                selected: (this.props.author && item.aut_id === this.props.author.aut_id) || index === itemIndex,
                authorId: (index === itemIndex && this.props.author) ? this.props.author.aut_id : null
            })
        );
        this.setState({
            contributors: newContributors
        });
    };

    render() {
        const {classes, showIdentifierLookup, showContributorAssignment, disabled} = this.props;
        const {contributors, isCurrentAuthorSelected, errorMessage} = this.state;

        const renderContributorsRows = contributors.map((contributor, index) => (
            <ContributorRow
                key={`ContributorRow_${index}`}
                index={index}
                contributor={contributor}
                canMoveDown={index !== contributors.length - 1}
                canMoveUp={index !== 0}
                onMoveUp={this.moveUpContributor}
                onMoveDown={this.moveDownContributor}
                onDelete={this.deleteContributor}
                showIdentifierLookup={showIdentifierLookup}
                contributorSuffix={this.props.locale.contributorSuffix}
                disabled={disabled}
                showContributorAssignment={showContributorAssignment}
                disabledContributorAssignment={isCurrentAuthorSelected}
                {...(this.props.locale && this.props.locale.row ? this.props.locale.row : {})}
                onContributorAssigned={this.assignContributor} />
        ));

        let error = null;
        if (this.props.meta && this.props.meta.error) {
            error = !!this.props.meta.error.props && React.Children.map(this.props.meta.error.props.children, (child, index) => {
                if (child.type) {
                    return React.cloneElement(child, {
                        key: index
                    });
                } else {
                    return child;
                }
            });
        }

        return (
            <div className={this.props.className}>
                {
                    errorMessage &&
                    <Alert
                        title={this.props.locale.errorTitle}
                        message={errorMessage}
                        type="warning" />
                }
                <ContributorForm
                    onAdd={this.addContributor}
                    showIdentifierLookup={showIdentifierLookup}
                    {...(this.props.locale && this.props.locale.form ? this.props.locale.form : {})}
                    disabled={disabled}
                    showContributorAssignment={showContributorAssignment}
                />
                {
                    contributors.length > 0 &&
                    <Fragment>
                        <List>
                            <ContributorRowHeader
                                onDeleteAll={this.deleteAllContributors}
                                {...(this.props.locale && this.props.locale.header ? this.props.locale.header : {})}
                                showIdentifierLookup={showIdentifierLookup}
                                disabled={disabled}
                                showContributorAssignment={showContributorAssignment}
                                isInfinite={contributors.length > 3}
                            />
                        </List>
                        <List classes={{root: `${classes.list} ${contributors.length > 3 ? classes.scroll : ''}`}}>
                            {renderContributorsRows}
                        </List>
                    </Fragment>
                }
                {
                    this.props.meta && this.props.meta.error &&
                    <Typography color="error" variant="caption">
                        {
                            error || this.props.meta.error
                        }
                    </Typography>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        author: state && state.get('accountReducer') ? state.get('accountReducer').author : null
    };
};

const styles = () => ({
    list: {
        maxHeight: 200,
        overflow: 'hidden',
        marginBottom: 8
    },
    scroll: {
        overflowY: 'scroll'
    }
});

export default compose(
    withStyles(styles),
    connect(mapStateToProps)
)(ContributorsEditor);
