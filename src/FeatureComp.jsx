import React, { useEffect, useState } from "react";
import { DNDComp } from "./DNDComp";
import { Inputs } from "./Inputs";
import "./custom.css";

export const FeatureComp = () => {
    const defaultValue = {
        ruleName: "",
        version: "1.0.0",
        description: "",
        ruleDimension: "",
        inputs: [{ id: "input1", name: "", type: "" }],
        sqlQuery: "",
        droppedItems: [null, null],
        querySelectValue: "",
    };
    const [ruleData, setRuleData] = useState(defaultValue);

    const [formHistory, setFormHistory] = useState([]);

    const handleInputChange = (id, property, value) => {
        if (id) {
            setRuleData((prevData) => ({
                ...prevData,
                inputs: prevData.inputs.map((input) =>
                    input.id === id ? { ...input, [property]: value } : input
                ),
            }));
        } else {
            setRuleData((prevData) => ({
                ...prevData,
                [property]: value,
            }));
        }
    };

    const handleAddInput = (e) => {
        e.preventDefault();
        const newId = `input${ruleData.inputs.length + 1}`;
        setRuleData((prevData) => ({
            ...prevData,
            inputs: [...prevData.inputs, { id: newId, name: "", type: "" }],
        }));
    };

    const handleDeleteInput = (id) => {
        const updatedInputs = ruleData.inputs.filter((input) => input.id !== id);
        setRuleData({
            ...ruleData,
            inputs: updatedInputs,
        });
    };

    const handleQuerySelectChange = (e) => {
        setRuleData((prevData) => ({
            ...prevData,
            querySelectValue: e.target.value,
        }));
    };

    const handleDrop = (index, item) => {
        const { name, type } = item;
        setRuleData((prevData) => {
            const newDroppedItems = [...prevData.droppedItems];
            newDroppedItems[index] = { name, type };
            return { ...prevData, droppedItems: newDroppedItems };
        });
    };

    const isAllInputsFilled = ruleData.inputs.every(
        (input) => input.name.trim() !== "" && input.type.trim() !== ""
    );
    const isMultipleInputs = ruleData.inputs.length > 1;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("formHistory", formHistory.length);
        if (formHistory.length === 0) {
            setFormHistory([...formHistory, { ...ruleData }]);
        } else {
            const newVersion = incrementVersion(
                formHistory[formHistory.length - 1].version
            );
            setFormHistory([...formHistory, { ...ruleData, version: newVersion }]);
            setRuleData({
                ...ruleData,
                version: newVersion,
            });
        }
    };

    useEffect(() => {
        const sqlQuery = `${ruleData.droppedItems[0] && ruleData.droppedItems[0].name
            ? `${ruleData.droppedItems[0].name}`
            : ""
            } 
        ${ruleData.querySelectValue ? `${ruleData.querySelectValue}` : ""} 
        ${ruleData.droppedItems[1] && ruleData.droppedItems[1].name
                ? `${ruleData.droppedItems[1].name}`
                : ""
            }`;
        setRuleData((prevData) => ({
            ...prevData,
            sqlQuery: sqlQuery.replace(/\n        /g, ""),
        }));
    }, [ruleData.droppedItems, ruleData.querySelectValue]);

    const retrieveFormData = (version) => {
        const formData = formHistory.find((data) => data.version === version);
        if (formData) {
            setRuleData(formData);
        }
    };

    const incrementVersion = (version) => {
        const [major, minor, patch] = version.split(".").map(Number);
        const newPatch = patch + 1;
        return `${major}.${minor}.${newPatch}`;
    };

    const editCurrentObj = () => {
        const formHist = formHistory?.map(el => el.version === ruleData.version?   ruleData : el)
        setFormHistory(formHist)
    };

    const isFormComplete =
        ruleData.ruleName.trim() !== "" &&
        ruleData.version.trim() !== "" &&
        ruleData.description.trim() !== "" &&
        ruleData.ruleDimension.trim() !== "" &&
        ruleData.inputs.every(
            (input) => input.name.trim() !== "" && input.type.trim() !== ""
        ) &&
        ruleData.droppedItems.every((item) => item !== null) &&
        ruleData.querySelectValue.trim() !== "";
    console.log("formHistory", formHistory);

    return (
        <div>
            <div style={{ display: "flex" }}>
                <form onSubmit={handleSubmit} className="form-container">
                    <div>
                        <input
                            type="text"
                            placeholder="Rule Name:"
                            value={ruleData.ruleName}
                            onChange={(e) =>
                                handleInputChange(null, "ruleName", e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label>Version:</label>
                        <select
                            value={ruleData?.version}
                            onChange={(e) => retrieveFormData(e.target.value)}
                        >
                            {formHistory.length ? (
                                formHistory.map(({ version }) => (
                                    <option key={version} value={version ?? "1.0.0"}>
                                        {version ?? "1.0.0"}
                                    </option>
                                ))
                            ) : (
                                <option key={ruleData?.version} value={ruleData?.version}>
                                    {ruleData?.version}
                                </option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
                            type="text"
                            placeholder="Description"
                            value={ruleData.description}
                            onChange={(e) =>
                                handleInputChange(null, "description", e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label>Rule Dimension:</label>
                        <select
                            value={ruleData.ruleDimension}
                            onChange={(e) =>
                                handleInputChange(null, "ruleDimension", e.target.value)
                            }
                        >
                            <option value="">Select Rule Dimension</option>
                            <option value="Accuracy">Accuracy</option>
                            <option value="Completenes">Completeness</option>
                        </select>
                    </div>
                    {ruleData.inputs.map(({ id, name, type }) => (
                        <Inputs
                            key={id}
                            id={id}
                            name={name}
                            type={type}
                            handleInputChange={handleInputChange}
                            handleAddInput={handleAddInput}
                            handleDeleteInput={() => handleDeleteInput(id)}
                        />
                    ))}
                    <button type="button" onClick={editCurrentObj}>
                        Edit
                    </button>
                    <button
                        type={!isFormComplete ? "button" : "submit"}
                        disabled={!isFormComplete}
                    >
                        Submit
                    </button>
                    <button
                        type="reset"
                        onClick={() => {
                            setRuleData(defaultValue);
                            setFormHistory([]);
                        }}
                    >
                        Reset
                    </button>
                </form>

                <div>
                    <div style={{ display: "flex" }}>
                        <div style={{ overflow: "hidden", clear: "both" }}>
                            <DNDComp
                                accept="InputEle"
                                lastDroppedItem={ruleData.droppedItems[0]}
                                onDrop={(item) =>
                                    isMultipleInputs && isAllInputsFilled
                                        ? handleDrop(0, item)
                                        : null
                                }
                                customActive={isMultipleInputs && isAllInputsFilled}
                            />
                        </div>
                        <select
                            value={ruleData.querySelectValue}
                            onChange={handleQuerySelectChange}
                        >
                            <option value="">Query Select</option>
                            <option value="=">=</option>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value="!=">!=</option>
                        </select>
                        <div style={{ overflow: "hidden", clear: "both" }}>
                            <DNDComp
                                accept="InputEle"
                                lastDroppedItem={ruleData.droppedItems[1]}
                                onDrop={(item) =>
                                    isMultipleInputs && isAllInputsFilled
                                        ? handleDrop(1, item)
                                        : null
                                }
                                customActive={isMultipleInputs && isAllInputsFilled}
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            border: "1px solid",
                            width: "20rem",
                            height: "10rem",
                            marginTop: "1rem",
                        }}
                    >
                        {ruleData?.sqlQuery}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureComp;
