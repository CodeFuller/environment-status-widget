import "es6-promise/auto";
import * as SDK from "azure-devops-extension-sdk";
import * as React from 'react';
import * as ReactDOM from "react-dom";

const EnvironmentStatusWidget: React.FC = () => {
    React.useEffect(() => {
        console.debug("EnvironmentStatusWidget: Calling SDK.init()");
        SDK.init({ loaded: false });

        console.debug("EnvironmentStatusWidget: Calling SDK.register()");
        SDK.register('environment-status-widget', {
            preload: (widgetSettings: any) => {
                console.debug("EnvironmentStatusWidget: preload() called");
                return {
                    state: 'ok',
                    statusType: 0,
                };
            },
            load: (widgetSettings: any) => {
                console.debug("EnvironmentStatusWidget: load() called");
                return {
                    state: 'ok',
                    statusType: 0,
                };
            },
            reload: (newWidgetSettings: any) => {
                console.debug("EnvironmentStatusWidget: reload() called");
                return {
                    state: 'ok',
                    statusType: 0,
                };
            },
        });

        console.debug("EnvironmentStatusWidget: Calling SDK.notifyLoadSucceeded()")
        SDK.notifyLoadSucceeded();
        console.debug("EnvironmentStatusWidget: After calling SDK.notifyLoadSucceeded()")
    }, []);

    return <h2>Hello :)</h2>;
};

ReactDOM.render(<EnvironmentStatusWidget />, document.getElementById("root"));
