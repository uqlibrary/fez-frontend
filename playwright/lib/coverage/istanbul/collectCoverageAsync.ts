import { BrowserContext } from '@playwright/test';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

function generateUUID(): string {
    return crypto.randomBytes(16).toString('hex');
}

// window.__coverage__ repeats each file's statementMap/fnMap/branchMap (the structure, which is the
// bulk of the payload) identically for every test; only the s/f/b hit counts change. So write each
// file's structure once (keyed by its istanbul hash) to structureDir, and have each per-test partial
// carry only the counts keyed by file + hash. ReportMerger rejoins structure + counts, so a run does
// not rewrite the whole coverage map for every test.
export async function collectCoverageAsync(
    context: BrowserContext,
    use: (context: BrowserContext) => Promise<void>,
    partialsDir: string,
    structureDir: string,
): Promise<void> {
    await fs.promises.mkdir(partialsDir, { recursive: true });
    await fs.promises.mkdir(structureDir, { recursive: true });

    const writeStructureOnce = (hash: string, structure: unknown) => {
        const file = path.join(structureDir, `${hash}.json`);
        try {
            fs.writeFileSync(file, JSON.stringify(structure), { flag: 'wx' });
        } catch (e) {
            if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e; // another worker wrote it
        }
    };

    await context.exposeFunction('collectIstanbulCoverageAsync', (coverageJson: string) => {
        if (!coverageJson) return;
        let coverage: Record<string, Record<string, unknown>>;
        try {
            coverage = JSON.parse(coverageJson);
        } catch {
            return;
        }
        const counts: Record<string, unknown> = {};
        for (const key of Object.keys(coverage)) {
            const fc = coverage[key];
            if (!fc) continue;
            const { statementMap, fnMap, branchMap, inputSourceMap, _coverageSchema, ...rest } = fc as {
                statementMap: unknown;
                fnMap: unknown;
                branchMap: unknown;
                inputSourceMap?: unknown;
                _coverageSchema?: unknown;
                hash?: string;
                path?: string;
            };
            // istanbul sets `hash` per file; fall back to hashing the structure so no file is dropped.
            const hash =
                (rest as { hash?: string }).hash ||
                crypto.createHash('sha1').update(JSON.stringify({ statementMap, fnMap, branchMap })).digest('hex');
            writeStructureOnce(hash, {
                path: (rest as { path?: string }).path,
                statementMap,
                fnMap,
                branchMap,
                inputSourceMap,
                _coverageSchema,
                hash,
            });
            counts[key] = { ...rest, hash }; // path + s/f/b (+ bT) + hash; no structure
        }
        if (Object.keys(counts).length) {
            fs.writeFileSync(path.join(partialsDir, `${generateUUID()}.json`), JSON.stringify(counts));
        }
    });

    await context.addInitScript(() => {
        window.addEventListener('beforeunload', () => {
            if (!(window as any)?.__coverage__) return;
            (window as any).collectIstanbulCoverageAsync(JSON.stringify((window as any).__coverage__));
        });
    });

    await use(context);

    for (const page of context.pages()) {
        await page.evaluate(() => {
            if (!(window as any)?.__coverage__) return;
            (window as any).collectIstanbulCoverageAsync(JSON.stringify((window as any).__coverage__));
        });
    }
}
