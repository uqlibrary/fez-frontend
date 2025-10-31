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

    let indexedText = null;
    const _hide = () => {
        dispatch(hide());
    };

    if (text && text.props && text.props.children) {
        indexedText = React.Children.map(text.props.children, (child, index) => {
            if (child?.type) {
                return React.cloneElement(child, { key: index });
            } else {
                return child;
            }
        });
    }
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
                        component={'span'}
                        data-testid="help-drawer-message"
                        id={`help-drawer-text-${title.replace(/\s/g, '')}`}
                        key={'text'}
                        variant="body2"
                    >
                        {indexedText || text}
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
