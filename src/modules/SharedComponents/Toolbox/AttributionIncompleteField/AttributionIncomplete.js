import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export class AttributionIncomplete extends PureComponent {
    static propTypes = {
        isAttributionIncomplete: PropTypes.bool,
        onChange: PropTypes.func,
        classes: PropTypes.object,
        disabled: PropTypes.bool,
        attributionIncompleteStatement: PropTypes.string,
    };

    _handleChange = event => {
        this.props.onChange(event.target.checked ? 'on' : 'off');
    };

    render() {
        const { isAttributionIncomplete, attributionIncompleteStatement, classes, disabled } = this.props;

        return (
            <FormControlLabel
                classes={{
                    root: classes.root,
                }}
                disabled={disabled}
                control={
                    <Checkbox
                        inputProps={{
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
        );
    }
}

export const styles = () => ({
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
    checkboxRoot: {},
});

export default withStyles(styles, { withTheme: true })(AttributionIncomplete);
