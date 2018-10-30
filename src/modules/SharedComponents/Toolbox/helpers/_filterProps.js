export default function filterProps(props) {
    const validProps = Object.assign({}, props, props.input);

    delete validProps.input;
    delete validProps.meta;
    delete validProps.help;
    delete validProps.className;
    delete validProps.forceError;

    validProps.errorText = (props.forceError || (props.meta && props.meta.touched)) ? !!props.meta && (props.meta.error || props.meta.warn) || undefined : undefined;
    return validProps;
}
