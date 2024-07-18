import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export const FileUploadTermsAndConditions = ({
    isTermsAndConditionsAccepted,
    onAcceptTermsAndConditions,
    accessTermsAndConditions,
    disabled,
}) => {
    const _handleChange = event => {
        onAcceptTermsAndConditions?.(event.target.checked);
    };

    return (
        <FormControlLabel
            sx={{ alignItems: 'flex-start', margin: 0 }}
            disabled={disabled}
            control={
                <Checkbox
                    inputProps={{
                        'data-analyticsid': 'terms-and-conditions-input',
                        'data-testid': 'terms-and-conditions-input',
                        id: 'terms-and-conditions-input',
                    }}
                    checked={isTermsAndConditionsAccepted}
                    onChange={_handleChange}
                    sx={theme => ({ color: theme.status.danger, '&.Mui-checked': { color: 'primary.main' } })}
                />
            }
            label={
                <Typography
                    textAlign={'justify'}
                    fontSize={16}
                    fontWeight={300}
                    lineHeight={'24px'}
                    pt={'10px'}
                    color={!isTermsAndConditionsAccepted ? 'error' : 'secondary'}
                >
                    {accessTermsAndConditions}
                </Typography>
            }
        />
    );
};
FileUploadTermsAndConditions.propTypes = {
    isTermsAndConditionsAccepted: PropTypes.bool,
    onAcceptTermsAndConditions: PropTypes.func,
    accessTermsAndConditions: PropTypes.string,
    disabled: PropTypes.bool,
};

export default React.memo(FileUploadTermsAndConditions);
