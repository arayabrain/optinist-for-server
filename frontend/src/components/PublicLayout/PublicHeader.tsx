import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'

const PublicHeader: FC = () => {
  return (
    <AppBar position="fixed">
      <Container>
        <Toolbar>
          <PublicNavMenu
            displayName="PUB STUDIO"
            navLink="/"
            sx={{ fontWeight: 600, fontSize: 22, mr: 2 }}
          />
          <PublicNavMenu displayName="Console" navLink="/console" />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

const PublicNavMenu: FC<{
  displayName: string
  navLink: string
  sx?: SxProps<Theme>
}> = ({ displayName, navLink, sx }) => {
  const navigate = useNavigate()
  const handleMenuClick = () => {
    navigate(navLink)
  }

  return (
    <Button key={displayName} onClick={handleMenuClick}>
      <Typography color="white" sx={sx}>
        {displayName}
      </Typography>
    </Button>
  )
}

export default PublicHeader
