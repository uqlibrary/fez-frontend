import type { FullConfig, FullResult, Reporter as Base } from '@playwright/test/reporter';

import fs from 'fs';
import path from 'path';
import { CoverageMap, createCoverageMap } from 'istanbul-lib-coverage';
import { createContext } from 'istanbul-lib-report';
import { create as createReporter } from 'istanbul-reports';
import { ReporterDescription } from '@playwright/test';

export type Config =
    | {
          bailOnTestFailure: boolean | undefined;
          outputDir: string;
          htmlReportDir: string | undefined;
          jsonReportDir: string | undefined;
          jsonReportFilename: string | undefined;
          jsonPartialsDir: string | undefined;
          structureDir: string | undefined;
      }
    | undefined;

export default class ReportMerger implements Base {
    public baseDir: string;
    public config: Config;

    constructor() {
        this.baseDir = path.resolve(__dirname, '../../../../');
    }

    async onBegin(config: FullConfig) {
        this.config = config.reporter.find(
            (reporter: ReporterDescription) => typeof reporter[0] === 'string' && reporter[0].includes(__filename),
        )?.[1];
    }

    async onEnd(testResult: FullResult) {
        if (process?.env?.NODE_ENV !== 'cc' || testResult.status === 'interrupted') return;
        if (this.config === undefined || !this.config.outputDir) {
            console.log(`\nSkipping Istanbul Coverage Merger ... misconfigured, please check it's configuration\n`);
            return;
        }
        // skip for failed test, unless explicitly specified
        if (testResult.status === 'failed' && this.config.bailOnTestFailure !== false) return;

        const jsonPartialsDir = this.config.jsonPartialsDir || `${this.config.outputDir}/partials`;
        const structureDir = this.config.structureDir || 'coverage/playwright-structure';
        const jsonReportDir = this.config.jsonReportDir || this.config.outputDir;
        const htmlReportDir = this.config.htmlReportDir || this.config.outputDir;

        // json report
        const mergeResult = this.mergeJsonPartialReports(
            jsonPartialsDir,
            structureDir,
            jsonReportDir,
            this.config.jsonReportFilename || 'coverage-final.json',
        );
        if (!mergeResult) return;
        // html report
        const [coverageMap, jsonOutputFilepath] = mergeResult;
        this.createHtmlReport(coverageMap, htmlReportDir);

        console.log('\n');
        console.log('> Istanbul Coverage Merger');
        console.log(`   • Merged coverage to: ${jsonOutputFilepath}`);
        console.log(`   • HTML report available at: ${htmlReportDir}`);
        console.log('\n');
    }

    getDir(append: string): string {
        return `${this.baseDir}${append.trim() ? `/${append.trim()}` : ''}`;
    }

    // Load the write-once structures (keyed by hash) and rejoin each per-test counts partial
    // ({ [file]: { hash, s, f, b } }) back into full istanbul file coverage before merging.
    loadStructures(structureDirPath: string): Record<string, Record<string, unknown>> {
        const structures: Record<string, Record<string, unknown>> = {};
        if (!fs.existsSync(structureDirPath)) return structures;
        for (const f of fs.readdirSync(structureDirPath).filter(f => f.endsWith('.json'))) {
            const s = JSON.parse(fs.readFileSync(path.join(structureDirPath, f), 'utf-8'));
            if (s && s.hash) structures[s.hash] = s;
        }
        return structures;
    }

    rejoin(
        counts: Record<string, { hash?: string }>,
        structures: Record<string, Record<string, unknown>>,
    ): Record<string, unknown> {
        const full: Record<string, unknown> = {};
        for (const key of Object.keys(counts)) {
            const c = counts[key];
            const structure = c.hash ? structures[c.hash] : undefined;
            if (!structure) continue; // structure missing, skip rather than emit malformed coverage
            full[key] = { ...structure, ...c };
        }
        return full;
    }

    mergeJsonPartialReports(
        partialsDir: string,
        structureDir: string,
        outputDir: string,
        outputFilename: string,
    ): [CoverageMap, string] | undefined {
        const partialsDirPath = this.getDir(partialsDir);
        const outputDirPath = this.getDir(outputDir);

        if (!fs.existsSync(partialsDirPath)) return;
        const files = fs.readdirSync(partialsDirPath).filter(f => f.endsWith('.json'));
        if (!files.length) return;

        const structures = this.loadStructures(this.getDir(structureDir));

        // merge partials (rejoined with their structure)
        const map = createCoverageMap({});
        for (const file of files) {
            const counts = JSON.parse(fs.readFileSync(path.join(partialsDirPath, file), 'utf-8'));
            map.merge(this.rejoin(counts, structures));
        }

        // write result
        fs.mkdirSync(outputDirPath, { recursive: true });
        const outputFilepath = path.join(outputDir, outputFilename);
        fs.writeFileSync(outputFilepath, JSON.stringify(map.toJSON(), null, 2));

        return [map, outputFilepath];
    }

    createHtmlReport(coverage: CoverageMap, outputDir: string): void {
        const outputDirPath = this.getDir(outputDir);
        fs.mkdirSync(outputDirPath, { recursive: true });

        // write report
        createReporter('html').execute(
            createContext({
                dir: outputDirPath,
                coverageMap: coverage,
            }),
        );
    }
}
