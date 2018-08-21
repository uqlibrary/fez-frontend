import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {FormControlLabel, Typography, Checkbox} from '@material-ui/core';

export class FileUploadTermsAndConditions extends PureComponent {
    static propTypes = {
        isTermsAndConditionsAccepted: PropTypes.bool,
        onAcceptTermsAndConditions: PropTypes.func,
        classes: PropTypes.object,
        accessTermsAndConditions: PropTypes.string,
        disabled: PropTypes.bool
    };

    _handleChange = (event) => {
        this.props.onAcceptTermsAndConditions(event.target.checked);
    };

    render() {
        const {isTermsAndConditionsAccepted, classes, accessTermsAndConditions, disabled} = this.props;

        return (
            <FormControlLabel
                classes={{
                    root: classes.root
                }}
                disabled={disabled}
                control={
                    <Checkbox
                        checked={isTermsAndConditionsAccepted}
                        onChange={this._handleChange}
                        classes={{root: classes.checkboxRoot, checked: classes.checkboxChecked}}
                    />
                }
                label={
                    <Typography
                        classes={{
                            root: classes.label
                        }}
                        color={!isTermsAndConditionsAccepted ? 'error' : 'secondary'}
                    >
                        {accessTermsAndConditions}
                    </Typography>
                }
            />
        );
    }
}

const styles = (theme) => ({
    root: {
        alignItems: 'flex-start'
    },
    label: {
        textAlign: 'justify',
        fontSize: 16,
        fontWeight: 300,
        lineHeight: '24px',
        paddingTop: 10
    },
    checkboxRoot: {
        color: theme.status.danger,
    },
    checkboxChecked: {
        color: `${theme.palette.primary.main} !important`
    }
});

export default withStyles(styles)(FileUploadTermsAndConditions);
