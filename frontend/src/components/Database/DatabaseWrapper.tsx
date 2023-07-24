import { Box, Button, styled } from '@mui/material'
import { FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DatabaseWrapper: FC = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const handleClickExperiments = () => {
    navigate('/console/experiments?sort=&sort=&limit=50&offset=0')
  }
  const handleClickCells = () => {
    navigate('/console/cells?sort=&sort=&limit=50&offset=0')
  }

  return (
    <Box
      sx={{
        paddingTop: 2,
        paddingBottom: 5,
      }}
    >
      <Box>
        <Button
          variant="text"
          onClick={handleClickExperiments}
          disabled={location.pathname === '/console/experiments'}
        >
          Experiments
        </Button>
        /
        <Button
          variant="text"
          onClick={handleClickCells}
          disabled={location.pathname === '/console/cells'}
        >
          Cells
        </Button>
      </Box>
      <DataBaseContent>{children}</DataBaseContent>
    </Box>
  )
}

const DataBaseContent = styled(Box)(({ theme }) => ({
  width: '94vw',
  margin: 'auto',
  marginTop: 15,
}))

export default DatabaseWrapper
