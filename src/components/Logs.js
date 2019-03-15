import PropTypes from "prop-types";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { unstable_Box as Box } from "@material-ui/core/Box";

@inject("store")
@observer
class Logs extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const { logs } = this.props.store;
        return (
            <Paper>
                <Box p={1}>
                    <Typography component="pre">{logs}</Typography>
                </Box>
            </Paper>
        );
    }
}

export default Logs;
