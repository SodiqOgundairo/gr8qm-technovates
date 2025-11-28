import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { HiTrash, HiChevronUp, HiChevronDown, HiSave } from "react-icons/hi";
import ConditionalLogicBuilder from "../../components/forms/ConditionalLogicBuilder";

interface Field {
  id?: string;
  type: string;
  label: string;
  description?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
  conditional_logic?: {
    action: "show" | "hide";
    logic: "all" | "any";
    rules: {
      fieldId: string;
      operator:
        | "equals"
        | "not_equals"
        | "contains"
        | "greater_than"
        | "less_than";
      value: string;
    }[];
  };
  order_index: number;
  is_screener?: boolean;
  screener_logic?: {
    action: "disqualify";
    operator:
      | "equals"
      | "not_equals"
      | "contains"
      | "greater_than"
      | "less_than";
    value: string;
  };
}

interface FormData {
  title: string;
  description: string;
  status: "draft" | "published" | "closed";
}

const FIELD_TYPES = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "radio", label: "Multiple Choice (Single)" },
  { value: "checkbox", label: "Multiple Choice (Multiple)" },
  { value: "dropdown", label: "Dropdown" },
  { value: "range", label: "Scale/Range" },
  { value: "date", label: "Date" },
];

const generateShortCode = async (): Promise<string> => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const { data } = await supabase
      .from("forms")
      .select("id")
      .eq("short_code", code)
      .maybeSingle();

    if (!data) {
      return code;
    }
    attempts++;
  }
  return Date.now().toString(36).slice(-6);
};

const FormBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "draft",
  });
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data: form, error: formError } = await supabase
        .from("forms")
        .select("*")
        .eq("id", id)
        .single();

      if (formError) throw formError;

      setFormData({
        title: form.title,
        description: form.description || "",
        status: form.status,
      });

      const { data: formFields, error: fieldsError } = await supabase
        .from("form_fields")
        .select("*")
        .eq("form_id", id)
        .order("order_index");

      if (fieldsError) throw fieldsError;

      setFields(formFields || []);
    } catch (error) {
      console.error("Error fetching form:", error);
      alert("Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (publish = false) => {
    if (!formData.title.trim()) {
      alert("Please enter a form title");
      return;
    }

    setSaving(true);
    try {
      let formId = id;
      let shortCode = null;

      if (publish) {
        shortCode = await generateShortCode();
      }

      if (isEditMode) {
        // Update existing form
        const updateData: any = {
          title: formData.title,
          description: formData.description,
          status: publish ? "published" : formData.status,
        };

        if (publish && shortCode) {
          // Only set short_code if it doesn't exist?
          // Usually we want to keep the existing one if it exists.
          // Let's check if we already have one in fetchForm, but for now let's assume we might need to generate one if it's null.
          // Actually, simpler to just update it if we are publishing.
          // But wait, if it's already published, we shouldn't change the short code.
          // Let's check existing form data first.
          const { data: existingForm } = await supabase
            .from("forms")
            .select("short_code")
            .eq("id", id)
            .single();
          if (!existingForm?.short_code) {
            updateData.short_code = shortCode;
          }
        }

        const { error: updateError } = await supabase
          .from("forms")
          .update(updateData)
          .eq("id", id);

        if (updateError) throw updateError;
      } else {
        // Create new form
        const insertData: any = {
          title: formData.title,
          description: formData.description,
          status: publish ? "published" : "draft",
        };

        if (publish) {
          insertData.short_code = shortCode;
        }

        const { data: newForm, error: createError } = await supabase
          .from("forms")
          .insert(insertData)
          .select()
          .single();

        if (createError) throw createError;
        formId = newForm.id;
      }

      // Delete existing fields and recreate
      if (isEditMode) {
        await supabase.from("form_fields").delete().eq("form_id", id);
      }

      // Insert fields
      if (fields.length > 0) {
        const fieldsToInsert = fields.map((field, index) => ({
          form_id: formId,
          type: field.type,
          label: field.label,
          description: field.description,
          placeholder: field.placeholder,
          options: field.options,
          validation: field.validation,
          conditional_logic: field.conditional_logic,
          is_screener: field.is_screener || false,
          order_index: index,
        }));

        const { error: fieldsError } = await supabase
          .from("form_fields")
          .insert(fieldsToInsert);

        if (fieldsError) throw fieldsError;
      }

      alert(
        publish ? "Form published successfully!" : "Form saved successfully!"
      );
      navigate("/admin/forms");
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const addField = (type: string) => {
    const newField: Field = {
      type,
      label: `${FIELD_TYPES.find((t) => t.value === type)?.label || "Field"} ${
        fields.length + 1
      }`,
      order_index: fields.length,
      validation: { required: false },
    };

    if (["radio", "checkbox", "dropdown"].includes(type)) {
      newField.options = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ];
    }

    setFields([...fields, newField]);
    setSelectedField(fields.length);
  };

  const updateField = (index: number, updates: Partial<Field>) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...updates };
    setFields(updated);
  };

  const deleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
    setSelectedField(null);
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newFields = [...fields];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= fields.length) return;

    [newFields[index], newFields[newIndex]] = [
      newFields[newIndex],
      newFields[index],
    ];
    newFields.forEach((field, i) => {
      field.order_index = i;
    });

    setFields(newFields);
    setSelectedField(newIndex);
  };

  const addOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const options = field.options || [];
    updateField(fieldIndex, {
      options: [
        ...options,
        {
          label: `Option ${options.length + 1}`,
          value: `option${options.length + 1}`,
        },
      ],
    });
  };

  const updateOption = (
    fieldIndex: number,
    optionIndex: number,
    label: string
  ) => {
    const field = fields[fieldIndex];
    const options = [...(field.options || [])];
    options[optionIndex] = {
      ...options[optionIndex],
      label,
      value: label.toLowerCase().replace(/\s+/g, "_"),
    };
    updateField(fieldIndex, { options });
  };

  const deleteOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    const options = field.options || [];
    updateField(fieldIndex, {
      options: options.filter((_, i) => i !== optionIndex),
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading form...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-100px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-oxford">
            {isEditMode ? "Edit Form" : "Create New Form"}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="sec"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              Save Draft
            </Button>
            <Button
              variant="pry"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <HiSave />
              Publish Form
            </Button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Left Panel - Field Types */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-4">Form Fields</h3>
            <div className="space-y-2">
              {FIELD_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => addField(type.value)}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 text-sm text-gray-700 transition-colors"
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Form Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Input
                  labelText="Form Title"
                  showLabel
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter form title"
                  className="mb-4"
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter form description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue/50"
                  />
                </div>
              </div>

              {/* Fields List */}
              {fields.map((field, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedField(index)}
                  className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all ${
                    selectedField === index
                      ? "ring-2 ring-skyblue"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <label className="block font-medium text-gray-900">
                        {field.label}
                        {field.validation?.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {field.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {field.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveField(index, "up");
                        }}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <HiChevronUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveField(index, "down");
                        }}
                        disabled={index === fields.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <HiChevronDown className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteField(index);
                        }}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <HiTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Field Preview */}
                  <div className="pointer-events-none opacity-60">
                    {field.type === "text" && (
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 border rounded-lg"
                        disabled
                      />
                    )}
                    {field.type === "textarea" && (
                      <textarea
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg"
                        disabled
                      />
                    )}
                    {(field.type === "radio" || field.type === "checkbox") && (
                      <div className="space-y-2">
                        {field.options?.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type={field.type}
                              disabled
                              className="text-skyblue"
                            />
                            <span className="text-gray-700">{opt.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {field.type === "dropdown" && (
                      <select
                        className="w-full px-4 py-2 border rounded-lg"
                        disabled
                      >
                        <option>Select an option</option>
                        {field.options?.map((opt, i) => (
                          <option key={i}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                    {field.type === "range" && (
                      <input type="range" className="w-full" disabled />
                    )}
                    {field.type === "date" && (
                      <input
                        type="date"
                        className="w-full px-4 py-2 border rounded-lg"
                        disabled
                      />
                    )}
                  </div>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <p>Click a field type on the left to add it to your form</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Field Settings */}
          <div className="w-80 bg-white rounded-lg shadow-sm p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-700 mb-4">Field Settings</h3>
            {selectedField !== null && fields[selectedField] ? (
              <div className="space-y-4">
                <Input
                  labelText="Label"
                  showLabel
                  value={fields[selectedField].label}
                  onChange={(e) =>
                    updateField(selectedField, { label: e.target.value })
                  }
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={fields[selectedField].description || ""}
                    onChange={(e) =>
                      updateField(selectedField, {
                        description: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-skyblue/50"
                  />
                </div>

                <Input
                  labelText="Placeholder"
                  showLabel
                  value={fields[selectedField].placeholder || ""}
                  onChange={(e) =>
                    updateField(selectedField, { placeholder: e.target.value })
                  }
                />

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="required"
                    checked={
                      fields[selectedField].validation?.required || false
                    }
                    onChange={(e) =>
                      updateField(selectedField, {
                        validation: {
                          ...fields[selectedField].validation,
                          required: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-skyblue focus:ring-skyblue"
                  />
                  <label htmlFor="required" className="text-sm text-gray-700">
                    Required Field
                  </label>
                </div>

                {/* Options Editor for Choice Fields */}
                {["radio", "checkbox", "dropdown"].includes(
                  fields[selectedField].type
                ) && (
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    <div className="space-y-2">
                      {fields[selectedField].options?.map((option, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) =>
                              updateOption(selectedField, idx, e.target.value)
                            }
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => deleteOption(selectedField, idx)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(selectedField)}
                        className="text-sm text-skyblue hover:text-oxford font-medium"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                )}

                {/* Range Settings */}
                {fields[selectedField].type === "range" && (
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        labelText="Min Value"
                        showLabel
                        type="number"
                        value={fields[selectedField].validation?.min || 0}
                        onChange={(e) =>
                          updateField(selectedField, {
                            validation: {
                              ...fields[selectedField].validation,
                              min: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                      <Input
                        labelText="Max Value"
                        showLabel
                        type="number"
                        value={fields[selectedField].validation?.max || 10}
                        onChange={(e) =>
                          updateField(selectedField, {
                            validation: {
                              ...fields[selectedField].validation,
                              max: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Logic */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conditional Logic
                  </label>
                  <ConditionalLogicBuilder
                    value={fields[selectedField].conditional_logic}
                    onChange={(logic) =>
                      updateField(selectedField, { conditional_logic: logic })
                    }
                    allFields={fields}
                    currentFieldIndex={selectedField}
                  />
                </div>

                {/* Screener Settings */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="is_screener"
                      checked={fields[selectedField].is_screener || false}
                      onChange={(e) =>
                        updateField(selectedField, {
                          is_screener: e.target.checked,
                        })
                      }
                      className="rounded text-skyblue focus:ring-skyblue"
                    />
                    <label
                      htmlFor="is_screener"
                      className="text-sm font-medium text-gray-700"
                    >
                      Screener Question
                    </label>
                  </div>

                  {fields[selectedField].is_screener && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 space-y-3">
                      <p className="text-xs text-red-600 font-medium">
                        Disqualify respondents who match this rule:
                      </p>
                      <div className="flex gap-2">
                        <select
                          value={
                            fields[selectedField].screener_logic?.operator ||
                            "equals"
                          }
                          onChange={(e) =>
                            updateField(selectedField, {
                              screener_logic: {
                                action: "disqualify",
                                operator: e.target.value as any,
                                value:
                                  fields[selectedField].screener_logic?.value ||
                                  "",
                              },
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
                        {fields[selectedField].options ? (
                          <select
                            value={
                              fields[selectedField].screener_logic?.value || ""
                            }
                            onChange={(e) =>
                              updateField(selectedField, {
                                screener_logic: {
                                  action: "disqualify",
                                  operator:
                                    fields[selectedField].screener_logic
                                      ?.operator || "equals",
                                  value: e.target.value,
                                },
                              })
                            }
                            className="flex-1 border-gray-300 rounded text-sm"
                          >
                            <option value="">Select option</option>
                            {fields[selectedField].options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={
                              fields[selectedField].screener_logic?.value || ""
                            }
                            onChange={(e) =>
                              updateField(selectedField, {
                                screener_logic: {
                                  action: "disqualify",
                                  operator:
                                    fields[selectedField].screener_logic
                                      ?.operator || "equals",
                                  value: e.target.value,
                                },
                              })
                            }
                            placeholder="Value"
                            className="flex-1 border-gray-300 rounded text-sm px-2 py-1"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Select a field to edit its settings
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FormBuilder;
