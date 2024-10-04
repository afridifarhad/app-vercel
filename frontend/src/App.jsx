import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, Paper, Grid,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = "https://smit-node-vercel.vercel.app/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  async function fetchUsers() {
    const response = await axios.get(API_URL);
    const content = response.data;
    setUsers(content.data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = () => {
    axios
      .post(API_URL, { name: newUser.name, email: newUser.email })
      .then((response) => {
        setUsers([...users, response.data]);
        setNewUser({ name: '', email: '' });
        fetchUsers();
      })
      .catch((err) => console.error(err));
  };

  const handleUpdateClick = (user) => {
    setUpdateUser(user);
    setUpdateDialogOpen(true);
  };

  const updateUserById = (id) => {
    axios
      .put(`${API_URL}/${id}`, { name: updateUser.name, email: updateUser.email })
      .then((response) => {
        setUsers(users.map((user) => (user.id === id ? response.data : user)));
        setUpdateUser({ id: '', name: '', email: '' });
        setUpdateDialogOpen(false);
        fetchUsers();
      })
      .catch((err) => console.error(err));
  };

  const handleUpdateConfirm = () => {
    updateUserById(updateUser.id);
  };

  const handleUpdateCancel = () => {
    setUpdateDialogOpen(false);
    setUpdateUser({ id: '', name: '', email: '' });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDialogOpen(true);
  };

  const deleteUserById = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
        setDialogOpen(false);
        setUserToDelete(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteConfirm = () => {
    deleteUserById(userToDelete.id);
  };

  const handleDeleteCancel = () => {
    setDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        CRUD Operations with Express & React
      </Typography>

      <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Enter new user name"
              variant="outlined"
              size="small" // Smaller input size
              fullWidth
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Enter new user email"
              variant="outlined"
              size="small" // Smaller input size
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          size="small" // Smaller button size
          onClick={addUser}
          fullWidth
          style={{ marginTop: '16px' }}
        >
          Add User
        </Button>
      </Paper>

      {/* Update User */}
      {updateUser.id && (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Update user name"
                variant="outlined"
                size="small" // Smaller input size
                fullWidth
                value={updateUser.name}
                onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Update user email"
                variant="outlined"
                size="small" // Smaller input size
                fullWidth
                value={updateUser.email}
                onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="secondary"
            size="small" // Smaller button size
            onClick={() => handleUpdateClick(updateUser)}
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Update User
          </Button>
        </Paper>
      )}

      {/* User List */}
      <Typography variant="h6" gutterBottom>
        User List
      </Typography>

      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
            divider
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  size="small" // Smaller icon button
                  onClick={() => setUpdateUser({ id: user.id, name: user.name, email: user.email })}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  size="small" // Smaller icon button
                  onClick={() => handleDeleteClick(user)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={user.name}
              secondary={user.email}
            />
          </ListItem>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {userToDelete?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary" size="small">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" size="small" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={handleUpdateCancel}
        aria-labelledby="alert-update-title"
        aria-describedby="alert-update-description"
      >
        <DialogTitle id="alert-update-title">{"Confirm Update"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-update-description">
            Are you sure you want to update the user to name: {updateUser.name} and email: {updateUser.email}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateCancel} color="primary" size="small">
            Cancel
          </Button>
          <Button onClick={handleUpdateConfirm} color="secondary" size="small" autoFocus>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
