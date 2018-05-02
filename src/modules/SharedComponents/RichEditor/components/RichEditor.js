import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import 'ckeditor';

export default class RichEditor extends PureComponent {
    static propTypes = {
        value: PropTypes.any,
        className: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        height: PropTypes.number
    };

    static defaultProps = {
        value: '',
        className: '',
        height: 100,
        disabled: false
    };

    componentDidMount() {
        if (window.CKEDITOR) {
            this.editorInstance = window.CKEDITOR.appendTo(
                ReactDOM.findDOMNode(this),
                {
                    removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor',
                    height: this.props.height
                },
                this.props.value
            );

            if (this.editorInstance) {
                this.editorInstance.on('instanceReady', () => {
                    this.editorInstance.setReadOnly(!!this.props.disabled);
                });

                this.editorInstance.on('change', (evt) => {
                    const textValue = evt.editor.document.getBody().getText().trim();
                    this.props.onChange(textValue.length > 0
                        ? {
                            htmlText: evt.editor.getData(),
                            plainText: evt.editor.document.getBody().getText().trim()
                        }
                        : null);
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.disabled !== this.props.disabled && this.editorInstance !== null) {
            this.editorInstance.setReadOnly(!!nextProps.disabled);
        }
    }

    render() {
        return <div className={this.props.className} />;
    }
}
