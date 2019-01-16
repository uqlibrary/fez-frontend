import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {AdminLookupForm} from './AdminLookupForm';

/**
 * This component is intended to replace https://espace.library.uq.edu.au/misc/api_view_info.php
 * but only an additional form (incites) has been done at this point
 * As each form comes in:
 * - add an entry to locale/components.js under .adminLookupTools.forms as a sibling to .incites;
 *          - match the contents of the incites entry
 *          - the secondary field is optional
 * - create a new api (use FezCoreLookupController) that returns the desired data, with a url of:
 *    admin/lookup/[components.adminLookupTools.forms.sibling]/[keys to search for]/[possible other field you need]
 * ie the api url that incites calls is: eg
 *    "https://api.library.uq.edu.au/staging/admin/lookup/incites/A1979HY31900010,A1979HY31900068/[APIKEY]".
 * - and that should be all that is required (but do examine how the result is displayed...)
 * (once we have more than one component use the default isMinimised value so they load minimised)
 */
export class AdminLookupTool extends PureComponent {
    static propTypes = {
        actions: PropTypes.object,
    };
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StandardPage title={locale.components.adminLookupTools.title}>

                {/* incites */}
                <AdminLookupForm
                    isMinimised={false}
                    localeform={locale.components.adminLookupTools.forms.incites}
                    actions={this.props.actions}
                />

            </StandardPage>
        );
    }
}

export default AdminLookupTool;
