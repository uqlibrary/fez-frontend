import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { PublicationsList } from 'modules/SharedComponents/PublicationsList';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import Alert from 'modules/SharedComponents/Toolbox/Alert/components/Alert';

export const styles = theme => ({
    tabs: {
        [theme.breakpoints.up('sm')]: {
            margin: '-16px -16px 0px -16px',
        },
        [theme.breakpoints.down('xs')]: {
            margin: '-16px -16px 0px -16px',
        },
        backgroundColor: theme.palette.primary.main,
        borderRadius: '4px 4px 0px 0px',
    },
    tab: {
        color: theme.palette.white.main,
    },
    tabIndicator: {
        height: 4,
        backgroundColor: theme.palette.accent.main,
    },
});

export class TopCitedPublicationsClass extends PureComponent {
    static propTypes = {
        topCitedPublicationsList: PropTypes.array,
        loadingTopCitedPublications: PropTypes.bool,
        actions: PropTypes.object.isRequired,
        showSourceCountIcon: PropTypes.bool,
        theme: PropTypes.object,
        classes: PropTypes.object,
        width: PropTypes.string,
    };

    static defaultProps = {
        topCitedPublicationsList: [],
        loadingTopCitedPublications: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            tabClicked: false,
        };
    }

    componentDidMount() {
        if (!this.props.loadingTopCitedPublications) {
            this.props.actions.searchTopCitedPublications(locale.components.topCitedPublications.recordsPerSource);
        }
    }

    handleTabChange = (event, value) => {
        this.setState({
            topCitedTab: value,
            tabClicked: true,
        });
    };

    render() {
        const { classes } = this.props;
        const txt = locale.components.topCitedPublications;
        if (this.props.loadingTopCitedPublications) {
            return (
                <Grid container>
                    <Grid item xs />
                    <Grid item>
                        <InlineLoader message={txt.loading} />
                    </Grid>
                    <Grid item xs />
                </Grid>
            );
        }

        const reorderedItems = this.props.topCitedPublicationsList.sort(
            (source1, source2) => txt[source1.key].order - txt[source2.key].order,
        );

        if (!this.state.tabClicked) {
            reorderedItems.forEach(item => {
                if (item.key === 'altmetric') {
                    this.state.topCitedTab = 'altmetric';
                }
            });

            if (!this.state.topCitedTab && reorderedItems.length > 0) {
                this.state.topCitedTab = reorderedItems[0].key;
            }
        }

        return (
            <React.Fragment>
                {!this.props.loadingTopCitedPublications && this.props.topCitedPublicationsList.length > 0 ? (
                    <StandardCard noHeader>
                        <Tabs
                            className={classes.tabs}
                            classes={{ indicator: classes.tabIndicator }}
                            value={this.state.topCitedTab}
                            onChange={this.handleTabChange}
                            variant="fullWidth"
                            centered
                        >
                            {/* Tabs */}
                            {reorderedItems.map(
                                ({ key, values }) =>
                                    values &&
                                    values.length >= 1 && (
                                        <Tab
                                            className={classes.tab}
                                            key={key}
                                            label={this.props.width === 'xs' ? txt[key].mobileTitle : txt[key].title}
                                            value={key}
                                        />
                                    ),
                            )}
                        </Tabs>

                        {/* Content */}
                        {reorderedItems.map(
                            ({ key, values }) =>
                                values &&
                                values.length >= 1 &&
                                this.state.topCitedTab === key && (
                                    <Grid
                                        container
                                        alignItems={'flex-start'}
                                        alignContent={'flex-start'}
                                        key={key}
                                        style={{ marginTop: 24 }}
                                    >
                                        <Grid item xs>
                                            <Typography key={key} variant={'h6'} color={'primary'}>
                                                <div key={key} className={`fez-icon ${key} xxlarge`} />
                                                {txt[key].heading}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={'auto'} style={{ marginTop: -12 }}>
                                            <HelpIcon {...locale.components.trendingPublicationHelp} />
                                        </Grid>
                                        <Grid item xs={12} style={{ paddingTop: 24 }} id={'topCitedPublications'}>
                                            <PublicationsList
                                                key={key}
                                                publicationsList={values}
                                                showMetrics
                                                hideCountTotal
                                            />
                                        </Grid>
                                    </Grid>
                                ),
                        )}
                    </StandardCard>
                ) : (
                    <Alert {...txt.notAvailableAlert} />
                )}
            </React.Fragment>
        );
    }
}
const TopCitedPublications = withWidth()(TopCitedPublicationsClass);
export default withStyles(styles)(TopCitedPublications);
