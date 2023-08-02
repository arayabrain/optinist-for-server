import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {ChangeEvent, useEffect, useMemo} from "react";
import {Box, Pagination, styled} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser, selectListUser, selectLoading} from "../../store/slice/User/UserSelector";
import {useSearchParams} from "react-router-dom";
import {getListUser} from "../../store/slice/User/UserActions";
import { DataGridPro } from "@mui/x-data-grid-pro";
import Loading from "../../components/common/Loading";
import {UserDTO} from "../../api/users/UsersApiDTO";

const AccountManager = () => {

  const dispatch = useDispatch()

  const listUser = useSelector(selectListUser)
  const loading = useSelector(selectLoading)
  const user = useSelector(selectCurrentUser)
  const [searchParams, setParams] = useSearchParams()

  const limit = searchParams.get('limit') || undefined
  const offset = searchParams.get('offset') || undefined

  const params = useMemo(() => {
    return {
      limit: Number(limit),
      offset: Number(offset)
    }
  }, [limit, offset])

  useEffect(() => {
    dispatch(getListUser(params))
    //eslint-disable-next-line
  }, [params])

  const handlePage = (event: ChangeEvent<unknown>, page: number) => {
    if(!listUser) return
    setParams(`limit=${listUser.limit}&offset=${page - 1}`)
  }

  const columns = useMemo(() =>
    [
      {
        headerName: 'UID',
        field: 'uid',
        minWidth: 350
      },
      {
        headerName: 'Name',
        field: 'name',
        minWidth: 200
      },
      {
        headerName: 'Role',
        field: 'role_id',
        minWidth: 200
      },
      {
        headerName: 'Mail',
        field: 'email',
        minWidth: 350
      },
      {
        headerName: '',
        field: 'action',
        sortable: 'false',
        filterable: 'false',
        width: 200,
        renderCell: (params: {row: UserDTO}) => {
          return (
            <>
              <ALink
                sx={{ color: 'red' }}
              >
                <EditIcon sx={{ color: 'black' }} />
              </ALink>
              {
                !(params.row?.id === user?.id) ?
                <ALink
                  sx={{ ml: 1.25 }}
                >
                  <DeleteIcon sx={{ color: 'red' }} />
                </ALink> : null
              }
            </>
          )
        },
      },
    ],
    [user?.id],
  )
  return (
    <AccountManagerWrapper>
      {
        listUser ?
          <>
            <DataGridPro
              sx={{ minHeight: 400, height: 'calc(100vh - 250px)'}}
              columns={columns as any}
              rows={listUser.items}
              hideFooter
            />
            <Pagination
              sx={{ marginTop: 2 }}
              count={listUser.total}
              page={listUser.offset + 1}
              onChange={handlePage}
            />
          </>
            : null
      }
      {
        loading ? <Loading /> : null
      }
    </AccountManagerWrapper>
  )
}

const AccountManagerWrapper = styled(Box)(({ theme }) => ({
  width: '80%',
  margin: theme.spacing(6.125, 'auto')
}))

const ALink = styled('a')({
  color: '#1677ff',
  textDecoration: 'none',
  cursor: 'pointer',
  userSelect: 'none',
})

export default AccountManager
