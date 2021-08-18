import React, { PureComponent } from 'react';
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
        titleProps: PropTypes.object,
        description: PropTypes.any,
        inputRef: PropTypes.object,
        instanceRef: PropTypes.object,
        required: PropTypes.bool,
        richEditorId: PropTypes.string,
    };

    static defaultProps = {
        value: '',
        className: '',
        height: 100,
        disabled: false,
        returnSingleValue: false,
        titleProps: {},
        instanceRef: React.createRef(),
        required: false,
    };

    componentDidMount() {
        this.editorInstance =
            !!window.CKEDITOR &&
            window.CKEDITOR.replace(this.props.inputRef.current, {
                bodyId: `${this.props.richEditorId}-input`,
                removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor',
                height: this.props.height,
                pasteFilter: 'semantic-content',
            });

        !!this.editorInstance && (this.editorInstance.id = `${this.props.richEditorId}-editor`);
        !!this.editorInstance && (this.editorInstance.name = `${this.props.richEditorId}-editor`);
        !!this.editorInstance && !!this.props.value && this.editorInstance.setData(this.props.value.get('htmlText'));

        !!this.editorInstance && (this.editorInstance.id = `${this.props.richEditorId}-editor`);
        !!this.editorInstance && (this.editorInstance.name = `${this.props.richEditorId}-editor`);

        !!this.editorInstance && this.editorInstance.on('instanceReady', this.onInstanceReady);
        !!this.editorInstance && this.editorInstance.on('change', this.onChange);
        !!this.editorInstance && this.editorInstance.on('contentDom', this.onContentDom);
        this.props.instanceRef.current = this.editorInstance;
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.disabled !== this.props.disabled && this.editorInstance !== null) {
            this.editorInstance.setReadOnly(!!nextProps.disabled);
        }
    }

    onInstanceReady = () => {
        this.editorInstance.setReadOnly(!!this.props.disabled);
    };

    onContentDom = e => {
        e.editor.document.getBody().setAttribute('data-testid', `${this.props.richEditorId}-input`);
    };

    onChange = evt => {
        const textValue = evt.editor.document
            .getBody()
            .getText()
            .trim();
        this.props.onChange(
            textValue.length > 0
                ? {
                      htmlText: evt.editor.getData(),
                      plainText: evt.editor.document
                          .getBody()
                          .getText()
                          .trim(),
                  }
                : null,
        );
    };

    render() {
        let error = null;
        const inputLength =
            (this.props.value && this.props.value.plainText && this.props.value.plainText.length) ||
            this.props.value.length - 7; // default rich editor has "<p></p>"
        if (this.props.meta && this.props.meta.error) {
            error =
                !!this.props.meta.error.props &&
                React.Children.map(this.props.meta.error.props.children, (child, index) => {
                    if (child.type) {
                        return React.cloneElement(child, {
                            key: index,
                        });
                    } else {
                        return child;
                    }
                });
        }
        return (
            <React.Fragment>
                <span>
                    {this.props.title && (
                        <Typography
                            color={this.props.meta && this.props.meta.error && 'error'}
                            {...this.props.titleProps}
                        >
                            {this.props.title}
                            {this.props.required && <span> *</span>}
                        </Typography>
                    )}
                    {this.props.description && (
                        <Typography color={this.props.meta && this.props.meta.error && 'error'} variant={'caption'}>
                            {this.props.description}
                        </Typography>
                    )}
                </span>
                <div
                    className={this.props.className}
                    id={this.props.richEditorId}
                    data-testid={this.props.richEditorId}
                    ref={this.props.inputRef}
                />
                {this.props.meta && this.props.meta.error && (
                    <Typography
                        color="error"
                        variant="caption"
                        component={'span'}
                        style={{
                            display: 'inline-block',
                        }}
                    >
                        {error || this.props.meta.error}
                        {this.props.maxValue && <span>&nbsp;-&nbsp;</span>}
                    </Typography>
                )}
                {this.props.maxValue && (
                    <Typography
                        color="error"
                        variant="caption"
                        component={'span'}
                        style={{
                            display: 'inline-block',
                        }}
                        variant="caption"
                        color={this.props.meta && this.props.meta.error && 'error'}
                    >
                        {inputLength > 0 ? inputLength : 0} characters of {this.props.maxValue}
                        {this.props.instructions || ''}
                    </Typography>
                )}
            </React.Fragment>
        );
    }
}
