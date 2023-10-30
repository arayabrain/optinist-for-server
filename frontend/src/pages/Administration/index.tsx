import {Box} from "@mui/material";
import {BoxMenu, BoxWrapper, DashboardContent, DashboardWrapper, LinkWrapper, TitleMenu} from "../Dashboard";
import {Group, Person} from "@mui/icons-material";

const Administration = () => {
  return (
    <BoxWrapper>
      <h1 style={{ paddingLeft: 16 }}>Administration</h1>
      <DashboardWrapper>
        <DashboardContent>
          <LinkWrapper to="/console/account-manager">
            <BoxMenu>
              <Box>
                <Person fontSize="large" />
                <TitleMenu>Account Manager</TitleMenu>
              </Box>
            </BoxMenu>
          </LinkWrapper>
          <LinkWrapper to="/console/group-manager">
            <BoxMenu>
              <Box>
                <Group fontSize="large" />
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
