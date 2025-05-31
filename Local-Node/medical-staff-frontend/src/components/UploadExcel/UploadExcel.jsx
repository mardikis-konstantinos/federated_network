import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Box, Typography } from "@mui/material"

export default function UploadExcel({ onFileAccepted }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file && onFileAccepted) {
        onFileAccepted(file)
      }
    },
    [onFileAccepted]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
          ".xls",
        ],
      },
    })

  return (
    <Box
      {...getRootProps()}
      sx={{
        flex: 1,
        border: "2px dashed",
        borderColor: isDragActive
          ? "primary.main"
          : isDragReject
          ? "error.main"
          : "grey.400",
        borderRadius: 2,
        bgcolor: isDragActive ? "action.hover" : "transparent",
        p: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "border-color 0.2s, background-color 0.2s",
        "&:hover": { backgroundColor: "action.hover" },
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography>Drop the file here …</Typography>
      ) : (
        <Typography>
          Drag & drop an Excel file here, or click to select
        </Typography>
      )}
    </Box>
  )
}
