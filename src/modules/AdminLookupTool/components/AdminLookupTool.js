import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {AdminLookupForm} from './AdminLookupForm';

/**
 * This component is intended to replace https://espace.library.uq.edu.au/misc/api_view_info.php
 * but only a new form (incites) has been done at this point
 * As each form comes in:
 * - add an entry to locale/components.js under .adminLookupTools.forms as a sibling to .incites;
 *          - match the contents of the incites entry
 *          - the secondary field is optional
 * - create a new api that returns the desired data, with a url of:
 *    admin/lookup/[components.adminLookupTools.sibling]/[keys to search for]/[possible other field you need]
 * ie the api url that incites calls is: eg
 *    "https://api.library.uq.edu.au/staging/admin/lookup/incites/A1979HY31900010,A1979HY31900068/[APIKEY]".
 * - and that should be all that is required (note the comment below about minimising components)
 */
export class AdminLookupTool extends PureComponent {
    static propTypes = {
        location: PropTypes.object,
        history: PropTypes.object,
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
                    isMinimised={false} // once we do more than one form here they should be loaded minimised, ie use the default
                    form={locale.components.adminLookupTools.forms.incites}
                    actions={this.props.actions}
                />

            </StandardPage>
        );
    }
}

export default AdminLookupTool;
