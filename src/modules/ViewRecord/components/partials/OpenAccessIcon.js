import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import {OPEN_ACCESS_ID_LINK_NO_DOI, openAccessIdLookup} from 'config/general';

export default class OpenAccessIcon extends PureComponent {
    static propTypes = {
        isOpenAccess: PropTypes.bool,
        embargoDate: PropTypes.string,
        openAccessStatusId: PropTypes.number,
        showEmbargoText: PropTypes.bool
    };

    render() {
        const txt = locale.viewRecord.sections.links;
        if (this.props.isOpenAccess && !this.props.embargoDate) {
            const openAccessTitle = this.props.openAccessStatusId !== OPEN_ACCESS_ID_LINK_NO_DOI
                ? txt.openAccessLabel.replace('[oa_status]', openAccessIdLookup[this.props.openAccessStatusId])
                : txt.labelOpenAccessNoStatus;
            return (
                <div className="fez-icon openAccess large" title={openAccessTitle} />
            );
        } else if (!this.props.isOpenAccess && this.props.embargoDate) {
            const openAccessTitle = txt.openAccessEmbargoedLabel
                .replace('[embargo_date]', this.props.embargoDate)
                .replace('[oa_status]', openAccessIdLookup[this.props.openAccessStatusId]);
            return (
                <div>
                    {
                        this.props.showEmbargoText &&
                        <span className="is-hidden-mobile is-hidden-tablet-only">
                            {txt.embargoedUntil.replace('[embargo_date]', this.props.embargoDate)}
                        </span>
                    }
                    <div className="fez-icon openAccessEmbargoed large" title={openAccessTitle} />
                </div>
            );
        }
        return (<div className="openAccessClosed noOaIcon" />);
    }
}
