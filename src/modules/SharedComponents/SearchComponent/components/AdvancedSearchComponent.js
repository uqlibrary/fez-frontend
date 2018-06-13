import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import AdvancedSearchRow from './AdvancedSearchRow';
import Checkbox from 'material-ui/Checkbox';

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

    _getAdvancedSearchCaption = ({fieldRows, isOpenAccess}) => {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
        const searchFields = fieldRows
            .filter(item => item.searchField !== '0' && item.value !== '')
            .map((item, index) => (
                <span key={item.searchField}>
                    {index > 0 && <span className="and">  {item.value && 'and'}</span>}
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

    _hasAllAdvancedSearchFieldCompleted = (fieldRows) => {
        return fieldRows.filter(item => item.searchField === '0' || item.value === '').length === 0;
    };

    handleAdvancedSearch = (event) => {
        // Stop submission unless enter was pressed
        if (event && event.key && (event.key !== 'Enter')) return;

        this.props.onSearch();
    };

    toggleSearchMode = () => {
        if (!!this.props.onToggleSearchMode) {
            this.props.onToggleSearchMode();
        }
    };

    toggleMinimise = () => {
        if (!!this.props.onToggleMinimise) {
            this.props.onToggleMinimise();
        }
    };

    toggleOpenAccess = (event) => {
        event.preventDefault();
        if (!!this.props.onToggleOpenAccess) {
            this.props.onToggleOpenAccess();
        }
    };

    handleAdvancedSearchRowChange = (index, searchRow) => {
        this.props.onAdvancedSearchRowChange(index, searchRow);
    };


    addAdvancedSearchRow = () => {
        if (!!this.props.onAdvancedSearchRowAdd) {
            this.props.onAdvancedSearchRowAdd();
        }
    };

    removeAdvancedSearchRow = (index) => {
        if (!!this.props.onAdvancedSearchRowRemove) {
            this.props.onAdvancedSearchRowRemove(index);
        }
    };

    resetAdvancedSearch = () => {
        if (!!this.props.onAdvancedSearchReset) {
            this.props.onAdvancedSearchReset();
        }
    };

    render() {
        const txt = locale.components.searchComponent;
        const canAddAnotherField = this._hasAllAdvancedSearchFieldCompleted(this.props.fieldRows)
             && this.props.fieldRows.length < Object.keys(txt.advancedSearch.fieldTypes).length - 1;
        const alreadyAddedFields = this.props.fieldRows.map(item => item.searchField);
        const searchQueryCaption = this._getAdvancedSearchCaption(this.props);

        return (
            <div className={`search-component ${this.props.className}`}>
                <div className="advancedSearch">
                    <div className="columns is-gapless is-mobile" style={{marginBottom: '-12px'}}>
                        <div className="column">
                            <h2>{txt.advancedSearch.title}</h2>
                        </div>
                        <div className="column is-narrow">
                            <IconButton onClick={this.toggleMinimise}
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
                                <div className="columns">
                                    <div className="column fields">
                                        {
                                            this.props.fieldRows.map((item, index) => (
                                                <AdvancedSearchRow
                                                    key={`advanced-search-field-${item.searchField}`}
                                                    rowIndex={index}
                                                    disabledFields={alreadyAddedFields}
                                                    onSearchRowChange={this.handleAdvancedSearchRowChange}
                                                    onSearchRowDelete={this.removeAdvancedSearchRow}
                                                    {...item}
                                                />
                                            ))
                                        }
                                    </div>
                                    <div className="column is-3">
                                        <Checkbox
                                            label={txt.advancedSearch.openAccess.title}
                                            checked={this.props.isOpenAccess}
                                            onCheck={this.toggleOpenAccess}
                                            style={{marginTop: 12, paddingBottom: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)'}}
                                        />
                                    </div>
                                </div>
                                <div className="columns is-gapless">
                                    <div className="column is-narrow">
                                        <RaisedButton
                                            label={txt.advancedSearch.addField.title}
                                            aria-label={txt.advancedSearch.addField.aria}
                                            secondary
                                            disabled={!canAddAnotherField}
                                            onClick={this.addAdvancedSearchRow}
                                        />
                                    </div>
                                    <div className="column is-narrow">
                                        <RaisedButton
                                            label={txt.advancedSearch.reset.title}
                                            aria-label={txt.advancedSearch.reset.aria}
                                            style={{marginLeft: 6}}
                                            onClick={this.resetAdvancedSearch}
                                        />
                                    </div>
                                    <div className="column is-narrow">
                                        <FlatButton
                                            label={txt.advancedSearch.simpleSearch.title}
                                            aria-label={txt.advancedSearch.simpleSearch.aria}
                                            style={{marginLeft: 6}}
                                            onClick={this.toggleSearchMode}
                                        />
                                    </div>
                                    <div className="column" />
                                    <div className="column is-3">
                                        <RaisedButton
                                            label={txt.searchButtonText}
                                            aria-label={txt.searchButtonAriaLabel}
                                            primary
                                            fullWidth
                                            onClick={this.handleAdvancedSearch}
                                            disabled={!this._hasAllAdvancedSearchFieldCompleted(this.props.fieldRows)}
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
            </div>
        );
    }
}
