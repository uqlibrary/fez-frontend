import React, { PureComponent } from 'react';
import { publicationTypes } from 'config';
import MenuItem from '@mui/material/MenuItem';
import { locale } from 'locale';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import withStyles from '@mui/styles/withStyles';

export const styles = theme => ({
    title: {
        ...theme.typography.caption,
    },
    selectedMenuItem: {
        backgroundColor: `${((theme.palette || {}).accent || {}).main || ''} !important`,
        color: ((theme.palette || {}).white || {}).main || '',
    },
});

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
        classes: PropTypes.object,
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
        const { classes } = this.props;
        const txt = locale.components.searchComponent;
        const docTypeItems = [
            <MenuItem key={0} disabled>
                {txt.advancedSearch.fieldTypes.rek_display_type.hint}
            </MenuItem>,
            ...this.publicationTypes.map((item, index) => {
                return (
                    <MenuItem
                        classes={{ selected: classes.selectedMenuItem }}
                        style={{ display: 'block' }}
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
export default withStyles(styles, { withTheme: true })(DocumentTypeMultipleField);
