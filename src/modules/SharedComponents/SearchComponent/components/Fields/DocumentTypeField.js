import React, {PureComponent} from 'react';
import {publicationTypes} from 'config';
// import {documentTypesLookup} from 'config/general';
import MenuItem from 'material-ui/MenuItem';
import {locale} from 'locale';
import * as recordForms from '../../../PublicationForm/components/Forms';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';

export default class DocumentTypeField extends PureComponent {
    static propTypes = {
        docTypes: PropTypes.array,
        updateDocTypeValues: PropTypes.func,
        className: PropTypes.string
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

    _handleDocTypeChange = (event, index, value) => {
        this.props.updateDocTypeValues(value);
    };

    render() {
        const txt = locale.components.searchComponent;
        const docTypeItems = [
            ...this.publicationTypes.filter((item) => {
                return item.hasFormComponent;
            }).map((item, index) => {
                return (
                    <MenuItem
                        className={this.props.className}
                        checked={this.props.docTypes && this.props.docTypes.length > 0 && this.props.docTypes.indexOf(item.id) > -1}
                        value={item.id}
                        primaryText={item.name}
                        key={index + 1}
                        disabled={!item.formComponent}
                    />
                );
            })
        ];

        return (
            <SelectField
                floatingLabelText={txt.advancedSearch.fieldTypes.rek_doc_type.title}
                value={this.props.docTypes}
                onChange={this._handleDocTypeChange}
                multiple
                fullWidth
            >
                {docTypeItems}
            </SelectField>
        );
    }
}
