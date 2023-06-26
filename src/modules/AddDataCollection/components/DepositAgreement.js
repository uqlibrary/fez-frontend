import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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

const DepositAgreement = ({
    isDepositAgreementAccepted,
    onChange,
    depositAgreement,
    depositAgreementFieldId,
    disabled,
}) => {
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
                    inputProps={{
                        'data-analyticsid': `${depositAgreementFieldId}-input`,
                        'data-testid': `${depositAgreementFieldId}-input`,
                        id: `${depositAgreementFieldId}-input`,
                    }}
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
                    id={`${depositAgreementFieldId}-label`}
                    data-testid={`${depositAgreementFieldId}-label`}
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
    depositAgreementFieldId: PropTypes.string,
    disabled: PropTypes.bool,
};

export default DepositAgreement;
