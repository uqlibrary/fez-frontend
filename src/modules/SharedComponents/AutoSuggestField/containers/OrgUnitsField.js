import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AutoSuggestField} from '../components/AutoSuggestField';
import {OrgUnitsVocabId} from 'config/general';
import {connect} from 'react-redux';
import * as actions from 'actions';

export class OrgUnitsAutoSuggestField extends Component {
    static propTypes = {
        input: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AutoSuggestField
                onChange={this.props.input.onChange}
                locale={{
                    fieldLabel: 'School, department or centre',
                    fieldHint: 'Start typing organisation unit name'
                }}
                {...this.props} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        category: OrgUnitsVocabId,
        itemsList: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[OrgUnitsVocabId]
            ? state.get('controlledVocabulariesReducer')[OrgUnitsVocabId].itemsList : []
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (category) => dispatch(actions.loadVocabulariesList(category))
    }
);

export const OrgUnitsField = connect(mapStateToProps, mapDispatchToProps)(OrgUnitsAutoSuggestField);

