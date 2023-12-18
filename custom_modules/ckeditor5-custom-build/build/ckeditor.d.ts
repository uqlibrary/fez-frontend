declare class Editor {
}
declare namespace Editor {
    const builtinPlugins: any[];
    namespace defaultConfig {
        namespace toolbar {
            const items: string[];
        }
        const language: string;
    }
}
export default Editor;
