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
    cardHeaderPrimary: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.primary.main,
        borderRadius: '4px 4px 0px 0px',
        padding: '12px 24px',
    },
    cardHeaderAccent: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.accent.main,
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
        primaryHeader: PropTypes.bool,
        accentHeader: PropTypes.bool,
        fullHeight: PropTypes.bool,
        noPadding: PropTypes.bool,
        noHeader: PropTypes.bool,
        children: PropTypes.any,
        classes: PropTypes.object.isRequired,
        help: PropTypes.object,
        customBackgroundColor: PropTypes.any,
        customTitleColor: PropTypes.any,
        customTitleBgColor: PropTypes.any,
        squareTop: PropTypes.bool,
        smallTitle: PropTypes.bool,
        standardCardId: PropTypes.string,
        subCard: PropTypes.bool,
    };

    render() {
        const {
            classes,
            title,
            help,
            children,
            primaryHeader,
            accentHeader,
            smallTitle = false,
            subCard = false,
        } = this.props;
        const customBG = !!this.props.customBackgroundColor
            ? { backgroundColor: this.props.customBackgroundColor }
            : null;
        const customTitleBG = !!this.props.customTitleBgColor
            ? { backgroundColor: this.props.customTitleBgColor }
            : null;
        const customTitle = !!this.props.customTitleColor ? { color: this.props.customTitleColor } : null;
        const fullHeight = !!this.props.fullHeight ? { height: '100%' } : null;
        const squareTop = !!this.props.squareTop ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : null;
        const standardCardId = !!this.props.standardCardId
            ? this.props.standardCardId
            : `standard-card${typeof title === 'string' ? '-' + title.replace(/ /g, '-').toLowerCase() : ''}`;
        return (
            <Card
                data-testid={standardCardId}
                className={`${classes.card} StandardCard`}
                style={{ ...customBG, ...customTitle, ...fullHeight }}
            >
                {!this.props.noHeader && (
                    <CardHeader
                        style={{ ...squareTop, ...customTitleBG }}
                        title={title}
                        titleTypographyProps={{
                            variant: smallTitle ? 'h6' : 'h5',
                            component: subCard ? 'h4' : 'h3',
                            color: 'inherit',
                            'data-testid': `${standardCardId}-header`,
                        }}
                        action={!!help && !!help.text && <HelpIcon {...help} />}
                        classes={{
                            root:
                                (primaryHeader && classes.cardHeaderPrimary) ||
                                (accentHeader && classes.cardHeaderAccent),
                        }}
                    />
                )}
                <CardContent
                    data-testid={`${standardCardId}-content`}
                    className={(this.props.noPadding && classes.cardContentNoPadding) || ''}
                >
                    {children}
                </CardContent>
            </Card>
        );
    }
}

const StyledCard = withStyles(styles, { withTheme: true })(Cards);
export const StandardCard = props => <StyledCard {...props} />;
export default StandardCard;
