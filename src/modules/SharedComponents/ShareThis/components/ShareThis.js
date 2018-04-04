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

        console.log(this.props);
        if (this.props.hide === false) {
            console.log('props false');
        } else if (this.props.hide === true) {
            console.log('props true');
        } else {
            console.log('props else');
        }

        this.shareThisConfigInHead();
    }

    componentWillUnmount() {
        /* remove the script so we can reload it when user returns via the back button  */
        const scriptShareThis = document.getElementById('shareThisScript');
        scriptShareThis.parentNode.removeChild(scriptShareThis);
    }

    shareThisConfigInHead() {
        const code = '(function() { \n' +
            '    _waitforShareThis(1000);\n\n' +

            '    function _waitforShareThis(waitmilliseconds) {\n' +
            '        if (window.a2a_config === null || typeof window.a2a === "undefined" || !(window.a2a.init_all)) {\n' +
            '            if (waitmilliseconds > 0) {\n' +
            '                setTimeout(function() {\n' +
            '                    _waitforShareThis(waitmilliseconds-100)\n' +
            '                },  waitmilliseconds);\n' +
            '            }\n' +
            '        } else {\n' +
            '            _addCode()\n' +
            '        }\n' +
            '    }\n\n' +

            '    function my_addtoany_onready() {\n' +
            '        a2a_config.custom_services = [ \n' +
            '              [ \n' +
            '                  "researchgate", \n' +
            '                  "https://www.researchgate.net/go.Share.html?url=' + encodeURI(window.location.href) + '&title=' + encodeURIComponent(document.title) + '", \n' +
            '                  "/images/ResearchGate.png" \n' +
            '              ] \n' +
            '        ]; \n' +
            '        // Additional instance configs can be set here\n' +
            // '        a2a.init("page");\n' +
            '    }\n\n' +

            '    function _addCode() { \n' +
            'console.log(window.a2a_config);\n' +
            '        var a2a_config = window.a2a_config || {}; \n' +
            '        a2a_config.callbacks = a2a_config.callbacks || [];' +
            'console.log("a2a_config.callbacks= "+a2a_config.callbacks)\n' +
            '        a2a_config.callbacks.push({\n' +
            '            ready: my_addtoany_onready,\n' +
            '            share: function(data) {\n' +
            '                // Track shares in Google Analytics with Google Tag Manager\n' +
            '                dataLayer.push({\n' +
            '                    "event": "AddToAnyShare", \n' +
            '                    "socialNetwork": "AddToAny", \n' +
            '                    "socialAction": data.service, \n' +
            '                    "socialTarget": data.url\n' +
            '                });\n' +
            '            }\n' +
            '        });\n' +
            '        window.a2a_config = a2a_config; \n' +
            '        window.a2a.init_all("page");  \n' +
            '    } \n' +
            '})(window);';

        const script = document.createElement('script');
        script.id = 'shareThisHeader';
        script.appendChild(document.createTextNode(code));
        document.head.appendChild(script);
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
        if (this.props.hide === true) return <div className="shareThis_empty" />;

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
