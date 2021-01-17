import Head from '@components/head'
import dynamic from 'next/dynamic'
import React from 'react'

const DynamicComponentWithNoSSR = dynamic(() => import('../src/ErrorWrapper'), {
  ssr: false
})

const App = () => {
  return (
    <Head>
      <DynamicComponentWithNoSSR />
    </Head>
  )
}
export default App
