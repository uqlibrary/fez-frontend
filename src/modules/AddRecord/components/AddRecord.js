import React from 'react';
import PropTypes from 'prop-types';
import {renderRoutes} from 'react-router-config';
import {StandardPage} from 'uqlibrary-react-toolbox';

// forms & custom components
import {Stepper} from 'modules/SharedComponents/Stepper';

import {locale} from 'config';

export default class AddRecord extends React.Component {
    static propTypes = {
        actions: PropTypes.object,
        route: PropTypes.object,    // react-router-config prop
        history: PropTypes.object.isRequired,
        location: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    getStepperIndex = () => {
        return this.props.route.routes.findIndex((route) => (route.path === this.props.location.pathname));
    };

    render() {
        const txt = locale.pages.addRecord;
        return (
            <StandardPage title={txt.title}>
                <Stepper activeStep={this.getStepperIndex()} steps={txt.stepper} />
                {renderRoutes(this.props.route.routes, {...this.props})}
            </StandardPage>
        );
    }
}
