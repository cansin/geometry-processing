import PropTypes from "prop-types";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import { inject, observer } from "mobx-react";
import autobind from "autobind-decorator";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/SaveAlt";
import TextField from "@material-ui/core/es/TextField";

import { ASSIGNMENTS, BOUNDARY_SHAPES, WEIGHT_APPROACHES } from "../constants";
import { MODELS, Q_TYPES, VERTEX_SELECTIONS } from "../constants";
import { populateGeodesicDistanceMatrix } from "../algorithms/geodesic_distance";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        minWidth: 110,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 125,
    },
    icon: {
        marginRight: theme.spacing.unit,
    },
});

@inject("store")
@observer
class ModeChooser extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
    };

    @autobind
    handleAssignmentChange(event) {
        this.props.store.setAssignment(event.target.value);
    }

    @autobind
    handleModelChange(event) {
        this.props.store.setModel(event.target.value);
    }

    @autobind
    handleQTypeChange(event) {
        this.props.store.setQType(event.target.value);
    }

    @autobind
    handleVertexSelectionChange(event) {
        this.props.store.setVertexSelection(event.target.value);
    }

    @autobind
    handleWeightApproachChange(event) {
        this.props.store.setWeightApproach(event.target.value);
    }

    @autobind
    handleBoundaryShapeChange(event) {
        this.props.store.setBoundaryShape(event.target.value);
    }

    @autobind
    handleVertexCountChange(event) {
        this.props.store.setVertexCount(event.target.value);
    }

    @autobind
    handleCreateMatrix() {
        const { assignment, model, graph, mesh, qType } = this.props.store;

        const { matrix } = populateGeodesicDistanceMatrix({
            geometry: mesh.geometry,
            graph,
            qType,
        });

        let data = "";
        matrix.forEach(row => {
            data += Array.from(row.values()).join(" ") + "\n";
        });
        const blob = new Blob([data], { type: "octet/stream" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        const filename = Object.keys(MODELS[assignment]).filter(
            key => MODELS[assignment][key] === model,
        )[0];
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = `${filename}_geodesic_matrix.txt`;

        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    render() {
        const { classes, store } = this.props;
        const {
            assignment,
            model,
            qType,
            vertexCount,
            vertexSelection,
            weightApproach,
            boundaryShape,
        } = store;
        return (
            <Paper>
                <Grid container alignItems="center">
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="assignment">Assignment</InputLabel>
                            <Select
                                value={assignment}
                                onChange={this.handleAssignmentChange}
                                input={<Input name="assignment" id="assignment" />}
                                autoWidth>
                                {Object.entries(ASSIGNMENTS).map(([value, tag], key) => (
                                    <MenuItem key={key} value={value}>
                                        {tag}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="model">Model</InputLabel>
                            <Select
                                value={model}
                                onChange={this.handleModelChange}
                                input={<Input name="model" id="model" />}
                                autoWidth>
                                {Object.entries(MODELS[assignment]).map(([tag, value], key) => (
                                    <MenuItem key={key} value={value}>
                                        {tag}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {ASSIGNMENTS[assignment] !== ASSIGNMENTS.MeshParameterization && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="q-type">Dijkstra Queue</InputLabel>
                                <Select
                                    value={qType}
                                    onChange={this.handleQTypeChange}
                                    input={<Input name="q-type" id="q-type" />}
                                    autoWidth>
                                    {Object.entries(Q_TYPES).map(([value, tag], key) => (
                                        <MenuItem key={key} value={value}>
                                            {tag}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {ASSIGNMENTS[assignment] !== ASSIGNMENTS.MeshParameterization && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="vertex-selection">Vertex Selection</InputLabel>
                                <Select
                                    value={vertexSelection}
                                    onChange={this.handleVertexSelectionChange}
                                    input={<Input name="vertex-selection" id="vertex-selection" />}
                                    autoWidth>
                                    {Object.entries(VERTEX_SELECTIONS).map(([value, tag], key) => (
                                        <MenuItem key={key} value={value}>
                                            {tag}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {ASSIGNMENTS[assignment] === ASSIGNMENTS.MeshParameterization && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="boundary-shape">Boundary Shape</InputLabel>
                                <Select
                                    value={boundaryShape}
                                    onChange={this.handleBoundaryShapeChange}
                                    input={<Input name="boundary-shape" id="boundary-shape" />}
                                    autoWidth>
                                    {Object.entries(BOUNDARY_SHAPES).map(([value, tag], key) => (
                                        <MenuItem key={key} value={value}>
                                            {tag}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {ASSIGNMENTS[assignment] === ASSIGNMENTS.MeshParameterization && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="weight-approach">Weight Approach</InputLabel>
                                <Select
                                    value={weightApproach}
                                    onChange={this.handleWeightApproachChange}
                                    input={<Input name="weight-approach" id="weight-approach" />}
                                    autoWidth>
                                    {Object.entries(WEIGHT_APPROACHES).map(([value, tag], key) => (
                                        <MenuItem key={key} value={value}>
                                            {tag}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    {ASSIGNMENTS[assignment] === ASSIGNMENTS.MultiSeedBilateral && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="vertex-count"
                                    label="Vertex Count"
                                    value={vertexCount}
                                    onChange={this.handleVertexCountChange}
                                    type="number"
                                />
                            </FormControl>
                        </Grid>
                    )}
                    {ASSIGNMENTS[assignment] === ASSIGNMENTS.Geodesic && (
                        <Grid item>
                            <Button
                                className={classes.button}
                                color="secondary"
                                onClick={this.handleCreateMatrix}
                                variant="contained">
                                <SaveIcon className={classes.icon} />
                                Create Matrix
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(ModeChooser);
