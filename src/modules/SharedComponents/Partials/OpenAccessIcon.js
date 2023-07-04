import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import { openAccessConfig } from 'config';
import Badge from '@mui/material/Badge';
import AccessTime from '@mui/icons-material/AccessTime';
import Lock from '@mui/icons-material/Lock';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import withStyles from '@mui/styles/withStyles';

const styles = theme => ({
    badgeStyle: { width: 12, height: 12, marginLeft: -4, marginTop: 4 },
    embargoedBadgeStyle: { width: 12, height: 12, marginLeft: -4, marginTop: 4, color: theme.palette.secondary.main },
});

export class OpenAccessIcon extends PureComponent {
    static propTypes = {
        isOpenAccess: PropTypes.bool,
        embargoDate: PropTypes.string,
        openAccessStatusId: PropTypes.number,
        showEmbargoText: PropTypes.bool,
        securityStatus: PropTypes.bool,
        classes: PropTypes.object,
    };
    static defaultProps = {
        isOpenAccess: false,
        embargoDate: null,
        showEmbargoText: false,
        securityStatus: true,
    };

    render() {
        const txt = locale.viewRecord.sections.links;
        const classes = this.props.classes;
        if (!this.props.securityStatus) {
            return (
                <Fragment>
                    <Tooltip title={txt.securityLocked} placement="left" TransitionComponent={Fade}>
                        <Badge
                            badgeContent={<Lock fontSize="small" color="secondary" className={classes.badgeStyle} />}
                        >
                            <span
                                className="fez-icon openAccessLocked large"
                                role="img"
                                aria-label={txt.securityLocked}
                            />
                        </Badge>
                    </Tooltip>
                </Fragment>
            );
        } else if (this.props.isOpenAccess && !this.props.embargoDate) {
            const openAccessTitle =
                this.props.openAccessStatusId !== openAccessConfig.OPEN_ACCESS_ID_LINK_NO_DOI
                    ? txt.openAccessLabel.replace('[oa_status]', openAccessConfig.labels[this.props.openAccessStatusId])
                    : txt.labelOpenAccessNoStatus;

            return (
                <Fragment>
                    <Tooltip title={openAccessTitle} placement="left" TransitionComponent={Fade}>
                        <span
                            className="fez-icon openAccess large"
                            role="img"
                            aria-label={openAccessTitle}
                            data-testid="open-access"
                        />
                    </Tooltip>
                </Fragment>
            );
        } else if (!this.props.isOpenAccess && !!this.props.embargoDate) {
            const openAccessTitle = txt.openAccessEmbargoedLabel
                .replace('[embargo_date]', this.props.embargoDate)
                .replace('[oa_status]', openAccessConfig.labels[this.props.openAccessStatusId]);
            return (
                <Fragment>
                    {this.props.showEmbargoText && (
                        <span className="is-hidden-mobile is-hidden-tablet-only">
                            {txt.embargoedUntil.replace('[embargo_date]', this.props.embargoDate)}
                        </span>
                    )}
                    <Badge badgeContent={<AccessTime fontSize="small" className={classes.embargoedBadgeStyle} />}>
                        <Tooltip title={openAccessTitle} placement="left" TransitionComponent={Fade}>
                            <span
                                className="fez-icon openAccessEmbargoed large"
                                role="img"
                                aria-label={openAccessTitle}
                                data-testid="open-access-embargoed"
                            />
                        </Tooltip>
                    </Badge>
                </Fragment>
            );
        }
        return <span className="noOaIcon" data-testid="no-oa-icon" />;
    }
}

export default withStyles(styles)(OpenAccessIcon);
