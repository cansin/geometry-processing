import PropTypes from "prop-types";
import React, { Component } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import { inject, observer } from "mobx-react";
import autobind from "autobind-decorator";
import { ASSIGNMENTS } from "../constants";
import Paper from "@material-ui/core/Paper";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { MODELS, Q_TYPES, VERTEX_SELECTIONS } from "../constants";

@inject("store")
@observer
class ModeChooser extends Component {
    static propTypes = {
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

    render() {
        const { assignment, model, qType, vertexSelection } = this.props.store;
        return (
            <Paper>
                <Box display="flex" alignItems="center">
                    <Box p={1}>
                        <FormControl>
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
                    </Box>
                    <Box p={1}>
                        <FormControl>
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
                    </Box>
                    <Box p={1}>
                        <FormControl style={{ minWidth: 110 }}>
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
                    </Box>
                    <Box p={1}>
                        <FormControl>
                            <InputLabel htmlFor="vertex-selection">Vertices</InputLabel>
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
                    </Box>
                </Box>
            </Paper>
        );
    }
}

export default ModeChooser;
