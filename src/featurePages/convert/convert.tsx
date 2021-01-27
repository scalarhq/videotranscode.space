/* eslint-disable jsx-a11y/anchor-is-valid */
import Dropdown from '@cluiComponents/Dropdown'
import Submit from '@cluiComponents/Submit'
import Dropzone from '@components/dropzone/dropzone'
import ProgressBar from '@components/progress/progress'
import { Footer } from '@components/static/static'
import VideoPlayer from '@components/video/video'
import { createCodecValue } from '@features/src/transcodeFeature'
import ComponentStore from '@store/componentStore'
import utilsStore from '@store/utilsStore'
import { observer } from 'mobx-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Fade } from 'react-reveal'
import formats from 'src/dist/formats'
import LoadingWrapper from 'src/LoadingWrapper'

import styles from './convert.module.css'

type ConvertPageProps = {
  to: string
}

const ConvertPage = ({ to }: ConvertPageProps) => {
  const { processingState, sectionProps } = utilsStore

  const { CluiStore } = ComponentStore

  const { updateConfiguration, updateChosenFeatures } = CluiStore

  const OtherFormats = () => {
    const formatKeys = Object.keys(formats)

    return (
      <div className="w-full hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {formatKeys.map(formatName => {
              if (formatName !== to?.toUpperCase()) {
                if (processingState === 'done') {
                  /**
                   * This is returned as an <a> tag to trigger a full state reset
                   */
                  return (
                    <a
                      href={`/convert/${formatName.toLowerCase()}`}
                      className="border-transparent text-gray-300 hover:text-gray-100 hover:border-gray-300 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm">
                      {formatName}
                    </a>
                  )
                }
                return (
                  <Link
                    key={formatName}
                    href={`/convert/${formatName.toLowerCase()}`}
                    passHref
                    replace>
                    <a className="border-transparent text-gray-300 hover:text-gray-100 hover:border-gray-300 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm">
                      {formatName}
                    </a>
                  </Link>
                )
              } else {
                return (
                  <Link
                    key={formatName}
                    href={`/convert/${formatName.toLowerCase()}`}
                    passHref>
                    <a
                      className="border-indigo-500 text-indigo-300 w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm"
                      aria-current="page">
                      {formatName}
                    </a>
                  </Link>
                )
              }
            })}
          </nav>
        </div>
      </div>
    )
  }

  const Codecs = () => {
    const formatKey = to?.toUpperCase() || 'MP4'

    const currentFormat = formats[formatKey]

    const parents = ['TRANSCODE', 'FORMAT']

    useEffect(() => {
      updateConfiguration({ value: formatKey }, [...parents])

      // Sets the chosen features array as a single element feature
      updateChosenFeatures([{ name: 'TRANSCODE' }])

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const dropdown = currentFormat.codecs.map(codec => ({
      name: codec.name,
      value: createCodecValue(codec.name)
    }))

    const current = currentFormat.defaultCodec
      ? {
          name: currentFormat.defaultCodec.name,
          value: createCodecValue(currentFormat.defaultCodec.name)
        }
      : {
          name: currentFormat.codecs[0].name,
          value: createCodecValue(currentFormat.codecs[0].name)
        }

    return (
      <Dropdown
        parents={[...parents, 'CODEC']}
        title="Choose Codec"
        usingExisting={false}
        dropdown={dropdown}
        current={current}
      />
    )
  }

  return (
    <LoadingWrapper>
      <div className={styles['variable-wrapper']}>
        <div className="min-w-screen w-full h-full min-h-screen flex flex-col items-center justify-start">
          {processingState !== 'processing' && (
            <div className="flex flex-col w-full items-center py-8">
              <p className="text-6xl text-gray-50 uppercase">Convert</p>
              <p className="text-lg uppercase">
                BY <Link href="/"> modfy.video</Link>
              </p>
            </div>
          )}
          <div className="flex flex-row w-full px-20 h-3/4 justify-center">
            {processingState === 'selection' ? (
              <>
                <div className="w-5/12 flex">
                  <Fade bottom>
                    <div className={styles.dropzone}>
                      <Dropzone acceptedFiles={['video/*']} />
                    </div>
                  </Fade>
                </div>
                <div className="w-2/12 flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="text-indigo-500"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
                <div className="w-5/12 flex justify-center">
                  <div className={styles.convert}>
                    <div className="w-full h-full flex flex-col items-center">
                      <p className="text-3xl text-gray-100 py-5 uppercase">
                        Convert to <span className="underline">{to}</span>
                      </p>
                      <div className="w-full h-full">
                        <Codecs></Codecs>
                      </div>
                    </div>
                    <Submit></Submit>
                  </div>
                </div>
              </>
            ) : processingState === 'processing' ? (
              <Fade bottom>
                {/* @ts-ignore When processingState === 'processing', sectionProps will be correct */}
                <ProgressBar {...sectionProps} />
              </Fade>
            ) : (
              <Fade bottom>
                {/* @ts-ignore When processingState === 'done', sectionProps will be correct */}
                <VideoPlayer {...sectionProps} />
              </Fade>
            )}
          </div>
          <div className="flex flex-col w-full items-center pb-10"></div>
          {processingState !== 'processing' && (
            <div className="flex flex-col w-1/2 items-center">
              <p className="text-gray-50 text-lg">Convert to other formats</p>
              <OtherFormats></OtherFormats>
            </div>
          )}
        </div>
        <Footer></Footer>
      </div>
    </LoadingWrapper>
  )
}

export default observer(ConvertPage)
