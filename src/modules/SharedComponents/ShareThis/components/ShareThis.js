import React from 'react';
import PropTypes from 'prop-types';

export default class ShareThis extends React.Component {
    static propTypes = {
        hide: PropTypes.bool
    };

    static defaultProps = {
        hide: false
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

        this.shareThisConfigInHead();
    }

    componentWillUnmount() {
        /* remove the script so we can reload it when user returns via the back button  */
        const scriptShareThis = document.getElementById('shareThisScript');
        scriptShareThis.parentNode.removeChild(scriptShareThis);
    }

    shareThisConfigInHead() {
        const code = '' +
            'var a2a_config = a2a_config || {}; \n' +
            'a2a_config.callbacks = a2a_config.callbacks || [];\n' +
            'a2a_config.callbacks.push({\n' +
            '    share: function(data) {\n' +
            '        // Track shares in Google Analytics with Google Tag Manager\n' +
            '        dataLayer.push({\n' +
            '            "event": "AddToAnyShare", \n' +
            '            "socialNetwork": "AddToAny", \n' +
            '            "socialAction": data.service, \n' +
            '            "socialTarget": data.url\n' +
            '        });\n' +
            '    }\n' +
            '});\n' +
            'console.log("a2a done")\n';

        const script = document.createElement('script');
        script.id = 'shareThisHeader';
        script.appendChild(document.createTextNode(code));
        document.head.appendChild(script);
    }

    addResearchGateButton() {
        const link = document.createElement('a');
        link.href = 'https://www.researchgate.net/go.Share.html?url=' + encodeURI(window.location.href) + '&title=' + encodeURIComponent(document.title);
        link.rel = 'nofollow noopener noreferrer';
        link.target = '_blank';
        link.className = 'researchgate';
        link.title = 'Share this link via ResearchGate';

        const parentDiv = document.querySelector('.shareThis div:nth-child(2)');
        const secondChild = document.querySelector('.shareThis div:nth-child(2) a:nth-child(2)');
        if (link && parentDiv && secondChild && parentDiv.insertBefore) {
            parentDiv.insertBefore(link, secondChild);
        }
    }

    render() {
        if (this.props.hide) return <div className="shareThis_empty" />;

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
