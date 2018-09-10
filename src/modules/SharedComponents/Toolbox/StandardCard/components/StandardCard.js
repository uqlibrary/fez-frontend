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
        marginBottom: 24
    },
    cardHeaderPurple: {
        margin: '12px 12px 0 12px',
        textIndent: 12,
        color: theme.palette.white.main,
        backgroundColor: theme.palette.primary.main
    },
    cardHeader: {
        margin: '24px 12px 0 12px',
        textIndent: 12,
    },
    cardContent: {
        fontWeight: theme.typography.fontWeightRegular
    }
});

class Cards extends Component {
    static propTypes = {
        title: PropTypes.any,
        darkHeader: PropTypes.bool,
        children: PropTypes.any,
        classes: PropTypes.object,
        help: PropTypes.object
    };
    render() {
        const {classes, title, help, children, darkHeader} = this.props;
        return (
            <Card className={classes.card}>
                {title &&
                    <Grid container spacing={24}>
                        <Grid item xs className={darkHeader && classes.cardHeaderPurple || classes.cardHeader}>
                            <Typography variant={'title'} color={'inherit'}>{title}</Typography>
                        </Grid>
                    </Grid>
                }
                <CardContent>
                    <Grid container spacing={24}>
                        {help && help.text &&
                        <Grid item>
                            <HelpIcon {...help}/>
                        </Grid>
                        }
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
