import { FC, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { SnackbarProvider, SnackbarKey, useSnackbar } from "notistack"

import Close from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"

import Loading from "components/common/Loading"
import Layout from "components/Layout"
import { RETRY_WAIT } from "const/Mode"
import Account from "pages/Account"
import AccountDelete from "pages/AccountDelete"
import AccountManager from "pages/AccountManager"
import Administration from "pages/Administration"
import Dashboard from "pages/Dashboard"
import Cells from "pages/Database/Cells"
import Experiments from "pages/Database/Experiments"
import GroupManager from "pages/GroupManager"
import Login from "pages/Login"
import PublicCells from "pages/PublicDatabase/PublicCells"
import PublicExperiments from "pages/PublicDatabase/PublicExperiments"
import ResetPassword from "pages/ResetPassword"
import Workspaces from "pages/Workspace"
import Workspace from "pages/Workspace/Workspace"
import { getModeStandalone } from "store/slice/Standalone/StandaloneActions"
import {
  selectLoading,
  selectModeStandalone,
} from "store/slice/Standalone/StandaloneSeclector"
import { AppDispatch } from "store/store"

const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isStandalone = useSelector(selectModeStandalone)
  const loading = useSelector(selectLoading)
  const getMode = () => {
    dispatch(getModeStandalone())
      .unwrap()
      .catch(() => {
        new Promise((resolve) => setTimeout(resolve, RETRY_WAIT)).then(() => {
          getMode()
        })
      })
  }

  useEffect(() => {
    getMode()
    //eslint-disable-next-line
  }, [])

  return loading ? (
    <Loading loading={true} />
  ) : (
    <SnackbarProvider
      maxSnack={5}
      action={(snackbarKey) => (
        <SnackbarCloseButton snackbarKey={snackbarKey} />
      )}
    >
      <BrowserRouter>
        <Layout>
          {isStandalone ? (
            <Routes>
              <Route path="/" element={<Workspace />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          ) : (
            <Routes>
              <Route
                path="/"
                element={<Navigate replace to="/experiments" />}
              />
              <Route path="/experiments" element={<PublicExperiments />} />
              <Route path="/cells" element={<PublicCells />} />
              <Route path="/account-deleted" element={<AccountDelete />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/console" element={<Dashboard />} />
              <Route path="/console/account" element={<Account />} />
              <Route
                path="/console/account-manager"
                element={<AccountManager />}
              />
              <Route path="/console/experiments" element={<Experiments />} />
              <Route path="/console/group-manager" element={<GroupManager />} />
              <Route
                path="/console/administration"
                element={<Administration />}
              />
              <Route path="/console/cells" element={<Cells />} />
              <Route path="/console/workspaces">
                <Route path="" element={<Workspaces />} />
                <Route path=":workspaceId" element={<Workspace />} />
              </Route>
              <Route
                path="/console/*"
                element={<Navigate replace to="/console" />}
              />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          )}
        </Layout>
      </BrowserRouter>
    </SnackbarProvider>
  )
}

const SnackbarCloseButton: FC<{ snackbarKey: SnackbarKey }> = ({
  snackbarKey,
}) => {
  const { closeSnackbar } = useSnackbar()
  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)} size="large">
      <Close style={{ color: "white" }} />
    </IconButton>
  )
}

export default App
