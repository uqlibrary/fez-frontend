import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export class CopyrightAgreement extends PureComponent {
    static propTypes = {
        isCopyrightAgreementAccepted: PropTypes.bool,
        onChange: PropTypes.func,
        copyrightAgreement: PropTypes.node,
        disabled: PropTypes.bool,
        copyrightAgreementFieldId: PropTypes.string.isRequired,
    };

    _handleChange = event => {
        this.props.onChange(event.target.checked ? 'on' : 'off');
    };

    render() {
        const { isCopyrightAgreementAccepted, copyrightAgreement, disabled } = this.props;

        return (
            <FormControlLabel
                sx={{ alignItems: 'flex-start', margin: 0 }}
                disabled={disabled}
                control={
                    <Checkbox
                        inputProps={{
                            'data-analyticsid': `${this.props.copyrightAgreementFieldId}-input`,
                            'data-testid': `${this.props.copyrightAgreementFieldId}-input`,
                            id: `${this.props.copyrightAgreementFieldId}-input`,
                        }}
                        checked={isCopyrightAgreementAccepted}
                        onChange={this._handleChange}
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
                        id={`${this.props.copyrightAgreementFieldId}-label`}
                        data-testid={`${this.props.copyrightAgreementFieldId}-label`}
                    >
                        {copyrightAgreement}
                    </Typography>
                }
            />
        );
    }
}

export default CopyrightAgreement;
