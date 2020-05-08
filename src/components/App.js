import React, { Component } from "react";
import { observer, Provider } from "mobx-react";
import Grid from "@material-ui/core/Grid";

import ThreeScene from "./ThreeScene";
import ModeChooser from "./ModeChooser";
import store from "./Store";
import Logs from "./Logs";
import Chart from "./Chart";

@observer
class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Grid container spacing={10}>
                    <Grid item xs={12}>
                        <ModeChooser />
                    </Grid>
                    <Grid item xs={8} style={{ overflow: "hidden", minWidth: 800 }}>
                        <ThreeScene />
                    </Grid>
                    <Grid item xs={4}>
                        <Grid
                            container
                            spacing={10}
                            direction="column"
                            justify="center"
                            alignItems="stretch">
                            {store.chartData && (
                                <Grid item>
                                    <Chart />
                                </Grid>
                            )}
                            <Grid item>
                                <Logs />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Provider>
        );
    }
}

export default App;
