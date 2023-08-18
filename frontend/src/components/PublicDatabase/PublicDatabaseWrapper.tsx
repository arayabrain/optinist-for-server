import { FC } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Button, styled } from '@mui/material'
import PublicLayout from 'components/PublicLayout'

const PublicDatabaseWrapper: FC = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const handleClickExperiments = () => {
    navigate('/experiments')
  }
  const handleClickCells = () => {
    navigate('/cells')
  }

  return (
    <PublicLayout>
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
            disabled={location.pathname === '/experiments'}
          >
            Experiments
          </Button>
          /
          <Button
            variant="text"
            onClick={handleClickCells}
            disabled={location.pathname === '/cells'}
          >
            Cells
          </Button>
        </Box>
        <DataBaseContent>{children}</DataBaseContent>
      </Box>
    </PublicLayout>
  )
}

const DataBaseContent = styled(Box)(({ theme }) => ({
  width: '94vw',
  margin: 'auto',
  marginTop: 15,
}))

export default PublicDatabaseWrapper
