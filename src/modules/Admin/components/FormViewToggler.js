import React from 'react';
import { useTabbedContext } from 'context';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';

// Commented out till keyboard support is added in PT#174815421
// import KeyboardIcon from '@material-ui/icons/Keyboard';
// import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
// import txt from 'locale/pages';

export const FormViewToggler = React.memo(() => {
    const { tabbed, toggleTabbed } = useTabbedContext();
    return (
        <Grid container direction="row" spacing={0} alignItems="center">
            <Grid item>
                <Tooltip title={`Switch to ${tabbed ? 'full form' : 'tabbed'} mode`}>
                    <Switch color="primary" checked={tabbed} onChange={toggleTabbed} value="tabbed" />
                </Tooltip>
            </Grid>
            {/* <Grid item>
                <HelpIcon IconComponent={KeyboardIcon} {...txt.pages.edit.help} />
            </Grid> */}
        </Grid>
    );
});

export default FormViewToggler;
