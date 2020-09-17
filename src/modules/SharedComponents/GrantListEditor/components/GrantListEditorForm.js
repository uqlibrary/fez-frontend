import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { ORG_AFFILIATION_TYPES } from 'config/general';
import locale from 'locale/validationErrors';
import { withStyles } from '@material-ui/core';

const styles = () => ({
    reminderMessage: {
        marginTop: 8,
        borderTop: '1px solid red',
        paddingTop: 4,
    },
});

export class GrantListEditorFormClass extends PureComponent {
    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        errorText: PropTypes.string,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
        hideType: PropTypes.bool,
        classes: PropTypes.object,
        isPopulated: PropTypes.any,
        grantSelectedToEdit: PropTypes.object,
    };

    static defaultProps = {
        locale: {
            grantAgencyNameLabel: 'Funder/Sponsor name',
            grantAgencyNameHint: 'Enter funder/sponsor name for this work',
            grantIdLabel: 'Grant ID',
            grantIdHint: 'Enter grant number for this work, if available',
            grantAgencyTypeLabel: 'Funder/Sponsor type',
            grantAgencyTypeHint: 'Funder/Sponsor type',
            addButton: 'Add grant',
            editButton: 'Edit grant',
            description:
                "Add the Funder/Sponsor's name, grant ID and type - " +
                'then click the ADD GRANT button to add each to the list',
            remindToAdd: (
                <span>
                    &nbsp;<b>* REMINDER:</b> Click ADD GRANT to add this item to your list or it will not be included.
                </span>
            ),
        },
        hideType: false,
        isPopulated: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            grantAgencyName: '',
            grantId: '',
            grantAgencyType: '',
        };
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        !!nextProps.grantSelectedToEdit && this.setState({ ...nextProps.grantSelectedToEdit });
    }

    _addGrant = event => {
        if (
            this.props.disabled ||
            (event && event.key && (event.key !== 'Enter' || this.state.grantAgencyName.length === 0))
        ) {
            return;
        }

        // pass on the selected grant
        this.props.onAdd({
            grantAgencyName: this.state.grantAgencyName,
            grantId: this.state.grantId,
            grantAgencyType: this.state.grantAgencyType,
        });

        // reset internal state
        this.setState({
            grantAgencyName: '',
            grantId: '',
            grantAgencyType: '',
        });
        if (this.props.isPopulated) {
            this.props.isPopulated(false);
        }
    };

    _onNameChanged = event => {
        this.setState(
            {
                grantAgencyName: event.target.value,
            },
            () => {
                if (this.props.isPopulated) {
                    this.props.isPopulated(!!(this.state.grantAgencyName.trim().length > 0));
                }
            },
        );
    };

    _onIDChanged = event => {
        this.setState(
            {
                grantId: event.target.value,
            },
            () => {
                if (this.props.isPopulated) {
                    this.props.isPopulated(!!(this.state.grantId.trim().length > 0));
                }
            },
        );
    };

    _onTypeChanged = event => {
        this.setState({
            grantAgencyType: event.target.value,
        });
    };

    render() {
        const { disabled, grantSelectedToEdit, required, hideType } = this.props;
        const {
            addButton,
            editButton,
            description,
            grantAgencyNameLabel,
            grantAgencyNameHint,
            grantIdHint,
            grantIdLabel,
            grantAgencyTypeLabel,
            grantAgencyTypeHint,
        } = this.props.locale;
        const { grantAgencyName, grantAgencyType, grantId } = this.state;

        // const remindToAdd = (this.state.grantAgencyName.trim().length > 0 ||
        // this.state.grantId.trim().length > 0) ? this.props.locale.remindToAdd : null;
        return (
            <React.Fragment>
                {description}
                <Grid container spacing={1} style={{ marginTop: 8 }}>
                    <Grid item xs={12} sm={12} md>
                        <TextField
                            fullWidth
                            id="grant-agency-name"
                            textFieldId="rek-grant-agency"
                            label={grantAgencyNameLabel}
                            placeholder={grantAgencyNameHint}
                            value={grantAgencyName}
                            onChange={this._onNameChanged}
                            disabled={disabled}
                            required={required}
                            autoComplete="off"
                            error={required && !grantAgencyName}
                            errorText={required && !grantAgencyName && locale.validationErrors.required}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={!hideType ? 3 : 4}>
                        <TextField
                            fullWidth
                            id="grant-id"
                            textFieldId="rek-grant-id"
                            label={grantIdLabel}
                            placeholder={grantIdHint}
                            value={grantId}
                            onChange={this._onIDChanged}
                            disabled={disabled || !grantAgencyName || grantAgencyName.trim().length === 0}
                            required={required}
                        />
                    </Grid>
                    {!hideType && (
                        <Grid item xs={12} sm={12} md={3}>
                            <FormControl
                                fullWidth
                                required={required || (!!grantAgencyName && grantAgencyName.trim().length > 0)}
                                error={
                                    !!grantAgencyName &&
                                    grantAgencyName.trim().length > 0 &&
                                    grantAgencyType.trim().length === 0
                                }
                            >
                                <Typography variant="caption" color="secondary" style={{ marginBottom: -3 }}>
                                    {!!grantAgencyType ? grantAgencyTypeLabel : ' '}&nbsp;
                                </Typography>
                                <Select
                                    SelectDisplayProps={{
                                        id: 'grant-type',
                                        'data-testid': 'rek-grant-type-select',
                                    }}
                                    MenuProps={{
                                        id: 'rek-grant-type-options',
                                        'data-testid': 'rek-grant-type-options',
                                    }}
                                    inputProps={{
                                        id: 'rek-grant-type-input',
                                        'data-testid': 'rek-grant-type-input',
                                    }}
                                    name="grant-type"
                                    label={grantAgencyType}
                                    placeholder={grantAgencyTypeHint}
                                    displayEmpty
                                    value={grantAgencyType}
                                    onChange={this._onTypeChanged}
                                    disabled={disabled || grantAgencyName.trim().length === 0}
                                >
                                    <MenuItem value="" disabled>
                                        {grantAgencyTypeHint}
                                    </MenuItem>
                                    {ORG_AFFILIATION_TYPES.map((item, index) => {
                                        return item.value !== '454045' ? (
                                            <MenuItem value={item.value} key={index}>
                                                {item.text}
                                            </MenuItem>
                                        ) : null;
                                    })}
                                </Select>
                                {grantAgencyName.trim().length > 0 && grantAgencyType.trim().length === 0 && (
                                    <FormHelperText error>{locale.validationErrors.required}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            id={(!!grantSelectedToEdit && 'edit-grant') || 'add-grant'}
                            data-testid={(!!grantSelectedToEdit && 'rek-grant-update') || 'rek-grant-add'}
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={
                                disabled ||
                                grantAgencyName.trim().length === 0 ||
                                (!hideType && grantAgencyType.trim().length === 0)
                            }
                            onClick={this._addGrant}
                        >
                            {(!!grantSelectedToEdit && editButton) || addButton}
                        </Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

const StyledGrantListEditorFormClass = withStyles(styles, { withTheme: true })(GrantListEditorFormClass);
const GrantListEditorForm = props => <StyledGrantListEditorFormClass {...props} />;
export default GrantListEditorForm;
