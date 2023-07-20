import { Box } from "@mui/material"

const Overley = () => {
  return (
      <Box sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 100
      }}>
      </Box>
  )
}

export default Overley;
