import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AutoSuggestField} from '../components/AutoSuggestField';
import {FieldOfResearchVocabId} from 'config/general';
import {connect} from 'react-redux';
import * as actions from 'actions';

export class FieldOfResearchAutoSuggestField extends Component {
    static propTypes = {
        input: PropTypes.object,
        maxResults: PropTypes.number
    };

    static defaultProps = {
        maxResults: 100,
        locale: {
            fieldLabel: 'Field of research',
            fieldHint: 'Start typing field of research or code'
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        return (
            <AutoSuggestField
                forceItemSelection
                onChange={this.props.input.onChange}
                {...this.props} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        category: FieldOfResearchVocabId,
        itemsList: state.get('controlledVocabulariesReducer') && state.get('controlledVocabulariesReducer')[FieldOfResearchVocabId]
            ? state.get('controlledVocabulariesReducer')[FieldOfResearchVocabId].itemsKeyValueList : [],
        dataSourceConfig: { text: 'value', value: 'key'}
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        loadSuggestions: (category) => dispatch(actions.loadVocabulariesList(category))
    }
);

export const FieldOfResearchField = connect(mapStateToProps, mapDispatchToProps)(FieldOfResearchAutoSuggestField);

