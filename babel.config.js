global.reactCompilerCounts = global.reactCompilerCounts || { success: 0, fail: 0 };

module.exports = {
    plugins: [],
    overrides: [
        {
            test: /src\/modules\/AdminDashboard\/.+\.(js|jsx|ts|tsx)$/,
            plugins: [
                [
                    'babel-plugin-react-compiler',
                    {
                        logger: {
                            logEvent(filename, event) {
                                if (event.kind === 'CompileError') {
                                    global.reactCompilerCounts.fail++;
                                    console.error(`\n❌ Compilation failed: ${filename}`);
                                    console.error(`Reason: ${event.detail.reason}`);

                                    if (event.detail.description) {
                                        console.error(`Details: ${event.detail.description}`);
                                    }

                                    if (event.detail.loc) {
                                        const { line, column } = event.detail.loc.start;
                                        console.error(`Location: Line ${line}, Column ${column}`);
                                    }

                                    if (event.detail.suggestions) {
                                        console.error('Suggestions:', event.detail.suggestions);
                                    }
                                } else if (event.kind === 'CompileSuccess') {
                                    global.reactCompilerCounts.success++;
                                    console.log(`✅ Compiled: ${filename}`);
                                }
                            },
                        },
                    },
                ],
            ],
        },
    ],
};
