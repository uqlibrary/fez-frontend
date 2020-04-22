import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export const useStyles = makeStyles(
    theme => ({
        root: {
            alignItems: 'flex-start',
            margin: 0,
        },
        label: {
            textAlign: 'justify',
            fontSize: 16,
            fontWeight: 300,
            lineHeight: '24px',
        },
        checkboxRoot: {
            color: theme.status.danger,
        },
        checkboxChecked: {
            color: `${theme.palette.primary.main} !important`,
        },
    }),
    { withTheme: true },
);

const DepositAgreement = ({ isDepositAgreementAccepted, onChange, depositAgreement, disabled }) => {
    const classes = useStyles();

    const _handleChange = event => {
        onChange(event.target.checked ? 'on' : 'off');
    };

    return (
        <FormControlLabel
            classes={{
                root: classes.root,
            }}
            disabled={disabled}
            control={
                <Checkbox
                    id="deposit-agreement"
                    checked={isDepositAgreementAccepted}
                    onChange={_handleChange}
                    classes={{ root: classes.checkboxRoot, checked: classes.checkboxChecked }}
                />
            }
            label={
                <Typography
                    classes={{
                        root: classes.label,
                    }}
                    color={!isDepositAgreementAccepted ? 'error' : 'secondary'}
                    component="div"
                >
                    {depositAgreement}
                </Typography>
            }
        />
    );
};

DepositAgreement.propTypes = {
    isDepositAgreementAccepted: PropTypes.bool,
    onChange: PropTypes.func,
    classes: PropTypes.object,
    depositAgreement: PropTypes.node,
    disabled: PropTypes.bool,
};

export default DepositAgreement;
