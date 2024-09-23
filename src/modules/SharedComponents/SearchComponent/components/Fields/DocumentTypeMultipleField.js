import React from 'react';
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
export const DocumentTypeMultipleField = ({ docTypes, updateDocTypeValues, disabled = false }) => {
    const _publicationTypes = Object.values(publicationTypes());

    const _handleDocTypeChange = event => {
        updateDocTypeValues(event.target.value);
    };

    const txt = locale.components.searchComponent;
    const docTypeItems = [
        <MenuItem key={0} disabled>
            {txt.advancedSearch.fieldTypes.rek_display_type.hint}
        </MenuItem>,
        ..._publicationTypes.map((item, index) => {
            return (
                <MenuItem
                    sx={{
                        display: 'block',
                        '&.Mui-selected': { backgroundColor: 'accent.main', color: 'white.main' },
                    }}
                    checked={docTypes && docTypes.length > 0 && docTypes.indexOf(item.id) > -1}
                    value={item.id}
                    children={item.name}
                    key={index + 1}
                />
            );
        }),
    ];
    // const {classes} = props;
    return (
        <FormControl variant="standard" fullWidth>
            <InputLabel>{txt.advancedSearch.fieldTypes.rek_display_type.title}</InputLabel>
            <Select
                variant="standard"
                id="document-type-selector"
                data-testid="document-type-selector"
                name="document-type-selector"
                aria-label={txt.advancedSearch.fieldTypes.rek_display_type.ariaLabel}
                value={docTypes || ['0']}
                onChange={_handleDocTypeChange}
                multiple
                fullWidth
                disabled={disabled}
                children={docTypeItems}
            />
        </FormControl>
    );
};

DocumentTypeMultipleField.propTypes = {
    docTypes: PropTypes.array,
    updateDocTypeValues: PropTypes.func,
    disabled: PropTypes.bool,
};

export default React.memo(DocumentTypeMultipleField);
