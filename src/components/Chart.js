import PropTypes from "prop-types";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import { unstable_Box as Box } from "@material-ui/core/Box";
import LineChart from "recharts/es6/chart/LineChart";
import XAxis from "recharts/es6/cartesian/XAxis";
import Tooltip from "recharts/es6/component/Tooltip";
import CartesianGrid from "recharts/es6/cartesian/CartesianGrid";
import Line from "recharts/es6/cartesian/Line";

@inject("store")
@observer
class Chart extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        return (
            <Paper>
                <Box p={1}>
                    <LineChart
                        width={400}
                        height={400}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
                        <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
                    </LineChart>
                </Box>
            </Paper>
        );
    }
}

export default Chart;
