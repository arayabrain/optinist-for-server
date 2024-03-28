import { FC, ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Box, Button, styled } from "@mui/material"

const DatabaseWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const handleClickExperiments = () => {
    navigate("/console/experiments")
  }
  const handleClickCells = () => {
    navigate("/console/cells")
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
          disabled={location.pathname === "/console/experiments"}
        >
          Experiments
        </Button>
        /
        <Button
          variant="text"
          onClick={handleClickCells}
          disabled={location.pathname === "/console/cells"}
        >
          Cells
        </Button>
      </Box>
      <DataBaseContent>{children}</DataBaseContent>
    </Box>
  )
}

const DataBaseContent = styled(Box)(() => ({
  width: "94vw",
  margin: "auto",
  marginTop: 15,
}))

export default DatabaseWrapper
