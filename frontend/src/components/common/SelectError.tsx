import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Typography,
} from '@mui/material'
import { FC, FocusEvent } from 'react'
import CheckIcon from "@mui/icons-material/Check";

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
          multiple={multiple}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            PaperProps: {
              style: {
                maxHeight: '200px',
                width: '200px',
                marginTop: '8px',
              },
            },
          }}
          renderValue={(selected: any) => (
            <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {multiple ? selected?.join(', ') : selected}
            </div>
          )}
        >
          {options.map((item: string, index) => {
            return (
              <MenuItem key={index} value={item} sx={{ maxWidth: 270, width: '95%' }}>
                <SpanCustom>
                  <Box sx={{ width: '90%' }}>{item}</Box>
                  {
                    value && value.includes(item) ? <CheckIcon /> : null
                  }
                </SpanCustom>
              </MenuItem>
            )
          })}
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
  textOverflow: 'unset'
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
  width: '100%',
  display: 'flex',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

export default SelectError
