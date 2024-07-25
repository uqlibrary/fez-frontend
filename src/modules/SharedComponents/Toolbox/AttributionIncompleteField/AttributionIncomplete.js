import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export const AttributionIncomplete = ({
    isAttributionIncomplete,
    onChange,
    disabled,
    attributionIncompleteStatement,
    attributionIncompleteDetail,
}) => {
    const _handleChange = event => {
        onChange(event.target.checked ? true : false);
    };

    return (
        <React.Fragment>
            <div>
                <Typography variant="caption">{attributionIncompleteDetail}</Typography>
            </div>
            <FormControlLabel
                sx={{ margin: 0 }}
                disabled={disabled}
                control={
                    <Checkbox
                        inputProps={{
                            'data-analyticsid': 'attributionIncomplete-input',
                            'data-testid': 'attributionIncomplete-input',
                            id: 'attributionIncomplete-input',
                        }}
                        checked={isAttributionIncomplete}
                        onChange={_handleChange}
                    />
                }
                label={
                    <Typography
                        sx={{ textAlign: 'justify', fontSize: 16, fontWeight: 300, lineHeight: '24px' }}
                        component="div"
                        id={'attributionIncomplete-label'}
                        data-testid={'attributionIncomplete-label'}
                    >
                        {attributionIncompleteStatement}
                    </Typography>
                }
            />
        </React.Fragment>
    );
};

AttributionIncomplete.propTypes = {
    isAttributionIncomplete: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    attributionIncompleteStatement: PropTypes.string,
    attributionIncompleteDetail: PropTypes.string,
};

export default React.memo(AttributionIncomplete);
