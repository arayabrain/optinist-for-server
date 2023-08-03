import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {ChangeEvent, useCallback, useEffect, useMemo, useState, MouseEvent} from "react";
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
import {regexEmail, regexIgnoreS, regexPassword} from "../../const/Auth";
import InputError from "../../components/common/InputError";
import {SelectChangeEvent} from "@mui/material/Select";
import SelectError from "../../components/common/SelectError";

type ModalComponentProps = {
  onSubmitEdit: (
    id: number | string | undefined,
    data: { [key: string]: string },
  ) => void
  setOpenModal: (v: boolean) => void
  dataEdit?: {
    [key: string]: string
  }
}

const initState = {
  email: '',
  password: '',
  role_id: '',
  name: '',
  confirmPassword: '',
}

const ModalComponent =
   ({
     onSubmitEdit,
     setOpenModal,
     dataEdit,
   }: ModalComponentProps) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>(
      dataEdit || initState,
  )
  const [isDisabled, setIsDisabled] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>(initState)

  const validateEmail = (value: string): string => {
    const error = validateField('email', 255, value)
    if (error) return error
    if (!regexEmail.test(value)) {
      return 'Invalid email format'
    }
    return ''
  }

  const validatePassword = (
      value: string,
      isConfirm: boolean = false,
      values?: { [key: string]: string },
  ): string => {
    if (!value && !dataEdit?.uid) return 'This field is required'
    const errorLength = validateLength('password', 255, value)
    if (errorLength) {
      return errorLength
    }
    let datas = values || formData
    if (!regexPassword.test(value) && value) {
      return 'Your password must be at least 6 characters long and must contain at least one letter, number, and special character'
    }
    if(regexIgnoreS.test(value)){
      return 'Allowed special characters (!#$%&()*+,-./@_|)'
    }
    if (isConfirm && datas.password !== value && value) {
      return 'password is not match'
    }
    return ''
  }

  const validateField = (name: string, length: number, value?: string) => {
    if (!value) return 'This field is required'
    return validateLength(name, length, value)
  }

  const validateLength = (name: string, length: number, value?: string) => {
    if (value && value.length > length)
      return `The text may not be longer than ${length} characters`
    if (formData[name]?.length && value && value.length > length) {
      return `The text may not be longer than ${length} characters`
    }
    return ''
  }

  const validateForm = (): { [key: string]: string } => {
    const errorName = validateField('name', 100, formData.display_name)
    const errorEmail = validateEmail(formData.email)
    const errorRole = validateField('role_id', 50, formData.roleId)
    const errorPassword = validatePassword(formData.password)
    const errorConfirmPassword = validatePassword(
      formData.confirmPassword,
      true,
    )
    return {
      email: errorEmail,
      password: errorPassword,
      confirmPassword: errorConfirmPassword,
      name: errorName,
      role_id: errorRole,
    }
  }

  const onChangeData = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent,
    length: number,
  ) => {
    const { value, name } = e.target
    const newDatas = { ...formData, [name]: value }
    setFormData(newDatas)
    let error: string =
      name === 'email'
        ? validateEmail(value)
        : validateField(name, length, value)
    let errorConfirm = errors.confirmPassword
    if (name.toLowerCase().includes('password')) {
      error = validatePassword(value, name === 'confirmPassword', newDatas)
      if (name !== 'confirmPassword' && formData.confirmPassword) {
        errorConfirm = validatePassword(
          newDatas.confirmPassword,
          true,
          newDatas,
        )
      }
    }
    setErrors({ ...errors, confirmPassword: errorConfirm, [name]: error })
  }

  const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsDisabled(true)
    const newErrors = validateForm()
    if (Object.keys(newErrors).some((key) => !!newErrors[key])) {
      setErrors(newErrors)
      setIsDisabled(false)
      return
    }
    try {
      await onSubmitEdit(dataEdit?.uid, formData)
      setTimeout(() => {
        if (!dataEdit?.uid) {
          alert('Your account has been created successfully!')
        } else {
          alert('Your account has been successfully updated!')
        }
      }, 1)
      setOpenModal(false)
    } catch {
      if (!dataEdit?.uid) {
        setTimeout(() => {
          alert('This email already exists!')
        }, 300)
      }
    } finally {
      setIsDisabled(false)
    }
  }
  const onCancel = () => {
    setOpenModal(false)
  }

  return (
    <Modal>
      <ModalBox>
        <TitleModal>{dataEdit?.uid ? 'Edit' : 'Add'} Account</TitleModal>
        <BoxData>
          <LabelModal>Name: </LabelModal>
          <InputError
            name="name"
            value={formData?.name || ''}
            onChange={(e) => onChangeData(e, 100)}
            onBlur={(e) => onChangeData(e, 100)}
            errorMessage={errors.name}
          />
          <LabelModal>Role: </LabelModal>
          <SelectError
            value={formData?.role_id || ''}
            options={Object.keys(ROLE).filter(key => !Number(key))}
            name="role_id"
            onChange={(e) => onChangeData(e, 50)}
            onBlur={(e) => onChangeData(e, 50)}
            errorMessage={errors.role_id}
          />
          <LabelModal>e-mail: </LabelModal>
          <InputError
            name="email"
            value={formData?.email || ''}
            onChange={(e) => onChangeData(e, 255)}
            onBlur={(e) => onChangeData(e, 255)}
            errorMessage={errors.email}
          />
          {!dataEdit?.uid ? (
            <>
              <LabelModal>Password: </LabelModal>
              <InputError
                name="password"
                value={formData?.password || ''}
                onChange={(e) => onChangeData(e, 255)}
                onBlur={(e) => onChangeData(e, 255)}
                type={'password'}
                errorMessage={errors.password}
              />
              <LabelModal>Confirm Password: </LabelModal>
              <InputError
                name="confirmPassword"
                value={formData?.confirmPassword || ''}
                onChange={(e) => onChangeData(e, 255)}
                onBlur={(e) => onChangeData(e, 255)}
                type={'password'}
                errorMessage={errors.confirmPassword}
              />
            </>
          ) : null}
        </BoxData>
        <ButtonModal>
          <Button disabled={isDisabled} onClick={(e) => onSubmit(e)}>
            Ok
          </Button>
          <Button onClick={() => onCancel()}>Cancel</Button>
        </ButtonModal>
      </ModalBox>
      {isDisabled ? <Loading /> : null}
    </Modal>
  )
}
const AccountManager = () => {

  const dispatch = useDispatch()

  const listUser = useSelector(selectListUser)
  const loading = useSelector(selectLoading)
  const user = useSelector(selectCurrentUser)
  const [searchParams, setParams] = useSearchParams()

  const [openModal, setOpenModal] = useState(false)
  const [dataEdit, setDataEdit] = useState({})

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

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const onSubmitEdit = async (
      id: number | string | undefined,
      data: { [key: string]: string },
  ) => {
    if (id !== undefined) {
      // await editUser(id, data)
      setOpenModal(false)
    } else {
      // await createUser(data)
    }
    // await getList(id !== undefined ? paginate.page : 0)
    return undefined
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
        <Button onClick={handleOpenModal}>Add</Button>
      </Box>
      <DataGridPro
        sx={{ minHeight: 400, height: 'calc(100vh - 300px)'}}
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
        openModal ?
          <ModalComponent
            onSubmitEdit={onSubmitEdit}
            setOpenModal={(flag) => {
              setOpenModal(flag)
              if (!flag) {
                setDataEdit({})
              }
            }}
            dataEdit={dataEdit}
          /> : null
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

const Modal = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#cccccc80',
}))

const ModalBox = styled(Box)(({ theme }) => ({
  width: 800,
  height: 550,
  backgroundColor: 'white',
  border: '1px solid black',
}))

const TitleModal = styled(Box)(({ theme }) => ({
  fontSize: 25,
  margin: theme.spacing(5),
}))

const BoxData = styled(Box)(({ theme }) => ({
  marginTop: 35,
}))

const LabelModal = styled(Box)(({ theme }) => ({
  width: 300,
  display: 'inline-block',
  textAlign: 'end',
  marginRight: theme.spacing(0.5),
}))

const ButtonModal = styled(Box)(({ theme }) => ({
  button: {
    fontSize: 20,
  },
  display: 'flex',
  justifyContent: 'end',
  margin: theme.spacing(5),
}))

export default AccountManager
