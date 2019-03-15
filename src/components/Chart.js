import PropTypes from "prop-types";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import { unstable_Box as Box } from "@material-ui/core/Box";
import LineChart from "recharts/es6/chart/LineChart";
import Line from "recharts/es6/cartesian/Line";
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";
import CartesianGrid from "recharts/es6/cartesian/CartesianGrid";
import XAxis from "recharts/es6/cartesian/XAxis";
import YAxis from "recharts/es6/cartesian/YAxis";
import Tooltip from "recharts/es6/component/Tooltip";
import Legend from "recharts/es6/component/Legend";

@inject("store")
@observer
class Chart extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { chartData: data } = this.props.store;

        return (
            <Paper>
                <Box p={1}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="isoCurveLength" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        );
    }
}

export default Chart;
