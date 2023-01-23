import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button/Button';

export class ThirdPartyLookupFormResult extends PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        lookupResults: PropTypes.array,
        primaryValue: PropTypes.string.isRequired,
        secondaryValue: PropTypes.string,
        formDisplay: PropTypes.object,
        // localeform: PropTypes.object.isRequired,
        locale: PropTypes.object.isRequired,
    };

    static defaultProps = {
        lookupResults: [],
    };

    _handleClear = () => {
        if (this.props.actions && this.props.actions.clearThirdPartyLookup) {
            this.props.actions.clearThirdPartyLookup();
        }
    };

    render() {
        const txt = {
            thisForm: this.props.formDisplay,
        };
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StandardCard title={txt.thisForm.lookupLabel}>
                        <p>
                            {txt.thisForm.primaryFieldHeading} - {this.props.primaryValue}
                        </p>
                        {// not all forms will have a second field; some of them shouldn't be reported
                        !!txt.thisForm.secondaryFieldHeading &&
                            !!txt.thisForm.reportSecondaryFieldInOutput &&
                            this.props.secondaryValue && (
                                <p>
                                    {txt.thisForm.secondaryFieldHeading} - {this.props.secondaryValue}
                                </p>
                            )}
                        <StandardCard
                            title={this.props.locale.resultsLabel ? this.props.locale.resultsLabel : 'Results'}
                        >
                            {this.props.lookupResults.length > 0 && (
                                <Fragment>
                                    <pre>{JSON.stringify(this.props.lookupResults, null, 2)}</pre>
                                </Fragment>
                            )}
                            {this.props.lookupResults.length === 0 && (
                                <Grid item xs={12}>
                                    <StandardCard>
                                        {this.props.locale.noResultsFound && this.props.locale.noResultsFound.text
                                            ? this.props.locale.noResultsFound.text
                                            : 'No results found'}
                                    </StandardCard>
                                </Grid>
                            )}
                        </StandardCard>
                        <Button
                            children={
                                this.props.locale.clearButtonLabel ? this.props.locale.clearButtonLabel : 'New Search'
                            }
                            variant="contained"
                            color={'primary'}
                            onClick={() => this._handleClear()}
                            style={{ marginTop: 20 }}
                        />
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
