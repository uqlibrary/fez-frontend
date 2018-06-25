/* config.js */

window.CKEDITOR.editorConfig = function() {
    console.log(CKEDITOR.config);
    // Define changes to default configuration here.
    // For complete reference see:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config
    CKEDITOR.config.pasteFromWord_inlineImages = false;
    CKEDITOR.config.clipboard_defaultContentType = 'text';
    CKEDITOR.config.pasteFromWordPromptCleanup = true;
    CKEDITOR.config.removePlugins = 'image';
};
