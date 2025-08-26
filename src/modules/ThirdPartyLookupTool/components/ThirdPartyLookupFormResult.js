import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';

export const ThirdPartyLookupFormResult = ({
    actions,
    lookupResults = [],
    primaryValue,
    secondaryValue,
    formDisplay,
    locale,
}) => {
    const dispatch = useDispatch();
    const _handleClear = () => {
        actions?.clearThirdPartyLookup && dispatch(actions.clearThirdPartyLookup());
    };

    const txt = {
        thisForm: formDisplay,
    };
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <StandardCard title={txt.thisForm.lookupLabel}>
                    <p>
                        {txt.thisForm.primaryFieldHeading} - {primaryValue}
                    </p>
                    {
                        // not all forms will have a second field; some of them shouldn't be reported
                        !!txt.thisForm.secondaryFieldHeading &&
                            !!txt.thisForm.reportSecondaryFieldInOutput &&
                            secondaryValue && (
                                <p>
                                    {txt.thisForm.secondaryFieldHeading} - {secondaryValue}
                                </p>
                            )
                    }
                    <StandardCard title={locale.resultsLabel ? locale.resultsLabel : 'Results'}>
                        {lookupResults.length > 0 && (
                            <Fragment>
                                <pre>{JSON.stringify(lookupResults, null, 2)}</pre>
                            </Fragment>
                        )}
                        {lookupResults.length === 0 && (
                            <Grid item xs={12}>
                                <StandardCard>
                                    {locale.noResultsFound && locale.noResultsFound.text
                                        ? locale.noResultsFound.text
                                        : 'No results found'}
                                </StandardCard>
                            </Grid>
                        )}
                    </StandardCard>
                    <Button
                        children={locale.clearButtonLabel ? locale.clearButtonLabel : 'New Search'}
                        variant="contained"
                        color={'primary'}
                        onClick={_handleClear}
                        style={{ marginTop: 20 }}
                    />
                </StandardCard>
            </Grid>
        </Grid>
    );
};
ThirdPartyLookupFormResult.propTypes = {
    actions: PropTypes.object,
    lookupResults: PropTypes.array,
    primaryValue: PropTypes.string.isRequired,
    secondaryValue: PropTypes.string,
    formDisplay: PropTypes.object.isRequired,
    // localeform: PropTypes.object.isRequired,
    locale: PropTypes.object.isRequired,
};

export default React.memo(ThirdPartyLookupFormResult);
