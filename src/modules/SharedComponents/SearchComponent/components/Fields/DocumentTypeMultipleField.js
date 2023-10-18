import React, { PureComponent } from 'react';
import { publicationTypes } from 'config';
import MenuItem from '@mui/material/MenuItem';
import { locale } from 'locale';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

/**
 * allow the user to select MULTIPLE document types
 * (see DocumentTypeSingleField for selecting SINGLE document type)
 */
export class DocumentTypeMultipleField extends PureComponent {
    static propTypes = {
        docTypes: PropTypes.array,
        updateDocTypeValues: PropTypes.func,
        className: PropTypes.string,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        value: [],
        disabled: false,
        className: 'displaytype menuitem',
    };

    constructor(props) {
        super(props);
        this.publicationTypes = Object.values(publicationTypes());
    }

    _handleDocTypeChange = event => {
        this.props.updateDocTypeValues(event.target.value);
    };

    render() {
        const txt = locale.components.searchComponent;
        const docTypeItems = [
            <MenuItem key={0} disabled>
                {txt.advancedSearch.fieldTypes.rek_display_type.hint}
            </MenuItem>,
            ...this.publicationTypes.map((item, index) => {
                return (
                    <MenuItem
                        sx={{
                            display: 'block',
                            '&.Mui-selected': { backgroundColor: 'accent.main', color: 'white.main' },
                        }}
                        checked={
                            this.props.docTypes &&
                            this.props.docTypes.length > 0 &&
                            this.props.docTypes.indexOf(item.id) > -1
                        }
                        value={item.id}
                        children={item.name}
                        key={index + 1}
                    />
                );
            }),
        ];
        // const {classes} = this.props;
        return (
            <FormControl variant="standard" fullWidth>
                <InputLabel>{txt.advancedSearch.fieldTypes.rek_display_type.title}</InputLabel>
                <Select
                    variant="standard"
                    id="document-type-selector"
                    data-testid="document-type-selector"
                    name="document-type-selector"
                    aria-label={txt.advancedSearch.fieldTypes.rek_display_type.ariaLabel}
                    value={this.props.docTypes || ['0']}
                    onChange={this._handleDocTypeChange}
                    multiple
                    fullWidth
                    disabled={this.props.disabled}
                    children={docTypeItems}
                />
            </FormControl>
        );
    }
}
export default DocumentTypeMultipleField;
