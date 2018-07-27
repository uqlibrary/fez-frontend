import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/navigation/close';
import {locale} from 'locale';
import AdvancedSearchRowInput from './AdvancedSearchRowInput';

export default class AdvancedSearchRow extends PureComponent {
    static propTypes = {
        rowIndex: PropTypes.number,
        searchField: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        disabledFields: PropTypes.array,
        onSearchRowChange: PropTypes.func,
        onSearchRowDelete: PropTypes.func,
    };

    _handleTextChange = (event, value) => {
        this.props.onSearchRowChange(this.props.rowIndex, {searchField: this.props.searchField, value});
    };

    _handleSearchFieldChange = (event, index, searchField) => {
        this.props.onSearchRowChange(this.props.rowIndex, {searchField, value: ''});
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
        onChange={this._handleTextChange}
        disabled={this.props.searchField === '0'}
        {...inputProps}
    />);

    render() {
        const txt = locale.components.searchComponent.advancedSearch;
        return (
            <div className="columns is-gapless is-mobile advancedSearchRow">
                <div className="column is-4-tablet">
                    <SelectField
                        value={this.props.searchField}
                        onChange={this._handleSearchFieldChange}
                        errorText={this.selectFieldValidation()}
                        fullWidth>
                        {
                            Object.keys(txt.fieldTypes)
                                .filter(item => txt.fieldTypes[item].type !== null)
                                .map((item, index) => (
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
                        : <div className="column is-narrow spacer" />
                }
                <div className={`column input ${(this.props.rowIndex === 0) ? 'is-12-mobile' : 'is-11-mobile'}`}>
                    <AdvancedSearchRowInput {...this.props} inputField={txt.fieldTypes[this.props.searchField]} value={this.props.value}>
                        {
                            this.renderInputComponentAndProps()
                        }
                    </AdvancedSearchRowInput>
                </div>
                {
                    this.props.rowIndex !== 0 &&
                    <div className="column is-1-mobile is-narrow-tablet">
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
