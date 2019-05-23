import React, {PureComponent} from 'react';
import {compose} from 'recompose';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import GrantListEditorHeader from './GrantListEditorHeader';
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
        onChange: PropTypes.func,
        locale: PropTypes.object,
        input: PropTypes.object,
        classes: PropTypes.object,
        required: PropTypes.bool,
        hideType: PropTypes.bool,
        disableDeleteAllGrants: PropTypes.bool
    };

    static defaultProps = {
        hideType: false,
        disableDeleteAllGrants: false
    };

    constructor(props) {
        super(props);
        this.state = {
            grants: this.getGrantsFromProps(props),
            errorMessage: ''
        };
    }

    componentWillUpdate(nextProps, nextState) {
        // notify parent component when local state has been updated, eg grants added/removed/reordered
        if (nextState.grantFormPopulated && this.props.onChange) {
            this.props.onChange(nextState.grantFormPopulated);
        } else {
            this.props.onChange(nextState.grants);
        }
    }

    getGrantsFromProps = (props) => {
        if (props.input && props.input.name && props.input.value) {
            return props.input.value instanceof Immutable.List ? props.input.value.toJS() : props.input.value;
        }

        return [];
    };

    addGrant = (grant) => {
        this.setState({
            grants: [ ...this.state.grants, grant],
            errorMessage: '',
        });
    }

    moveUpGrant = (grant, index) => {
        if (index === 0) return;

        const previousGrant = this.state.grants[index - 1];

        if (previousGrant.hasOwnProperty('disabled') && previousGrant.disabled) return;

        this.setState({
            grants: [
                ...this.state.grants.slice(0, index - 1),
                grant, previousGrant,
                ...this.state.grants.slice(index + 1)]
        });
    }

    moveDownGrant = (grant, index) => {
        if (index === (this.state.grants.length - 1)) return;
        const nextGrant = this.state.grants[index + 1];
        this.setState({
            grants: [
                ...this.state.grants.slice(0, index),
                nextGrant, grant,
                ...this.state.grants.slice(index + 2)]
        });
    }

    deleteGrant = (grant, index) => {
        this.setState({
            grants: this.state.grants.filter((_, i) => i !== index),
        });
    }

    deleteAllGrants = () => {
        this.setState({
            grants: [],
            errorMessage: ''
        });
    }

    isFormPopulated = (value) => {
        this.setState({
            grantFormPopulated: !!value
        });
    };

    render() {
        const {classes, disabled, required, disableDeleteAllGrants} = this.props;
        const {grants, errorMessage} = this.state;

        const renderGrantsRows = grants.map((grant, index) => (
            <GrantListEditorRow
                key={`GrantListRow_${index}`}
                index={index}
                disabled={disabled || grant && grant.disabled}
                grant={grant}
                canMoveDown={index !== grants.length - 1}
                canMoveUp={index !== 0}
                onMoveUp={this.moveUpGrant}
                onMoveDown={this.moveDownGrant}
                onDelete={this.deleteGrant}
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
                    onAdd={this.addGrant}
                    isPopulated={this.isFormPopulated}
                    required={required}
                    disabled={disabled}
                    hideType={this.props.hideType}
                    {...(this.props.locale && this.props.locale.form ? this.props.locale.form : {})}
                />
                {
                    grants.length > 0 &&
                    <Grid container spacing={8}>
                        <Grid item xs={12}>
                            <List>
                                <GrantListEditorHeader
                                    onDeleteAll={this.deleteAllGrants}
                                    disabled={disabled || disableDeleteAllGrants}
                                    hideType={this.props.hideType}
                                />
                            </List>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: -8}}>
                            <List classes={{root: `${classes.list} ${grants.length > 3 ? classes.scroll : ''}`}}>
                                {renderGrantsRows}
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


export const styles = () => ({
    list: {
        width: '100%',
        maxHeight: 200,
        overflow: 'hidden',
    },
    scroll: {
        overflowY: 'scroll'
    }
});

export default compose(
    withStyles(styles)
)(GrantListEditor);
