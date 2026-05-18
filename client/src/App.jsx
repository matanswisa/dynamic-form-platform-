import './App.css'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DynamicForm } from './components/DynamicForm'
import SubmissionsStack from './components/SubmissionsStack';
import formSchemas from "./schema/formSchema.json";
import { useEffect, useState } from 'react';

function getInitialFormIndex() {
  const params = new URLSearchParams(window.location.search);
  const formParam = params.get('form');

  if (!formParam) {
    return 0;
  }

  const numericIndex = Number(formParam);
  if (Number.isInteger(numericIndex) && numericIndex >= 0 && numericIndex < formSchemas.length) {
    return numericIndex;
  }

  const matchedIndex = formSchemas.findIndex(
    (form) => form.formName.toLowerCase() === formParam.toLowerCase(),
  );

  return matchedIndex >= 0 ? matchedIndex : 0;
}

export default function App() {
  const [selectedFormIndex, setSelectedFormIndex] = useState(getInitialFormIndex);

  const handleChange = (event) => {
    setSelectedFormIndex(event.target.value);
  };

  const selectedForm = formSchemas[selectedFormIndex];
  const totalFields = formSchemas.reduce((total, form) => total + form.fields.length, 0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('form', String(selectedFormIndex));
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [selectedFormIndex]);

  return (
    <main className="app-shell">
      <section className="app-container">
        <header className="hero">
          <p className="eyebrow">Schema driven forms</p>
          <h1 className="hero-title">Dynamic Form Platform</h1>
          <p className="hero-copy">
            Choose a form template, render validated fields from JSON schema, and persist submissions through a FastAPI backend.
          </p>
        </header>

        <section className="stats-grid" aria-label="Application summary">
          <div className="stat-card">
            <span className="stat-label">Form templates</span>
            <span className="stat-value">{formSchemas.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Schema fields</span>
            <span className="stat-value">{totalFields}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Current form</span>
            <span className="stat-value">{selectedForm.formName}</span>
          </div>
        </section>

        <section className="workspace">
          <Box className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Form builder</h2>
              <span className="panel-hint">Formik + Yup validation</span>
            </div>
            <div className="panel-body">
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Form</InputLabel>
                <Select
                  value={selectedFormIndex}
                  label="Select Form"
                  onChange={handleChange}
                >
                  {formSchemas.map((form, index) => (
                    <MenuItem key={form.formName} value={index}>
                      {form.formName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DynamicForm schema={selectedForm} />
            </div>
          </Box>

          <Box className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Recent submissions</h2>
              <span className="panel-hint">Loaded from API</span>
            </div>
            <SubmissionsStack />
          </Box>
        </section>
      </section>
    </main>
  );
}
