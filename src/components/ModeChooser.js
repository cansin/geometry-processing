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
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/SaveAlt";
import TextField from "@material-ui/core/TextField";

import { ASSIGNMENTS, BOUNDARY_SHAPES, MOUTH_FIXATIONS, WEIGHT_APPROACHES } from "../constants";
import { MODELS, Q_TYPES, VERTEX_SELECTIONS } from "../constants";
import { populateGeodesicDistanceMatrix } from "../algorithms/geodesic_distance";

const styles = (theme) => ({
    button: {
        margin: theme.spacing(),
        minWidth: 110,
    },
    formControl: {
        margin: theme.spacing(),
        minWidth: 125,
    },
    formControlNullShape: {
        margin: theme.spacing(),
        minWidth: 270,
    },
    icon: {
        marginRight: theme.spacing(),
    },
});

export function downloadFile(content, filename) {
    const blob = new Blob([content], { type: "octet/stream" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = filename;

    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

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
    handleSourceVertexIndexChange(event) {
        this.props.store.setSourceVertexIndex(event.target.value);
    }

    @autobind
    handleTarget1VertexIndexChange(event) {
        this.props.store.setTarget1VertexIndex(event.target.value);
    }

    @autobind
    handleTarget2VertexIndexChange(event) {
        this.props.store.setTarget2VertexIndex(event.target.value);
    }

    @autobind
    handleIsMouthFixatedChange(event) {
        this.props.store.setIsMouthFixated(event.target.value);
    }

    @autobind
    handleSubmit() {
        this.props.store.submit();
    }

    @autobind
    handleDownloadBilateralDescriptor() {
        const { bilateralDescriptor, model } = this.props.store;

        const matrixDim = Math.max(
            Math.floor(bilateralDescriptor.length / 1000),
            bilateralDescriptor.length % 1000,
        );

        const matrix = new Array(matrixDim).fill(0);
        matrix.map((row, index) => {
            matrix[index] = new Array(matrixDim).fill(0);
        });

        bilateralDescriptor.filter(Boolean).forEach((datum) => {
            matrix[datum.x][datum.y] = datum.z;
        });

        const data = matrix.reduce(
            (acc, row) => `${acc}\n${row.reduce((acc, col) => `${acc} ${col}`, "")}`,
            "",
        );

        downloadFile(data, `${model.slice(0, -4)}_bilateral_descriptor.txt`);
    }

    @autobind
    handleDownloadFarthestPointIndices() {
        const { farthestPointIndices, model } = this.props.store;

        downloadFile(
            JSON.stringify(farthestPointIndices),
            `${model.slice(0, -4)}_farthest_point_indices.txt`,
        );
    }

    @autobind
    handleCreateMatrix() {
        const { model, graph, mesh, qType } = this.props.store;

        const { matrix } = populateGeodesicDistanceMatrix({
            geometry: mesh.geometry,
            graph,
            qType,
        });

        let data = "";
        matrix.forEach((row) => {
            data += Array.from(row.values()).join(" ") + "\n";
        });

        downloadFile(data, `${model.slice(0, -4)}_geodesic_matrix.txt`);
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
            isMouthFixated,
            sourceVertexIndexAtNullShape,
            target1VertexIndexAtNullShape,
            target2VertexIndexAtNullShape,
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
                        <>
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
                            <Grid item>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="vertex-selection">
                                        Vertex Selection
                                    </InputLabel>
                                    <Select
                                        value={vertexSelection}
                                        onChange={this.handleVertexSelectionChange}
                                        input={
                                            <Input name="vertex-selection" id="vertex-selection" />
                                        }
                                        autoWidth>
                                        {Object.entries(VERTEX_SELECTIONS).map(
                                            ([value, tag], key) => (
                                                <MenuItem key={key} value={value}>
                                                    {tag}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </>
                    )}
                    {ASSIGNMENTS[assignment] === ASSIGNMENTS.MeshParameterization && (
                        <>
                            <Grid item>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="boundary-shape">Boundary Shape</InputLabel>
                                    <Select
                                        value={boundaryShape}
                                        onChange={this.handleBoundaryShapeChange}
                                        input={<Input name="boundary-shape" id="boundary-shape" />}
                                        autoWidth>
                                        {Object.entries(BOUNDARY_SHAPES).map(
                                            ([value, tag], key) => (
                                                <MenuItem key={key} value={value}>
                                                    {tag}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="weight-approach">
                                        Weight Approach
                                    </InputLabel>
                                    <Select
                                        value={weightApproach}
                                        onChange={this.handleWeightApproachChange}
                                        input={
                                            <Input name="weight-approach" id="weight-approach" />
                                        }
                                        autoWidth>
                                        {Object.entries(WEIGHT_APPROACHES).map(
                                            ([value, tag], key) => (
                                                <MenuItem key={key} value={value}>
                                                    {tag}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="mouth-fixated">
                                        Is Mouth Fixated
                                    </InputLabel>
                                    <Select
                                        value={isMouthFixated}
                                        onChange={this.handleIsMouthFixatedChange}
                                        input={<Input name="mouth-fixated" id="mouth-fixated" />}
                                        autoWidth>
                                        {Object.entries(MOUTH_FIXATIONS).map(
                                            ([value, tag], key) => (
                                                <MenuItem key={key} value={value}>
                                                    {tag}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </>
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
                    {ASSIGNMENTS[assignment] === ASSIGNMENTS.Trilateral && (
                        <>
                            <Grid item>
                                <Button
                                    className={classes.button}
                                    color="secondary"
                                    onClick={this.handleDownloadBilateralDescriptor}
                                    variant="contained">
                                    <SaveIcon className={classes.icon} />
                                    Download Bilateral Descriptor
                                </Button>
                            </Grid>
                            <Grid item>
                                <FormControl className={classes.formControlNullShape}>
                                    <TextField
                                        id="sourceVertexIndexAtNullShape"
                                        label="Source Vertex Index at Null Shape"
                                        value={sourceVertexIndexAtNullShape}
                                        onChange={this.handleSourceVertexIndexChange}
                                        type="number"
                                    />
                                </FormControl>
                                <FormControl className={classes.formControlNullShape}>
                                    <TextField
                                        id="target1VertexIndexAtNullShape"
                                        label="1st Target Vertex Index at Null Shape"
                                        value={target1VertexIndexAtNullShape}
                                        onChange={this.handleTarget1VertexIndexChange}
                                        type="number"
                                    />
                                </FormControl>
                                <FormControl className={classes.formControlNullShape}>
                                    <TextField
                                        id="target2VertexIndexAtNullShape"
                                        label="2nd Target Vertex Index at Null Shape"
                                        value={target2VertexIndexAtNullShape}
                                        onChange={this.handleTarget2VertexIndexChange}
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                        </>
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
                    {ASSIGNMENTS[assignment] === ASSIGNMENTS.FarthestPoint && (
                        <Grid item>
                            <Button
                                className={classes.button}
                                color="secondary"
                                onClick={this.handleDownloadFarthestPointIndices}
                                variant="contained">
                                <SaveIcon className={classes.icon} />
                                Download Farthest Point Indices
                            </Button>
                        </Grid>
                    )}

                    <Grid item>
                        <Button
                            className={classes.button}
                            color="primary"
                            onClick={this.handleSubmit}
                            variant="contained">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(ModeChooser);
