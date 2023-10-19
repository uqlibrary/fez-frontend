import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export class HelpDrawer extends Component {
    static propTypes = {
        buttonLabel: PropTypes.string,
        hide: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        text: PropTypes.any.isRequired,
        title: PropTypes.string.isRequired,
    };
    static defaultProps = {
        buttonLabel: 'CLOSE',
    };

    render() {
        const { buttonLabel, hide, open, text, title } = this.props;
        let indexedText = null;
        if (this.props.text && this.props.text.props && this.props.text.props.children) {
            indexedText = React.Children.map(this.props.text.props.children, (child, index) => {
                if (child.type) {
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
                onClose={hide}
            >
                <Grid container spacing={5} id="help-drawer">
                    <Grid item xs={12}>
                        <Typography
                            color={'primary.main'}
                            component={'h3'}
                            data-testid="help-drawer-title"
                            id="help-drawer-title"
                            key={'title'}
                            variant={'h6'}
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
                            onClick={hide}
                            variant="contained"
                        />
                    </Grid>
                </Grid>
            </Drawer>
        );
    }
}

export default HelpDrawer;
