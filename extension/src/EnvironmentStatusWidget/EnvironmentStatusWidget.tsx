import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import * as React from 'react';
import * as ReactDOM from "react-dom";
import { getClient } from "azure-devops-extension-api";
import { BuildRestClient } from "azure-devops-extension-api/Build";
import { TaskAgentRestClient, EnvironmentInstance, TaskResult } from "azure-devops-extension-api/TaskAgent";

class EnvironmentStatusWidget {
    // TODO: What is responsibility of preload, load & reload methods?
    public preload(widgetSettings: any) {
        console.debug("EnvironmentStatusWidget: preload() called");
        return {
            state: 'ok',
            statusType: 0,
        };
    }

    public async load(widgetSettings: any) {
        console.debug("EnvironmentStatusWidget: load() called");

        // TODO: Remove fixed project name.
        const projectName = "Environment Status Widget";

        const taskAgentClient = getClient(TaskAgentRestClient);
        const buildClient = getClient(BuildRestClient);

        const environments = await taskAgentClient.getEnvironments(projectName);
        for (const environment of environments) {
            console.debug(`Processing environment ${environment.name} ...`)
            const buildNumber = await this.getLastEnvironmentBuildNumber(taskAgentClient, buildClient, projectName, environment);
            console.debug(`Last successful build for environment ${environment.name} is ${buildNumber}`);
        }

        return {
            state: 'ok',
            statusType: 0,
        };
    }

    public reload(widgetSettings: any) {
        console.debug("EnvironmentStatusWidget: reload() called");
        return {
            state: 'ok',
            statusType: 0,
        };
    }

    private async getLastEnvironmentBuildNumber(taskAgentClient: TaskAgentRestClient, buildClient: BuildRestClient, projectName: string, environment: EnvironmentInstance): Promise<string | null> {
        const buildId = await this.getLastEnvironmentBuildId(taskAgentClient, projectName, environment);
        if (buildId === null) {
            return null;
        }

        // TODO: Handle missing build
        const build = await buildClient.getBuild(projectName, buildId);
        return build.buildNumber;
    }

    private async getLastEnvironmentBuildId(taskAgentClient: TaskAgentRestClient, projectName: string, environment: EnvironmentInstance): Promise<number | null> {
        const deploymentRecords = await taskAgentClient.getEnvironmentDeploymentExecutionRecords(projectName, environment.id);
        // Selecting last successful build.
        const lastRecord = deploymentRecords
            .filter(x => x.result == TaskResult.Succeeded)
            .sort((x, y) => x.finishTime > y.finishTime ? -1 : 1)[0] || null;

            if (lastRecord === null) {
            console.log(`No build history found for environment '${environment.name}'`)
            return null;
        }

        return lastRecord.owner.id;
    }
}

const EnvironmentStatusComponent: React.FC = () => {
    React.useEffect(() => {
        console.debug("EnvironmentStatusWidget: Calling SDK.init()");
        SDK.init({ loaded: false });

        console.debug("EnvironmentStatusWidget: Calling SDK.register()")
        SDK.register('environment-status-widget', new EnvironmentStatusWidget());

        console.debug("EnvironmentStatusWidget: Calling SDK.notifyLoadSucceeded()")
        SDK.notifyLoadSucceeded();
        console.debug("EnvironmentStatusWidget: After calling SDK.notifyLoadSucceeded()")
    }, []);

    return <h2>Hello :)</h2>;
};

ReactDOM.render(<EnvironmentStatusComponent />, document.getElementById("root"));
