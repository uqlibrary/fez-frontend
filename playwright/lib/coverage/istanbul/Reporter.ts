import type {
    FullConfig,
    FullResult,
    Reporter as Base,
} from '@playwright/test/reporter';

import fs from 'fs';
import path from 'path';
import {CoverageMap, createCoverageMap} from 'istanbul-lib-coverage';
import {createContext} from 'istanbul-lib-report';
import {create as createReporter} from 'istanbul-reports';
import {ReporterDescription} from "@playwright/test";

export type Config = {
    bailOnFailure: boolean | undefined
    outputDir: string
    htmlReportDir: string | undefined
    jsonReportDir: string | undefined
    jsonReportFilename: string | undefined
    jsonPartialsDir: string | undefined
} | undefined;

export default class Reporter implements Base {
    public baseDir: string;
    public config: Config;

    constructor() {
        this.baseDir = path.resolve(__dirname, '../../../../');
    }

    getDir(append: string): string {
        return `${this.baseDir}${append.trim() ? `/${append.trim()}` : ''}`;
    }

    mergeJsonReportPartials(partialsDir: string, outputDir: string, outputFilename: string | undefined): [CoverageMap | undefined, string | undefined] {
        const partialsDirPath = this.getDir(partialsDir);
        const outputDirPath = this.getDir(outputDir);

        // load partials
        const files = fs.readdirSync(partialsDirPath).filter(f => f.endsWith('.json'));
        if (!files.length) {
            return [undefined, undefined];
        }

        // merge partials
        const map = createCoverageMap({});
        for (const file of files) {
            map.merge(JSON.parse(fs.readFileSync(path.join(partialsDirPath, file), 'utf-8')));
        }

        // write result
        fs.mkdirSync(outputDirPath, {recursive: true});
        const outputFilepath = path.join(outputDir, outputFilename || 'coverage-final.json');
        fs.writeFileSync(outputFilepath, JSON.stringify(map.toJSON(), null, 2));

        return [map, outputFilepath];
    }

    createHtmlReport(coverage: CoverageMap, outputDir: string): void {
        const outputDirPath = this.getDir(outputDir);
        fs.mkdirSync(outputDirPath, {recursive: true});

        // write report
        createReporter('html').execute(createContext({
            dir: outputDirPath,
            coverageMap: coverage,
        }));
    }

    async onBegin(config: FullConfig) {
        this.config = config.reporter.find((reporter: ReporterDescription) => typeof reporter[0] === 'string' && reporter[0].includes(__filename))?.[1];
    }

    async onEnd(result: FullResult) {
        if (this.config === undefined || !this.config.outputDir) {
            console.log(`\nSkipping Istanbul Coverage Merger: misconfigured\n`);
            return;
        }

        if (result.status === 'failed' && this.config.bailOnFailure) {
            return;
        }

        const jsonPartialsDir = this.config.jsonPartialsDir || `${this.config.outputDir}/temp`;
        const jsonReportDir = this.config.jsonReportDir || this.config.outputDir;
        const htmlReportDir = this.config.htmlReportDir || this.config.outputDir;

        const [coverageMap, jsonOutputFilepath] = this.mergeJsonReportPartials(jsonPartialsDir, jsonReportDir, this.config.jsonReportFilename);
        if (!coverageMap || !jsonOutputFilepath) {
            return;
        }

        this.createHtmlReport(coverageMap, htmlReportDir);

        console.log('\n');
        console.log('> Istanbul Coverage Merger');
        console.log(`   • Merged coverage to: ${jsonOutputFilepath}`);
        console.log(`   • HTML report available at: ${htmlReportDir}`);
        console.log('\n');
    }
}
