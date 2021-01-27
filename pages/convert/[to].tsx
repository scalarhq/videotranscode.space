// Path convert/[to]
import ConvertPage from '@featurePages/convert/convert'
import { useRouter } from 'next/router'
import React from 'react'

const ConvertTo = () => {
  const router = useRouter()

  const { to } = router.query
  return <ConvertPage to={to as string}></ConvertPage>
}

export default ConvertTo
