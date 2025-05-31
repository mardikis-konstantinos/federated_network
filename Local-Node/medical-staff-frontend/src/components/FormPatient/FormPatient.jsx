import React from "react"
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material"

export default function FormPatient({ values, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target

    onChange({ ...values, [name]: value })
  }

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
        justifyContent: "flex-start",
      }}
    >
      <TextField
        label="First Name"
        name="firstName"
        value={values.firstName}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Last Name"
        name="lastName"
        value={values.lastName}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        fullWidth
      />

      <FormControl component="fieldset">
        <FormLabel component="legend">Consent</FormLabel>
        <RadioGroup
          row
          name="consent"
          value={values.consent}
          onChange={handleChange}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
    </Box>
  )
}
