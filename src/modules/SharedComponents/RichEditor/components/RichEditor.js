import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
// const loadScript = require('load-script');
const defaultScriptUrl = 'ckeditor/ckeditor.js';
// const CK = require('ckeditor');
import 'ckeditor';

class RichEditor extends React.Component {
    constructor(props) {
        super(props);
        // Bindings
        // this.onLoad = this.onLoad.bind(this);
        // State initialization
        this.state = {
            // isScriptLoaded: this.props.isScriptLoaded,
            config: this.props.config
        };
    }

    // load ckeditor script as soon as component mounts if not already loaded
    componentDidMount() {
        // console.log(CK);
        console.log(window.CKEDITOR);
        this.editorInstance = window.CKEDITOR.appendTo(
            ReactDOM.findDOMNode(this),
            this.state.config,
            this.props.content
        );
        // if(!this.props.isScriptLoaded) {
        //     loadScript(this.props.scriptUrl, this.onLoad);
        // }else{
        //     this.onLoad();
        // }
    }

    componentWillUnmount() {
        this.unmounting = true;
    }

    // onLoad() {
    //     if (this.unmounting) return;
    //
    //     this.setState({
    //         isScriptLoaded: true
    //     });
    //
    //     // if (!window.CKEDITOR) {
    //     //     console.error('CKEditor not found');
    //     //     // return;
    //     // }
    //     //
    //
    //     this.editorInstance = window.CKEDITOR.appendTo(
    //         ReactDOM.findDOMNode(this),
    //         this.state.config,
    //         this.props.content
    //     );
    //
    //     // Register listener for custom events if any
    //     // for (const eventA in this.props.events) {
    //     //     const eventHandler = this.props.events[eventA];
    //     //     this.editorInstance.on(eventA, eventHandler);
    //     // }
    // }

    render() {
        return <div className={this.props.activeClass} />;
    }
}

RichEditor.defaultProps = {
    content: '',
    config: {},
    isScriptLoaded: false,
    scriptUrl: defaultScriptUrl,
    activeClass: '',
    events: {}
};

RichEditor.propTypes = {
    content: PropTypes.any,
    config: PropTypes.object,
    isScriptLoaded: PropTypes.bool,
    scriptUrl: PropTypes.string,
    activeClass: PropTypes.string,
    events: PropTypes.object
};

export default RichEditor;

// import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import RichTextEditor from 'react-rte';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ReactDOM from 'react-dom';
//
// export default class RichEditor extends Component {
//     static propTypes = {
//         onChange: PropTypes.func
//     };
//
//     state = {
//         value: RichTextEditor.createEmptyValue()
//     }
//
//     onChange = (value) => {
//         this.setState({value});
//         if (this.props.onChange) {
//             // Send the changes up to the parent component as an HTML string.
//             // This is here to demonstrate using `.toString()` but in a real app it
//             // would be better to avoid generating a string on each change.
//             this.props.onChange(
//                 value.toString('html')
//             );
//         }
//     };
//
//     render() {
//         // const toolbarConfig = {
//         //     // Optionally specify the groups to display (displayed in the order listed).
//         //     display: ['INLINE_STYLE_BUTTONS'],
//         //     INLINE_STYLE_BUTTONS: [
//         //         {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
//         //         {label: 'Italic', style: 'ITALIC'},
//         //         {label: 'Underline', style: 'UNDERLINE'},
//         //         {label: 'Superscript', style: 'SUPERSCRIPT'},
//         //         {label: 'Subscript', style: 'SUBSCRIPT'},
//         //         {label: 'Sup', style: 'SUPERSCRIPT'},
//         //         {label: 'Sub', style: 'SUBSCRIPT'}
//         //     ]
//         // };
//
//         const config = {
//             toolbar: ['bold', 'italic', 'link', 'subscript', 'numberedList', 'blockQuote'],
//         };
//
//         ClassicEditor
//             .create(ReactDOM.findDOMNode(this), config)
//             .then(editor => {
//                 console.log( editor );
//             } )
//             .catch( error => {
//                 console.error( error );
//             } );
//
//         return (
//             <textarea name='content' id='editor'>
//                 <p>Here goes the initial content of the editor.</p>
//             </textarea>
//         );
//     }
// }
