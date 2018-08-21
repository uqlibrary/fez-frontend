import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {FormControlLabel, Typography, Checkbox} from '@material-ui/core';
import classNames from 'classnames';

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
                className={classes.root}
                disabled={disabled}
                control={
                    <Checkbox
                        checked={isTermsAndConditionsAccepted}
                        onChange={this._handleChange}
                        className={classNames([!isTermsAndConditionsAccepted ? classes.error : null])}
                        color="primary"
                    />
                }
                label={
                    <Typography className={classNames([classes.label, !isTermsAndConditionsAccepted ? classes.error : classes.accepted])}>
                        {accessTermsAndConditions}
                    </Typography>
                }
            />
        );
    }
}

const styles = () => ({
    root: {
        alignItems: 'flex-start'
    },
    label: {
        textAlign: 'justify',
        fontSize: 16,
        fontWeight: 300,
        lineHeight: '24px',
        paddingTop: 10
    },
    error: {
        color: '#e02500'
    },
    accepted: {
        color: 'rgb(136, 136, 136)'
    }
});

export default withStyles(styles)(FileUploadTermsAndConditions);
