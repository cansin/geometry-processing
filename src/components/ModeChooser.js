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
        const { assignment, model } = this.props.store;
        return (
            <form autoComplete="off">
                <FormControl>
                    <InputLabel htmlFor="assignment">Assignment</InputLabel>
                    <Select
                        value={assignment}
                        onChange={this.handleAssignmentChange}
                        input={<Input name="assignment" id="assignment" />}
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
            </form>
        );
    }
}

export default ModeChooser;
