import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import { submitForm } from '../services/api';
import { Snackbar, Alert } from '@mui/material';

export function DynamicForm({ schema }) {
  const { fields, formName } = schema;


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });


  const initialValues = {};
  fields.forEach(field => {
    initialValues[field.name] = '';
  });


  //Yup validation schema
  const validationSchema = Yup.object(
    fields.reduce((acc, field) => {
      let validator = null;

      if (field.type === 'email') {
        validator = Yup.string().email('Invalid email');
      } else if (field.type === 'number') {
        validator = Yup.number()
          .typeError('Must be a number')
          .nullable();
        if (field.min !== undefined) {
          validator = validator.min(field.min, `Minimum value is ${field.min}`);
        }
      } else {
        validator = Yup.string();
        if (field.minLength) {
          validator = validator.min(field.minLength, `Minimum ${field.minLength} characters`);
        }
      }

      if (field.required) {
        validator = validator.required('Required');
      }

      acc[field.name] = validator;
      return acc;
    }, {})
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await submitForm({ ...values, form_type: formName });
        setSnackbar({ open: true, message: response.message, severity: 'success' });
        resetForm();
      } catch (error) {
        const errMsg = error.response?.data?.detail || 'Unable to submit form';
        console.error(errMsg);
        setSnackbar({ open: true, message: errMsg, severity: 'error' });
      }
    },
  });


  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary">Selected template</Typography>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>{formName || 'Dynamic Form'}</Typography>
        </Box>
        <Chip label={`${fields.length} fields`} color="primary" variant="outlined" />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {fields ? fields.map((field) => (
            <Grid item xs={12} key={field.name}>
              {field.type === 'dropdown' ? (
                <TextField
                  fullWidth
                  select
                  id={field.name}
                  name={field.name}
                  label={field.label}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                  helperText={formik.touched[field.name] && formik.errors[field.name]}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  id={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                  helperText={formik.touched[field.name] && formik.errors[field.name]}
                />
              )}
            </Grid>
          )) : null}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary" type="submit" size="large">
            Submit
          </Button>
          <Button variant="outlined" type="button" size="large" onClick={() => formik.resetForm()}>
            Reset
          </Button>
        </Box>
      </form>
    </Box>
  );
}
