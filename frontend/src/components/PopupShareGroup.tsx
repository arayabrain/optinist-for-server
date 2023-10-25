import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Input,
  Radio,
  RadioGroup,
  styled, Tooltip
} from "@mui/material";
import {DataGrid, GridRenderCellParams, GridValidRowModel} from "@mui/x-data-grid";
import {SHARE, WAITING_TIME} from "../@types";
import {ChangeEvent, MouseEvent as MouseEventReact, useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import CancelIcon from '@mui/icons-material/Cancel'
import {selectListGroupSearch, selectListUserSearch, selectLoading} from "../store/slice/User/UserSelector";
import {getListGroupSearch, getListUserSearch} from "../store/slice/User/UserActions";
import Loading from "./common/Loading";
import {UserDTO} from "../api/users/UsersApiDTO";
import CheckIcon from '@mui/icons-material/Check';
import {resetUserSearch} from "../store/slice/User/UserSlice";
import {ListShareGroup, ListShareUser} from "../store/slice/Database/DatabaseType";
import {postListUserShare, postMultiShare} from "../store/slice/Database/DatabaseActions";
import PopupConfirm from "./common/PopupConfirm";

type PopupType = {
  id?: number
  open: boolean
  handleClose: (v: boolean) => void
  isWorkspace?: boolean
  data?: {
    expId: string
    shareType: number
  }
  usersShare?: {
    share_type?: number
    users: ListShareUser[]
    groups: ListShareGroup[]
  }
  listCheck?: number[],
  type: string
  paramsUrl?: { [key: string]: number | string | string[] | undefined }
}

type TableSearch = {
  usersSuggest: UserDTO[]
  onClose: () => void
  handleAddListUser: (user: UserDTO, type: 'groups' | 'users') => void
  stateUserShare: ListShareUser[] | ListShareGroup[]
  type: 'groups' | 'users'
}

const TableListSearch = ({usersSuggest, onClose, handleAddListUser, stateUserShare, type}: TableSearch) => {

  const ref = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
    }
    //eslint-disable-next-line
  }, [])

  const onMouseDown = (event: MouseEvent) => {
    if(ref.current?.contains((event as any).target) ||
      (event as any).target.id === 'inputSearchGroups' ||
      (event as any).target.id === 'inputSearchUsers'
    )
    {
      return;
    }
    onClose?.()
  }

  return (
    <TableListSearchWrapper ref={ref} onBlur={() => console.log(123)}>
      <UlCustom>
        {usersSuggest?.map(item => {
          const isSelected = stateUserShare.some(i => i.id === item.id)
          return (
            <LiCustom key={item.id} onClick={() => !isSelected && handleAddListUser(item, type)}
              style={{
                cursor: isSelected ? 'not-allowed' : 'pointer',
                display: 'flex',
            }}
            >
              <Tooltip title={`${item.name} ${type === 'users' ? item.email : ''}`} placement={'right-start'}>
                <Box sx={{ width: '90%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {`${item.name} `}
                  {type === 'users' ? <span style={{ paddingLeft: 20 }}>{item.email}</span> : ''}
                </Box>
              </Tooltip>
              {isSelected ? <CheckIcon style={{ fontSize: 14 }}/> : null}
            </LiCustom>
          )
        })}
      </UlCustom>
    </TableListSearchWrapper>
  )
}

const PopupShareGroup = ({id, open, handleClose, data, usersShare, isWorkspace, listCheck, type, paramsUrl}: PopupType) => {
  const [shareType, setShareType] = useState(type === 'multiShare' ? SHARE.USERS : data?.shareType || 0)
  const [openConfirm, setOpenConfirm] = useState(false)
  const usersSuggest = useSelector(selectListUserSearch)
  const groupsSuggest = useSelector(selectListGroupSearch)
  const loading = useSelector(selectLoading)
  const [textSearch, setTextSearch] = useState({
    groups: '',
    users: ''
  })

  const [stateUserShare, setStateUserShare] = useState(type === 'share' && usersShare ? usersShare : {
    share_type: undefined,
    users: [],
    groups: []
  })

  const [check, setCheck] = useState({
    groups: false,
    users: false
  })

  const dispatch = useDispatch()
  let timeout = useRef<NodeJS.Timeout | undefined>()

  useEffect(() => {
    if(usersShare && type === 'share') {
      setStateUserShare(usersShare)
    }
  }, [usersShare])

  useEffect(() => {
    if(timeout.current) clearTimeout(timeout.current)
    if(!textSearch) {
      dispatch(resetUserSearch())
      return
    }
    timeout.current = setTimeout(() => {
      let api
      if(textSearch.groups) api = getListGroupSearch({keyword: textSearch.groups})
      if(textSearch.users) api = getListUserSearch({keyword: textSearch.users})
      if(!api) return
      dispatch(api)
    }, WAITING_TIME)
    //eslint-disable-next-line
  }, [textSearch])

  const handleShareUsersFalse = (e: any, params: GridRenderCellParams<GridValidRowModel>) => {
    e.preventDefault()
    e.stopPropagation()
    if(!stateUserShare) return
    const indexCheck = stateUserShare.users.findIndex(user => user.id === params.id)
    const newStateUserShare = stateUserShare.users.filter((user, index) => index !== indexCheck)
    setStateUserShare({...stateUserShare, users: newStateUserShare})
  }

  const handleShareGroupsFalse = (e: any, params: GridRenderCellParams<GridValidRowModel>) => {
    e.preventDefault()
    e.stopPropagation()
    if(!stateUserShare) return
    const indexCheck = stateUserShare.groups.findIndex(group => group.id === params.id)
    const newStateUserShare = stateUserShare.groups.filter((group, index) => index !== indexCheck)
    setStateUserShare({...stateUserShare, groups: newStateUserShare})
  }

  const handleValue = (event: ChangeEvent<HTMLInputElement>) => {
    setShareType(Number((event.target as HTMLInputElement).value));
  }

  const columnsShare = useCallback(
      (handleShareFalse: (e: MouseEventReact<HTMLButtonElement>, parmas: GridRenderCellParams<GridValidRowModel>) => void,
       type: 'group' | 'user'
      ) =>  [
    {
      field: "name",
      headerName: type === 'group' ? "Name Group" : "Name User",
      flex: type === 'group' ? 15 : 5,
      renderCell: (params: GridRenderCellParams<GridValidRowModel>) => (
        <span style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{params.row.name}</span>
      ),
    },
      type === 'user' && {
      field: "email",
      headerName: "Email",
      flex: 10,
      renderCell: (params: GridRenderCellParams<GridValidRowModel>) => (
        <span>{params.row.email}</span>
      ),
    },
    {
      field: "share",
      headerName: "",
      filterable: false,
      flex: 2,
      sortable: false,
      renderCell: (params: GridRenderCellParams<GridValidRowModel>) => {
        if(!params.row.share) return ''
        return (
          <Button onClick={(e) => handleShareFalse(e, params)}>
            <CancelIcon color={"error"}/>
          </Button>
        )
      }
    },
    //eslint-disable-next-line
  ], [JSON.stringify(stateUserShare?.users)])

  const handleOke = async () => {
    if(!stateUserShare) return
    if(type === 'multiShare') {
      setOpenConfirm(true)
      return
    }
    setOpenConfirm(false)
    let newUserIds = stateUserShare.users.map(user => user.id)
    let newListGroups = stateUserShare.groups.map(group => group.id)
    let newType = shareType
    if(!isWorkspace) {
      if(shareType === SHARE.ORGANIZATION) {
        newUserIds = []
        newListGroups = []
      }
      else if(shareType === SHARE.USERS && newUserIds.length < 1 && newListGroups.length < 1) {
        newType = 0
      }
      else if(newUserIds.length > 0) newType = SHARE.USERS
      await dispatch(postListUserShare({id: id as number , data: {user_ids: newUserIds as number[], group_ids: newListGroups, share_type: newType }}))
    }
    setStateUserShare({
      share_type: undefined,
      users: [],
      groups: []
    })
    handleClose(true);
  }

  const handleOkShareMulti = async () => {
    if(!listCheck || listCheck.length === 0 || !paramsUrl) return
    const { users, groups } = stateUserShare
    let share_type_multi: number
    if(shareType === SHARE.ORGANIZATION) {
      share_type_multi = SHARE.ORGANIZATION
    }
    else {
      if(users.length === 0 && groups.length === 0) {
        share_type_multi = SHARE.NOSHARE
      }
      else share_type_multi = SHARE.USERS
    }
    await dispatch(postMultiShare({
      params: paramsUrl,
      dataPost: {
      ids: listCheck,
      data: {
        share_type: share_type_multi,
        user_ids: shareType === SHARE.ORGANIZATION ? [] : users.map(user => user.id),
        group_ids: shareType === SHARE.ORGANIZATION ? [] : groups.map(group => group.id)
      },
      }}))
    setStateUserShare({
      share_type: undefined,
      users: [],
      groups: []
    })
    handleClose(true);
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>, type: 'groups' | 'users') => {
    const { name } = event.target
    setCheck({
      ...check, [type]: type === name
    })
    setTextSearch({...textSearch, [type]: event.target.value})
  }

  const handleCloseSearch = () => {
    setTextSearch({
      users: '',
      groups: ''
    })
    dispatch(resetUserSearch())
  }

  const handleAddListUser = (user: any, type: 'groups' | 'users') => {
    setStateUserShare({...stateUserShare, [type]: [...stateUserShare[type], user]})
  }

  const handleClosePopup = (event: any) => {
    if(event.key === 'Escape') {
      handleClose(false)
    }
  }

  return (
    <Box>
      <DialogCustom
        open={open}
        onClose={handleClose}
        sx={{margin: 0}}
        onKeyDown={handleClosePopup}
      >
        <DialogTitle>{`Share Database Record${id ? '' : ' (bulk)'}`}</DialogTitle>
        {isWorkspace ? null : (
          <DialogContent>
            <DialogContentText sx={{fontSize: 16, fontWeight: 400}}>
              <ul><li>{type === 'share' ? `Experiment ID: ${id}` : `Experiment ${listCheck?.length}`}</li></ul>
            </DialogContentText>
            <DialogContentText>
              <FormControl>
                <RadioGroup
                  value={shareType !== SHARE.ORGANIZATION ? SHARE.USERS : SHARE.ORGANIZATION}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onChange={handleValue}
                >
                  <FormControlLabel value={SHARE.ORGANIZATION} control={<Radio/>} label={"Organization share"}/>
                  <FormControlLabel value={SHARE.USERS} control={<Radio/>} label={"Groups/Users share"}/>
                </RadioGroup>
              </FormControl>
            </DialogContentText>
          </DialogContent>
        )}
        <DialogContent>
          {
            (shareType !== SHARE.ORGANIZATION) ?
              <WrapperPermitted>
                <Box style={{position: 'relative'}}>
                  <TitleCustom>Groups</TitleCustom>
                  <Input
                    id="inputSearchGroups"
                    name={'groups'}
                    onFocus={() => setTextSearch({ ...textSearch, users: ''})}
                    sx={{width: "60%"}}
                    placeholder={"Search and add groups"}
                    value={textSearch.groups}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleSearch(event, 'groups')}
                  />
                  {
                    textSearch.groups && groupsSuggest && check.groups ?
                      <TableListSearch
                        onClose={handleCloseSearch}
                        usersSuggest={groupsSuggest as UserDTO[]}
                        stateUserShare={stateUserShare?.groups || []}
                        handleAddListUser={handleAddListUser}
                        type={'groups'}
                      /> : null
                  }
                </Box>
                <p>Permitted groups</p>
                {
                  (stateUserShare && stateUserShare.groups?.length > 0) ?
                  <DataGrid
                    sx={{ height: 159 }}
                    rows={stateUserShare?.groups.map((user: any) => ({...user, share: true}))}
                    columns={columnsShare(handleShareGroupsFalse, 'group').filter(Boolean) as any}
                    hideFooterPagination
                    hideFooter
                    columnHeaderHeight={0}
                  />: <p>No data</p>
                }
              </WrapperPermitted>
              : null
          }
          {
            (shareType !== SHARE.ORGANIZATION || isWorkspace) ?
              <WrapperPermitted>
                <Box style={{position: 'relative'}}>
                  <TitleCustom>Users</TitleCustom>
                  <Input
                    name={'users'}
                    onFocus={() => setTextSearch({ ...textSearch, groups: ''})}
                    id="inputSearchUsers"
                    sx={{width: "60%"}}
                    placeholder={"Search and add users"}
                    value={textSearch.users}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleSearch(event, 'users')}
                  />
                  {
                    textSearch.users && usersSuggest && check.users ?
                      <TableListSearch
                        type={'users'}
                        onClose={handleCloseSearch}
                        usersSuggest={usersSuggest}
                        stateUserShare={stateUserShare?.users || []}
                        handleAddListUser={handleAddListUser}
                    /> : null
                  }
                </Box>
                <p>Permitted users</p>
                {
                  (stateUserShare && stateUserShare?.users?.length > 0) ?
                  <DataGrid
                    sx={{ height: 159 }}
                    rows={stateUserShare?.users.map((user: any) => ({...user, share: true}))}
                    columns={columnsShare(handleShareUsersFalse, 'user').filter(Boolean) as any}
                    hideFooterPagination
                    hideFooter
                    columnHeaderHeight={0}
                  />: <p>No data</p>
                }
              </WrapperPermitted>
              : null
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            handleClose(false)
          }}>
            Cancel
          </Button>
          <Button onClick={handleOke}>Ok</Button>
        </DialogActions>
      </DialogCustom>
      {
        loading ? <Loading /> : null
      }
      <PopupConfirm
        title={`Update the share settings of ${listCheck?.length} records at once. Is this OK?`}
        open={openConfirm}
        handleClose={() => setOpenConfirm(false)}
        handleOk={handleOkShareMulti}
      />
    </Box>
  )
}

const DialogCustom = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    "& .MuiPaper-root": {
      width: "70%",
      maxWidth: "890px",
    },
  },
}))

const TableListSearchWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  background: "#fff",
  zIndex: 100000,
  width: "60%",
  boxShadow: '0 6px 16px 0 rgba(0,0,0,.08), 0 3px 6px -4px rgba(0,0,0,.12), 0 9px 28px 8px rgba(0,0,0,.05)',
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  maxHeight: 200,
  overflow: 'auto'
}))

const UlCustom = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: 0,
}))

const LiCustom = styled('li')(({ theme }) => ({
  padding: theme.spacing(1, 2),
  fontSize: 14,
  cursor: "pointer",
  display: 'flex',
  justifyContent: "space-between",
  alignItems: 'center',
  "&:hover": {
    backgroundColor: 'rgba(0,0,0,.04)'
  }
}))

const WrapperPermitted = styled(Box)(() => ({
  border: '1px solid black',
  boxSizing: 'border-box',
  padding: 15,
  marginBottom: 20,
  height: 290,
}))

const TitleCustom = styled('span')(({ theme }) => ({
  display: 'inline-block',
  position: 'absolute',
  background: '#fff',
  top: -27,
  padding: theme.spacing(0, 1.25)
}))

export default PopupShareGroup
