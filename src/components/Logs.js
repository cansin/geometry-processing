import PropTypes from "prop-types";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
    paper: {
        padding: theme.spacing(),
    },
});

@inject("store")
@observer
class Logs extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
    };

    render() {
        const { classes, store } = this.props;
        const { logs } = store;
        return (
            <Paper className={classes.paper}>
                <Typography component="pre">{logs}</Typography>
            </Paper>
        );
    }
}

export default withStyles(styles)(Logs);
