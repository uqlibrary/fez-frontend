import React from 'react';

export default class AddThis extends React.Component {
    componentDidMount() {
        const script = document.createElement('script');

        script.src = '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-512eb98337c8a4a9';
        script.async = true;

        document.body.appendChild(script);
    }

    render() {
        return (
            <span className="addthis_toolbox addthis_default_style">
                <a className="addthis_button_mendeley addthis_20x20_style" />
                <a className="addthis_button_researchgate addthis_20x20_style" />
                <a className="addthis_button_tweet" />
                <a className="addthis_button_linkedin addthis_20x20_style" />
                <a className="addthis_button_facebook_like" />
                <a className="addthis_button_email addthis_20x20_style" />
                <a className="addthis_button_print addthis_20x20_style" />
                <a className="addthis_counter addthis_pill_style" />
            </span>
        );
    }
}
