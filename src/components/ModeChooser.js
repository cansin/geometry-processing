import PropTypes from "prop-types";
import React, { Component } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { ASSIGNMENTS, MODELS } from "./Store";
import Paper from "@material-ui/core/Paper";
import { unstable_Box as Box } from "@material-ui/core/Box";

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

    render() {
        const { assignment, model, timing } = this.props.store;
        return (
            <Paper>
                <Box display="flex" alignItems="center">
                    <Box p={1}>
                        <FormControl>
                            <InputLabel htmlFor="assignment">
                                Assignment
                            </InputLabel>
                            <Select
                                value={assignment}
                                onChange={this.handleAssignmentChange}
                                input={
                                    <Input name="assignment" id="assignment" />
                                }
                                autoWidth>
                                {Object.entries(ASSIGNMENTS).map(
                                    ([value, tag], key) => (
                                        <MenuItem key={key} value={value}>
                                            {tag}
                                        </MenuItem>
                                    ),
                                )}
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
                                {Object.entries(MODELS[assignment]).map(
                                    ([tag, value], key) => (
                                        <MenuItem key={key} value={value}>
                                            {tag}
                                        </MenuItem>
                                    ),
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box p={1}>
                        {timing !== undefined
                            ? `The operation took ${timing}ms.`
                            : "Loading..."}
                    </Box>
                </Box>
            </Paper>
        );
    }
}

export default ModeChooser;
