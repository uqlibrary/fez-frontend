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
        onSimpleSearchClick: PropTypes.func,
        onSearch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        const fieldRows = Object.keys(props.searchQueryParams).map(key => ({
            searchField: key,
            value: props.searchQueryParams[key]
        }));

        this.state = {
            fieldRows,
            minimised: false,
            openAccess: props.isOpenAccessInAdvancedMode || false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.searchQueryParams) {
            const fieldRows = Object.keys(nextProps.searchQueryParams).map(key => ({
                searchField: key,
                value: nextProps.searchQueryParams[key]
            }));

            this.setState({
                ...this.state,
                fieldRows,
                openAccess: nextProps.isOpenAccessInAdvancedMode,
                minimised: nextProps.isAdvancedSearchMinimised
            });
        }
    }

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

    toggleAdvancedSearchMinimise = () => {
        this.setState({
            minimised: !this.state.minimised
        });
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
        const newArray = [
            ...this.state.fieldRows.slice(0, index),
            ...this.state.fieldRows.slice(index + 1)
        ];
        this._updateAdvancedFields(newArray);
    };

    handleAdvancedFieldChange = (index, searchRow) => {
        const newArray = [
            ...this.state.fieldRows.slice(0, index),
            searchRow,
            ...this.state.fieldRows.slice(index + 1)
        ];
        this._updateAdvancedFields(newArray);
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

    _updateAdvancedFields = (searchRows) => {
        this.setState({
            fieldRows: searchRows
        });
    };

    _getAdvancedSearchCaption = () => {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
        const searchFields = this.state.fieldRows.map((item, index) => (
            <span key={index}>
                {index > 0 && <span className="and">  {item.value && 'and'}</span>}
                <span className={`title ${index > 0 && ' lowercase'}`}> {item.value && txt[item.searchField].title}</span>
                <span className="combiner"> {item.value && txt[item.searchField].combiner}</span>
                <span className="value"> {item.value}</span>
            </span>
        ));
        const openAccess = this.state.openAccess
            ? <span> and is <span className="value">open access/ full text.</span></span>
            : '.';
        return <div>{searchFields}{openAccess}</div>;
    };

    hasAllAdvancedSearchFieldCompleted = (fieldRows) => {
        return fieldRows.filter(item => item.searchField === 0 || item.value === '').length === 0;
    }

    render() {
        const txt = locale.components.searchComponent;
        const canAddAnotherField = this.hasAllAdvancedSearchFieldCompleted(this.state.fieldRows)
             && this.state.fieldRows.length < Object.keys(txt.advancedSearch.fieldTypes).length - 1;
        const alreadyAddedFields = this.state.fieldRows.map(item => item.searchField);

        return (
            <div className={`search-component ${this.props.className}`}>
                <div className="advancedSearch">
                    <div className="columns is-gapless is-mobile" style={{marginBottom: '-12px'}}>
                        <div className="column">
                            <h2>{txt.advancedSearch.title}</h2>
                        </div>
                        <div className="column is-narrow">
                            <IconButton onClick={this.toggleAdvancedSearchMinimise}
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
                                            onClick={this.props.onSimpleSearchClick}
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
                                            disabled={!this.hasAllAdvancedSearchFieldCompleted(this.state.fieldRows)}
                                        />
                                    </div>
                                </div>
                            </Fragment>
                    }
                    <div className="searchQueryCaption">
                        {this._getAdvancedSearchCaption()}
                    </div>
                </div>
            </div>
        );
    }
}
