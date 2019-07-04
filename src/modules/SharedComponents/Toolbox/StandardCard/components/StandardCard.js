import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { HelpIcon } from '../../HelpDrawer';
import { withStyles } from '@material-ui/core/styles';

export const styles = theme => ({
    card: {
        overflow: 'unset',
        fontWeight: theme.typography.fontWeightRegular,
    },
    cardContentNoPadding: {
        padding: 0,
    },
    cardHeaderPurple: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.primary.main,
        borderRadius: '4px 4px 0px 0px',
        padding: '12px 24px',
    },
    fullHeight: {
        border: '10px solid red',
        height: '100%',
    },
});

export class Cards extends Component {
    static propTypes = {
        title: PropTypes.any,
        darkHeader: PropTypes.bool,
        fullHeight: PropTypes.bool,
        noPadding: PropTypes.bool,
        noHeader: PropTypes.bool,
        children: PropTypes.any,
        classes: PropTypes.object.isRequired,
        help: PropTypes.object,
        customBackgroundColor: PropTypes.any,
        customTitleColor: PropTypes.any,
    };
    render() {
        const { classes, title, help, children, darkHeader } = this.props;
        const customBG = !!this.props.customBackgroundColor ? { backgroundColor: this.props.customBackgroundColor } : null;
        const customTitle = !!this.props.customTitleColor ? { color: this.props.customTitleColor } : null;
        const fullHeight = !!this.props.fullHeight ? { height: '100%' } : null;
        return (
            <Card className={`${classes.card} StandardCard`} style={{ ...customBG, ...customTitle, ...fullHeight }}>
                {
                    !this.props.noHeader &&
                    <CardHeader
                        title={title}
                        titleTypographyProps={{
                            variant: 'h5',
                            component: 'h3',
                            color: 'inherit',
                        }}
                        action={
                            !!help && !!help.text &&
                            <HelpIcon {...help} />
                        }
                        classes={{
                            root: darkHeader && classes.cardHeaderPurple || '',
                        }}
                    />
                }
                <CardContent className={this.props.noPadding && classes.cardContentNoPadding || ''}>
                    {children}
                </CardContent>
            </Card>
        );
    }
}

const StyledCard = withStyles(styles, { withTheme: true })(Cards);
const StandardCard = (props) => <StyledCard {...props}/>;
export default StandardCard;
