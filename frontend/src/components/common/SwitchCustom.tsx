import FormControlLabel from "@mui/material/FormControlLabel"
import { styled } from "@mui/material/styles"
import Switch, { SwitchProps } from "@mui/material/Switch"

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
    sx={{
      width: "50px !important",
    }}
  />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(24px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "red",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "silver" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    "&:before": {
      // eslint-disable-next-line quotes
      content: '"ON"',
      position: "relative",
      left: 10,
      top: 2,
      fontSize: 9,
    },
    "&:after": {
      // eslint-disable-next-line quotes
      content: '"OFF"',
      position: "relative",
      right: -15,
      top: 2,
      fontSize: 9,
    },
  },
}))

const SwitchCustom = ({ value }: { value: boolean }) => {
  return (
    <FormControlLabel
      control={<IOSSwitch checked={value} sx={{ m: 1 }} />}
      label=""
    />
  )
}

export default SwitchCustom
