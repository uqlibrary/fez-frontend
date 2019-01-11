import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
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
                    height: this.props.height,
                    pasteFilter: 'semantic-content'
                },
                !!this.props.value && this.props.value.get('htmlText') || null
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
        let error = null;
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
                <div className={this.props.className} />
                {
                    this.props.meta && this.props.meta.error &&
                    <Typography color="error" variant="caption">
                        {
                            error || this.props.meta.error
                        }
                    </Typography>
                }
            </React.Fragment>
        );
    }
}
