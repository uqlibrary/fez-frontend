export default function filterProps(props) {
    const validProps = Object.assign({}, props, props.input);

    delete validProps.input;
    delete validProps.meta;
    delete validProps.helpText;
    delete validProps.helpTitle;
    delete validProps.formValue;
    delete validProps.helpButtonLabel;

    validProps.errorText = (props.forceError || props.meta.touched) ? props.meta.error || props.meta.warn || undefined : undefined;
    return validProps;
}
