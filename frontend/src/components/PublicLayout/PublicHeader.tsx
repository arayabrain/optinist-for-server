import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'

const PublicHeader: FC = () => {
  return (
    <AppBar position="fixed">
      <Container>
        <Toolbar>
          <Typography sx={{ fontWeight: 600, fontSize: 22, mr: 2 }}>
            PUB STUDIO
          </Typography>
          <PublicNavMenu displayName="Home" navLink="/" />
          <PublicNavMenu displayName="Console" navLink="/console" />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

const PublicNavMenu: FC<{
  displayName: string
  navLink: string
}> = ({ displayName, navLink }) => {
  const navigate = useNavigate()
  const handleMenuClick = () => {
    navigate(navLink)
  }

  return (
    <Button key={displayName} onClick={handleMenuClick}>
      <Typography color="white">{displayName}</Typography>
    </Button>
  )
}

export default PublicHeader
