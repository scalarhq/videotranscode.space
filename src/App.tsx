/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-nested-ternary */

import Banner from '@components/banner/banner'
import Configuration from '@components/configuration/configuration'
import Dropzone from '@components/dropzone/dropzone'
import PostSelection from '@components/postSelection'
import { Footer, Header } from '@components/static/static'
import StepComponent from '@components/steps/steps'
import TerminalComponent from '@components/terminal/terminalComponent'
import Tour from '@components/tour/tour'
import Util from '@components/utils/util'
// Stores
import ComponentStore from '@store/componentStore'
import { useActiveUsers } from '@store/userStore'
import utilStore from '@store/utilsStore'
import styles from '@styles/app.module.css'
import classNames from 'classnames'
// Modules
import { observer } from 'mobx-react'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Fade } from 'react-reveal'

import LoadingWrapper from './LoadingWrapper'

const App = observer(() => {
  const { CluiStore } = ComponentStore
  const { isSubmitted, cluiToggle } = CluiStore

  const isActiveUser = useActiveUsers()

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className={classNames(styles['overlay-wrapper'], 'h-screen ')}>
        {!isMobile ? (
          <div>
            <Banner />
            <Util />
            <Tour>
              <>
                <div className={classNames(styles.main, 'main-padding')}>
                  <div className={styles['flex-wrapper']}>
                    {!isSubmitted ? (
                      <div
                        className={styles['dropzone-wrapper']}
                        id="dropzone-wrapper">
                        <Fade bottom>
                          <Dropzone />
                        </Fade>
                      </div>
                    ) : (
                      <PostSelection></PostSelection>
                    )}

                    {!isSubmitted ? (
                      <Fade bottom>
                        <Configuration />
                      </Fade>
                    ) : cluiToggle ? (
                      <div className={styles['terminal-wrapper']}>
                        <Fade bottom>
                          <TerminalComponent />
                        </Fade>
                      </div>
                    ) : utilStore.processingState === 'done' ? (
                      <div className={styles['terminal-wrapper']}>
                        <Fade bottom>
                          <TerminalComponent />
                        </Fade>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <StepComponent />
                </div>

                <Header />
              </>
            </Tour>
          </div>
        ) : null}
        {/* @ts-ignore Styled JSX */}
        <style jsx>
          {`
            .flex-wrapper {
              padding-top: ${isActiveUser ? '2vh' : '5vh'};
            }

            .main-padding {
              max-width: ${isSubmitted ? '80vw' : 'unset'};
              padding-top: ${isSubmitted ? '5vh' : '1rem'};
            }
            ul {
              max-width: unset !important;
              background-color: transparent !important;
            }
          `}
        </style>
      </div>

      <Footer />
    </div>
  )
})

const Wrapped = () => (
  <LoadingWrapper>
    <App></App>
  </LoadingWrapper>
)

export default Wrapped
