import React from "react";
import { HiPlus, HiTrash } from "react-icons/hi";

interface LogicRule {
  fieldId: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: string;
}

interface ConditionalLogic {
  action: "show" | "hide";
  logic: "all" | "any";
  rules: LogicRule[];
}

interface Field {
  id?: string;
  type: string;
  label: string;
  order_index: number;
  options?: { label: string; value: string }[];
}

interface ConditionalLogicBuilderProps {
  value?: ConditionalLogic;
  onChange: (value: ConditionalLogic | undefined) => void;
  allFields: Field[];
  currentFieldIndex: number;
}

const ConditionalLogicBuilder: React.FC<ConditionalLogicBuilderProps> = ({
  value,
  onChange,
  allFields,
  currentFieldIndex,
}) => {
  // Only allow conditions based on previous fields
  const availableFields = allFields.filter(
    (f, index) =>
      index < currentFieldIndex &&
      ["text", "radio", "checkbox", "dropdown", "range"].includes(f.type)
  );

  if (availableFields.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Add fields above this one to use conditional logic.
      </div>
    );
  }

  const handleAddRule = () => {
    const newRule: LogicRule = {
      fieldId: availableFields[0].id || "", // This assumes fields have IDs, might need to use index or temp ID if not saved yet
      operator: "equals",
      value: "",
    };

    const newValue: ConditionalLogic = value || {
      action: "show",
      logic: "all",
      rules: [],
    };

    onChange({
      ...newValue,
      rules: [...newValue.rules, newRule],
    });
  };

  const handleRemoveRule = (index: number) => {
    if (!value) return;
    const newRules = value.rules.filter((_, i) => i !== index);
    if (newRules.length === 0) {
      onChange(undefined);
    } else {
      onChange({ ...value, rules: newRules });
    }
  };

  const handleUpdateRule = (index: number, updates: Partial<LogicRule>) => {
    if (!value) return;
    const newRules = [...value.rules];
    newRules[index] = { ...newRules[index], ...updates };
    onChange({ ...value, rules: newRules });
  };

  if (!value || value.rules.length === 0) {
    return (
      <button
        onClick={handleAddRule}
        className="text-sm text-skyblue hover:text-oxford font-medium flex items-center gap-1"
      >
        <HiPlus className="h-4 w-4" />
        Add Conditional Logic
      </button>
    );
  }

  return (
    <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 text-sm">
        <select
          value={value.action}
          onChange={(e) =>
            onChange({ ...value, action: e.target.value as "show" | "hide" })
          }
          className="border-gray-300 rounded text-sm py-1 px-2"
        >
          <option value="show">Show</option>
          <option value="hide">Hide</option>
        </select>
        <span>this field if</span>
        <select
          value={value.logic}
          onChange={(e) =>
            onChange({ ...value, logic: e.target.value as "all" | "any" })
          }
          className="border-gray-300 rounded text-sm py-1 px-2"
        >
          <option value="all">all</option>
          <option value="any">any</option>
        </select>
        <span>of the following match:</span>
      </div>

      <div className="space-y-2">
        {value.rules.map((rule, index) => {
          const field =
            availableFields.find((f) => f.id === rule.fieldId) ||
            availableFields[0];

          return (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <select
                  value={rule.fieldId}
                  onChange={(e) =>
                    handleUpdateRule(index, { fieldId: e.target.value })
                  }
                  className="w-full border-gray-300 rounded text-sm"
                >
                  {availableFields.map((f) => (
                    <option key={f.id || f.order_index} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <select
                    value={rule.operator}
                    onChange={(e) =>
                      handleUpdateRule(index, {
                        operator: e.target.value as any,
                      })
                    }
                    className="w-1/3 border-gray-300 rounded text-sm"
                  >
                    <option value="equals">equals</option>
                    <option value="not_equals">does not equal</option>
                    <option value="contains">contains</option>
                    <option value="greater_than">greater than</option>
                    <option value="less_than">less than</option>
                  </select>

                  {field?.options ? (
                    <select
                      value={rule.value}
                      onChange={(e) =>
                        handleUpdateRule(index, { value: e.target.value })
                      }
                      className="flex-1 border-gray-300 rounded text-sm"
                    >
                      <option value="">Select option</option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) =>
                        handleUpdateRule(index, { value: e.target.value })
                      }
                      className="flex-1 border-gray-300 rounded text-sm px-2 py-1"
                      placeholder="Value"
                    />
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveRule(index)}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <HiTrash className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleAddRule}
        className="text-xs text-skyblue hover:text-oxford font-medium flex items-center gap-1 mt-2"
      >
        <HiPlus className="h-3 w-3" />
        Add another rule
      </button>
    </div>
  );
};

export default ConditionalLogicBuilder;
