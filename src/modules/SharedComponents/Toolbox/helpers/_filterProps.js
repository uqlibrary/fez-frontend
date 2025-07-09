export default function filterProps(props) {
    const validProps = Object.assign({}, props, props.input);
    delete validProps.input;
    delete validProps.meta;
    delete validProps.help;
    delete validProps.forceError;
    delete validProps.selectFieldId;
    delete validProps.textFieldId;

    validProps.error =
        !!props.error ||
        (!!(props.forceError || (!!props.meta && !!props.meta.touched)) &&
            !!props.meta &&
            !!(!!props.meta.error || !!props.meta.warn)) ||
        undefined;
    validProps.errorText =
        (props.meta && props.meta.error) ||
        (props.meta && props.meta.warn) ||
        (props.errorText && props.errorText.toString()) ||
        undefined;
    return validProps;
}
