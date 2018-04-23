export default function filterProps(props) {
    const validProps = Object.assign({}, props, props.input);

    delete validProps.input;
    delete validProps.meta;
    delete validProps.help;

    validProps.errorText = (props.forceError || (props.meta && props.meta.touched)) ? props.meta.error || props.meta.warn || undefined : undefined;
    return validProps;
}
