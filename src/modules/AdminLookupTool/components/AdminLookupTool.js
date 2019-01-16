import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';

import {AdminLookupForm} from './AdminLookupForm';
import {AdminLookupFormResult} from './AdminLookupFormResult';

/**
 * This component is intended to replace https://espace.library.uq.edu.au/misc/api_view_info.php
 * but only an additional form (incites) has been done at this point
 * As each form comes in:
 * - add an entry to locale/components.js under .adminLookupTools.forms as a sibling to .incites;
 *          - match the contents of the incites entry
 *          - the secondary field is optional
 *          - add a new form entry below (once we have more than one component use the default isMinimised value so they load minimised)
 * - create a new api (use FezCoreLookupController) that returns the desired data, with a url of:
 *    admin/lookup/[components.adminLookupTools.forms.sibling]/[keys to search for]/[possible other field you need]
 * ie the api url that incites calls is: eg
 *    "https://api.library.uq.edu.au/staging/admin/lookup/incites/A1979HY31900010,A1979HY31900068/[APIKEY]".
 * - and that should be all that is required (but do examine how the result is displayed...)
 */
export class AdminLookupTool extends PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        lookupResults: PropTypes.array,
        // lookupSubmitted: PropTypes.string,
        loadingResults: PropTypes.bool,
        lookupType: PropTypes.string,
        primaryValue: PropTypes.string,
        secondaryValue: PropTypes.string,
        history: PropTypes.object.isRequired,
    };
    static defaultProps = {
        lookupResults: [],
        loadingResults: false,
        lookupType: '',
        primaryValue: '',
        secondaryValue: '',
    };

    render() {
        console.log('AdminLookupTool renders this:');
        console.log(this.props.lookupResults);
        return (
            <StandardPage title={locale.components.adminLookupTools.title}>
                {
                    this.props.loadingResults &&
                        <InlineLoader message={locale.components.adminLookupTools.loadingMessage ? locale.components.adminLookupTools.loadingMessage : 'Loading'}/>

                }
                {
                    !this.props.loadingResults && !!this.props.lookupResults && this.props.lookupResults.length > 0 &&
                    <AdminLookupFormResult
                        lookupResults={this.props.lookupResults}
                        actions={this.props.actions}
                        history={history}
                    />
                }

                {
                    !this.props.loadingResults && !!this.props.lookupResults && this.props.lookupResults.length === 0 &&
                        <Fragment>

                            {/* incites */}
                            <AdminLookupForm
                                isMinimised={false}
                                localeform={locale.components.adminLookupTools.forms.incites}
                                actions={this.props.actions}
                                history={history}
                            />

                            {/* put more forms here */}

                        </Fragment>
                }
            </StandardPage>
        );
    }
}

export default AdminLookupTool;
