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
        /* add the script to the body if it hasnt already happened */
        if (!document.getElementById('shareAnywhereScript')) {
            // const url = encodeURI(window.location.href);
            // const pageTitle = encodeURIComponent(document.title);

            // window.a2a_config.custom_services = [
            //     [
            //         'www.researchgate.net',
            //         'https://www.researchgate.net/go.Share.html?url=' + url + '&title=' + pageTitle,
            //         'https://www.example.com/images/icon_32x32.png' // RG background: #ooccbb, white text
            //     ]
            // ];

            const script = document.createElement('script');

            script.src = '//static.addtoany.com/menu/page.js' + '?' + new Date().getTime();
            script.id = 'shareAnywhereScript';
            document.head.appendChild(script);
            console.log('added in did mount');
        }
    }

    componentWillUnmount() {
        const scriptShareAnywhere = document.getElementById('shareAnywhereScript');
        scriptShareAnywhere.parentNode.removeChild(scriptShareAnywhere);
        if (!document.getElementById('shareAnywhereScript')) {
            console.log('script has been removed');
        } else {
            console.log('script has NOT been removed');
        }
    }

    render() {
        if (!this.props.show) return <div className="shareAnywhere_empty" />;

        return (
            <div className="a2a_kit a2a_kit_size_20 a2a_default_style columns is-gapless is-clearfix is-marginless">
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
