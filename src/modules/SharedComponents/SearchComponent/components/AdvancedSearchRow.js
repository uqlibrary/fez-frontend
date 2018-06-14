import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/navigation/close';
import {locale} from 'locale';
import {MAX_PUBLIC_SEARCH_TEXT_LENGTH} from 'config/general';


export default class AdvancedSearchRow extends PureComponent {
    static propTypes = {
        rowIndex: PropTypes.number,
        searchField: PropTypes.string,
        value: PropTypes.string,
        disabledFields: PropTypes.array,
        onSearchRowChange: PropTypes.func,
        onSearchRowDelete: PropTypes.func,
    };

    _handleTextChange = (event, value) => {
        this.props.onSearchRowChange(this.props.rowIndex, {searchField: this.props.searchField, value});
    };

    _handleSearchFieldChange = (event, index, searchField) => {
        this.props.onSearchRowChange(this.props.rowIndex, {searchField, value: this.props.value});
    };

    _deleteRow = () => {
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
                        value={this.props.searchField}
                        onChange={this._handleSearchFieldChange}
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
                    txt.fieldTypes[this.props.searchField].combiner ?
                        <div className="column is-narrow combiner">
                            <span>{txt.fieldTypes[this.props.searchField].combiner}</span>
                        </div>
                        : <div className="column is-narrow" style={{width: 12}} />
                }
                <div className="column">
                    <TextField
                        type="search"
                        name={`textSearchField${this.props.rowIndex}`}
                        id="searchField"
                        fullWidth
                        hintText={txt.fieldTypes[this.props.searchField].hint}
                        aria-label="Aria"
                        value={this.props.value}
                        onChange={this._handleTextChange}
                        errorText={this.searchTextValidationMessage(this.props.value)}
                        disabled={this.props.searchField === 0}
                    />
                </div>
                {
                    this.props.rowIndex !== 0 &&
                    <div className="column is-narrow">
                        <IconButton
                            className="deleteFieldButton"
                            onClick={this._deleteRow}
                        >
                            <Close/>
                        </IconButton>
                    </div>
                }
            </div>
        );
    }
}
