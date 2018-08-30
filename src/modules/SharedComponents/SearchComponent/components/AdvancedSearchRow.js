import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import Close from 'material-ui/svg-icons/navigation/close';
import {locale} from 'locale';
import AdvancedSearchRowInput from './AdvancedSearchRowInput';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

const styles = {
    advancedSearchRowDeleteButton: {
        marginTop: -6,
        marginBottom: -6,
        opacity: 0.66
    },
    advancedSearchCombiner: {
        marginTop: 6
    }
};

export class AdvancedSearchRow extends PureComponent {
    static propTypes = {
        rowIndex: PropTypes.number,
        searchField: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.number
        ]),
        label: PropTypes.any,
        disabledFields: PropTypes.array,
        onSearchRowChange: PropTypes.func,
        onSearchRowDelete: PropTypes.func,
        classes: PropTypes.object
    };

    _handleTextChange = (value, label = '') => {
        this.props.onSearchRowChange(this.props.rowIndex, {searchField: this.props.searchField, value, label});
    };

    _handleSearchFieldChange = (event) => {
        const searchField = event.target.value;
        this.props.onSearchRowChange(this.props.rowIndex, {searchField, value: '', label: ''});
    };

    _deleteRow = () => {
        this.props.onSearchRowDelete(this.props.rowIndex);
    };

    selectFieldValidation = () => {
        // If the input value is empty and select value = 0 then show an error
        if (this.props.searchField === '0' && !this.props.value) {
            return locale.validationErrors.advancedSearchSelectionRequired;
        }
        return null;
    };

    renderInputComponentAndProps = () => (InputComponent, inputProps) => (<InputComponent
        type="search"
        name={`searchField${this.props.rowIndex}`}
        id="searchField"
        fullWidth
        value={this.props.value}
        disabled={this.props.searchField === '0'}
        {...inputProps}
    />);

    render() {
        const txt = locale.components.searchComponent.advancedSearch;
        const {classes} = this.props;
        return (
            <Grid container spacing={16}>
                <Grid item xs={12} sm={3}>
                    <Select
                        value={this.props.searchField}
                        onChange={this._handleSearchFieldChange}
                        error={!!this.selectFieldValidation()}
                        helpertext={this.selectFieldValidation()}
                        aria-label={txt.selectAria.replace('[current_selection]', txt.fieldTypes[this.props.searchField].title)}
                        fullWidth
                    >
                        {
                            Object.keys(txt.fieldTypes)
                                .filter(item => txt.fieldTypes[item].type !== null)
                                .sort((item1, item2) => txt.fieldTypes[item1].order - txt.fieldTypes[item2].order)
                                .map((item, index) => {
                                    if(txt.fieldTypes[item].type === 'divider') {
                                        return <Divider key={index} />;
                                    }
                                    return  (
                                        <MenuItem
                                            key={item}
                                            value={item}
                                            children={txt.fieldTypes[item].title}
                                            disabled={index === 0 || this.props.disabledFields.indexOf(item) > -1}
                                        />
                                    );
                                })
                        }
                    </Select>
                </Grid>
                {
                    txt.fieldTypes[this.props.searchField].combiner &&
                        <Grid item>
                            <Typography className={classes.advancedSearchCombiner}>{txt.fieldTypes[this.props.searchField].combiner}</Typography>
                        </Grid>
                }
                <Grid item style={{flexGrow: 1}}>
                    <AdvancedSearchRowInput
                        {...this.props}
                        onChange={this._handleTextChange}
                        inputField={txt.fieldTypes[this.props.searchField]}
                    >
                        {
                            this.renderInputComponentAndProps()
                        }
                    </AdvancedSearchRowInput>
                </Grid>
                {
                    this.props.rowIndex !== 0 &&
                    <Grid item className={classes.advancedSearchRowDeleteButton}>
                        <IconButton
                            aria-label={txt.deleteAria}
                            className="deleteFieldButton"
                            onClick={this._deleteRow}
                        >
                            <Close/>
                        </IconButton>
                    </Grid>
                }
            </Grid>
        );
    }
}
export default withStyles(styles, {withTheme: true})(AdvancedSearchRow);

