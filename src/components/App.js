import React, { Component } from "react";
import { unstable_Box as Box } from "@material-ui/core/Box";

import ThreeScene from "./ThreeScene";
import ModeChooser from "./ModeChooser";
import store from "./Store";
import { Provider } from "mobx-react";

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Box display="flex" flexDirection="column" flexGrow={1} p={1}>
                    <Box p={1}>
                        <ModeChooser />
                    </Box>
                    <Box display="flex" p={1} flexGrow={1}>
                        <Box flexGrow={1}>
                            <ThreeScene />
                        </Box>
                        <Box display="flex" flexDirection="column" flexShrink={0} p={1}>
                            <Box p={1} flexGrow={1}>
                                <div>
                                    <p>Chart goes here.</p>
                                </div>
                            </Box>
                            <Box p={1} flexGrow={1}>
                                <div>
                                    <p>Logs go here.</p>
                                </div>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Provider>
        );
    }
}
