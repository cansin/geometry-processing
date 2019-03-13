import React, { Component } from "react";
import { unstable_Box as Box } from "@material-ui/core/Box";

import ThreeScene from "./ThreeScene";
import ModeChooser from "./ModeChooser";
import store from "./Store";

export default class App extends Component {
    render() {
        return (
            <Box display="flex" flexDirection="column" flexGrow={1} p={1}>
                <Box p={1}>
                    <ModeChooser store={store} />
                </Box>
                <Box p={1} flexGrow={1}>
                    <ThreeScene store={store} />
                </Box>
            </Box>
        );
    }
}
