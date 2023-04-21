import * as core from '@actions/core'
import {exec} from '@actions/exec'
import {context} from '@actions/github';
import {Octokit} from '@octokit/rest';
import {getParameters} from './get-parameters.util';

async function run(): Promise<void> {
    let octokit: Octokit | undefined = undefined;
    let checkRunId;

    try {
        octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN,
        });

        const checkRun = await octokit.checks.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            name: 'coverage',
            head_sha: context.payload.after,
            status: 'queued',
        });

        checkRunId = checkRun.data.id;

        const parameters = getParameters();

        const execError = Buffer.from('');
        const listeners = {
            stderr: (data: Buffer) => {
                execError.write(data.toString());
            }
        }

        await exec('mkdir -p ./coverage/merged-coverage-report/coverage-final-reports', [], {listeners})
        let index = 1;
        for (const coverageReportPath of parameters.coverageReportPaths) {
            await exec(`cp ${coverageReportPath} ./coverage/merged-coverage-report/coverage-final-reports/${index++}-coverage-final.json`, [], {listeners})
        }
        await exec('npx nyc merge ./coverage/merged-coverage-report/coverage-final-reports ./coverage/merged-coverage-report/merged-coverage-final.json -t ./coverage/merged-coverage-report/.nyc_output', [], {listeners})

        let lineCoverage = 0;
        await exec('/bin/sh -c "npx nyc report --reporter text-summary -t ./coverage/merged-coverage-report/ | egrep -i lines | awk \'{ print \$3 }\'"', [], {
            listeners: {
                ...listeners, stdout: (data: Buffer) => {
                    const lineCoverageStr = data.toString().trim().slice(0, -1)
                    lineCoverage = parseFloat(lineCoverageStr === 'Unknown' ? '0' : lineCoverageStr);
                },
            }
        })

        if (execError.length !== 0) {
            throw new Error(execError.toString());
        }


        if (parameters.lineCoverageThreshold > lineCoverage) {
            throw new Error(`Line coverage ${lineCoverage}% did not pass the threshold ${parameters.lineCoverageThreshold}%.`)
        }

        await octokit.checks.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            check_run_id: checkRunId,
            status: 'completed',
            conclusion: 'success',
            output: {
                title: `Line coverage ${lineCoverage}% passed the threshold ${parameters.lineCoverageThreshold}%.`,
                summary: `Line coverage ${lineCoverage}% passed the threshold ${parameters.lineCoverageThreshold}%.`
            },
        });

        core.setOutput('line-coverage', `${lineCoverage}`)
    } catch (error) {
        let reason: string;

        if (error instanceof Error) {
            reason = error.message
        } else {
            reason = JSON.stringify(error);
        }

        core.setFailed(reason)

        await octokit?.checks.update({
            owner: context.repo.owner,
            repo: context.repo.repo,
            check_run_id: checkRunId,
            status: 'completed',
            conclusion: 'failure',
            output: {
                title: `${reason}`,
                summary: `${reason}`
            },
        });
    }
}

run()
