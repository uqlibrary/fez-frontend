import { TkLabelsListField } from './TkLabelsListField';
import { TK_FIELDS_VOCAB_ID } from 'config/general';
import { connect } from 'react-redux';
import * as actions from 'actions';

const category = TK_FIELDS_VOCAB_ID;

const mapStateToProps = (state, props) => {
    const { itemsKeyValueList, itemsLoading } = (state.get('controlledVocabulariesReducer') &&
        state.get('controlledVocabulariesReducer')[props.category || category]) || {
        itemsKeyValueList: [],
        itemsLoading: false,
    };
    return {
        disabled: itemsLoading || props.disabled,
        onChange: props.input.onChange,
        errorText: props.meta ? props.meta.error : props.errorText,
        error: props.meta ? !!props.meta.error : !!props.error || null,
        itemsList: itemsKeyValueList.map(item => ({ key: item.key, value: item.key, text: item.value })),
        genericSelectFieldId: props.tkLabelsFieldId ?? 'tk-labels-field-input',
        itemsLoading,
        ...props,
    };
};
const mapDispatchToProps = (dispatch, props) => ({
    loadVocabularies: () => {
        dispatch(actions.loadVocabulariesList(props.category || category));
    },
});

export const TkLabelsField = connect(mapStateToProps, mapDispatchToProps)(TkLabelsListField);
