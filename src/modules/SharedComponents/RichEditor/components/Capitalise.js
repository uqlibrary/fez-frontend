// import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class Capitalise {
    // extends Plugin {
    init() {
        const editor = this.editor;

        editor.model.schema.extend('$text', { allowAttributes: 'capitalize' });
        editor.conversion.attributeToElement({
            model: 'capitalize',
            view: {
                name: 'span',
                styles: {
                    'text-transform': 'capitalize',
                },
            },
        });

        editor.ui.componentFactory.add('Capitalise', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Capitalise',
                withText: true,
                tooltip: true,
                isToggleable: true,
            });

            // Callback executed once the button is clicked.
            view.on('execute', () => {
                const selection = editor.model.document.selection;
                const range = selection.getFirstRange();
                const isCapitalised = selection.hasAttribute('capitalize');

                if (!isCapitalised) {
                    editor.model.change(writer => {
                        writer.setAttribute('capitalize', true, range);
                    });
                } else {
                    editor.model.change(writer => {
                        writer.removeAttribute('capitalize', range);
                    });
                }
            });
            return view;
        });
    }
}
