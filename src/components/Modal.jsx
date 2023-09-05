import * as React from 'react';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const defStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({children, handleClose, open, style}) {
  return (
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style ? style : defStyle}>
      		{children}
        </Box>
      </Modal>
  );
}
