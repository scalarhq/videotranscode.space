import ComponentStore from '@store/componentStore'
import styles from '@styles/reload.module.css'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import React from 'react'
import ReactTooltip from 'react-tooltip'

const ReloadSvg = ({
  width,
  fill = '#5596ff'
}: {
  width: string
  fill?: string
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 25 25"
    width={width}
    fill={fill}>
    <path d="M12.5,21A7.5,7.5,0,0,1,6.713,8.729a.5.5,0,1,1,.771.637A6.5,6.5,0,1,0,12.5,7h-3a.5.5,0,0,1,0-1h3a7.5,7.5,0,0,1,0,15Z" />
    <path d="M11.5,9a.5.5,0,0,1-.354-.146l-2-2a.5.5,0,0,1,.708-.708l2,2A.5.5,0,0,1,11.5,9Z" />
    <path d="M9.5,7a.5.5,0,0,1-.354-.854l2-2a.5.5,0,0,1,.708.708l-2,2A.5.5,0,0,1,9.5,7Z" />
  </svg>
)

const ReloadUtil = () => (
  <div className="fixed xl:top-2 xl:right-2 bottom-3 right-3">
    <div className="flex flex-col">
      <button
        type="button"
        data-tip
        data-for="reset-tooltip"
        className={classNames(styles['hidden-button'])}
        onClick={() => {
          window.location.reload()
        }}>
        <ReloadSvg width="2.5rem" fill="rgba(255,255,255,0.6)" />
        <ReactTooltip
          id="reset-tooltip"
          place="left"
          effect="solid"
          type="dark">
          Reset
        </ReactTooltip>
      </button>
      {ComponentStore.CluiStore.isSubmitted ? null : (
        <button
          type="button"
          className="bg-gray-700 bg-opacity-75 hidden xl:block transition-all duration-200 ease-in-out hover:bg-indigo-700 text-white font-bold mt-12 py-2 px-4 "
          onClick={() => {
            ComponentStore.startTour()
          }}>
          <span>Tour</span>
        </button>
      )}
    </div>
  </div>
)

export default observer(ReloadUtil)

export { ReloadSvg }
