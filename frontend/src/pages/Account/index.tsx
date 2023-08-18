import { useSelector, useDispatch } from 'react-redux'
import { Box, Button, Input, styled, Typography } from '@mui/material'
import Loading from "components/common/Loading"
import ChangePasswordModal from 'components/Account/ChangePasswordModal'
import DeleteConfirmModal from 'components/common/DeleteConfirmModal'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { deleteMe, updateMe, updateMePassword} from 'store/slice/User/UserActions'
import { selectCurrentUser, selectLoading } from 'store/slice/User/UserSelector'
import { ROLE } from "../../@types";
import {useSnackbar, VariantType} from "notistack";
const Account = () => {
  const user = useSelector(selectCurrentUser)
  const loading = useSelector(selectLoading)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)
  const [isChangePwModalOpen, setIsChangePwModalOpen] = useState(false)
  const [isEditName, setIsEditName] = useState(false)
  const [isName, setIsName] = useState<string>()

  const ref = useRef<HTMLInputElement>(null)

  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = (variant: VariantType, mess: string) => {
    enqueueSnackbar(mess, { variant });
  };

  useEffect(() => {
    if(!user) return
    setIsName(user.name)
    //eslint-disable-next-line
  }, [])

  const handleCloseDeleteComfirmModal = () => {
    setIsDeleteConfirmModalOpen(false)
  }

  const onDeleteAccountClick = () => {
    setIsDeleteConfirmModalOpen(true)
  }

  const onConfirmDelete = async () => {
    if(!user) return
    const data = await dispatch(deleteMe())
    if((data as any).error) {
      handleClickVariant('error', 'Account deleted failed!')
    }
    else {
      navigate('/login')
    }
    handleCloseDeleteComfirmModal()
  }

  const handleCloseChangePw = () => {
    setIsChangePwModalOpen(false)
  }

  const onChangePwClick = () => {
    setIsChangePwModalOpen(true)
  }

  const onConfirmChangePw = async (oldPass: string, newPass: string) => {
    const data = await dispatch(updateMePassword({old_password: oldPass, new_password: newPass}))
    if((data as any).error) {
      handleClickVariant('error', 'Failed to Change Password!')
    }
    else {
      handleClickVariant('success', 'Your password has been successfully changed!')
    }
    handleCloseChangePw()
  }

  const onEditName = (e: ChangeEvent<HTMLInputElement>) => {
    setIsName(e.target.value)
  }

  const onSubmit = async (e: any) => {
    if(!user || !user.name || !user.email) return
    if(isName === user.name) {
      setIsEditName(false)
      return
    }
    if(!e.target.value) {
      handleClickVariant('error', "Full name cann't empty!")
      setIsName(user?.name)
    }
    else {
      const data = await dispatch(updateMe({
        name: e.target.value,
        email: user.email,
      }))
      if((data as any).error) {
        handleClickVariant('error', 'Full name edited failed!')
      }
      else {
        handleClickVariant('success', 'Full name edited successfully!')
      }
    }
    setIsEditName(false)
  }

  const getRole = (role?: number) => {
    if(!role) return
    let newRole = ''
    switch (role) {
      case ROLE.ADMIN:
        newRole = 'Admin'
        break
      case ROLE.DATA_MANAGER:
        newRole = 'Data Manager'
        break
      case ROLE.OPERATOR:
        newRole = 'Operator'
        break
      case ROLE.GUEST_OPERATOR:
        newRole = 'Guest Operator'
    }
    return newRole
  }

  const handleName = (event: any) => {
    if(event.key === 'Escape') {
      setIsName(user?.name)
      setIsEditName(false)
      return
    }
    if(event.key === 'Enter') {
      if(ref.current) ref.current?.querySelector('input')?.blur?.()
      return
    }
  }

  return (
    <AccountWrapper>
      <DeleteConfirmModal
        titleSubmit="Delete My Account"
        onClose={handleCloseDeleteComfirmModal}
        open={isDeleteConfirmModalOpen}
        onSubmit={onConfirmDelete}
        description='Delete account will erase all of your data.'
      />
      <ChangePasswordModal
        onSubmit={onConfirmChangePw}
        open={isChangePwModalOpen}
        onClose={handleCloseChangePw}
      />
      <Title>Account Profile</Title>
      <BoxFlex>
        <TitleData>Account ID</TitleData>
        <BoxData>{user?.uid}</BoxData>
      </BoxFlex>
      <BoxFlex>
        <TitleData>Organization</TitleData>
        <BoxData>{user?.organization?.name}</BoxData>
      </BoxFlex>
      <BoxFlex>
        <TitleData>Full name:</TitleData>
        {isEditName ? (
          <Input
            sx={{ width: 400 }}
            autoFocus
            onBlur={onSubmit}
            placeholder="Full name"
            value={isName}
            onChange={onEditName}
            onKeyDown={handleName}
            ref={ref}
          />
        ) : (
          <>
            <Box>{isName ? isName : user?.name}</Box>
            <Button sx={{ ml: 1 }} onClick={() => setIsEditName(true)}>
              Edit
            </Button>
          </>
        )}
      </BoxFlex>
      <BoxFlex>
        <TitleData>Email</TitleData>
        <BoxData>{user?.email}</BoxData>
      </BoxFlex>
      <BoxFlex>
        <TitleData>Role</TitleData>
        <BoxData>{getRole(user?.role_id)}</BoxData>
      </BoxFlex>
      <BoxFlex sx={{ justifyContent: 'space-between', mt: 10, maxWidth: 600}}>
        <ButtonSubmit onClick={onChangePwClick}>Change Password</ButtonSubmit>
        <ButtonSubmit onClick={onDeleteAccountClick}>Delete Account</ButtonSubmit>
      </BoxFlex>
      {
        loading ? <Loading /> : null
      }
    </AccountWrapper>
  )
}

const AccountWrapper = styled(Box)({
  padding: '0 20px',
})

const BoxFlex = styled(Box)({
  display: 'flex',
  margin: '20px 0 10px 0',
  alignItems: 'center',
  maxWidth: 1000,
})

const Title = styled('h2')({
  marginBottom: 40,
})

const BoxData = styled(Typography)({
  fontWeight: 700,
  minWidth: 272,
})

const TitleData = styled(Typography)({
  width: 250,
  minWidth: 250
})

const ButtonSubmit = styled('button')({
  backgroundColor: '#283237',
  color: '#ffffff',
  borderRadius: 4,
  border: 'none',
  outline: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
})

export default Account
