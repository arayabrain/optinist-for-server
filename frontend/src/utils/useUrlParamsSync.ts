import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

/**
 * URLパラメーターの同期を管理するカスタムフック
 *
 * デフォルトパラメーター（limit, offset）の追加時は履歴を置き換え、
 * ユーザー操作時は履歴に追加することで、ブラウザの戻る/進むボタンを正常に動作させる
 */
export const useUrlParamsSync = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [newParams, setNewParams] = useState(
    window.location.search.replace("?", ""),
  )

  const isInitialMountRef = useRef(true)
  const hasAddedDefaultParamsRef = useRef(false)

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      return
    }

    let param = newParams
    if (newParams[0] === "&") {
      param = newParams.slice(1, param.length)
    }

    if (param === window.location.search.replace("?", "")) {
      return
    }

    // デフォルトパラメーター（limit, offset）の追加を検出
    const currentSearch = window.location.search.replace("?", "")
    const isAddingDefaultParams =
      !hasAddedDefaultParamsRef.current &&
      currentSearch.length > 0 &&
      param.length > currentSearch.length &&
      param.includes("limit=") &&
      param.includes("offset=")

    if (isAddingDefaultParams) {
      hasAddedDefaultParamsRef.current = true
      setSearchParams(param.replaceAll("+", "%2B"), { replace: true })
    } else {
      setSearchParams(param.replaceAll("+", "%2B"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newParams])

  return {
    searchParams,
    setNewParams,
  }
}
