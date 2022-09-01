import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Stepper } from 'modules/SharedComponents/Toolbox/Stepper';
import { pathConfig } from 'config/pathConfig';
import locale from 'locale/pages';

export default class AddMissingRecord extends PureComponent {
    static propTypes = {
        rawSearchQuery: PropTypes.string,
        addRecordStep: PropTypes.func,
        actions: PropTypes.object,
        history: PropTypes.object,
        location: PropTypes.object,
        match: PropTypes.object,
        author: PropTypes.object,
    };

    constructor(props) {
        super(props);

        if (!this.props.rawSearchQuery && this.props.match.path === pathConfig.records.add.results) {
            this.props.history.replace(pathConfig.records.add.find);
        }
    }

    getStepperIndex = location => {
        const locationTokens = location.split('/').filter(Boolean);
        if (locationTokens.length !== 3) return 0;
        const configTokens = pathConfig[locationTokens[0]][locationTokens[1]];
        return Object.keys(configTokens).indexOf(locationTokens[2]);
    };

    render() {
        const txt = locale.pages.addRecord;

        return (
            <StandardPage title={txt.title}>
                <Stepper activeStep={this.getStepperIndex(this.props.location.pathname)} steps={txt.stepper} />
                <this.props.addRecordStep {...this.props} />
            </StandardPage>
        );
    }
}
