import React, {PureComponent} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {FormControlLabel, Typography, Checkbox} from '@material-ui/core';

export class FileUploadTermsAndConditions extends PureComponent {
    render() {
        const {isTermsAndConditionsAccepted, classes, onAcceptTermsAndConditions} = this.props;

        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isTermsAndConditionsAccepted}
                        onChange={onAcceptTermsAndConditions}
                        className={!isTermsAndConditionsAccepted ? classes.error : null}
                    />
                }
                label={
                    <Typography className={!isTermsAndConditionsAccepted ? classes.error : null}>
                        {accessTermsAndConditions}
                    </Typography>
                }
            />
        );
    }
}

const styles = () => ({
    error: {
        color: 'e02500'
    }
});

export default withStyles(styles)(FileUploadTermsAndConditions);
