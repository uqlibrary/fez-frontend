import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {FormControlLabel, Typography, Checkbox} from '@material-ui/core';
import classnames from 'classnames';

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
                disabled={disabled}
                control={
                    <Checkbox
                        checked={isTermsAndConditionsAccepted}
                        onChange={this._handleChange}
                        className={!isTermsAndConditionsAccepted ? classes.error : null}
                    />
                }
                label={
                    <Typography className={classnames([classes.label, !isTermsAndConditionsAccepted ? classes.error : classes.accepted])}>
                        {accessTermsAndConditions}
                    </Typography>
                }
            />
        );
    }
}

const styles = () => ({
    label: {
        textAlign: 'justify'
    },
    error: {
        color: '#e02500'
    },
    accepted: {
        color: 'rgb(0, 0, 0, 0.5)'
    }
});

export default withStyles(styles)(FileUploadTermsAndConditions);
