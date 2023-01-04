import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import { openAccessConfig } from 'config';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';
import { LockOpen, Lock, LockClockOutlined } from '@mui/icons-material';

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
        if (!this.props.securityStatus) {
            return (
                <Fragment>
                    <Tooltip title={txt.securityLocked} placement="left" TransitionComponent={Fade}>
                        <Lock />
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
                        <LockOpen />
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
                    <Tooltip title={openAccessTitle} placement="left" TransitionComponent={Fade}>
                        <LockClockOutlined color="#989898" />
                    </Tooltip>
                </Fragment>
            );
        }
        return <span className="noOaIcon" />;
    }
}

export default withStyles(styles)(OpenAccessIcon);
