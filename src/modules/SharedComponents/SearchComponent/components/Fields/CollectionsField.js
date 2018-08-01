import {AdvancedSearchSelectField} from '../AdvancedSearchSelectField';
import {connect} from 'react-redux';
import * as actions from 'actions';
import {bindActionCreators} from 'redux';

const mapStateToProps = (state, props) => {
    const translatedItemList = state.get('collectionsReducer') && state.get('collectionsReducer').itemsList.map((item, index) => {
        return {text: item.rek_title, value: item.rek_pid, index};
    });
    return {
        itemsList: translatedItemList || [],
        value: props.value || [],
        onChange: props.onChange,
        itemsLoading: state.get('collectionsReducer').itemsLoading || false,
        itemsLoadingError: state.get('collectionsReducer').itemsLoadingError || false,
        async: true,
        errorText: props.errorText,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        loadSuggestions: bindActionCreators(actions.collectionsList, dispatch)
    };
}

const CollectionsField = connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchSelectField);
export default CollectionsField;
