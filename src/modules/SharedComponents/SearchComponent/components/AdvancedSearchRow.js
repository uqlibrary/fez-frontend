import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/navigation/close';
import {locale} from 'locale';
import {MAX_PUBLIC_SEARCH_TEXT_LENGTH} from 'config/general';


export default class AdvancedSearchRow extends Component {
    static propTypes = {
        rowIndex: PropTypes.number,
        searchRow: PropTypes.object,
        disabledFields: PropTypes.array,
        onSearchRowChange: PropTypes.func,
        onSearchRowDelete: PropTypes.func,
    };

    shouldComponentUpdate(nextProps) {
        if (
            this.props.searchRow.searchField !== nextProps.searchRow.searchField ||
            this.props.searchRow.value !== nextProps.searchRow.value
        ) return true;

        return false;
    }

    handleTextChange = (event, value) => {
        this.props.onSearchRowChange(this.props.rowIndex, {...this.props.searchRow, value});
    };

    handleSearchFieldChange = (event, index, searchField) => {
        this.props.onSearchRowChange(this.props.rowIndex, {...this.props.searchRow, searchField});
    };

    deleteRow = () => {
        this.props.onSearchRowDelete(this.props.rowIndex);
    };

    searchTextValidationMessage = (value) => {
        if (value.trim().length > MAX_PUBLIC_SEARCH_TEXT_LENGTH) {
            return locale.validationErrors.maxLength.replace('[max]', MAX_PUBLIC_SEARCH_TEXT_LENGTH);
        }

        return null;
    };

    render() {
        const txt = locale.components.searchComponent.advancedSearch;
        return (
            <div className="columns is-gapless is-mobile advancedSearchField">
                <div className="column is-3">
                    <SelectField
                        value={this.props.searchRow.searchField}
                        onChange={this.handleSearchFieldChange}
                        fullWidth>
                        {
                            Object.keys(txt.fieldTypes).map((item, index) => (
                                <MenuItem
                                    key={item}
                                    value={item}
                                    primaryText={txt.fieldTypes[item].title}
                                    disabled={index === 0 || this.props.disabledFields.indexOf(item) > -1}
                                />
                            ))
                        }
                    </SelectField>
                </div>
                {
                    txt.fieldTypes[this.props.searchRow.searchField].combiner ?
                        <div className="column is-narrow combiner">
                            <span>{txt.fieldTypes[this.props.searchRow.searchField].combiner}</span>
                        </div>
                        : <div className="column is-narrow" style={{width: 12}} />
                }
                <div className="column">
                    <TextField
                        type="search"
                        name={`textSearchField${this.props.rowIndex}`}
                        id="searchField"
                        fullWidth
                        hintText={txt.fieldTypes[this.props.searchRow.searchField].hint}
                        aria-label="Aria"
                        value={this.props.searchRow.value}
                        onChange={this.handleTextChange}
                        errorText={this.searchTextValidationMessage(this.props.searchRow.value)}
                        disabled={this.props.searchRow.searchField === 0}
                    />
                </div>
                {
                    this.props.rowIndex !== 0 &&
                    <div className="column is-narrow">
                        <IconButton
                            className="deleteFieldButton"
                            onClick={this.deleteRow}
                        >
                            <Close/>
                        </IconButton>
                    </div>
                }
            </div>
        );
    }
}
