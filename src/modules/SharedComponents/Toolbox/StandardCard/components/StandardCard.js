import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {HelpIcon} from '../../HelpDrawer';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    card: {
        // marginBottom: 24
    },
    cardHeaderPurple: {
        margin: '12px 12px 0 12px',
        color: theme.palette.white.main,
        backgroundColor: theme.palette.primary.main,
        '& h2': {
            paddingLeft: 12
        },
    },
    cardHeader: {
        margin: '24px 12px 0 12px',
        '& h2': {
            paddingLeft: 12
        },
    },
    cardContent: {
        fontWeight: theme.typography.fontWeightRegular
    },
    noPadding: {
        padding: 0,
    },
    fullHeight: {
        border: '10px solid red',
        height: '100%'
    }
});

class Cards extends Component {
    static propTypes = {
        title: PropTypes.any,
        darkHeader: PropTypes.bool,
        fullHeight: PropTypes.bool,
        noPadding: PropTypes.bool,
        noHeader: PropTypes.bool,
        children: PropTypes.any,
        classes: PropTypes.object,
        help: PropTypes.object,
        customBackgroundColor: PropTypes.any,
        customTitleColor: PropTypes.any
    };
    render() {
        const {classes, title, help, children, darkHeader} = this.props;
        const customBG = !!this.props.customBackgroundColor ? {backgroundColor: this.props.customBackgroundColor} : null;
        const customTitle = !!this.props.customTitleColor ? {color: this.props.customTitleColor} : null;
        const fullHeight = !!this.props.fullHeight ? {height: '100%'} : null;
        return (
            <Card className={classes.card} style={{...customBG, ...customTitle, ...fullHeight}}>
                {
                    !this.props.noHeader &&
                    <Grid container spacing={24}>
                        {
                            title ?
                                <Grid item xs className={darkHeader && classes.cardHeaderPurple || classes.cardHeader}>
                                    <Typography variant={'title'} color={'inherit'}>{title}</Typography>
                                </Grid>
                                :
                                <Grid item xs/>
                        }
                        {
                            help && help.text &&
                            <Grid item>
                                <HelpIcon {...help}/>
                            </Grid>
                        }
                    </Grid>
                }
                <CardContent classes={this.props.noPadding ? {root: classes.noPadding} : {}}>
                    <Grid container spacing={24}>
                        <Grid item xs={12} className={classes.cardContent}>
                            {children}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

const StyledCard = withStyles(styles, {withTheme: true})(Cards);
const StandardCard = (props) => <StyledCard {...props}/>;
export default StandardCard;
