import PropTypes from "prop-types";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

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
                <Typography component="pre">{logs}</Typography>
            </Paper>
        );
    }
}

export default Logs;
