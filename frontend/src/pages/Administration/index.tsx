import {Box} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {BoxMenu, BoxWrapper, DashboardContent, DashboardWrapper, LinkWrapper, TitleMenu} from "../Dashboard";

const Administration = () => {
  return (
    <BoxWrapper>
      <h1 style={{ paddingLeft: 16 }}>Administration</h1>
      <DashboardWrapper>
        <DashboardContent>
          <LinkWrapper to="/console/account-manager">
            <BoxMenu>
              <Box>
                <ManageAccountsIcon fontSize="large" />
                <TitleMenu>Account Manager</TitleMenu>
              </Box>
            </BoxMenu>
          </LinkWrapper>
          <LinkWrapper to="/console/group-manager">
            <BoxMenu>
              <Box>
                <ManageAccountsIcon fontSize="large" />
                <TitleMenu>Group Manager</TitleMenu>
              </Box>
            </BoxMenu>
          </LinkWrapper>
        </DashboardContent>
      </DashboardWrapper>

    </BoxWrapper>
  )
}

export default Administration;
