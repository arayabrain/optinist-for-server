import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {Box, Input, styled} from "@mui/material";
import {DataGrid, GridCellParams, GridRenderCellParams, GridValidRowModel} from "@mui/x-data-grid";
import {ChangeEvent, MouseEvent as MouseEventReact, useEffect, useRef, useState} from "react";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CancelIcon from "@mui/icons-material/Cancel";
import {TableListSearch} from "./PopupShare";
import {useDispatch, useSelector} from "react-redux";
import {resetUserSearch} from "../store/slice/User/UserSlice";
import {selectListUserSearch} from "../store/slice/User/UserSelector";
import {getListUserSearch} from "../store/slice/User/UserActions";
import {WAITING_TIME} from "../@types";
import {getListUserGroup, postListSet} from "../store/slice/GroupManager/GroupActions";
import {GroupManagerParams} from "../store/slice/GroupManager/GroupManagerType";
import {selectListUserGroup} from "../store/slice/GroupManager/GroupManagerSelectors";

export type UserAdd = {
  id: number
  name: string
  email: string
  share?: boolean
}

type PopupSetGroupManagerProps = {
  infoGroup: {
    open: boolean
    name: string
    id?: number
  }
  handleClose: () => void
  dataParams: GroupManagerParams
}

const columns = (
  handleShareFalse: (e: MouseEventReact<HTMLButtonElement>,
  parmas: GridRenderCellParams<GridValidRowModel>) => void,
  hide: boolean = true
) => ([
  {
    field: "name",
    headerName: "Name",
    filterable: false,
    sortable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => (
      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{params.row.name}</span>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    filterable: false,
    sortable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => (
        <span>{params.row.email}</span>
    ),
  },
  hide && {
    field: "share",
    headerName: "",
    filterable: false,
    sortable: false,
    renderCell: (params: GridRenderCellParams<GridValidRowModel>) => {
      if(!params.row.share) return ''
      return (
        <Button
          onClick={(e) => handleShareFalse(e, params)}
        >
          <CancelIcon color={"error"}/>
        </Button>
      )
    }
  },
])

const PopupSetGroupManager = ({infoGroup, handleClose, dataParams}: PopupSetGroupManagerProps) => {

  let timeout = useRef<NodeJS.Timeout | undefined>()
  const dispatch = useDispatch()

  const listUserInit  = useSelector(selectListUserGroup)
  const usersSuggest = useSelector(selectListUserSearch)
  const [userSet, setUserSet] = useState<UserAdd[]>([])

  const [textSearch, setTextSearch] = useState({
    setGroup: '',
    searchAdd: ''
  })
  const [listSet, setListSet] = useState<UserAdd[]>([])
  const [listSearchAdd, setListSearchAdd] = useState<UserAdd[]>([])
  const [newListSetSearch, setNewListSetSearch] = useState<UserAdd[]>([])
  const [listIdNoAdd, setListIdNoAdd] = useState<number[]>([])

  useEffect(() => {
    if(!infoGroup.open) {
      setListSearchAdd([])
      setTextSearch({
        setGroup: '',
        searchAdd: ''
      })
      return
    }
    if(!infoGroup.id) return
    setListSet(listUserInit.map(item => ({ ...item, share: true})))
    dispatch(getListUserGroup(infoGroup.id))
    //eslint-disable-next-line
  }, [infoGroup.open, infoGroup.id])

  useEffect(() => {
    setListSet(listUserInit.map(item => ({ ...item, share: true})))
    setNewListSetSearch(listUserInit.map(item => ({ ...item, share: true})))
    //eslint-disable-next-line
  }, [JSON.stringify(listUserInit)])

  useEffect(() => {
    if(!infoGroup.open) return
    if(timeout.current) clearTimeout(timeout.current)
    if(!textSearch.searchAdd) {
      dispatch(resetUserSearch())
      return
    }
    timeout.current = setTimeout(() => {
      dispatch(getListUserSearch({keyword: textSearch.searchAdd}))
    }, WAITING_TIME)
    //eslint-disable-next-line
  }, [textSearch.searchAdd, infoGroup.open])

  useEffect(() => {
    if(textSearch.setGroup) {
      setNewListSetSearch(pre => pre.filter(item => !listIdNoAdd.includes(item.id)))
    }
    else setNewListSetSearch(listSet.filter(item => !listIdNoAdd.includes(item.id)))
    //eslint-disable-next-line
  }, [listSet])

  useEffect(() => {
    const newList = listSet.filter(item => item.name.includes(textSearch.setGroup) || item.email.includes(textSearch.setGroup))
    setNewListSetSearch(newList)
    if(listIdNoAdd.length === 0) return
    setListSet(pre => pre.filter(item => !listIdNoAdd.includes(item.id)))
    //eslint-disable-next-line
  }, [textSearch.setGroup])

  const handleCloseSearch = (type: 'setGroup' | 'searchAdd') => {
    setTextSearch({ ...textSearch, [type]: ''})
    dispatch(resetUserSearch())
  }
  const handleSearchSet = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch({ ...textSearch, setGroup: event.target.value})
  }

  const handleSearchAdd = (event: ChangeEvent<HTMLInputElement>) => {
    setTextSearch({ ...textSearch, searchAdd: event.target.value})
  }

  const handleAddListUser = (user: any) => {
    if(listSearchAdd.find(item => item.id === user.id)) return
    setListSearchAdd([...listSearchAdd, user])
  }

  const handleShareFalse = (e: MouseEventReact<HTMLButtonElement>, params: GridRenderCellParams<GridValidRowModel>) => {
    e.preventDefault()
    e.stopPropagation()
    let newList = newListSetSearch.filter(item => item.id !== params.id)
    setListIdNoAdd([...listIdNoAdd, params.id as number])
    setNewListSetSearch(newList)
  }

  const checkDuplicate = (newList: UserAdd[], listCurrent: UserAdd[]) => {
    return listCurrent.filter(itemSet => {
      const isDuplicate = newList.findIndex(itemNew => itemNew.id === itemSet.id) !== -1;
      return !isDuplicate;
    }).concat(newList)
  }

  const onCellClick = (params: GridCellParams) => {
    setUserSet([{ ...params.row}])
  }
  const handleAddListSet = () => {
    if(userSet.length === 0) return
    const newList: UserAdd[] = userSet.map(item => ({...item, share: true}))
    setListIdNoAdd(pre => pre.filter(item => !newList.map(user => user.id).includes(item)))
    let newArray = checkDuplicate(newList, newListSetSearch)

    if(textSearch.setGroup) {
      setNewListSetSearch([...newArray])
      newArray = checkDuplicate(newList, listSet)
      setListSet([...newArray])
    }
    else {
      setListSet(newArray)
    }
    setListSearchAdd(pre => pre.filter(user => user.id !== userSet[0].id))
  }

  const handleClosePopup = () => {
    setListIdNoAdd([])
    setTextSearch({
      searchAdd: '',
      setGroup: ''
    })
    setUserSet([])
    handleClose()
  }

  const handleSetList = () => {
    if(!infoGroup.id) return
    dispatch(postListSet(
  {
        list: listSet.filter(item => !listIdNoAdd.includes(item.id)).map(item => item.id),
        id: infoGroup.id,
        params: dataParams
      }))
    setListSet([])
    setListIdNoAdd([])
    setTextSearch({
      searchAdd: '',
      setGroup: ''
    })
    setUserSet([])
    handleClose()
  }

  return (
    <div>
      <DiaLogCustom
        open={infoGroup.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: 24, fontWeight: 'bold'}}>
          Edit Group Users ({infoGroup.name})
        </DialogTitle>
        <DialogContent>
          <WrapperSet>
            <Box style={{position: 'relative', flex: 1, maxWidth: '45%', alignSelf: 'start', height: '100%'}}>
              <Typography variant={'h6'}>Current users</Typography>
              <Input
                autoComplete={'Off'}
                id="inputSearchSet"
                placeholder={"Search"}
                value={textSearch.setGroup}
                onChange={handleSearchSet}
                sx={{ width: '100%'}}
              />
              {
                newListSetSearch?.length > 0 ? (
                  <DataGrid
                    columns={columns(handleShareFalse).filter(Boolean) as any}
                    rows={newListSetSearch.filter(user => user.name.includes(textSearch.setGroup) || user.email.includes(textSearch.setGroup))}
                    hideFooter
                    columnHeaderHeight={0}
                    sx={{ marginTop: 2}}
                  />
                ) : <p>No data</p>
              }
            </Box>
            <KeyboardBackspaceIcon
              sx={{ cursor: userSet.length === 0 ? 'default' : 'pointer' }}
              onClick={handleAddListSet}
            />
            <Box style={{position: 'relative', flex: 1, maxWidth: '45%', alignSelf: 'start', height: '100%' }}>
              <Typography variant={'h6'}>Search users</Typography>
              <Input
                autoComplete={'Off'}
                id="inputSearchAdd"
                placeholder={"Search"}
                value={textSearch.searchAdd}
                onChange={handleSearchAdd}
                sx={{ width: '100%'}}
              />
              {
                textSearch.searchAdd && usersSuggest ? (
                  <TableListSearch
                    onClose={() => handleCloseSearch('searchAdd')}
                    usersSuggest={usersSuggest}
                    handleAddListUser={handleAddListUser}
                    listSearchAdd={listSearchAdd}
                    width={'80%'}
                    listSet={listSet}
                    listIdNoAdd={listIdNoAdd}
                  />
                ) : null
              }
              {
                listSearchAdd.length > 0 ? (
                  <DataGrid
                    columns={columns(handleShareFalse, false).filter(Boolean) as any}
                    rows={listSearchAdd || []}
                    hideFooter
                    columnHeaderHeight={0}
                    sx={{ marginTop: 2}}
                    onCellClick={onCellClick}
                  />
                ) : null
              }
            </Box>
          </WrapperSet>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Cancel</Button>
          <Button onClick={handleSetList} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </DiaLogCustom>
    </div>
  );
}

const DiaLogCustom = styled(Dialog)(() => ({
  '.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm': {
    maxHeight: 'unset',
    width: '80vw',
    maxWidth: 'unset',
    height: '80vh'
  }
}))

const WrapperSet = styled(Box)(() => ({
  display: 'flex',
  gap: 50,
  marginTop: 40,
  height: '80%',
  alignItems: 'center'
}))

export default PopupSetGroupManager;
