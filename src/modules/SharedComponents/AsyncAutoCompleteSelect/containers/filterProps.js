export default function filterProps(props) {
    const validProps = Object.assign({}, props, props.input);

    delete validProps.input;
    delete validProps.meta;
    delete validProps.helpText;
    delete validProps.helpTitle;

    validProps.errorText = (props.forceError || props.meta.touched) ? props.meta.error || props.meta.warn || undefined : undefined;
    return validProps;
}
