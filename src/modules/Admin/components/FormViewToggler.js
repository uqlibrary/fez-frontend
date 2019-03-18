import React from 'react';
import {TabbedContextConsumer} from 'context';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';

export const FormViewToggler = React.memo(() => (
    <TabbedContextConsumer>
        {
            ({tabbed, toggleTabbed}) => (
                <Tooltip title={`Switch to ${tabbed ? 'full form' : 'tabbed'} mode`}>
                    <Switch
                        color="primary"
                        checked={tabbed}
                        onChange={toggleTabbed}
                        value="tabbed"
                    />
                </Tooltip>
            )
        }
    </TabbedContextConsumer>
));

export default FormViewToggler;
