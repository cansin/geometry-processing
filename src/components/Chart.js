import PropTypes from "prop-types";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import { unstable_Box as Box } from "@material-ui/core/Box";
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";
import CartesianGrid from "recharts/es6/cartesian/CartesianGrid";
import XAxis from "recharts/es6/cartesian/XAxis";
import YAxis from "recharts/es6/cartesian/YAxis";
import Tooltip from "recharts/es6/component/Tooltip";
import Legend from "recharts/es6/component/Legend";
import Cell from "recharts/es6/component/Cell";

@inject("store")
@observer
class Chart extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { name, data, chart: Chart, cartesian: Cartesian } = this.props.store.chartData;

        return (
            <Paper>
                <Box p={1}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                        <Chart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis />
                            <YAxis />
                            <Tooltip />
                            <Legend verticalAlign="top" />
                            <Cartesian
                                name={name}
                                type="monotone"
                                dataKey="value"
                                fill="#cc0000"
                                stroke="#cc0000">
                                {data.map((entry, key) => (
                                    <Cell key={key} fill={entry.name % 2 ? "#cc0000" : "#0000cc"} />
                                ))}
                            </Cartesian>
                        </Chart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        );
    }
}

export default Chart;
