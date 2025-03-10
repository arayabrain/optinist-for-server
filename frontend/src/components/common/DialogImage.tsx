import { useEffect, MouseEvent } from "react"

import CloseIcon from "@mui/icons-material/Close"
import { Box, styled } from "@mui/material"

type DialogImageProps = {
  open: boolean
  data?: string | string[]
  handleCloseDialog: () => void
  expId?: string
  cellId?: number
  nameCol?: string
}

const DialogImage = ({
  data,
  handleCloseDialog,
  open,
  expId,
  cellId,
  nameCol,
}: DialogImageProps) => {
  useEffect(() => {
    const handleClosePopup = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseDialog()
        return
      }
    }

    document.addEventListener("keydown", handleClosePopup)
    return () => {
      document.removeEventListener("keydown", handleClosePopup)
    }
    //eslint-disable-next-line
  }, [])

  const handleClose = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (event.target === event.currentTarget) handleCloseDialog()
    return
  }

  if (!data) return null
  return (
    <Box>
      {open ? (
        <DialogImageWrapper
          sx={{ position: "absolute", zIndex: 1 }}
          onClick={handleClose}
        >
          <DialogImageContentWrapper
            sx={{ position: "absolute", zIndex: 10000 }}
          >
            <DialogImageContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 3,
                  margin: "80px 50px",
                }}
              >
                {!Array.isArray(data) ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <DialogImageTitle>{nameCol}</DialogImageTitle>
                    {cellId ? (
                        <DialogImageLabel>Cell ID: {cellId} ({expId})</DialogImageLabel>
                      ) : (
                        <DialogImageLabel>Experiment ID: {expId}</DialogImageLabel>
                      )
                    }

                    <img src={data} alt={""} width={"100%"} height={"100%"} />
                  </Box>
                ) : Array.isArray(data) ? (
                  data.filter(Boolean).map((url, index) => (
                    <Box
                      key={`${url}_${index}`}
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <img
                        key={index}
                        src={url}
                        alt={""}
                        width={"100%"}
                        height={"100%"}
                      />
                      <span style={{textAlign: "center"}}>[{url.split("/").at(-1)}]</span>
                    </Box>
                  ))
                ) : null}
              </Box>
            </DialogImageContent>
            <ButtonClose onClick={handleCloseDialog}>
              <CloseIcon />
            </ButtonClose>
          </DialogImageContentWrapper>
        </DialogImageWrapper>
      ) : null}
    </Box>
  )
}

const DialogImageWrapper = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(255,255,255,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}))

const DialogImageContentWrapper = styled(Box)(() => ({
  position: "relative",
  display: "flex",
  background: "#FFF",
  justifyContent: "center",
  alignItems: "center",
  width: "80%",
  height: "80%",
  border: "1px solid #000",
  color: "#333333",
}))

const DialogImageTitle = styled(Box)(() => ({
  margin: "0 0 0.5em 0",
  textAlign: "center",
  fontSize: "1.75em",
}))

const DialogImageLabel = styled(Box)(() => ({
  margin: "0.5em 0 0.5em 0",
  textAlign: "center",
  fontSize: "1.1em",
}))

const DialogImageContent = styled(Box)(() => ({
  overflow: "scroll",
  position: "relative",
  flexWrap: "wrap",
  display: "flex",
  background: "#FFF",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
}))

const ButtonClose = styled("button")(() => ({
  border: "1px solid #000",
  position: "absolute",
  display: "block",
  top: -20,
  right: -20,
  width: 40,
  height: 40,
  cursor: "pointer",
  borderRadius: 50,
  "&:hover": {
    background: "#8f8a8a",
  },
}))

export default DialogImage
