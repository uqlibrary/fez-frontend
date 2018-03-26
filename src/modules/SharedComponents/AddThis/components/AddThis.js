import React from 'react';
import PropTypes from 'prop-types';

export default class AddThis extends React.Component {
    static propTypes = {
        show: PropTypes.bool
    };

    static defaultProps = {
        show: true
    };

    componentDidMount() {
        /* add the script to the body if it hasnt already happened */
        if (!document.getElementById('addThisScript')) {
            window.addthis_config = {
                'pubid': 'ra-512eb98337c8a4a9'
            };

            const script = document.createElement('script');

            script.src = '//s7.addthis.com/js/300/addthis_widget.js' + '?' + new Date().getTime();
            script.id = 'addThisScript';
            document.head.appendChild(script);
            console.log('added in did mount');

            this.addThisRefresh();
        }
    }

    addThisRefresh() {
        const js = document.createTextNode('window.addEventListener("hashchange", function () { ' +
            'console.log("about to hashchange refresh"); ' +
            'addthis.layers.refresh; ' +
            'console.log("after hashchange refresh");' +
            '});');

        const script = document.createElement('script');
        script.id = 'hashchange';
        script.appendChild(js);
        document.head.appendChild(script);
    }

    render() {
        if (!this.props.show) return <div className="addthis_empty" />;

        return (
            <div className="addthis_toolbox addthis_default_style columns is-gapless is-clearfix is-marginless">
                <div className="column" />
                <div className="column is-narrow">
                    <a className="addthis_button_linkedin addthis_20x20_style" />
                    <a className="addthis_button_facebook_like" />
                    <a className="addthis_button_email addthis_20x20_style" />
                    <a className="addthis_button_print addthis_20x20_style" />
                    <a className="addthis_counter addthis_pill_style" />
                </div>
                <div className="column is-narrow">
                    <a className="addthis_button_mendeley addthis_20x20_style" />
                    <a className="addthis_button_researchgate addthis_20x20_style" />
                    <a className="addthis_button_tweet" />
                </div>
            </div>
        );
    }
}
