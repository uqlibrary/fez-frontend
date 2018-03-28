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
            // script.async = true;

            const code = this.addThisConfigInHead();
            script.appendChild(document.createTextNode(code));

            document.head.appendChild(script);
            console.log('AddThis in did mount');
        }
    }

    componentWillUnmount() {
        /* remove the script so we can reload it when user returns via the back button  */
        const scriptShareThis = document.getElementById('shareThisScript');
        scriptShareThis.parentNode.removeChild(scriptShareThis);
    }

    addThisConfigInHead() {
        const code = 'function my_addtoany_onready() { \n' +
            'console.log("in my_addtoany_onready"); \n' +
            '    var a2a_config = a2a_config || {}; \n' +
            '    a2a_config.custom_services = [ \n' +
            '        [ \n' +
            '            "www.researchgate.net", \n' +
            '            "https://www.researchgate.net/go.Share.html?url=' + encodeURI(window.location.href) + '&title=' + encodeURIComponent(document.title) + '", \n' +
            '            "https://www.example.com/images/icon_20x20.png" \n' +  // RG background: #ooccbb, white text TODO
            '        ] \n' +
            '    ]; \n' +
            '    a2a.init("page");  \n' +
            '}';
        return code;
        // const script = document.createElement('script');
        // script.id = 'shareThisHeader';
        // script.appendChild(document.createTextNode(code));
        // document.head.appendChild(script);
    }

    render() {
        if (!this.props.show) return <div className="shareThis_empty" />;

        const blockStyle = { paddingBottom: 12 };

        return (
            <div className="shareThis a2a_kit a2a_kit_size_20 a2a_default_style columns is-gapless is-clearfix is-marginless" style={blockStyle}>
                <div className="column" />
                <div className="column is-narrow">
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
