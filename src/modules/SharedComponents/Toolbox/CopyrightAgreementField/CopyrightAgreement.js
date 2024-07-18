import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export const CopyrightAgreement = ({
    isCopyrightAgreementAccepted,
    onChange,
    copyrightAgreement,
    disabled,
    copyrightAgreementFieldId,
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
                        'data-analyticsid': `${copyrightAgreementFieldId}-input`,
                        'data-testid': `${copyrightAgreementFieldId}-input`,
                        id: `${copyrightAgreementFieldId}-input`,
                    }}
                    checked={isCopyrightAgreementAccepted}
                    onChange={_handleChange}
                    sx={{ color: 'status.danger', '&.Mui-checked': { color: 'primary.main' } }}
                />
            }
            label={
                <Typography
                    textAlign={'justify'}
                    fontSize={16}
                    fontWeight={300}
                    lineHeight={'24px'}
                    color={!isCopyrightAgreementAccepted ? 'error' : 'secondary'}
                    component="div"
                    id={`${copyrightAgreementFieldId}-label`}
                    data-testid={`${copyrightAgreementFieldId}-label`}
                >
                    {copyrightAgreement}
                </Typography>
            }
        />
    );
};

CopyrightAgreement.propTypes = {
    isCopyrightAgreementAccepted: PropTypes.bool,
    onChange: PropTypes.func,
    copyrightAgreement: PropTypes.node,
    disabled: PropTypes.bool,
    copyrightAgreementFieldId: PropTypes.string.isRequired,
};

export default React.memo(CopyrightAgreement);
