import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';

import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button/Button';

export class AdminLookupFormResult extends PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        lookupResults: PropTypes.array,
        primaryValue: PropTypes.string.isRequired,
        secondaryValue: PropTypes.string,
        localeform: PropTypes.object.isRequired,
    };

    static defaultProps = {
        lookupResults: [],
    };

    _handleClear = () => {
        if (this.props.actions && this.props.actions.clearAdminLookup) {
            this.props.actions.clearAdminLookup();
        }
    };

    render() {
        const txt = {
            tools: locale.components.adminLookupTools,
            thisForm: this.props.localeform,
        };
        return (
            <StandardCard title={txt.thisForm.lookupLabel}>
                <p>{txt.thisForm.primaryField.heading} - {this.props.primaryValue}</p>
                {
                    // not all forms will have a second field
                    !!txt.thisForm.secondaryField && !!txt.thisForm.secondaryField.reportInOutput && this.props.secondaryValue &&
                    <p>{txt.thisForm.secondaryField.heading} - {this.props.secondaryValue}</p>
                }
                <StandardCard title={txt.tools.resultsLabel ? txt.tools.resultsLabel : 'Results'}>
                    {
                        this.props.lookupResults.length > 0 &&
                        <Fragment>
                            <pre>
                                {JSON.stringify(this.props.lookupResults, null, 2)}
                            </pre>
                        </Fragment>
                    }
                    {
                        this.props.lookupResults.length === 0 &&
                        <Grid item xs={12}>
                            <StandardCard>
                                {txt.tools.noResultsFound.text ? txt.tools.noResultsFound.text : 'No results found'}
                            </StandardCard>
                        </Grid>
                    }
                </StandardCard>
                <Button
                    children= {txt.tools.clearButtonLabel ? txt.tools.clearButtonLabel : 'New Search'}
                    variant="contained"
                    color={'primary'}
                    onClick={() => this._handleClear()}
                    style={{marginTop: 20}}
                />
            </StandardCard>
        );
    }
}
