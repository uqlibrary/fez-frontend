import { BrowserContext } from '@playwright/test';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

function generateUUID(): string {
    return crypto.randomBytes(16).toString('hex');
}

export async function collectCoverageAsync(
    context: BrowserContext,
    use: (context: BrowserContext) => Promise<void>,
    outputDir: string,
): Promise<void> {
    await fs.promises.mkdir(outputDir, { recursive: true });
    await context.exposeFunction('collectIstanbulCoverageAsync', (coverageJson: string) => {
        if (!coverageJson) return;
        fs.writeFileSync(path.join(outputDir, `${generateUUID()}.json`), coverageJson);
    });

    await context.addInitScript(() => {
        window.addEventListener('beforeunload', () => {
            (window as any).collectIstanbulCoverageAsync(JSON.stringify((window as any).__coverage__));
        });
    });

    await use(context);

    for (const page of context.pages()) {
        await page.evaluate(() => {
            (window as any).collectIstanbulCoverageAsync(JSON.stringify((window as any).__coverage__));
        });
    }
}
