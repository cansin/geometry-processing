import PropTypes from "prop-types";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import ResponsiveContainer from "recharts/es6/component/ResponsiveContainer";
import CartesianGrid from "recharts/es6/cartesian/CartesianGrid";
import XAxis from "recharts/es6/cartesian/XAxis";
import YAxis from "recharts/es6/cartesian/YAxis";
import Tooltip from "recharts/es6/component/Tooltip";
import Legend from "recharts/es6/component/Legend";
import Cell from "recharts/es6/component/Cell";
import { withStyles } from "@material-ui/core";
import ZAxis from "recharts/es6/cartesian/ZAxis";

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit,
    },
});

@inject("store")
@observer
class Chart extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
    };

    render() {
        const { classes, store } = this.props;
        const {
            name,
            data,
            chart: Chart,
            cartesian: Cartesian,
            cartesianDataKey,
        } = store.chartData;

        return (
            <Paper className={classes.paper}>
                <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                    <Chart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Legend verticalAlign="top" />
                        <XAxis dataKey="x" type="number" />
                        <YAxis dataKey="y" />
                        <ZAxis dataKey="z" range={[10, 100]} />
                        <Cartesian name={name} type="monotone" dataKey={cartesianDataKey}>
                            {data.map((entry, key) => (
                                <Cell
                                    key={key}
                                    fill={entry.fill || (entry.x % 2 ? "#cc0000" : "#0000cc")}
                                />
                            ))}
                        </Cartesian>
                    </Chart>
                </ResponsiveContainer>
            </Paper>
        );
    }
}

export default withStyles(styles)(Chart);
