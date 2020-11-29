import React from 'react'

import dynamic from 'next/dynamic'

import Head from '../src/components/head'

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
