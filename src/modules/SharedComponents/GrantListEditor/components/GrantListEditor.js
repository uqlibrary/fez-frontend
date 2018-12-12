import React, {PureComponent} from 'react';
import {compose} from 'recompose';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {connect} from 'react-redux';
import GrantListEditorRowHeader from './GrantListEditorHeader';
import GrantListEditorRow from './GrantListEditorRow';
import GrantListEditorForm from './GrantListEditorForm';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

export class GrantListEditor extends PureComponent {
    static propTypes = {
        disabled: PropTypes.bool,
        meta: PropTypes.object,
        author: PropTypes.object,
        onChange: PropTypes.func,
        locale: PropTypes.object,
        input: PropTypes.object,
        classes: PropTypes.object,
        required: PropTypes.bool
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            contributors: this.getContributorsFromProps(props),
            isCurrentAuthorSelected: false,
            errorMessage: '',
            showIdentifierLookup: false
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
        const {classes, disabled, required} = this.props;
        const {contributors, isCurrentAuthorSelected, errorMessage} = this.state;

        const renderContributorsRows = contributors.map((contributor, index) => (
            <GrantListEditorRow
                key={`ContributorRow_${index}`}
                index={index}
                disabled={disabled}
                contributor={contributor}
                canMoveDown={index !== contributors.length - 1}
                canMoveUp={index !== 0}
                onMoveUp={this.moveUpContributor}
                onMoveDown={this.moveDownContributor}
                onDelete={this.deleteContributor}
                onContributorAssigned={this.assignContributor}
                contributorSuffix={this.props.locale.contributorSuffix}
                disabledContributorAssignment={isCurrentAuthorSelected}
                {...(this.props.locale && this.props.locale.row ? this.props.locale.row : {})}
            />
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
            <div>
                {
                    errorMessage &&
                    <Alert
                        title={this.props.locale.errorTitle}
                        message={errorMessage}
                        type="warning" />
                }
                <GrantListEditorForm
                    onAdd={this.addContributor}
                    required={required}
                    disabled={disabled}
                    {...(this.props.locale && this.props.locale.form ? this.props.locale.form : {})}
                />
                {
                    contributors.length > 0 &&
                    <Grid container spacing={8}>
                        <Grid item xs={12}>
                            <List>
                                <GrantListEditorRowHeader
                                    onDeleteAll={this.deleteAllContributors}
                                    disabled={disabled}
                                    isInfinite={contributors.length > 3}
                                    {...(this.props.locale && this.props.locale.header ? this.props.locale.header : {})}
                                />
                            </List>
                        </Grid>
                        <Grid item xs={12}>
                            <List classes={{root: `${classes.list} ${contributors.length > 3 ? classes.scroll : ''}`}}>
                                {renderContributorsRows}
                            </List>
                        </Grid>
                    </Grid>
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
        width: '98%',
        margin: '0 1%',
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
)(GrantListEditor);
