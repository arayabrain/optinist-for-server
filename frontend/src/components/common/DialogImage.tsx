import CloseIcon from "@mui/icons-material/Close";
import {Box, styled} from "@mui/material";

type DialogImageProps = {
  data?: string[]
  handleCloseDialog: () => void
}

const DialogImage = ({data, handleCloseDialog}: DialogImageProps) => {
  if(!data) return <></>
  return (
      <DialogImageWrapper>
        <DialogImageContentWrapper>
          <DialogImageContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 2,
                margin: "80px 50px"
              }}
            >
              {
                data.filter(Boolean).map((item, index) => (
                    <img
                        key={index}
                        src={item}
                        alt={""}
                        width={150}
                        height={150}
                    />
                ))
              }
            </Box>
          </DialogImageContent>
          <ButtonClose onClick={handleCloseDialog}>
            <CloseIcon />
          </ButtonClose>
        </DialogImageContentWrapper>
      </DialogImageWrapper>
  )
}

const DialogImageWrapper = styled(Box)(({theme}) => ({
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

const DialogImageContentWrapper = styled(Box)(({theme}) => ({
  position: "relative",
  display: "flex",
  background: "#FFF",
  justifyContent: "center",
  alignItems: "center",
  width: "80%",
  height: "80%",
  border: "1px solid #000",
}))

const DialogImageContent = styled(Box)(({theme}) => ({
  overflow: "scroll",
  position: "relative",
  flexWrap: "wrap",
  display: "flex",
  background: "#FFF",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  // border: "1px solid #000",
}))

const ButtonClose = styled("button")(({theme}) => ({
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
    background: "#8f8a8a"
  }
}))

export default DialogImage;
