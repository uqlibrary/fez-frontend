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
import {defaultQueryParams} from 'config/general';

export default class AdvancedSearchComponent extends PureComponent {
    static propTypes = {
        searchQueryParams: PropTypes.object,
        className: PropTypes.string,
        isOpenAccessInAdvancedMode: PropTypes.bool,
        isAdvancedSearchMinimised: PropTypes.bool,
        onSearch: PropTypes.func.isRequired,
        onToggle: PropTypes.func
    };

    constructor(props) {
        super(props);

        const fieldRows = this._getFieldRowsFromSearchQuery(props.searchQueryParams);

        this.state = {
            fieldRows,
            minimised: props.isAdvancedSearchMinimised,
            openAccess: props.isOpenAccessInAdvancedMode || false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.searchQueryParams) {
            const fieldRows = this._getFieldRowsFromSearchQuery(nextProps.searchQueryParams);

            this.setState({
                ...this.state,
                fieldRows,
                minimised: nextProps.isAdvancedSearchMinimised,
                openAccess: nextProps.isOpenAccessInAdvancedMode
            });
        }
    }

    _getFieldRowsFromSearchQuery = (searchQueryParams) => (
        Object.keys(searchQueryParams).map(key => ({
            searchField: key,
            value: searchQueryParams[key]
        }))
    );

    _getAdvancedSearchCaption = ({fieldRows, openAccess}) => {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
        const searchFields = fieldRows.map((item, index) => (
            <span key={index}>
                {index > 0 && <span className="and">  {item.value && 'and'}</span>}
                <span className={`title ${index > 0 && ' lowercase'}`}> {item.value && txt[item.searchField].title}</span>
                <span className="combiner"> {item.value && txt[item.searchField].combiner}</span>
                <span className="value"> {item.value}</span>
            </span>
        ));

        const openAccessText = openAccess
            ? locale.components.searchComponent.advancedSearch.openAccess.captionText
            : searchFields.length > 0 && '.' || null;
        return (searchFields.length > 0 || !!openAccess) && <Fragment>{searchFields}{openAccessText}</Fragment> || null;
    };

    _hasAllAdvancedSearchFieldCompleted = (fieldRows) => {
        return fieldRows.filter(item => item.searchField === 0 || item.value === '').length === 0;
    };

    handleAdvancedSearch = (event) => {
        // Stop submission unless enter was pressed
        if (event && event.key && (event.key !== 'Enter')) return;

        const searchQueryParams = this.state.fieldRows
            .reduce((searchQueries, item) => (
                {...searchQueries, [item.searchField]: item.value}
            ), {});

        const {activeFacets} = defaultQueryParams;

        const searchQuery = {
            ...defaultQueryParams,
            searchQueryParams,
            searchMode: locale.components.searchComponent.advancedSearch.mode,
            activeFacets: {
                ...activeFacets,
                ...(this.state.openAccess ? {showOpenAccessOnly: true} : {})
            }
        };

        this.props.onSearch(searchQuery);
    };

    toggleMinimisedView = () => {
        this.setState({
            minimised: !this.state.minimised
        });
    };

    handleAdvancedFieldChange = (index, searchRow) => {
        this.setState({
            fieldRows: [
                ...this.state.fieldRows.slice(0, index),
                searchRow,
                ...this.state.fieldRows.slice(index + 1)
            ]
        });
    };

    handleSearchMode = () => {
        if (!!this.props.onToggle) {
            this.props.onToggle();
        }
    };

    addAdvancedField = () => {
        this.setState({
            fieldRows: [
                ...this.state.fieldRows,
                {
                    searchField: 0,
                    value: '',
                }
            ]
        });
    };

    deleteAdvancedField = (index) => {
        this.setState({
            fieldRows: [
                ...this.state.fieldRows.slice(0, index),
                ...this.state.fieldRows.slice(index + 1)
            ]
        });
    };

    resetAdvancedFields = () => {
        this.setState({
            openAccess: false,
            fieldRows: [{
                searchField: 0,
                value: ''
            }]
        });
    };

    toggleOpenAccess = (event) => {
        event.preventDefault();
        this.setState({
            openAccess: !this.state.openAccess
        });
    };

    render() {
        const txt = locale.components.searchComponent;
        const canAddAnotherField = this._hasAllAdvancedSearchFieldCompleted(this.state.fieldRows)
             && this.state.fieldRows.length < Object.keys(txt.advancedSearch.fieldTypes).length - 1;
        const alreadyAddedFields = this.state.fieldRows.map(item => item.searchField);
        const searchQueryCaption = this._getAdvancedSearchCaption(this.state);

        return (
            <div className={`search-component ${this.props.className}`}>
                <div className="advancedSearch">
                    <div className="columns is-gapless is-mobile" style={{marginBottom: '-12px'}}>
                        <div className="column">
                            <h2>{txt.advancedSearch.title}</h2>
                        </div>
                        <div className="column is-narrow">
                            <IconButton onClick={this.toggleMinimisedView}
                                tooltip={this.state.minimised
                                    ? txt.advancedSearch.tooltip.show
                                    : txt.advancedSearch.tooltip.hide}>
                                {
                                    !this.state.minimised
                                        ? <KeyboardArrowUp/>
                                        : <KeyboardArrowDown/>
                                }
                            </IconButton>
                        </div>
                    </div>
                    {
                        !this.state.minimised &&
                            <Fragment>
                                <div className="columns">
                                    <div className="column fields">
                                        {
                                            this.state.fieldRows.map((item, index) => (
                                                <AdvancedSearchRow
                                                    key={index}
                                                    rowIndex={index}
                                                    searchRow={item}
                                                    disabledFields={alreadyAddedFields}
                                                    onSearchRowChange={this.handleAdvancedFieldChange}
                                                    onSearchRowDelete={this.deleteAdvancedField}
                                                />
                                            ))
                                        }
                                    </div>
                                    <div className="column is-3">
                                        <Checkbox
                                            label={txt.advancedSearch.openAccess.title}
                                            checked={this.state.openAccess}
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
                                            onClick={this.addAdvancedField}
                                        />
                                    </div>
                                    <div className="column is-narrow">
                                        <RaisedButton
                                            label={txt.advancedSearch.reset.title}
                                            aria-label={txt.advancedSearch.reset.aria}
                                            style={{marginLeft: 6}}
                                            onClick={this.resetAdvancedFields}
                                        />
                                    </div>
                                    <div className="column is-narrow">
                                        <FlatButton
                                            label={txt.advancedSearch.simpleSearch.title}
                                            aria-label={txt.advancedSearch.simpleSearch.aria}
                                            style={{marginLeft: 6}}
                                            onClick={this.handleSearchMode}
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
                                            disabled={!this._hasAllAdvancedSearchFieldCompleted(this.state.fieldRows)}
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
