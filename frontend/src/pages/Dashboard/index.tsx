import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import AnalyticsIcon from "@mui/icons-material/Analytics"
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import StorageIcon from "@mui/icons-material/Storage"
import { Box, styled, Typography } from "@mui/material"

import { getMe } from "store/slice/User/UserActions"
import { isAdmin, selectCurrentUser } from "store/slice/User/UserSelector"
import { AppDispatch } from "store/store"

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const admin = useSelector(isAdmin)
  const user = useSelector(selectCurrentUser)
  useEffect(() => {
    if (!user) return
    dispatch(getMe())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BoxWrapper>
      <h1 style={{ paddingLeft: 16 }}>Dashboard</h1>
      <DashboardWrapper>
        <DashboardContent>
          <LinkWrapper to="/console/experiments">
            <BoxMenu>
              <Box>
                <StorageIcon fontSize="large" />
                <TitleMenu>Database</TitleMenu>
              </Box>
            </BoxMenu>
          </LinkWrapper>
          <LinkWrapper to="/console/workspaces">
            <BoxMenu>
              <Box>
                <AnalyticsIcon fontSize="large" />
                <TitleMenu>Workspaces</TitleMenu>
              </Box>
            </BoxMenu>
          </LinkWrapper>
          {admin ? (
            <>
              <LinkWrapper to="/console/administration">
                <BoxMenu>
                  <Box>
                    <ManageAccountsIcon fontSize="large" />
                    <TitleMenu>Administration</TitleMenu>
                  </Box>
                </BoxMenu>
              </LinkWrapper>
            </>
          ) : null}
        </DashboardContent>
      </DashboardWrapper>
    </BoxWrapper>
  )
}

const BoxWrapper = styled(Box)({
  width: "100%",
  height: "100%",
})

const LinkWrapper = styled(Link)(() => ({
  textDecoration: "none",
}))

const DashboardWrapper = styled(Box)(() => ({
  width: "100%",
  height: "calc(100% - 90px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

export const DashboardContent = styled(Box)(() => ({
  padding: 30,
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 32,
}))

export const BoxMenu = styled(Box)(() => ({
  width: 170,
  height: 150,
  backgroundColor: "#283237",
  borderRadius: 4,
  padding: "40px 30px",
  color: "#fff",
  textAlign: "center",
  fontSize: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: "rgba(40,50,55,0.9)",
  },
}))

export const TitleMenu = styled(Typography)(() => ({
  fontSize: 24,
  marginTop: 30,
}))

export default Dashboard
