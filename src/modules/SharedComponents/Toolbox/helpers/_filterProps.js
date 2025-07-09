export default function filterProps(props) {
    const validProps = Object.assign({}, props, props.input);
    delete validProps.input;
    delete validProps.state;
    delete validProps.help;
    delete validProps.forceError;
    delete validProps.selectFieldId;
    delete validProps.textFieldId;

    validProps.error = !!props.error || (!!props.forceError && !!props.state && !!props.state.error) || undefined;
    validProps.errorText =
        (props.state && props.state.error) || (props.errorText && props.errorText.toString()) || undefined;
    return validProps;
}
