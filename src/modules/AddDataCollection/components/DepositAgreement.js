import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const DepositAgreement = ({
    isDepositAgreementAccepted,
    onChange,
    depositAgreement,
    depositAgreementFieldId,
    disabled,
}) => {
    const _handleChange = event => {
        onChange(event.target.checked ? 'on' : 'off');
    };

    return (
        <FormControlLabel
            sx={{ alignItems: 'flex-start', margin: 0 }}
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
                    sx={{ color: 'status.danger', '& .Mui-checked': { color: 'primary.main' } }}
                />
            }
            label={
                <Typography
                    sx={{ textAlign: 'justify', fontSize: 16, fontWeight: 300, lineHeight: '24px' }}
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
