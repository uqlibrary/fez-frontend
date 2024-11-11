import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import GrantListEditorHeader from './GrantListEditorHeader';
import GrantListEditorRow from './GrantListEditorRow';
import GrantListEditorForm from './GrantListEditorForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export class GrantListEditor extends PureComponent {
    static propTypes = {
        canEdit: PropTypes.bool,
        disabled: PropTypes.bool,
        meta: PropTypes.object,
        onChange: PropTypes.func,
        locale: PropTypes.object,
        input: PropTypes.object,
        required: PropTypes.bool,
        hideType: PropTypes.bool,
        disableDeleteAllGrants: PropTypes.bool,
    };

    static defaultProps = {
        canEdit: false,
        hideType: false,
        disableDeleteAllGrants: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            grants: this.getGrantsFromProps(props),
            grantSelectedToEdit: null,
            grantIndexSelectedToEdit: null,
            errorMessage: '',
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.props.onChange) {
            return;
        }

        // notify parent component when local state has been updated, eg grants added/removed/reordered
        if (prevState.grantFormPopulated !== this.state.grantFormPopulated) {
            this.props.onChange(this.state.grantFormPopulated);
            return;
        }

        if (prevState.grants !== this.state.grants) {
            this.props.onChange(this.state.grants);
        }
    }

    getGrantsFromProps = props => {
        if (props.input && props.input.name && props.input.value) {
            return props.input.value instanceof Immutable.List ? props.input.value.toJS() : props.input.value;
        }

        return [];
    };

    addGrant = grant => {
        const { grantIndexSelectedToEdit } = this.state;
        if (grantIndexSelectedToEdit !== null && grantIndexSelectedToEdit > -1) {
            this.setState({
                grants: [
                    ...this.state.grants.slice(0, grantIndexSelectedToEdit),
                    grant,
                    ...this.state.grants.slice(grantIndexSelectedToEdit + 1),
                ],
                grantIndexSelectedToEdit: null,
                grantSelectedToEdit: null,
                errorMessage: '',
            });
        } else {
            this.setState({
                grants: [...this.state.grants, grant],
                errorMessage: '',
            });
        }
    };

    editGrant = (grant, index) => {
        this.setState({
            grantSelectedToEdit: grant,
            grantIndexSelectedToEdit: index,
        });
    };

    moveUpGrant = (grant, index) => {
        /* istanbul ignore next */
        if (index === 0) return;

        const previousGrant = this.state.grants[index - 1];

        if (previousGrant.hasOwnProperty('disabled') && previousGrant.disabled) return;

        this.setState({
            grants: [
                ...this.state.grants.slice(0, index - 1),
                grant,
                previousGrant,
                ...this.state.grants.slice(index + 1),
            ],
        });
    };

    moveDownGrant = (grant, index) => {
        /* istanbul ignore next */
        if (index === this.state.grants.length - 1) return;
        const nextGrant = this.state.grants[index + 1];
        this.setState({
            grants: [...this.state.grants.slice(0, index), nextGrant, grant, ...this.state.grants.slice(index + 2)],
        });
    };

    deleteGrant = (grant, index) => {
        this.setState({
            grants: this.state.grants.filter((_, i) => i !== index),
        });
    };

    deleteAllGrants = () => {
        this.setState({
            grants: [],
            errorMessage: '',
        });
    };

    isFormPopulated = value => {
        this.setState({
            grantFormPopulated: !!value,
        });
    };

    render() {
        const { disabled, required, disableDeleteAllGrants, canEdit } = this.props;
        const { grants, errorMessage, grantIndexSelectedToEdit, grantSelectedToEdit } = this.state;

        const renderGrantsRows = grants.map((grant, index) => (
            <GrantListEditorRow
                key={`GrantListRow_${index}`}
                index={index}
                disabled={disabled || (grant && grant.disabled)}
                grant={grant}
                canMoveDown={index !== grants.length - 1}
                canMoveUp={index !== 0}
                canEdit={canEdit}
                onMoveUp={this.moveUpGrant}
                onMoveDown={this.moveDownGrant}
                onDelete={this.deleteGrant}
                onEdit={this.editGrant}
            />
        ));

        let error = null;
        if (this.props.meta && this.props.meta.error) {
            error =
                !!this.props.meta.error.props &&
                React.Children.map(this.props.meta.error.props.children, (child, index) => {
                    if (child.type) {
                        return React.cloneElement(child, {
                            key: index,
                        });
                    } else {
                        return child;
                    }
                });
        }
        return (
            <div>
                {errorMessage && (
                    /* istanbul ignore next */ <Alert
                        title={this.props.locale.errorTitle}
                        message={errorMessage}
                        type="warning"
                    />
                )}
                <GrantListEditorForm
                    onAdd={this.addGrant}
                    isPopulated={this.isFormPopulated}
                    required={required}
                    disabled={disabled}
                    hideType={this.props.hideType}
                    {...((this.props.locale && this.props.locale.form) || {})}
                    {...(grantIndexSelectedToEdit !== null && grantIndexSelectedToEdit > -1
                        ? { grantSelectedToEdit: grantSelectedToEdit }
                        : {})}
                />
                {grants.length > 0 && (
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <List>
                                <GrantListEditorHeader
                                    onDeleteAll={this.deleteAllGrants}
                                    disabled={disabled || disableDeleteAllGrants}
                                    hideType={this.props.hideType}
                                    {...((this.props.locale && this.props.locale.header) || {})}
                                />
                            </List>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: -8 }}>
                            <List
                                sx={{
                                    width: '100%',
                                    maxHeight: '200px',
                                    overflow: 'hidden',

                                    ...(grants.length > 3 && { overflowY: 'scroll' }),
                                }}
                                data-testid="rek-grant-list"
                            >
                                {renderGrantsRows}
                            </List>
                        </Grid>
                    </Grid>
                )}
                {this.props.meta && this.props.meta.error && (
                    <Typography color="error" variant="caption">
                        {error || this.props.meta.error}
                    </Typography>
                )}
            </div>
        );
    }
}

export default GrantListEditor;
