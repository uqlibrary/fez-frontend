
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Command from "@ckeditor/ckeditor5-core/src/command";
import { addListToDropdown, createDropdown } from "@ckeditor/ckeditor5-ui/src/dropdown/utils";
import Collection from "@ckeditor/ckeditor5-utils/src/collection";
import Model from "@ckeditor/ckeditor5-ui/src/model";
import { upperCase, lowerCase, titleCase, sentenceCase, toggleCase, getText } from "./utils";

import LetterCaseIcon from "./themes/icons/letter-case.svg";

// Lis of Change Case Options Available
const LetterCaseOptions = [
    {
        text: "Sentence case",
        mode: "sentenceCase"
    },
    {
        text: "lower case",
        mode: "lowerCase"
    },
    {
        text: "UPPER CASE",
        mode: "upperCase"
    },
    {
        text: "Title Case",
        mode: "titleCase"
    },
    {
        text: "tOGGLE cASE",
        mode: "toggleCase"
    }
];

export default class LetterCase extends Plugin {
    init() {
        // Register the Change Case Command
        this.editor.commands.add("LetterCase", new LetterCaseCommand(this.editor));

        // Initializing UI
        this.editor.ui.componentFactory.add("LetterCase", locale => {
            console.log('letter-case componentFactory');
            const dropdownView = createDropdown(locale);
            addListToDropdown(
                dropdownView,
                this.getDropdownItemsDefinitions(LetterCaseOptions)
            );

            dropdownView.buttonView.set({
                label: "Change Case",
                tooltip: "Change Case",
                withText: false,
                icon: LetterCaseIcon
            });

            // bindi UI with the Command
            const command = this.editor.commands.get("LetterCase");
            dropdownView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");

            // Execute the Command through the UI
            this.listenTo(dropdownView, "execute", evt => {
                const command = evt.source.commandParam;
                this.editor.execute('LetterCase', command)
            });

            return dropdownView;
        });
    }

    // Generate Item Definitions for UI
    getDropdownItemsDefinitions() {
        const itemDefinitions = new Collection();

        for (const option of LetterCaseOptions) {
            const definition = {
                type: "button",
                model: new Model({
                    commandParam: option.mode,
                    label: option.text,
                    withText: true
                })
            };

            itemDefinitions.add(definition);
        }

        return itemDefinitions;
    }
}

class LetterCaseCommand extends Command {
    execute(mode) {
        const startPos = this.editor.model.document.selection.getFirstPosition();
        const endPos = this.editor.model.document.selection.getLastPosition();

        this.editor.model.enqueueChange(writer => {
            // get selected text
            const range = writer.createRange(startPos, endPos);
            const sourceText = getText(range);

            // convert previously selected text to new one
            let targetText;
            switch (mode) {
                case 'upperCase':
                    targetText = upperCase(sourceText);
                    break;

                case 'lowerCase':
                    targetText = lowerCase(sourceText);
                    break;

                case 'titleCase':
                    targetText = titleCase(sourceText);
                    break;

                case 'sentenceCase':
                    targetText = sentenceCase(sourceText);
                    break;

                case 'toggleCase':
                    targetText = toggleCase(sourceText);
                    break;

                default:
                    targetText = sourceText;
                    break;
            }

            this._replaceText(targetText, range);
        });
    }

    _replaceText(replaceWith, replaceRange) {
        this.editor.model.enqueueChange(writer => {
            const parent = replaceRange.start.parent;

            // Get the attributes of selected node before replacing the text
            const styles = Array.from(parent.getChildren()).map(a => {
                return {
                    attributes: Array.from(a.getAttributes()),
                    range: writer.createRangeOn(a)
                };
            });

            // Replace the text with new one
            let newText = writer.createText(replaceWith, {});
            this.editor.model.insertContent(newText, replaceRange);

            // Revert the text attributes into its original attributes
            styles.forEach(item => {
                writer.setAttributes(item.attributes, item.range);
            });
        });
    }

    refresh() {
        // the command only enabled when there is only one selected block
        const blocks = Array.from(this.editor.model.document.selection.getSelectedBlocks());
        this.isEnabled = blocks.length === 1;
    }
}
