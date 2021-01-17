import useHover from '@core/utils/useHover'
import { faCogs, faFile, faToggleOn } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ComponentStore from '@store/componentStore'
import styles from '@styles/help.module.css'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'

const HelpSvg = ({ width }: { width: string }) => (
  <svg
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    fill="rgba(255,255,255,0.6)"
    viewBox="0 0 24 24">
    <path d="M11.29,15.29a1.58,1.58,0,0,0-.12.15.76.76,0,0,0-.09.18.64.64,0,0,0-.06.18,1.36,1.36,0,0,0,0,.2.84.84,0,0,0,.08.38.9.9,0,0,0,.54.54.94.94,0,0,0,.76,0,.9.9,0,0,0,.54-.54A1,1,0,0,0,13,16a1,1,0,0,0-.29-.71A1,1,0,0,0,11.29,15.29ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM12,7A3,3,0,0,0,9.4,8.5a1,1,0,1,0,1.73,1A1,1,0,0,1,12,9a1,1,0,0,1,0,2,1,1,0,0,0-1,1v1a1,1,0,0,0,2,0v-.18A3,3,0,0,0,12,7Z" />
  </svg>
)

const HoverGuide = () => (
  <div className={styles['hover-help-wrapper']}>
    <div className="flex ">
      <div className={classNames('w-1/2', styles['hover-file-wrapper'])}>
        <div className="max-w-sm w-full lg:max-w-full lg:flex">
          <div
            className={classNames(
              styles['hover-card'],
              'rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal'
            )}>
            <div className="mb-8">
              <div className="text-white font-bold text-xl mb-2">
                <FontAwesomeIcon icon={faFile} /> Add Files
              </div>
              <p className="text-white text-base">
                Drag and drop as many files as you want here.
              </p>{' '}
              <p className="text-white text-base">
                {' '}
                Videos, Audio and Images are accepted.{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={classNames('w-1/2', styles['hover-clui-wrapper'])}>
        <div className="max-w-sm w-full lg:max-w-full lg:flex justify-end">
          <div
            className={classNames(
              styles['hover-card'],
              'rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal'
            )}>
            <div className="mb-8">
              <div className="text-white font-bold text-xl mb-2">
                <FontAwesomeIcon icon={faCogs} /> Configuration
              </div>
              <p className="text-white text-base">
                Choose a Feature -{'>'} Set your options -{'>'} Submit
              </p>{' '}
              <p />
              <p className="text-white text-base">
                Workflows are multiple features combined!{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex">
      <div className="w-1/2" />
      <div className="w-1/2">
        <div className={styles['hover-toggle']}>
          <div className="max-w-sm w-full lg:max-w-full lg:flex justify-center">
            <div
              className={classNames(
                styles['hover-card'],
                'rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal'
              )}>
              <div className="mb-8">
                <div className="text-white font-bold text-xl mb-2">
                  <FontAwesomeIcon icon={faToggleOn} /> Want advanced features?
                </div>
                <p className="text-white text-base">
                  Want to use more features? and customized workflows? Use our
                  CLUI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const HelpUtl = () => {
  const [hoverRef, isHovered] = useHover()
  const hoverDisplay = useRef<HTMLDivElement | null>(null)

  const { CluiStore } = ComponentStore

  const { isSubmitted } = CluiStore

  useEffect(() => {
    // console.info('Hover change ', isHovered);
    if (!isHovered) {
      setTimeout(() => {
        if (hoverDisplay && hoverDisplay.current) {
          hoverDisplay.current.style.visibility = 'hidden'
        }
      }, 1000)
    } else if (hoverDisplay && hoverDisplay.current) {
      hoverDisplay.current.style.visibility = 'visible'
    }
  }, [isHovered])
  if (!isSubmitted) {
    return (
      <div>
        <div className={styles['help-utl']}>
          <div className={styles['hover-container']}>
            <div className="hoverable" ref={hoverRef}>
              <HelpSvg width="2.5rem" />
            </div>
            <div className={styles['hover-display']} ref={hoverDisplay}>
              <HoverGuide />
            </div>
          </div>
        </div>
      </div>
    )
  }
  return <div />
}
export default observer(HelpUtl)
