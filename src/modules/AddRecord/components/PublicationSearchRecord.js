import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions';
import {withRouter} from 'react-router-dom';

import AddRecordStepper from './AddRecordStepper';
import {StandardPage} from 'uqlibrary-react-toolbox';

// forms & custom components
import {PublicationSearchForm} from 'modules/PublicationSearchForm';

import {locale} from 'config';

export class PublicationSearchRecord extends React.Component {
    static propTypes = {
        publicationsList: PropTypes.array,
        actions: PropTypes.object,
        history: PropTypes.object.isRequired,
        stepperIndex: PropTypes.number
    };

    static defaultProps = {
        stepperIndex: 0
    };

    constructor(props) {
        super(props);
    }

    _performSearch = (values) => {
        this.props.actions.searchPublications(values.get('searchQuery'));
        this.props.history.push('/records/add/results');
    };

    render() {
        const txt = locale.pages.addRecord;
        return (
            <StandardPage title={txt.title}>
                <AddRecordStepper activeStep={this.props.stepperIndex} txt={txt} />
                <div>
                    {
                        <PublicationSearchForm
                            locale={txt.step1}
                            onSubmit={this._performSearch}/>
                    }
                </div>
            </StandardPage>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

const PublicationSearchRecordContainer = connect(() => ({}), mapDispatchToProps)(PublicationSearchRecord);
export default withRouter(PublicationSearchRecordContainer);
