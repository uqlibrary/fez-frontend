import React from 'react';
import { useTabbedContext } from 'context';

import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';

import KeyboardIcon from '@mui/icons-material/Keyboard';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import txt from 'locale/pages';

export const FormViewToggler = React.memo(() => {
    const { tabbed, toggleTabbed } = useTabbedContext();
    return (
        <Grid container direction="row" spacing={0} alignItems="center">
            <Grid item>
                <Tooltip title={`Switch to ${tabbed ? 'full form' : 'tabbed'} mode`}>
                    <Switch checked={tabbed} onChange={toggleTabbed} value="tabbed" />
                </Tooltip>
            </Grid>
            <Grid item>
                <HelpIcon IconComponent={KeyboardIcon} {...txt.pages.edit.help} />
            </Grid>
        </Grid>
    );
});

export default FormViewToggler;
