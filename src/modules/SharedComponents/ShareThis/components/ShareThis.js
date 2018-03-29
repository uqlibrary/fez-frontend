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
            console.log('added in did mount');
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
            'console.log("in addThisConfigInHead"); \n' +

            // function _waitforAddThis() {
            //     var numMilliSecondsRecheck = 100;
            //     this.async(function() {
            //         if (window.)
            //     }, numMilliSecondsRecheck);
            // }

            '  var waitforAddThis = timeoutms => new Promise((r, j)=>{\n' +
            '    console.log("checking A")\n' +
            '    var check = function() {\n' +
            '      console.log("checking")\n' +
            '      if(window.a2a_config !== undefined) {\n' +
            '          console.log("found!"); \n' +
            '          console.log(window.a2a); \n' +
            '          var a2a_config = window.a2a_config || {}; \n' +
            '          a2a_config.custom_services = [ \n' +
            '              [ \n' +
            '                  "www.researchgate.net", \n' +
            '                  "https://www.researchgate.net/go.Share.html?url=' + encodeURI(window.location.href) + '&title=' + encodeURIComponent(document.title) + '", \n' +
            '                  "https://www.example.com/images/icon_20x20.png" \n' +  // RG background: #ooccbb, white text TODO
            '              ] \n' +
            '          ]; \n' +
            '          window.a2a_config = a2a_config; \n' +
            '          window.a2a.init("page");  \n' +
            '      } else if((timeoutms -= 100) < 0) {\n' +
            '        console.log("AddThis timed out")\n' +
            '      } else {\n' +
            '        setTimeout(check, 100)\n' +
            '      } \n' +
            '    }\n' +
            '    setTimeout(check, 100)\n' +
            '  })' +
            '  (async ()=>{\n' +
            // '    a.innerHTML = \'waiting..\'\n' +
            '    waitforAddThis(2000)\n' +
            '  })()\n' +


            '})(window);';

        const script = document.createElement('script');
        script.id = 'shareThisHeader';
        script.appendChild(document.createTextNode(code));
        console.log(script);
        document.head.appendChild(script);
        console.log('ran addThisConfigInHead');
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
