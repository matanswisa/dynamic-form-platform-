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
import { useState } from 'react';

export default function App() {
  const [selectedFormIndex, setSelectedFormIndex] = useState(0);

  const handleChange = (event) => {
    setSelectedFormIndex(event.target.value);
  };

  const selectedForm = formSchemas[selectedFormIndex];
  const totalFields = formSchemas.reduce((total, form) => total + form.fields.length, 0);

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
