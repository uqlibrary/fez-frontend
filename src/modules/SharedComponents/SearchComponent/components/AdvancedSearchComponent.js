import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import AdvancedSearchRow from './AdvancedSearchRow';
import Checkbox from 'material-ui/Checkbox';
import {MAX_PUBLIC_SEARCH_TEXT_LENGTH} from 'config/general';


import {locale} from 'locale';

export default class AdvancedSearchComponent extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        fieldRows: PropTypes.array,
        isOpenAccess: PropTypes.bool,
        isMinimised: PropTypes.bool,

        // Event handlers
        onToggleSearchMode: PropTypes.func,
        onToggleMinimise: PropTypes.func,
        onToggleOpenAccess: PropTypes.func,
        onAdvancedSearchRowAdd: PropTypes.func,
        onAdvancedSearchRowRemove: PropTypes.func,
        onAdvancedSearchReset: PropTypes.func,

        onAdvancedSearchRowChange: PropTypes.func.isRequired,
        onSearch: PropTypes.func.isRequired,
    };

    static defaultProps = {
        fieldRows: [{
            searchField: '0',
            value: ''
        }],
        isMinimised: false,
        isOpenAccess: false,

        onToggleSearchMode: () => {},
        onToggleMinimise: () => {},
        onToggleOpenAccess: () => {},
        onAdvancedSearchRowAdd: () => {},
        onAdvancedSearchRowRemove: () => {},
        onAdvancedSearchReset: () => {}
    };

    getAdvancedSearchCaption = ({fieldRows, isOpenAccess}) => {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
        const searchFields = fieldRows
            .filter(item => item.searchField !== '0' && item.value !== '')
            .map((item, index) => (
                <span key={item.searchField}>
                    {index > 0 && <span className="AND">  {item.value && 'AND'}</span>}
                    <span className={`title ${index > 0 && ' lowercase'}`}> {item.value && txt[item.searchField].title}</span>
                    <span className="combiner"> {item.value && txt[item.searchField].combiner}</span>
                    <span className="value"> {item.value}</span>
                </span>
            ));

        const openAccessText = isOpenAccess
            ? locale.components.searchComponent.advancedSearch.openAccess.captionText
            : searchFields.length > 0 && '.' || null;
        return (searchFields.length > 0 || !!isOpenAccess) && <Fragment>{searchFields}{openAccessText}</Fragment> || null;
    };

    haveAllAdvancedSearchFieldsValidated = (fieldRows) => {
        const fieldTypes = locale.components.searchComponent.advancedSearch.fieldTypes;
        return fieldRows.filter(item => item.searchField === '0' || item.value === ''
            // Check if the locale specifies a minLength for this field and check it not shorter
            || (!!fieldTypes[item.searchField].minLength && fieldTypes[item.searchField].minLength > item.value.trim().length)
            // Check if this field is exceeding the maxLength
            || (MAX_PUBLIC_SEARCH_TEXT_LENGTH < item.value.trim().length)
        ).length === 0;
    };

    _handleAdvancedSearch = (event) => {
        if (event) event.preventDefault();
        if (event && event.key && (event.key !== 'Enter')) return;
        this.props.onSearch();
    };

    _toggleSearchMode = () => {
        if (!!this.props.onToggleSearchMode) {
            this.props.onToggleSearchMode();
        }
    };

    _toggleMinimise = () => {
        if (!!this.props.onToggleMinimise) {
            this.props.onToggleMinimise();
        }
    };

    _toggleOpenAccess = (event) => {
        event.preventDefault();
        if (!!this.props.onToggleOpenAccess) {
            this.props.onToggleOpenAccess();
        }
    };

    _handleAdvancedSearchRowChange = (index, searchRow) => {
        this.props.onAdvancedSearchRowChange(index, searchRow);
    };

    _addAdvancedSearchRow = () => {
        if (!!this.props.onAdvancedSearchRowAdd) {
            this.props.onAdvancedSearchRowAdd();
        }
    };

    _removeAdvancedSearchRow = (index) => {
        if (!!this.props.onAdvancedSearchRowRemove) {
            this.props.onAdvancedSearchRowRemove(index);
        }
    };

    _resetAdvancedSearch = () => {
        if (!!this.props.onAdvancedSearchReset) {
            this.props.onAdvancedSearchReset();
        }
    };

    render() {
        const txt = locale.components.searchComponent;
        const canAddAnotherField = this.haveAllAdvancedSearchFieldsValidated(this.props.fieldRows)
             && this.props.fieldRows.length < Object.keys(txt.advancedSearch.fieldTypes).length - 1;
        const alreadyAddedFields = this.props.fieldRows.map(item => item.searchField);
        const searchQueryCaption = this.getAdvancedSearchCaption(this.props);
        return (
            <div className={`searchComponent ${this.props.className}`}>
                <form id="advancedSearchForm" onSubmit={this._handleAdvancedSearch}>
                    <div className="advancedSearch">
                        <div className="columns is-gapless is-mobile" style={{marginBottom: '-12px'}}>
                            <div className="column">
                                <h2>{txt.advancedSearch.title}</h2>
                            </div>
                            <div className="column is-narrow">
                                <IconButton onClick={this._toggleMinimise}
                                    tooltip={this.props.isMinimised
                                        ? txt.advancedSearch.tooltip.show
                                        : txt.advancedSearch.tooltip.hide}>
                                    {
                                        !this.props.isMinimised
                                            ? <KeyboardArrowUp/>
                                            : <KeyboardArrowDown/>
                                    }
                                </IconButton>
                            </div>
                        </div>
                        {
                            !this.props.isMinimised &&
                                <Fragment>
                                    <div className="columns is-multiline is-mobile">
                                        <div className="column fields is-11-mobile is-11-tablet-only">
                                            {
                                                this.props.fieldRows.map((item, index) => (
                                                    <AdvancedSearchRow
                                                        key={`advanced-search-field-${item.searchField}`}
                                                        rowIndex={index}
                                                        disabledFields={alreadyAddedFields}
                                                        onSearchRowChange={this._handleAdvancedSearchRowChange}
                                                        onSearchRowDelete={this._removeAdvancedSearchRow}
                                                        {...item}
                                                    />
                                                ))
                                            }
                                        </div>
                                        <div className="column is-3-desktop is-12-tablet is-12-mobile openAccessCheckbox">
                                            <Checkbox
                                                className="advancedSearchOpenAccessCheckbox"
                                                label={txt.advancedSearch.openAccess.title}
                                                checked={this.props.isOpenAccess}
                                                onCheck={this._toggleOpenAccess}
                                            />
                                        </div>
                                    </div>
                                    <div className="columns is-gapless is-mobile is-multiline actionButtons">
                                        <div className="column is-narrow-desktop is-narrow-tablet is-12-mobile">
                                            <RaisedButton
                                                label={txt.advancedSearch.addField.title}
                                                aria-label={txt.advancedSearch.addField.aria}
                                                secondary
                                                disabled={!canAddAnotherField}
                                                onClick={this._addAdvancedSearchRow}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="column is-narrow-tablet is-12-mobile">
                                            <RaisedButton
                                                label={txt.advancedSearch.reset.title}
                                                aria-label={txt.advancedSearch.reset.aria}
                                                onClick={this._resetAdvancedSearch}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="column is-12-mobile is-narrow-tablet">
                                            <FlatButton
                                                label={txt.advancedSearch.simpleSearch.title}
                                                aria-label={txt.advancedSearch.simpleSearch.aria}
                                                onClick={this._toggleSearchMode}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="column is-hidden-mobile" />
                                        <div className="column is-3-desktop is-3-tablet is-12-mobile">
                                            <RaisedButton
                                                className="advancedSearchButton"
                                                label={txt.searchButtonText}
                                                aria-label={txt.searchButtonAriaLabel}
                                                type="submit"
                                                primary
                                                fullWidth
                                                onClick={this._handleAdvancedSearch}
                                                disabled={!this.haveAllAdvancedSearchFieldsValidated(this.props.fieldRows)}
                                            />
                                        </div>
                                    </div>
                                </Fragment>
                        }
                        {
                            !!searchQueryCaption &&
                            <div className="searchQueryCaption">
                                {searchQueryCaption}
                            </div>
                        }
                    </div>
                </form>
            </div>
        );
    }
}
