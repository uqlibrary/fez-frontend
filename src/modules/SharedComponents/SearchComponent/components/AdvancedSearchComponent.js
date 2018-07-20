import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import AdvancedSearchRow from './AdvancedSearchRow';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {MAX_PUBLIC_SEARCH_TEXT_LENGTH} from 'config/general';
import {publicationTypes} from 'config';
import {documentTypesLookup} from 'config/general';
import {locale} from 'locale';
import * as recordForms from '../../PublicationForm/components/Forms';

export default class AdvancedSearchComponent extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        fieldRows: PropTypes.array,
        docTypes: PropTypes.array,
        isOpenAccess: PropTypes.bool,
        isMinimised: PropTypes.bool,

        // Event handlers
        onToggleSearchMode: PropTypes.func,
        onToggleMinimise: PropTypes.func,
        onToggleOpenAccess: PropTypes.func,
        onAdvancedSearchRowAdd: PropTypes.func,
        onAdvancedSearchRowRemove: PropTypes.func,
        onAdvancedSearchReset: PropTypes.func,
        updateDocTypeValues: PropTypes.func,

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

    constructor(props) {
        super(props);
        this.publicationTypes = publicationTypes({...recordForms});
    }

    getAdvancedSearchCaption = ({fieldRows, isOpenAccess, docTypes}) => {
        const txt = locale.components.searchComponent.advancedSearch.fieldTypes;
        const searchFields = fieldRows
            .filter(item => item.searchField !== '0' && item.value !== '')
            .filter(item => item.searchField !== 'rek_doc_type')
            .map((item, index) => (
                <span key={item.searchField}>
                    {index > 0 && <span className="and">  {item.value && 'AND'}</span>}
                    <span className={`title ${index > 0 && ' lowercase'}`}> {item.value && txt[item.searchField] && txt[item.searchField].title}</span>
                    <span className="combiner"> {item.value && txt[item.searchField] && txt[item.searchField].combiner}</span>
                    <span className="value"> {item.value && item.value}</span>
                </span>
            ));

        // // TODO: write up the caption for document types with lookups
        const docTypeList =  docTypes && docTypes.map((item, index) => (
            <span key={index}>
                {index !== 0 && (index + 1 === docTypes.length) && ' or '}
                {documentTypesLookup[item] || ''}
                {(index + 1 !== docTypes.length) && ', '}
            </span>));
        const docTypeText = docTypes && docTypes.length > 0 && (
            <span>
                <span className="and"> {searchFields.length > 0 && ' AND '}</span>
                <span className="title">{txt.rek_doc_type.title}</span>
                <span className="combiner"> {txt.rek_doc_type.combiner}</span>
                <span className="value"> {docTypeList}</span>
            </span>
        ) || '';

        const openAccessText = isOpenAccess
            ? locale.components.searchComponent.advancedSearch.openAccess.captionText
            : searchFields.length > 0 && '.' || null;
        return (searchFields.length > 0 || !!isOpenAccess || docTypeText) && <Fragment>{searchFields}{docTypeText}{openAccessText}</Fragment> || null;
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

    _handleDocTypeChange = (event, index, value) => {
        this.props.updateDocTypeValues(value);
    }

    render() {
        const txt = locale.components.searchComponent;
        const canAddAnotherField = this.haveAllAdvancedSearchFieldsValidated(this.props.fieldRows)
            && this.props.fieldRows.length < Object.keys(txt.advancedSearch.fieldTypes).length - 1;
        const alreadyAddedFields = this.props.fieldRows.map(item => item.searchField);
        const searchQueryCaption = this.getAdvancedSearchCaption(this.props);
        const docTypeItems = [
            ...this.publicationTypes.filter((item) => {
                return item.hasFormComponent;
            }).map((item, index) => {
                return <MenuItem value={item.id} primaryText={item.name} key={index + 1} disabled={!item.formComponent}/>;
            })
        ];
        return (
            <div className={`searchComponent ${this.props.className}`}>
                <form id="advancedSearchForm" onSubmit={this._handleAdvancedSearch}>
                    <div className="advancedSearch">
                        <div className="columns is-gapless is-mobile">
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
                                                this.props.fieldRows
                                                    .filter((item) => {
                                                        return item.searchField && txt.advancedSearch.fieldTypes[item.searchField].type !== null;
                                                    })
                                                    .map((item, index) => (
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
                                        <div className="column is-4-desktop is-12-tablet is-12-mobile openAccessCheckbox">
                                            <div className="columns is-gapless is-multiline">
                                                <div className="column is-12">
                                                    <Checkbox
                                                        className="advancedSearchOpenAccessCheckbox"
                                                        label={txt.advancedSearch.openAccess.title}
                                                        aria-label={txt.advancedSearch.openAccess.ariaLabel}
                                                        checked={this.props.isOpenAccess}
                                                        onCheck={this._toggleOpenAccess}
                                                    />
                                                </div>
                                                <div className="column is-12">
                                                    <SelectField
                                                        floatingLabelText="Document type"
                                                        value={this.props.docTypes}
                                                        onChange={this._handleDocTypeChange}
                                                        multiple >
                                                        {docTypeItems}
                                                    </SelectField>
                                                </div>
                                            </div>
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
