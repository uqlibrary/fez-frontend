import { ExternalLabelsListField } from './ExternalLabelsListField';
import { EXTERNAL_LABELS_FIELDS_VOCAB_ID } from 'config/general';
import { connect } from 'react-redux';
import * as actions from 'actions';

const category = EXTERNAL_LABELS_FIELDS_VOCAB_ID;
const NONE_ITEM = {
    key: -1,
    value: 'None',
};

const mapStateToProps = (state, props) => {
    const { itemsKeyValueList, itemsLoading } = (state.get('controlledVocabulariesReducer') &&
        state.get('controlledVocabulariesReducer')[props.category || category]) || {
        itemsKeyValueList: [],
        itemsLoading: false,
    };
    const itemsList = (!!props.hasNoneOption ? [{ ...NONE_ITEM }, ...itemsKeyValueList] : [...itemsKeyValueList]).map(
        item => ({
            key: item.key,
            value: item.key,
            text: item.value,
        }),
    );

    return {
        disabled: itemsLoading || props.disabled,
        onChange: props.input.onChange,
        errorText: props.meta ? props.meta.error : props.errorText,
        error: props.meta ? !!props.meta.error : !!props.error || null,
        itemsList,
        genericSelectFieldId: props.externalLabelsFieldId ?? 'external-labels-field-input',
        itemsLoading,
        ...props,
    };
};
const mapDispatchToProps = (dispatch, props) => ({
    loadVocabularies: () => {
        dispatch(actions.loadVocabulariesList(props.category || category));
    },
});

export const ExternalLabelsField = connect(mapStateToProps, mapDispatchToProps)(ExternalLabelsListField);
