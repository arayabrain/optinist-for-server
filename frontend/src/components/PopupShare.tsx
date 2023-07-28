import {Box, Button,
  Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup, styled } from "@mui/material";
import {DataGrid, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import { SHARE } from "../@types";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import { postListUserShare } from "../store/slice/Database/DatabaseActions";
import CancelIcon from '@mui/icons-material/Cancel'
import { ListShare } from "../store/slice/Database/DatabaseType";
import { ListUserShareWorkSpace } from "../store/slice/Workspace/WorkspaceType";
import { postListUserShareWorkspaces } from "store/slice/Workspace/WorkspacesActions";

type PopupType = {
  open: boolean
  id: number
  handleClose: (v: boolean) => void
  isWorkspace?: boolean
  title?: string
  data?: {
    expId: string
    shareType: number
  }
  usersShare?: {
    share_type?: number
    users: (ListShare | ListUserShareWorkSpace)[]
  }
}

const PopupShare = ({open, handleClose, data, usersShare, id, isWorkspace, title}: PopupType) => {
  const [shareType, setShareType] = useState(data?.shareType || 0)
  const [userList, setUserList] = useState<number[]>(usersShare?.users.map(user => user.id) || [])
  const dispatch = useDispatch();


  useEffect(() => {
    if(usersShare) {
      setUserList(usersShare.users.map(user => user.id));
    }
  }, [usersShare])

  const handleShareTrue = (params: GridRowParams) => {
    if(!params) return
    const index = userList.findIndex(item => {
      return item === params.id
    })
    if(index < 0) {
      userList.push(Number(params.id))
    }
  }

  const handleShareFalse = (e: any, params: GridRenderCellParams<string>) => {
    e.preventDefault()
    e.stopPropagation()
    if(userList.includes(Number(params.id))) {
      setUserList(userList.filter(id => id !== Number(params.id)))
    } else setUserList([...userList, Number(params.id)])
  }

  const handleValue = (event: ChangeEvent<HTMLInputElement>) => {
    setUserList(usersShare?.users.map(user => user.id) || [])
    setShareType(Number((event.target as HTMLInputElement).value));
  }

  const columnsShare = useCallback((handleShareFalse: (e: any, parmas: GridRenderCellParams<string>) => void) =>  [
    {
      field: "name",
      headerName: "Name",
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<string>) => (
          <span>{params.row.name}</span>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 280,
      renderCell: (params: GridRenderCellParams<string>) => (
          <span>{params.row.email}</span>
      ),
    },
    {
      field: "share",
      headerName: "",
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<string>) => {
        if(!params.row.share) return ''
        return (
            <Button onClick={(e) => handleShareFalse(e, params)}>
              {userList.includes(params.row.id) ? <CancelIcon color={"error"}/> : null}
            </Button>
        )
      }
    },
  ], [userList])

  const handleOke = async () => {
    if(!isWorkspace) {
      await dispatch(postListUserShare({id, data: {user_ids: userList, share_type: shareType }}))
    } else {
      await dispatch(postListUserShareWorkspaces({id, data: {user_ids: userList}}))
    }
    handleClose(true);
  }

  if(!data || !usersShare) return null;

  return (
      <Box>
        <DialogCustom
            open={open}
            onClose={handleClose}
            sx={{margin: 0}}
        >
          <DialogTitle>{title || "Share Database record"}</DialogTitle>
          {isWorkspace ? null : <DialogTitle sx={{fontSize: 16, fontWeight: 400}}>Experiment ID: {data.expId}</DialogTitle>}
          {isWorkspace ? null : (
              <DialogTitle>
                <FormControl>
                  <RadioGroup
                      value={shareType}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={handleValue}
                  >
                    <FormControlLabel value={1} control={<Radio/>} label={"Share for Organization"}/>
                    <FormControlLabel value={2} control={<Radio/>} label={"Share for Users"}/>
                  </RadioGroup>
                </FormControl>
              </DialogTitle>
          )}
          <DialogContent sx={{minHeight: 500}}>
            <p>Permitted users</p>
            {
              (shareType === SHARE.USERS || isWorkspace) ?
                  <DataGrid
                      sx={{minHeight: 500}}
                      onRowClick={handleShareTrue}
                      rows={usersShare.users.map(user => ({...user, share: true}))}
                      columns={columnsShare(handleShareFalse)}
                      hideFooterPagination
                  />
                : null
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose(false)}>Cancel</Button>
            <Button onClick={handleOke}>Ok</Button>
          </DialogActions>
        </DialogCustom>
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

export default PopupShare
