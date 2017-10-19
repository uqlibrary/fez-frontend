import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoSuggestField from './components/AutoSuggestField';
import {OrgUnitsVocabId} from 'config/general';
import {connect} from 'react-redux';
import * as actions from 'actions';

class OrgUnitsAutoSuggestField extends Component {
    static propTypes = {
        input: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AutoSuggestField
                category={OrgUnitsVocabId}
                onChange={this.props.input.onChange}
                locale={{
                    fieldLabel: 'School, department or centre',
                    fieldHint: 'Start typing organisation unit name'
                }}
                {...this.props} />
        );
    }
}

const mapStateToProps = (state) => (
    {
        itemsList: state.get('orgUnitsReducer').itemsList
    }
);

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (category) => dispatch(actions.loadOrgUnits(category))
    }
);

export const OrgUnitsField = connect(mapStateToProps, mapDispatchToProps)(OrgUnitsAutoSuggestField);

