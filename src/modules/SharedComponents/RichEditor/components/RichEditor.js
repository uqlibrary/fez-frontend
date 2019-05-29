import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import 'ckeditor';

export default class RichEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.any,
        className: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        height: PropTypes.number,
        meta: PropTypes.object,
        returnSingleValue: PropTypes.bool,
        maxValue: PropTypes.number,
        instructions: PropTypes.any,
        title: PropTypes.any,
        description: PropTypes.any,
        inputRef: PropTypes.object
    };

    static defaultProps = {
        value: '',
        className: '',
        height: 100,
        disabled: false,
        returnSingleValue: false,
    };

    componentDidMount() {
        this.editorInstance = !!window.CKEDITOR && window.CKEDITOR.appendTo(
            this.props.inputRef.current,
            {
                removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor',
                height: this.props.height,
                pasteFilter: 'semantic-content'
            },
            !!this.props.value && this.props.value.get('htmlText') || null
        );

        !!this.editorInstance && this.editorInstance.on('instanceReady', this.onInstanceReady);
        !!this.editorInstance && this.editorInstance.on('change', this.onChange);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.disabled !== this.props.disabled && this.editorInstance !== null) {
            this.editorInstance.setReadOnly(!!nextProps.disabled);
        }
    }

    onInstanceReady = () => {
        this.editorInstance.setReadOnly(!!this.props.disabled);
    };

    onChange = (evt) => {
        const textValue = evt.editor.document.getBody().getText().trim();
        this.props.onChange(textValue.length > 0
            ? {
                htmlText: evt.editor.getData(),
                plainText: evt.editor.document.getBody().getText().trim()
            }
            : null);
    };

    render() {
        let error = null;
        const inputLength = this.props.value && this.props.value.plainText && this.props.value.plainText.length || this.props.value.length - 7; // default rich editor has "<p></p>"
        if (this.props.meta && this.props.meta.error) {
            error = !!this.props.meta.error.props && React.Children.map(this.props.meta.error.props.children, (child, index) => {
                if (child.type) {
                    return React.cloneElement(child, {
                        key: index
                    });
                } else {
                    return child;
                }
            });
        }
        return (
            <React.Fragment>
                <span>
                    {
                        this.props.title &&
                            <Typography color={this.props.meta && this.props.meta.error && 'error'}>{this.props.title}</Typography>
                    }
                    {
                        this.props.description &&
                            <Typography color={this.props.meta && this.props.meta.error && 'error'} variant={'caption'}>{this.props.description}</Typography>
                    }
                </span>
                <div className={this.props.className} ref={this.props.inputRef} />
                {
                    this.props.meta && this.props.meta.error &&
                        <Typography
                            color="error"
                            variant="caption"
                            component={'span'}
                            style={{
                                display: 'inline-block'
                            }}
                        >
                            {
                                error || this.props.meta.error
                            }
                            {
                                this.props.maxValue &&
                                <span>&nbsp;-&nbsp;</span>
                            }
                        </Typography>
                }
                {
                    this.props.maxValue &&
                    <Typography
                        component={'span'}
                        style={{
                            display: 'inline-block'
                        }}
                        variant="caption"
                        color={
                            this.props.meta &&
                            this.props.meta.error &&
                            'error'
                        }
                    >
                        {inputLength > 0 ? inputLength : 0} characters of {this.props.maxValue} {this.props.instructions || ''}
                    </Typography>
                }
            </React.Fragment>
        );
    }
}
