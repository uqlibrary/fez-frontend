import React from 'react';
import PropTypes from 'prop-types';

export default class ShareThis extends React.Component {
    static propTypes = {
        show: PropTypes.bool
    };

    static defaultProps = {
        show: true
    };

    componentDidMount() {
        if (!document.getElementById('shareThisScript')) {
            /* add the script to the body if it hasnt already happened */
            const script = document.createElement('script');
            script.src = '//static.addtoany.com/menu/page.js';
            script.id = 'shareThisScript';
            script.async = true;
            document.head.appendChild(script);

            this.addResearchGateButton();
        }
    }

    componentWillUnmount() {
        /* remove the script so we can reload it when user returns via the back button  */
        const scriptShareThis = document.getElementById('shareThisScript');
        scriptShareThis.parentNode.removeChild(scriptShareThis);
    }

    addResearchGateButton() {
        const image = document.createElement('img');
        image.src = '/src/images/ResearchGate.svg';
        image.height = 20;
        image.width = 20;
        image.alt = 'Share this link via Researchgate';

        const link = document.createElement('a');
        link.href = 'https://www.researchgate.net/go.Share.html?url=' + encodeURI(window.location.href) + '&title=' + encodeURIComponent(document.title);
        link.rel = 'nofollow noopener noreferrer';
        link.appendChild(image);

        const parentDiv = document.querySelector('.shareThis div:nth-child(2)');
        const secondChild = document.querySelector('.shareThis div:nth-child(2) a:nth-child(2)');
        if (link && parentDiv && secondChild && parentDiv.insertBefore) {
            parentDiv.insertBefore(link, secondChild);
        }
    }

    render() {
        if (!this.props.show) return <div className="shareThis_empty" />;

        const blockStyle = { paddingBottom: 12 };

        return (
            <div className="shareThis columns is-gapless is-clearfix is-marginless" style={blockStyle}>
                <div className="column" />
                <div className="column is-narrow a2a_kit a2a_kit_size_20 a2a_default_style">
                    <a className="a2a_button_mendeley" />
                    <a className="a2a_button_twitter" />
                    <a className="a2a_button_linkedin" />
                    <a className="a2a_button_facebook a2a_counter" />
                    <a className="a2a_button_email" />
                    <a className="a2a_button_print" />
                    <a className="a2a_dd" href="https://www.addtoany.com/share" />
                </div>
            </div>
        );
    }
}
