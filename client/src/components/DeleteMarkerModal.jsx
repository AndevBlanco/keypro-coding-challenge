import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const DeleteMarkerModal = ({ open, handleClose, markerId, handleDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/markers/${markerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Marker deleted:", data);
      handleDeleteSuccess(markerId);
      handleClose();
    } catch (error) {
      console.error("Error deleting marker:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Confirm Deletion
        </Typography>
        <Typography variant="body1" component="p" sx={{ mt: 2 }}>
          Are you sure you want to delete this marker?
        </Typography>
        <Button onClick={handleDelete} variant="contained" color="error" sx={{ mt: 2, mr: 2 }}>
          Delete
        </Button>
        <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default DeleteMarkerModal;
