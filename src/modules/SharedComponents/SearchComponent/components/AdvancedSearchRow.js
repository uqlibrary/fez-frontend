import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { locale } from 'locale';
import AdvancedSearchRowInput from './AdvancedSearchRowInput';

import Close from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles(
    theme => ({
        autoWidth: {
            flexGrow: 1,
            width: 1,
        },
        advancedSearchRowDeleteButton: {
            margin: -6,
            opacity: 0.33,
            '&:hover': {
                opacity: 1,
            },
        },
        advancedSearchCombiner: {
            marginTop: 6,
        },
        mobileRowSpacer: {
            margin: '12px -18px',
        },
        mobileInputRow: {
            [theme.breakpoints.down('sm')]: {
                marginTop: -18,
            },
        },
    }),
    { withTheme: true },
);

export const AdvancedSearchRow = props => {
    const {
        rowIndex,
        searchField,
        value,
        // label,
        disabledFields,
        showUnpublishedFields,
        onSearchRowChange,
        onSearchRowDelete,
    } = props;
    const classes = useStyles();

    const _handleTextChange = (value, label = '') => {
        onSearchRowChange(rowIndex, { searchField: searchField, value, label });
    };

    const _handleSearchFieldChange = event => {
        const searchField = event.target.value;
        onSearchRowChange(rowIndex, { searchField, value: '', label: '' });
    };

    const _deleteRow = () => {
        onSearchRowDelete(rowIndex);
    };

    const selectFieldValidation = () => {
        // If the input value is empty and select value = 0 then show an error
        if (searchField === '0' && !value) {
            return locale.validationErrors.advancedSearchSelectionRequired;
        }
        return null;
    };

    const renderInputComponentAndProps = useCallback(
        (InputComponent, inputProps) => (
            <InputComponent
                type="search"
                name={`searchField${rowIndex}`}
                id="searchField"
                fullWidth
                value={value}
                disabled={searchField === '0'}
                {...inputProps}
            />
        ),
        [rowIndex, searchField, value],
    );

    const txt = locale.components.searchComponent.advancedSearch;
    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    {/* Select and combiner */}
                    <Grid container spacing={2}>
                        <Grid item className={classes.autoWidth} style={{ minWidth: 200 }}>
                            <FormControl fullWidth error={!!selectFieldValidation()} id="field-type-select-label">
                                <Select
                                    value={searchField}
                                    name="field-type-select"
                                    onChange={_handleSearchFieldChange}
                                    aria-label={txt.selectAria.replace(
                                        '[current_selection]',
                                        txt.fieldTypes[searchField].title,
                                    )}
                                    SelectDisplayProps={{
                                        id: 'field-type-select',
                                        'data-testid': 'field-type-select',
                                    }}
                                    MenuProps={{
                                        id: 'field-type-options',
                                        'data-testid': 'field-type-options',
                                    }}
                                >
                                    {Object.keys(txt.fieldTypes)
                                        .filter(item => txt.fieldTypes[item].type !== null)
                                        .filter(
                                            item => !txt.fieldTypes[item].isUnpublishedField || showUnpublishedFields,
                                        )
                                        .sort(
                                            (item1, item2) => txt.fieldTypes[item1].order - txt.fieldTypes[item2].order,
                                        )
                                        .map((item, index) => {
                                            if (txt.fieldTypes[item].type === 'divider') {
                                                return <Divider key={index} />;
                                            }
                                            return (
                                                <MenuItem
                                                    style={{ display: 'block' }}
                                                    key={item}
                                                    value={item}
                                                    children={txt.fieldTypes[item].title}
                                                    disabled={index === 0 || disabledFields.indexOf(item) > -1}
                                                    data-testid={`field-type-option-${index}`}
                                                />
                                            );
                                        })}
                                </Select>
                                <FormHelperText error={!!selectFieldValidation()}>
                                    {selectFieldValidation()}
                                </FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Typography className={classes.advancedSearchCombiner}>
                                {txt.fieldTypes[searchField].combiner}
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* Select and combiner */}
                </Grid>
                <Grid item xs={12} md={6} className={classes.mobileInputRow}>
                    <Grid container spacing={2}>
                        <Grid item className={classes.autoWidth} zeroMinWidth>
                            <AdvancedSearchRowInput
                                {...props}
                                onChange={_handleTextChange}
                                inputField={txt.fieldTypes[searchField]}
                                render={renderInputComponentAndProps}
                            />
                        </Grid>
                        {rowIndex !== 0 && (
                            <Grid item className={classes.advancedSearchRowDeleteButton}>
                                <IconButton
                                    style={{ float: 'right' }}
                                    aria-label={txt.deleteAria}
                                    className="deleteFieldButton"
                                    onClick={_deleteRow}
                                    id={`delete-advanced-search-row-${rowIndex}`}
                                >
                                    <Close />
                                </IconButton>
                            </Grid>
                        )}
                        <Hidden mdUp>
                            <Grid item xs={12}>
                                <Divider className={classes.mobileRowSpacer} />
                            </Grid>
                        </Hidden>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

AdvancedSearchRow.propTypes = {
    rowIndex: PropTypes.number,
    searchField: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number]),
    label: PropTypes.any,
    disabledFields: PropTypes.array,
    showUnpublishedFields: PropTypes.bool,
    onSearchRowChange: PropTypes.func,
    onSearchRowDelete: PropTypes.func,
};

export const isSame = (prevProps, nextProps) => {
    return (
        prevProps.rowIndex === nextProps.rowIndex &&
        prevProps.value === nextProps.value &&
        prevProps.label === nextProps.label &&
        prevProps.showUnpublishedFields === nextProps.showUnpublishedFields
    );
};

export default React.memo(AdvancedSearchRow, isSame);
