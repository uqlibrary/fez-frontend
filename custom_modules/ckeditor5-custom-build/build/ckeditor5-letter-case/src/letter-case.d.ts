export default class LetterCase extends Plugin {
    init(): void;
    getDropdownItemsDefinitions(): Collection<Record<string, any>>;
}
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Collection from "@ckeditor/ckeditor5-utils/src/collection";
