import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export class CopyrightAgreement extends PureComponent {
    static propTypes = {
        isCopyrightAgreementAccepted: PropTypes.bool,
        onChange: PropTypes.func,
        classes: PropTypes.object,
        copyrightAgreement: PropTypes.node,
        disabled: PropTypes.bool,
        copyrightAgreementFieldId: PropTypes.string.isRequired,
    };

    _handleChange = event => {
        this.props.onChange(event.target.checked ? 'on' : 'off');
    };

    render() {
        const { isCopyrightAgreementAccepted, classes, copyrightAgreement, disabled } = this.props;

        return (
            <FormControlLabel
                classes={{
                    root: classes.root,
                }}
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
                        classes={{ root: classes.checkboxRoot, checked: classes.checkboxChecked }}
                    />
                }
                label={
                    <Typography
                        classes={{
                            root: classes.label,
                        }}
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

export const styles = theme => ({
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
        color: (theme.status || {}).danger || '',
    },
    checkboxChecked: {
        color: (!!theme.palette && `${theme.palette.primary.main} !important`) || '',
    },
});

export default withStyles(styles, { withTheme: true })(CopyrightAgreement);
