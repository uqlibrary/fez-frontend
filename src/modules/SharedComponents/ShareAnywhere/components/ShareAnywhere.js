import React from 'react';
import PropTypes from 'prop-types';

export default class ShareAnywhere extends React.Component {
    static propTypes = {
        show: PropTypes.bool
    };

    static defaultProps = {
        show: true
    };

    componentDidMount() {
        // window.a2a_config.custom_services = [
        //     [
        //         'www.researchgate.net',
        //         'https://www.researchgate.net/go.Share.html?url=' + encodeURI(window.location.href) + '&title=' + encodeURIComponent(document.title),
        //         'https://www.example.com/images/icon_20x20.png' // RG background: #ooccbb, white text TODO
        //     ]
        // ];

        if (!document.getElementById('shareAnywhereScript')) {
            /* add the script to the body if it hasnt already happened */
            const script = document.createElement('script');
            script.src = '//static.addtoany.com/menu/page.js';
            script.id = 'shareAnywhereScript';
            document.head.appendChild(script);
            console.log('added in did mount');
        }
    }

    componentWillUnmount() {
        /* remove the script so we can reload it when user returns via the back button  */
        const scriptShareAnywhere = document.getElementById('shareAnywhereScript');
        scriptShareAnywhere.parentNode.removeChild(scriptShareAnywhere);
    }

    render() {
        if (!this.props.show) return <div className="shareAnywhere_empty" />;

        const blockStyle = { paddingBottom: 12 };

        return (
            <div className="shareAnywhere a2a_kit a2a_kit_size_20 a2a_default_style columns is-gapless is-clearfix is-marginless" style={blockStyle}>
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
