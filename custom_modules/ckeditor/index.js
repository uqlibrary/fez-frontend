/* index.js */

import './loader.js';
import './ckeditor_build/ckeditor';

// You can replace this with you own init script, e.g.:
// - jQuery(document).ready()
window.onload = function() {
    window.CKEDITOR.replaceAll();
};
