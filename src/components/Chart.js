import PropTypes from "prop-types";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import { unstable_Box as Box } from "@material-ui/core/Box";
import LineChart from "recharts/es6/chart/LineChart";
import Line from "recharts/es6/cartesian/Line";
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";

const data = [
    {
        name: "Page A",
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: "Page B",
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: "Page C",
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: "Page D",
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: "Page E",
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: "Page F",
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: "Page G",
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

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
                    <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                        <LineChart data={data}>
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        );
    }
}

export default Chart;
