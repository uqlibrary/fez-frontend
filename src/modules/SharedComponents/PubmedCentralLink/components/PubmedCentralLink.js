import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export default class PubmedCentralLink extends PureComponent {
    static propTypes = {
        pubmedCentralId: PropTypes.string,
    };

    render() {
        const txt = locale.global.pubmedCentralLink;
        if (!this.props.pubmedCentralId) {
            return <div className="pubmedCentralLinkUrl empty" />;
        }
        return (
            <ExternalLink
                id="pubmed-central"
                className="pubmedCentralLinkUrl"
                href={txt.externalUrl.replace('[id]', this.props.pubmedCentralId)}
                title={txt.ariaLabel}
                aria-label={txt.ariaLabel}
            >
                {txt.prefix + this.props.pubmedCentralId}
            </ExternalLink>
        );
    }
}
