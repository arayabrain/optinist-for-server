import { FC, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { getToken } from 'utils/auth/AuthUtils'
import { selectCurrentUser } from 'store/slice/User/UserSelector'
import { getMe } from 'store/slice/User/UserActions'
import Header from './Header'
import LeftMenu from './LeftMenu'
import { IS_STANDALONE } from 'const/Mode'

const authRequiredPathRegex = /^\/console\/?.*/
const redirectAfterLoginPaths = ['/login', '/reset-password']

const Layout: FC = ({ children }) => {
  const user = useSelector(selectCurrentUser)
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(IS_STANDALONE)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    !IS_STANDALONE &&
      authRequiredPathRegex.test(window.location.pathname) &&
      checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, user])

  const checkAuth = async () => {
    if (user) {
      if (loadingAuth) setLoadingAuth(false)
      return
    }
    const token = getToken()
    const isPageLogin = loginPaths.includes(window.location.pathname)
    const willRedirect = redirectAfterLoginPaths.includes(
      window.location.pathname,
    )

    try {
      if (token) {
        await dispatch(getMe())
        if (loadingAuth) setLoadingAuth(false)
        if (isPageLogin) return
        navigate('/')
        dispatch(getMe())
        if (willRedirect) navigate('/console')
        return
      } else if (!isPageLogin) {
        if (loadingAuth) setLoadingAuth(false)
        throw new Error('fail auth')
      }
      } else if (!willRedirect) throw new Error('fail auth')
    } catch {
      if (loadingAuth) setLoadingAuth(false)
      navigate('/login')
    }
  }

  return authRequiredPathRegex.test(location.pathname) ? (
    <AuthedLayout>{children}</AuthedLayout>
  ) : (
    <UnauthedLayout>{children}</UnauthedLayout>
  )
}

const AuthedLayout: FC = ({ children }) => {
  const [open, setOpen] = useState(false)
  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }
  return (
    <LayoutWrapper>
      <Header handleDrawerOpen={handleDrawerOpen} />
      <ContentBodyWrapper>
        {ignorePaths.includes(location.pathname) ? null : (
          <LeftMenu open={open} handleDrawerClose={handleDrawerClose} />
        )}
        <ChildrenWrapper open={open}>
          {loadingAuth ? null : children}
        </ChildrenWrapper>
        <LeftMenu open={open} handleDrawerClose={handleDrawerClose} />
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </ContentBodyWrapper>
    </LayoutWrapper>
  )
}

const UnauthedLayout: FC = ({ children }) => {
  return (
    <LayoutWrapper>
      <ContentBodyWrapper>
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </ContentBodyWrapper>
    </LayoutWrapper>
  )
}

const LayoutWrapper = styled(Box)({
  height: '100%',
  width: '100%',
})

const ContentBodyWrapper = styled(Box)(() => ({
  backgroundColor: '#ffffff',
  display: 'flex',
  paddingTop: 48,
  height: 'calc(100% - 48px)',
  paddingRight: 10,
  overflow: 'hidden',
}))

const ChildrenWrapper = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}))

export default Layout
