import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import WebIcon from '@mui/icons-material/Web';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AnalyticsIcon from '@mui/icons-material/Analytics'
import { DRAWER_WIDTH } from 'const/Layout'
import { Box } from '@mui/material'

const LeftMenu: FC<{ open: boolean; handleDrawerClose: () => void }> = ({
  open,
  handleDrawerClose,
}) => {
  const navigate = useNavigate()

  const onClickDashboard = () => {
    handleDrawerClose()
    navigate('/console')
  }

  const onClickDatabase = () => {
    handleDrawerClose()
    navigate('/console/experiments')
  }

  const onClickWorkspaces = () => {
    handleDrawerClose()
    navigate('/console/workspaces')
  }

  const onClickAccountManager = () => {
    handleDrawerClose()
    navigate('/console/account-manager?limit=50&offset=0')
  }

  const onClickOpenSite = () => {
    handleDrawerClose()
    navigate('/')
  }

  return (
    <>
      <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
        <Box sx={{ width: DRAWER_WIDTH }}>
          <List>
            <ListItem key="dashboard" disablePadding>
              <ListItemButton onClick={onClickDashboard}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem key="database" disablePadding>
              <ListItemButton onClick={onClickDatabase}>
                <ListItemIcon>
                  <StorageIcon />
                </ListItemIcon>
                <ListItemText primary="Database" />
              </ListItemButton>
            </ListItem>
            <ListItem key="workspaces" disablePadding>
              <ListItemButton onClick={onClickWorkspaces}>
                <ListItemIcon>
                  <AnalyticsIcon />
                </ListItemIcon>
                <ListItemText primary="Workspaces" />
              </ListItemButton>
            </ListItem>
            <ListItem key="account-manager" disablePadding>
              <ListItemButton onClick={onClickAccountManager}>
                <ListItemIcon>
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText primary="Account Manager" />
              </ListItemButton>
            </ListItem>
            <ListItem key="site" disablePadding>
              <ListItemButton onClick={onClickOpenSite}>
                <ListItemIcon>
                  <WebIcon />
                </ListItemIcon>
                <ListItemText primary="Open Site" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default LeftMenu
