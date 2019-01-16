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
        history: PropTypes.object.isRequired,
    };
    static defaultProps = {
        lookupResults: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            primaryValue: '',
            secondaryValue: '',
        };
    }

    _handleClear = () => {
        if (this.props.actions && this.props.actions.clearAdminLookup) {
            this.props.actions.clearAdminLookup();
        }
    };

    render() {
        const txt = locale.components.adminLookupTools;
        return (
            <StandardCard className="lookupComponent" title={txt.resultsLabel ? txt.resultsLabel : 'Results'}>
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
                            {txt.noResultsFound.text}
                        </StandardCard>
                    </Grid>
                }
                <Button
                    children= {txt.clearButtonLabel ? txt.clearButtonLabel : 'New Search'}
                    variant="contained"
                    color={'primary'}
                    onClick={() => this._handleClear()}
                />
            </StandardCard>
        );
    }
}
