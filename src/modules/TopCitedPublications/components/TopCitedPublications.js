import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {PublicationsList} from 'modules/SharedComponents/PublicationsList';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';
import Alert from 'modules/SharedComponents/Toolbox/Alert/components/Alert';

const styles = theme => ({
    tabs: {
        marginLeft: -24,
        marginTop: -16,
        marginRight: -24,
        backgroundColor: theme.palette.primary.main,
    },
    tab: {
        color: theme.palette.white.main
    },
    tabIndicator: {
        height: 4,
        backgroundColor: theme.palette.accent.main
    }
});

export class TopCitedPublications extends PureComponent {
    static propTypes = {
        topCitedPublicationsList: PropTypes.array,
        loadingTopCitedPublications: PropTypes.bool,
        actions: PropTypes.object.isRequired,
        showSourceCountIcon: PropTypes.bool,
        theme: PropTypes.object,
        classes: PropTypes.object
    };

    static defaultProps = {
        topCitedPublicationsList: [],
        loadingTopCitedPublications: false
    };

    constructor(props) {
        super(props);
        this.state = {
            TopCitedTab: false
        };
    }

    componentDidMount() {
        if (!this.props.loadingTopCitedPublications) {
            this.props.actions.searchTopCitedPublications(locale.components.topCitedPublications.recordsPerSource);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            TopCitedTab: nextProps.topCitedPublicationsList.length > 0 && nextProps.topCitedPublicationsList[0].key
        });
    }

    handleTabChange = (event, value) => {
        this.setState({
            TopCitedTab: value});
    };

    render() {
        const {classes} = this.props;
        const txt = locale.components.topCitedPublications;
        if (this.props.loadingTopCitedPublications) {
            return (
                <Grid container>
                    <Grid item xs />
                    <Grid item>
                        <InlineLoader message={txt.loading}/>
                    </Grid>
                    <Grid item xs />
                </Grid>
            );
        }
        const reorderedItems = this.props.topCitedPublicationsList.sort((source1, source2) => (txt[source1.key].order - txt[source2.key].order));
        return (
            <React.Fragment>
                {!this.props.loadingTopCitedPublications && this.props.topCitedPublicationsList.length > 0 ?
                    <StandardCard>
                        <Tabs
                            className={classes.tabs}
                            classes={{indicator: classes.tabIndicator}}
                            value={this.state.TopCitedTab}
                            onChange={this.handleTabChange}
                            fullWidth
                            centered
                        >
                            {/* Tabs */}
                            {reorderedItems.map(({key, values}) => (
                                values && values.length >= 1 &&
                                <Tab className={classes.tab} key={key} label={txt[key].title} value={key}/>
                            ))}
                        </Tabs>


                        {/* Content */}
                        {reorderedItems.map(({key, values}) => (
                            values && values.length >= 1 && (this.state.TopCitedTab === key) &&
                                <Grid container alignItems={'flex-start'} alignContent={'flex-start'} key={key} spacing={0} style={{marginTop: 18}}>
                                    <Grid item xs>
                                        <Typography key={key} variant={'title'}><div key={key} className={`fez-icon ${key} xxlarge`}/> {txt[key].heading}</Typography>
                                    </Grid>
                                    <Grid item xs={'auto'} style={{marginTop: -12}}>
                                        <HelpIcon {...locale.components.trendingPublicationHelp}/>
                                    </Grid>
                                    <Grid item xs={12} style={{paddingTop: 24}} id={'topCitedPublications'}>
                                        <PublicationsList
                                            key={key}
                                            publicationsList={values}
                                            showMetrics
                                            hideCountTotal/>
                                    </Grid>
                                </Grid>
                        ))}
                    </StandardCard>
                    :
                    <Alert {...txt.notAvailableAlert} />
                }
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(TopCitedPublications);
