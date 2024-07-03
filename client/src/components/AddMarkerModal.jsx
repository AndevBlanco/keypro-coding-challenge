import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const AddMarkerModal = ({ open, handleClose, handleSave, point, setPoint }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPoint({ ...point, [name]: value });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Add Point Information
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={point.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={point.description}
          onChange={handleChange}
        />
        <Button onClick={handleSave} variant="contained" sx={{ mt: 2 }}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default AddMarkerModal;
