import React, {PureComponent} from 'react';
import locale from 'locale/components';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import PropTypes from 'prop-types';

const styles = {
    addThis: {
        marginTop: 8,
        marginBottom: 8
    }
};

export class ShareThis extends PureComponent {
    static propTypes = {
        classes: PropTypes.object
    };

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
        const {classes} = this.props;
        const {shareThis} = locale.components;

        return (
            <Grid container spacing={16} className={classes.addThis}>
                <Hidden xsDown>
                    <Grid item xs />
                </Hidden>
                <Grid item className="a2a_kit a2a_kit_size_20 a2a_default_style">
                    <a className="a2a_button_facebook" title={shareThis.facebook.linkTitle} />
                    <a className="a2a_button_mendeley" title={shareThis.mendeley.linkTitle} />
                    <a className="a2a_button_twitter" title={shareThis.twitter.linkTitle} />
                    <a className="a2a_button_linkedin" title={shareThis.linkedin.linkTitle} />
                    <a className="a2a_button_google_plus" title={shareThis.googleplus.linkTitle} />
                    <a className="a2a_button_reddit" title={shareThis.reddit.linkTitle} />
                    <a className="a2a_button_email" title={shareThis.email.linkTitle} />
                    <a className="a2a_button_print" title={shareThis.print.linkTitle} />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(ShareThis);
