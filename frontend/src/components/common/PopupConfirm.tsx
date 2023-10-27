import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

type ConfirmProps = {
  title: string
  open: boolean
  handleClose: () => void
  handleOk: () => void
}
const PopupConfirm = ({ title, open, handleClose, handleOk }: ConfirmProps) => {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleOk} autoFocus variant="contained">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PopupConfirm;
