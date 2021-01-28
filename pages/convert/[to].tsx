// Path convert/[to]
import ConvertPage from '@featurePages/convert/convert'
import { GetStaticPaths, GetStaticProps } from 'next'
// import { useRouter } from 'next/router'
import React from 'react'
import formats from 'src/dist/formats'

React.useLayoutEffect = React.useEffect // Next JS SSR Error

const ConvertTo = ({ to, from }: { to: string; from: string | null }) => {
  return <ConvertPage to={to} from={from}></ConvertPage>
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const to = params?.to as string | undefined

  const splitArr = to?.split('-to-')

  const from = splitArr && splitArr.length > 1 ? splitArr[0] : null

  const splitTo = splitArr?.pop()

  return { props: { to: splitTo, from: from } }
}

type ParamPaths = Array<{
  params: {
    to?: string
    long?: string
  }
}>

export const getStaticPaths: GetStaticPaths = async () => {
  const formatKeys = Object.keys(formats)

  const paths: ParamPaths = formatKeys.map(format => {
    return { params: { to: format.toLowerCase() } }
  })

  const fromToPaths = formatKeys.map(format => {
    const fromPaths: ParamPaths = formatKeys
      .filter(currentFormat => currentFormat !== format)
      .map(currentFormat => {
        return {
          params: {
            to: `${currentFormat.toLowerCase()}-to-${format.toLowerCase()}`
          }
        }
      })

    return fromPaths
  }) // An Array of ParamPaths, which map to something like mp4-to-mov

  const flattedArray = Array.prototype.concat.apply([], fromToPaths)

  return {
    paths: [...paths, ...flattedArray],
    fallback: false // See the "fallback" section below
  }
}

export default ConvertTo
