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
        }

        this.addThisConfigInHead();
    }

    componentWillUnmount() {
        /* remove the script so we can reload it when user returns via the back button  */
        const scriptShareThis = document.getElementById('shareThisScript');
        scriptShareThis.parentNode.removeChild(scriptShareThis);
    }

    addThisConfigInHead() {
        const code = '(function() { \n' +
            '_waitforAddThis(1000)\n\n' +

            '  function _waitforAddThis(waitmilliseconds) {\n' +
            '    if (window.a2a_config === null || typeof window.a2a === "undefined" || !(window.a2a.init_all)) {\n' +
            '       if (waitmilliseconds > 0) {\n' +
            '           setTimeout(function() {\n' +
            '               _waitforAddThis(waitmilliseconds-100)\n' +
            '               },  waitmilliseconds);\n' +
            '       }\n' +
            '    } else {\n' +
            '        _addCode()\n' +
            '    }\n' +
            '  }\n\n' +

            '  function _addCode() { \n' +
            '          var a2a_config = window.a2a_config || {}; \n' +
            '          a2a_config.custom_services = [ \n' +
            '              [ \n' +
            '                  "researchgate", \n' +
            '                  "https://www.researchgate.net/go.Share.html?url=' + encodeURI(window.location.href) + '&title=' + encodeURIComponent(document.title) + '", \n' +
            '                  "/images/ResearchGate.png" \n' +
            '              ] \n' +
            '          ]; \n' +
            '          window.a2a_config = a2a_config; \n' +
            '          window.a2a.init_all("page");  \n' +
            '  } \n' +
            '})(window);';

        const script = document.createElement('script');
        script.id = 'shareThisHeader';
        script.appendChild(document.createTextNode(code));
        document.head.appendChild(script);
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
