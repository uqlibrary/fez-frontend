import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { hide } from '../actions';

import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

export const HelpDrawer = ({ buttonLabel = 'CLOSE' }) => {
    const dispatch = useDispatch();

    const helpDrawerState = useSelector(state => state.get('helpDrawer'));
    const {
        open = false,
        title = '',
        text = '',
    } = helpDrawerState?.toJS?.() || helpDrawerState || /* istanbul ignore next */ {};

    const _hide = () => {
        dispatch(hide());
    };

    const indexedText = React.useMemo(() => {
        const setKeys = (content, key = 0) => {
            if (Array.isArray(content)) {
                return content.map((child, i) => setKeys(child, i));
            }

            if (!React.isValidElement(content)) return content;

            const children = content.props?.children;
            return React.cloneElement(content, {
                key,
                ...(children && { children: setKeys(children, key) }),
            });
        };

        return setKeys(text?.props?.children ?? text);
    }, [text]);

    return (
        <Drawer
            sx={{
                '& .MuiDrawer-paper': {
                    width: '320px',
                    padding: { xs: 3, sm: 5 },
                    paddingBottom: 0,
                    maxHeight: '100%',
                    boxSizing: 'border-box',
                },
            }}
            open={open}
            anchor="right"
            onClose={_hide}
        >
            <Grid container spacing={5} id="help-drawer">
                <Grid item xs={12}>
                    <Typography
                        component={'h3'}
                        data-testid="help-drawer-title"
                        id="help-drawer-title"
                        key={'title'}
                        variant={'h6'}
                        sx={{
                            color: 'primary.main',
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        component={'div'}
                        data-testid="help-drawer-message"
                        id={`help-drawer-text-${title.replace(/\s/g, '')}`}
                        variant="body2"
                    >
                        {indexedText}
                    </Typography>
                </Grid>
                <Grid item xs={12} id="help-drawer-button">
                    <Button
                        children={buttonLabel}
                        sx={{ float: 'right', marginBottom: '60px' }}
                        color="primary"
                        data-analyticsid="help-drawer-close"
                        data-testid="help-drawer-close"
                        onClick={_hide}
                        variant="contained"
                    />
                </Grid>
            </Grid>
        </Drawer>
    );
};

HelpDrawer.propTypes = {
    buttonLabel: PropTypes.string,
};

export default React.memo(HelpDrawer);
