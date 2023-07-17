import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export class AttributionIncomplete extends PureComponent {
    static propTypes = {
        isAttributionIncomplete: PropTypes.bool,
        onChange: PropTypes.func,
        classes: PropTypes.object,
        disabled: PropTypes.bool,
        attributionIncompleteStatement: PropTypes.string,
        attributionIncompleteDetail: PropTypes.string,
    };

    _handleChange = event => {
        this.props.onChange(event.target.checked ? true : false);
    };

    render() {
        const {
            isAttributionIncomplete,
            attributionIncompleteStatement,
            attributionIncompleteDetail,
            classes,
            disabled,
        } = this.props;

        return (
            <React.Fragment>
                <div>
                    <Typography variant="caption">{attributionIncompleteDetail}</Typography>
                </div>
                <FormControlLabel
                    classes={{
                        root: classes.root,
                    }}
                    disabled={disabled}
                    control={
                        <Checkbox
                            inputProps={{
                                'data-analyticsid': 'attributionIncomplete-input',
                                'data-testid': 'attributionIncomplete-input',
                                id: 'attributionIncomplete-input',
                            }}
                            checked={isAttributionIncomplete}
                            onChange={this._handleChange}
                            classes={{ root: classes.checkboxRoot, checked: classes.checkboxChecked }}
                        />
                    }
                    label={
                        <Typography
                            classes={{
                                root: classes.label,
                            }}
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
    }
}

export const styles = () => ({
    root: {
        margin: 0,
    },
    label: {
        textAlign: 'justify',
        fontSize: 16,
        fontWeight: 300,
        lineHeight: '24px',
    },
    checkboxRoot: {},
});

export default withStyles(styles, { withTheme: true })(AttributionIncomplete);
