import React, { Component } from "react";
import { unstable_Box as Box } from "@material-ui/core/Box";

import ThreeScene from "./ThreeScene";
import ModeChooser from "./ModeChooser";
import Logs from "./Logs";
import Store from "./Store";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.store = new Store();
    }

    render() {
        return (
            <Box display="flex" flexDirection="column" flexGrow={1} p={1}>
                <Box p={1}>
                    <ModeChooser store={this.store} />
                </Box>
                <Box p={1} flexGrow={1}>
                    <ThreeScene store={this.store} />
                </Box>
                <Box p={1}>
                    <Logs />
                </Box>
            </Box>
        );
    }
}
