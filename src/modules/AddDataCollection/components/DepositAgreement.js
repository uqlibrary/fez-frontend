import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export class DepositAgreement extends PureComponent {
    static propTypes = {
        isDepositAgreementAccepted: PropTypes.bool,
        onChange: PropTypes.func,
        classes: PropTypes.object,
        depositAgreement: PropTypes.node,
        disabled: PropTypes.bool
    };

    _handleChange = (event) => {
        this.props.onChange(event.target.checked ? 'on' : 'off');
    };

    render() {
        const {isDepositAgreementAccepted, classes, depositAgreement, disabled} = this.props;

        return (
            <FormControlLabel
                classes={{
                    root: classes.root
                }}
                disabled={disabled}
                control={
                    <Checkbox
                        checked={isDepositAgreementAccepted}
                        onChange={this._handleChange}
                        classes={{root: classes.checkboxRoot, checked: classes.checkboxChecked}}
                    />
                }
                label={
                    <Typography
                        classes={{
                            root: classes.label
                        }}
                        color={!isDepositAgreementAccepted ? 'error' : 'secondary'}
                        component="div"
                    >
                        {depositAgreement}
                    </Typography>
                }
            />
        );
    }
}

const styles = (theme) => ({
    root: {
        alignItems: 'flex-start',
        margin: 0
    },
    label: {
        textAlign: 'justify',
        fontSize: 16,
        fontWeight: 300,
        lineHeight: '24px'
    },
    checkboxRoot: {
        color: !!theme.status && theme.status.danger || '',
    },
    checkboxChecked: {
        color: !!theme.palette && `${theme.palette.primary.main} !important` || ''
    }
});

export default withStyles(styles, {withTheme: true})(DepositAgreement);
