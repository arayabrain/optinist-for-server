import CloseIcon from "@mui/icons-material/Close";
import {Box, styled} from "@mui/material";
import { ImageUrls } from "store/slice/Database/DatabaseType";

type DialogImageProps = {
  open: boolean
  data?: ImageUrls[] | ImageUrls
  handleCloseDialog: () => void
}

const DialogImage = ({data, handleCloseDialog, open}: DialogImageProps) => {
  if(!data) return <></>
  return (
    <>
    {
      open ? <DialogImageWrapper>
        <DialogImageContentWrapper>
          <DialogImageContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 3,
                margin: "80px 50px"
              }}
            >
              {
                !Array.isArray(data) ?
                  <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}>
                    <img
                      src={data.url}
                      alt={""}
                      width={"100%"}
                      height={"100%"}
                    />
                    <span>{data.url}</span>
                  </Box> :
                Array.isArray(data) ?
                data.filter(Boolean).map((item, index) => (
                  <Box
                    key={`${item}_${index}`}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <img
                      key={index}
                      src={item.url}
                      alt={""}
                      width={"100%"}
                      height={"100%"}
                    />
                    <span>{item}</span>
                  </Box>
                )) : null
              }
            </Box>
          </DialogImageContent>
          <ButtonClose onClick={handleCloseDialog}>
            <CloseIcon />
          </ButtonClose>
        </DialogImageContentWrapper>
      </DialogImageWrapper> : null
    }
    </>
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
