import { FC } from 'react'
import { Box } from '@mui/material'
import PublicHeader from 'components/PublicLayout/PublicHeader'
import PublicFooter from 'components/PublicLayout/PublicFooter'

const PublicLayout: FC = ({ children }) => {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <PublicHeader />
      <Box>{children}</Box>
      <PublicFooter />
    </Box>
  )
}

export default PublicLayout
