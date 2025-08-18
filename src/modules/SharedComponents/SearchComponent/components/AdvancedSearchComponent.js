import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import AdvancedSearchRow from './AdvancedSearchRow';
import Checkbox from '@mui/material/Checkbox';
import { locale } from 'locale';
import DocumentTypeMultipleField from './Fields/DocumentTypeMultipleField';
import { default as PublicationYearRangeField } from './Fields/PublicationYearRangeField';
import DateRangeField from './Fields/DateRangeField';
import AdvancedSearchCaption from './AdvancedSearchCaption';

import * as validationRules from 'config/validation';

export const AdvancedSearchComponent = ({
    fieldRows = [{ searchField: '0', value: '', label: '' }],
    docTypes = [],
    yearFilter = { from: null, to: null, invalid: true },
    isOpenAccess = false,
    isMinimised = false,
    isLoading,
    showUnpublishedFields = false,
    createdRange = {},
    updatedRange = {},
    onToggleSearchMode,
    onToggleMinimise,
    onToggleOpenAccess,
    onAdvancedSearchRowAdd,
    onAdvancedSearchRowRemove,
    onAdvancedSearchReset,
    updateDocTypeValues,
    updateYearRangeFilter,
    updateDateRange,
    onAdvancedSearchRowChange,
    onSearch,
}) => {
    const haveAllAdvancedSearchFieldsValidated = fieldRows => {
        const fieldTypes = locale.components.searchComponent.advancedSearch.fieldTypes;
        return (
            !isLoading &&
            !yearFilter.invalid &&
            fieldRows
                .reduce((errors, item) => {
                    const newErrors = fieldTypes[item.searchField].validation.map(rule =>
                        validationRules[rule](item.value),
                    );
                    return [...errors, ...newErrors];
                }, [])
                .filter(error => !!error).length === 0
        );
    };

    const _handleAdvancedSearch = event => {
        event.preventDefault();
        onSearch();
    };

    const _toggleSearchMode = () => {
        !!onToggleSearchMode && onToggleSearchMode();
    };

    const _toggleMinimise = () => {
        !!onToggleMinimise && onToggleMinimise();
    };

    const _toggleOpenAccess = () => {
        !!onToggleOpenAccess && onToggleOpenAccess();
    };

    const _handleAdvancedSearchRowChange = useCallback((index, searchRow) => {
        !!onAdvancedSearchRowChange && onAdvancedSearchRowChange(index, searchRow);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _addAdvancedSearchRow = () => {
        !!onAdvancedSearchRowAdd && onAdvancedSearchRowAdd();
    };

    const _removeAdvancedSearchRow = useCallback(index => {
        !!onAdvancedSearchRowRemove && onAdvancedSearchRowRemove(index);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _resetAdvancedSearch = () => {
        !!onAdvancedSearchReset && onAdvancedSearchReset();
    };

    const _handleDateRangeChange = key => value => {
        !!updateDateRange && updateDateRange(key, value);
    };

    const _captionProps = () => {
        return {
            fieldRows: fieldRows,
            docTypes: docTypes,
            yearFilter: yearFilter,
            isOpenAccess: isOpenAccess,
        };
    };

    const txt = locale.components.searchComponent;
    const lastFieldAdded = [...fieldRows].pop();
    const canAddAnotherField = haveAllAdvancedSearchFieldsValidated(fieldRows) && lastFieldAdded.searchField !== '0';
    const alreadyAddedFields = fieldRows.map(item => item.searchField);

    return (
        <form id="advancedSearchForm" data-testid="advanced-search-form" onSubmit={_handleAdvancedSearch}>
            <Grid container spacing={0}>
                <Grid container spacing={5} alignItems={'center'}>
                    <Grid item style={{ flexGrow: 1, width: 1 }}>
                        <Typography variant="h5">{txt.advancedSearch.title}</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            aria-label={isMinimised ? txt.advancedSearch.tooltip.show : txt.advancedSearch.tooltip.hide}
                            onClick={_toggleMinimise}
                            tooltip={isMinimised ? txt.advancedSearch.tooltip.show : txt.advancedSearch.tooltip.hide}
                            id={!isMinimised ? 'minimize-advanced-search' : 'maximize-advanced-search'}
                            data-testid={!isMinimised ? 'minimize-advanced-search' : 'maximize-advanced-search'}
                            data-analyticsid={!isMinimised ? 'minimize-advanced-search' : 'maximize-advanced-search'}
                            size="large"
                        >
                            {!isMinimised ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    </Grid>
                </Grid>
                {!isMinimised && (
                    <Fragment>
                        <Grid container>
                            <Grid item xs={12} md={8}>
                                {fieldRows
                                    .filter(item => {
                                        return (
                                            item.searchField &&
                                            txt.advancedSearch.fieldTypes[item.searchField].type !== null
                                        );
                                    })
                                    .map((item, index) => (
                                        <AdvancedSearchRow
                                            key={`advanced-search-field-${item.searchField}`}
                                            rowIndex={index}
                                            disabledFields={alreadyAddedFields}
                                            onSearchRowChange={_handleAdvancedSearchRowChange}
                                            onSearchRowDelete={_removeAdvancedSearchRow}
                                            showUnpublishedFields={showUnpublishedFields}
                                            {...item}
                                        />
                                    ))}
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ paddingLeft: { md: 4 }, marginTop: { md: '-16px' } }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <DocumentTypeMultipleField
                                            docTypes={docTypes}
                                            updateDocTypeValues={updateDocTypeValues}
                                            disabled={isLoading}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PublicationYearRangeField
                                            yearFilter={yearFilter}
                                            updateYearRangeFilter={updateYearRangeFilter}
                                            disabled={isLoading}
                                            invalid={yearFilter.invalid}
                                        />
                                    </Grid>
                                    {showUnpublishedFields && (
                                        <React.Fragment>
                                            <Grid item xs={12}>
                                                <DateRangeField
                                                    id="created-range"
                                                    onChange={_handleDateRangeChange('rek_created_date')}
                                                    disabled={isLoading}
                                                    disableFuture
                                                    locale={
                                                        locale.components.searchComponent.advancedSearch.fieldTypes
                                                            .rek_created_date
                                                    }
                                                    {...createdRange}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <DateRangeField
                                                    id="updated-range"
                                                    onChange={_handleDateRangeChange('rek_updated_date')}
                                                    disabled={isLoading}
                                                    disableFuture
                                                    locale={
                                                        locale.components.searchComponent.advancedSearch.fieldTypes
                                                            .rek_updated_date
                                                    }
                                                    {...updatedRange}
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    )}
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="advanced-search-open-access"
                                                    inputProps={{
                                                        'data-analyticsid': 'advanced-search-open-access',
                                                        'data-testid': 'advanced-search-open-access',
                                                        'aria-label': txt.advancedSearch.openAccess.ariaLabel,
                                                    }}
                                                    checked={isOpenAccess}
                                                    onChange={_toggleOpenAccess}
                                                    disabled={isLoading}
                                                />
                                            }
                                            label={txt.advancedSearch.openAccess.title}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: 24 }}>
                            <Grid item xs={12} sm={'auto'}>
                                <Button
                                    variant={'contained'}
                                    sx={{
                                        backgroundColor: 'accent.main',
                                        color: 'white.main',
                                        '&:hover': {
                                            backgroundColor: 'accent.dark',
                                        },
                                    }}
                                    children={txt.advancedSearch.addField.title}
                                    aria-label={txt.advancedSearch.addField.aria}
                                    disabled={!canAddAnotherField}
                                    onClick={_addAdvancedSearchRow}
                                    id="add-another-search-row"
                                    data-analyticsid="advanced-search-row-add"
                                    data-testid="advanced-search-row-add"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={'auto'}>
                                <Button
                                    id="reset-advanced-search"
                                    data-analyticsid="advanced-search-reset"
                                    data-testid="advanced-search-reset"
                                    variant={'contained'}
                                    children={txt.advancedSearch.reset.title}
                                    aria-label={txt.advancedSearch.reset.aria}
                                    onClick={_resetAdvancedSearch}
                                    fullWidth
                                    color={'default'}
                                />
                            </Grid>
                            <Grid item xs={12} sm={'auto'}>
                                <Button
                                    id="toggle-to-simple-search-mode"
                                    data-analyticsid="toggle-to-simple-search"
                                    data-testid="toggle-to-simple-search"
                                    children={txt.advancedSearch.simpleSearch.title}
                                    aria-label={txt.advancedSearch.simpleSearch.aria}
                                    onClick={_toggleSearchMode}
                                    fullWidth
                                />
                            </Grid>
                            <Grid
                                item
                                style={{ flexGrow: 1, width: 1 }}
                                sx={{ display: { xs: 'none', md: 'block' } }}
                            />

                            <Grid item xs={12} md={4} sx={{ paddingLeft: { sm: 4 } }}>
                                <Button
                                    variant={'contained'}
                                    children={txt.searchButtonText}
                                    aria-label={txt.searchButtonAriaLabel}
                                    type="submit"
                                    fullWidth
                                    onClick={_handleAdvancedSearch}
                                    disabled={!haveAllAdvancedSearchFieldsValidated(fieldRows)}
                                    id="advanced-search"
                                    data-analyticsid="advanced-search"
                                    data-testid="advanced-search"
                                />
                            </Grid>
                        </Grid>
                    </Fragment>
                )}
                <Grid container>
                    <Grid item style={{ paddingTop: 24 }}>
                        <AdvancedSearchCaption {..._captionProps()} />
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

AdvancedSearchComponent.propTypes = {
    fieldRows: PropTypes.array,
    docTypes: PropTypes.array,
    yearFilter: PropTypes.object,
    isOpenAccess: PropTypes.bool,
    isMinimised: PropTypes.bool,
    isLoading: PropTypes.bool,
    showUnpublishedFields: PropTypes.bool,
    createdRange: PropTypes.object,
    updatedRange: PropTypes.object,

    // Event handlers
    onToggleSearchMode: PropTypes.func,
    onToggleMinimise: PropTypes.func,
    onToggleOpenAccess: PropTypes.func,
    onAdvancedSearchRowAdd: PropTypes.func,
    onAdvancedSearchRowRemove: PropTypes.func,
    onAdvancedSearchReset: PropTypes.func,
    updateDocTypeValues: PropTypes.func,
    updateYearRangeFilter: PropTypes.func,
    updateDateRange: PropTypes.func,

    onAdvancedSearchRowChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export default AdvancedSearchComponent;
