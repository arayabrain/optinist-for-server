import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {ChangeEvent, useCallback, useEffect, useMemo} from "react";
import {Box, Button, Pagination, styled} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser, selectListUser, selectLoading} from "../../store/slice/User/UserSelector";
import {useSearchParams} from "react-router-dom";
import {getListUser} from "../../store/slice/User/UserActions";
import { DataGridPro } from "@mui/x-data-grid-pro";
import Loading from "../../components/common/Loading";
import {UserDTO} from "../../api/users/UsersApiDTO";
import {ROLE} from "../../@types";
import {GridFilterModel, GridSortDirection, GridSortModel} from "@mui/x-data-grid";

const AccountManager = () => {

  const dispatch = useDispatch()

  const listUser = useSelector(selectListUser)
  const loading = useSelector(selectLoading)
  const user = useSelector(selectCurrentUser)
  const [searchParams, setParams] = useSearchParams()

  const limit = searchParams.get('limit') || 50
  const offset = searchParams.get('offset') || 0
  const name = searchParams.get('name') || undefined
  const email = searchParams.get('email') || undefined
  const sort = searchParams.getAll('sort') || []

  const sortParams = useMemo(() => {
    return {
      sort: sort
    }
    //eslint-disable-next-line
  }, [JSON.stringify(sort)])

  const filterParams = useMemo(() => {
    return {
      name: name,
      email: email
    }
  }, [name, email])

  const params = useMemo(() => {
    return {
      limit: Number(limit),
      offset: Number(offset)
    }
  }, [limit, offset])

  useEffect(() => {
    dispatch(getListUser({...filterParams, ...sortParams, ...params}))
    //eslint-disable-next-line
  }, [params])

  const handlePage = (event: ChangeEvent<unknown>, page: number) => {
    if(!listUser) return
    setParams(`limit=${listUser.limit}&offset=${page - 1}`)
  }

  const getParamsData = () => {
    const dataFilter = Object.keys(filterParams)
        .filter((key) => (filterParams as any)[key])
        .map((key) => `${key}=${(filterParams as any)[key]}`)
        .join('&')
    return dataFilter
  }

  const paramsManager = useCallback(
      (page?: number) => {
        return `limit=${limit}&offset=${
            page ? page - 1 : offset
        }`
      },
      [limit, offset],
  )

  const handleSort = useCallback(
    (rowSelectionModel: GridSortModel) => {
      const filter = getParamsData()
      if (!rowSelectionModel[0]) {
        setParams(`${filter}&sort=&sort=&${paramsManager()}`)
        return
      }
      setParams(
        `${filter}&sort=${rowSelectionModel[0].field}&sort=${rowSelectionModel[0].sort}&${paramsManager()}`,
      )
    },
    //eslint-disable-next-line
    [paramsManager, getParamsData],
  )

  const handleFilter = (model: GridFilterModel) => {
    let filter = ''
    if (!!model.items[0]?.value) {
      filter = model.items
          .filter((item) => item.value)
          .map((item: any) => {
            return `${item.field}=${item?.value}`
          })
          .join('&')
    }
    const { sort } = sortParams
    setParams(
        `${filter}&sort=${sort[0] || ''}&sort=${sort[1] || ''}&${paramsManager()}`,
    )
  }

  const columns = useMemo(() =>
    [
      {
        headerName: 'UID',
        field: 'uid',
        filterable: false,
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
        filterable: false,
        minWidth: 200,
        renderCell: (params: {value: number}) => {
          let role
          switch (params.value) {
            case ROLE.ADMIN:
              role = "Admin";
              break;
            case ROLE.MANAGER:
              role = "Manager";
              break;
            case ROLE.OPERATOR:
              role = "Operator";
              break;
            case ROLE.GUEST_OPERATOR:
              role = "Guest Operator";
              break;
          }
          return (
              <span>{role}</span>
          )
        }
      },
      {
        headerName: 'Mail',
        field: 'email',
        minWidth: 350
      },
      {
        headerName: '',
        field: 'action',
        sortable: false,
        filterable: false,
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
      <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button>Add</Button>
      </Box>
      <DataGridPro
        sx={{ minHeight: 400, height: 'calc(100vh - 250px)'}}
        columns={columns as any}
        rows={listUser?.items || []}
        filterMode={'server'}
        sortingMode={'server'}
        hideFooter
        onSortModelChange={handleSort}
        initialState={{
          sorting: {
            sortModel: [
              {
                field: sortParams.sort[0],
                sort: sortParams.sort[1] as GridSortDirection,
              },
            ],
          },
          filter: {
            filterModel: {
              items: [
                {
                  field: 'name',
                  operator: 'contains',
                  value: filterParams.name,
                },
                {
                  field: 'email',
                  operator: 'contains',
                  value: filterParams.email,
                }
              ],
            },
          },
        }}
        onFilterModelChange={handleFilter as any}
      />
      <Pagination
        sx={{ marginTop: 2 }}
        count={listUser?.total || 0}
        page={(listUser?.offset || 0) + 1 }
        onChange={handlePage}
      />
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
