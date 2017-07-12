import React from 'react';
import FontIcon from 'material-ui/FontIcon';

import './Alerts.scss';

export default class Alerts extends React.Component {
    render() {
        const alertText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur commodo commodo felis, et interdum ex tincidunt at. Donec arcu diam, pulvinar eget commodo non, congue ac erat. Nunc et molestie mi, at volutpat tortor. Proin molestie, lacus eu ullamcorper vehicula, elit turpis fermentum mi, sit amet ornare felis neque id neque. Morbi non ex porttitor, facilisis orci in, venenatis diam. Integer nec hendrerit orci, sit amet porttitor nibh. Nullam eleifend ut purus et mattis. Proin pellentesque velit et ante rhoncus, at tristique ipsum iaculis. Aliquam ante ligula, lacinia id vehicula sed, tristique quis metus. Proin neque eros, varius ut justo ullamcorper, condimentum molestie odio. In feugiat sit amet magna eget malesuada.';
        const alertState = ''; // hidden
        const alertType = 'error'; // info || warning || error

        return (
            <div className={alertType + ' ' + alertState + ' alertWrapper columns'}>
                <div className="column is-narrow alertIcon">
                    <FontIcon className="material-icons">{alertType}</FontIcon>
                </div>
                <div className="column alertText">
                    <div>{alertText}</div>
                </div>
            </div>
        );
    }
}
