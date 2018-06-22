import React, {PureComponent} from 'react';
import Raven from 'raven-js';

export default class ShareThis extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidMount() {
        if (!document.getElementById('shareThisScript')) {
            // add the script to the body if it hasn't already happened
            const script = document.createElement('script');
            script.src = '//static.addtoany.com/menu/page.js';
            script.id = 'shareThisScript';
            script.async = true;
            document.head.appendChild(script);

            this.addShareThisConfigToHead();
        }
    }

    // https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true });

        // https://docs.sentry.io/clients/javascript/integrations/react/
        Raven.captureException(error, { extra: errorInfo });
    }

    componentWillUnmount() {
        // remove the scripts so we can reload them when user returns via the back button
        const scriptShareThisHeader = document.getElementById('shareThisHeader');
        if (!!scriptShareThisHeader) {
            scriptShareThisHeader.parentNode.removeChild(scriptShareThisHeader);
        }

        const scriptShareThis = document.getElementById('shareThisScript');
        if (!!scriptShareThis) {
            scriptShareThis.parentNode.removeChild(scriptShareThis);
        }
    }

    addShareThisConfigToHead() {
        const code = '' +
            /* from https://www.addtoany.com/ext/google_analytics */
            'var a2a_config = a2a_config || {}; \n' +
            'a2a_config.callbacks = a2a_config.callbacks || [];\n' +
            'a2a_config.callbacks.push({\n' +
            '    share: function(data) {\n' +
            '        dataLayer.push({\n' +
            '            "event": "AddToAnyShare", \n' +
            '            "socialNetwork": "AddToAny", \n' +
            '            "socialAction": data.service, \n' +
            '            "socialTarget": data.url\n' +
            '        });\n' +
            '    }\n' +
            '});\n\n' +

            'var link = document.createElement("a");\n' +
            'href = "https://www.researchgate.net/go.Share.html?url=" + encodeURI(window.location.href) + "&title=" + encodeURIComponent(document.title);\n' +
            'link.href = href;\n' +
            'link.rel = "nofollow noopener noreferrer";\n' +
            'link.target = "_blank";\n' +
            'link.className = "researchgate";\n' + // allows css to get image built via webpack
            'link.title = "Share this link via ResearchGate";\n' +
            'link.onclick = function(href) {\n' +
            '    dataLayer.push({\n' +
            '        "event": "AddToAnyShare",\n' +
            '        "socialNetwork": "AddToAny",\n' +
            '        "socialAction": "researchgate",\n' +
            '        "socialTarget": href\n' +
            '    });\n' +
            '};\n\n' +

            /* add researchGate as the second link */
            'var parentDiv = document.querySelector(".shareThis div:nth-child(2)");\n' +
            'var secondChild = document.querySelector(".shareThis div:nth-child(2) a:nth-child(2)");\n' +
            'if (link && parentDiv && secondChild && parentDiv.insertBefore) {\n' +
            '    parentDiv.insertBefore(link, secondChild);\n' +
            '}\n';

        const script = document.createElement('script');
        script.id = 'shareThisHeader';
        script.appendChild(document.createTextNode(code));
        document.head.appendChild(script);
    }

    render() {
        if (this.state.hasError) {
            return '';
        }
        return (
            <div className="shareThis columns is-gapless is-clearfix is-marginless">
                <div className="column is-hidden-mobile" />
                <div className="column is-narrow a2a_kit a2a_kit_size_20 a2a_default_style">
                    <a className="a2a_button_facebook" />
                    <a className="a2a_button_mendeley" />
                    <a className="a2a_button_twitter" />
                    <a className="a2a_button_linkedin" />
                    <a className="a2a_button_google_plus" />
                    <a className="a2a_button_reddit" />
                    <a className="a2a_button_email" />
                    <a className="a2a_button_print" />
                </div>
            </div>
        );
    }
}
