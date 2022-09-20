import React from 'react';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { locale } from 'locale';
import Typography from '@material-ui/core/Typography';
// import Grid from '@material-ui/core/Grid';
// import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    culturalNoticeParent: {
        [theme.breakpoints.up('xs')]: {
            minHeight: 85,
        },
        [theme.breakpoints.up('sm')]: {
            minHeight: 85,
        },
    },
    culturalNoticeImage: {
        float: 'left',
        display: 'inline-block',
        padding: '0 15px 5px 0',
        [theme.breakpoints.up('xs')]: {
            height: 100,
        },
        [theme.breakpoints.up('sm')]: {
            height: 85,
        },
        [theme.breakpoints.up('md')]: {
            height: 70,
        },
    },
}));
const CulturalNotice = () => {
    const classes = useStyles();
    const txt = locale.components.culturalNoticeOC;
    return (
        <StandardCard title={txt.title} primaryHeader>
            {/* <Grid container spacing={3}>
                <Grid item xs={4} sm={3} md={4}>
                    <img src={txt.imagePath} width={100} alt={txt.title} />
                </Grid>
                <Grid item xs={8} sm={9} md={8}>
                    <Typography variant={'body2'}>{txt.text}</Typography>
                </Grid>
            </Grid> */}
            <div className={classes.culturalNoticeParent}>
                <img src={txt.imagePath} alt={txt.title} className={classes.culturalNoticeImage} />

                <Typography variant={'body2'}>{txt.text}</Typography>
            </div>
        </StandardCard>
    );
};

export default CulturalNotice;
