import * as core from '@actions/core';
import {asFloat} from "./as-float.util";

/**
 * Returns the parameters used to run a code coverage check.
 * Default values:
 * - `line-coverage-threshold`: 0
 * - `coverage-report-paths`: ./coverage/coverage-final.json
 */
export function getParameters(): {
    lineCoverageThreshold: number,
    coverageReportPaths: string[]
} {
    const lineCoverageThreshold = asFloat(core.getInput('line-coverage-threshold', {trimWhitespace: true}))
    const coverageReportPaths = core.getMultilineInput('coverage-report-paths')

    if (coverageReportPaths.length === 0) {
        coverageReportPaths.push(`./coverage/coverage-final.json`)
    }

    return {
        lineCoverageThreshold,
        coverageReportPaths
    }
}
