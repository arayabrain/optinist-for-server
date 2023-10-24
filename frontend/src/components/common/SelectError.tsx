import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Tooltip,
  Typography,
} from '@mui/material'
import { FC, FocusEvent } from 'react'

type SelectErrorProps = {
  value?: string | string[]
  onChange?: (value: SelectChangeEvent, child: React.ReactNode) => void
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  errorMessage: string
  name?: string
  options: string[]
  multiple?: boolean
}



const SelectError: FC<SelectErrorProps> =
   ({
     value,
     onChange,
     onBlur,
     errorMessage,
     options,
     name,
     multiple = false
   }) => {
  return (
    <>
      <SelectModal
        multiple={multiple}
        name={name}
        value={value}
        onChange={
          onChange as (
            value: SelectChangeEvent<unknown>,
            child: React.ReactNode,
          ) => void
        }
        onBlur={onBlur}
        error={!!errorMessage}
      >
        <Box sx={{ height: multiple ? 200 : 'auto' }}>
          {options.map((item: string) => {
            return (
              <Tooltip title={item} placement={'top'}>
                <MenuItem sx={{ maxWidth: 270 }} key={item} value={item}>
                  <SpanCustom>{item}</SpanCustom>
                </MenuItem>
              </Tooltip>
            )
          })}
        </Box>
      </SelectModal>
      <TextError>{errorMessage}</TextError>
    </>
  )
}

const SelectModal = styled(Select, {
  shouldForwardProp: (props) => props !== 'error',
})<{ error: boolean }>(({ theme, error }) => ({
  width: 272,
  marginBottom: '15px',
  border: '1px solid #d9d9d9',
  borderColor: error ? 'red' : '#d9d9d9',
  borderRadius: 4,
}))

const TextError = styled(Typography)({
  fontSize: 12,
  minHeight: 18,
  color: 'red',
  lineHeight: '14px',
  margin: '-14px 0px 0px 305px',
  wordBreak: 'break-word',
})

const SpanCustom = styled('span')({
  display: 'inline-block',
  width: '95%',
  margin: 'auto',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export default SelectError
