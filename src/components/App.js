import React, { Component } from "react";
import { unstable_Box as Box } from "@material-ui/core/Box";

import ThreeScene from "./ThreeScene";
import ModeChooser from "./ModeChooser";
import store from "./Store";
import { Provider } from "mobx-react";
import Logs from "./Logs";
import Grid from "@material-ui/core/Grid";

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Box display="flex" flexDirection="column" flexGrow={1} p={1}>
                    <Box p={1}>
                        <ModeChooser />
                    </Box>
                    <Box display="flex" p={1} flexGrow={1}>
                        <Grid container>
                            <Grid item xs={8} style={{ overflow: "hidden", minWidth: 800 }}>
                                <ThreeScene />
                            </Grid>
                            <Grid item xs={4}>
                                <Box display="flex" flexDirection="column">
                                    <Box p={1} flexGrow={1}>
                                        <div>
                                            <p>Chart goes here.</p>
                                        </div>
                                    </Box>
                                    <Box p={1} flexGrow={1}>
                                        <Logs />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Provider>
        );
    }
}
