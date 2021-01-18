import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'

import ComponentStore from '../../store/componentStore'

const { UserStore } = ComponentStore

const Banner = () => {
  const { isActiveUser, localUsageCounter, setDisabled } = UserStore

  useEffect(() => {
    if (localUsageCounter && localUsageCounter >= 3) {
      setDisplay(isActiveUser)
    }
  }, [localUsageCounter, isActiveUser])

  const handleDisable = () => {
    setDisplay(false)
    setDisabled()
  }

  const [displayable, setDisplay] = useState(isActiveUser)
  //   const [displayable, setDisplay] = useState(true)

  if (displayable) {
    return (
      <div className="bg-indigo-600">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-indigo-600">
                {/* <!-- Heroicon name: heart --> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="36"
                  stroke="#e53e3e">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white font-bold truncate">
                <span className="md:hidden">
                  {' '}
                  We{`'`}ve noticed you are an active user of our product and
                  would love your feedback!
                </span>
                <span className="hidden md:inline">
                  We{`'`}ve noticed you are an active user of our product and
                  would love your feedback!
                </span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <div className="rounded-md shadow-sm">
                <a
                  href="https://calendly.com/modfy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500 focus:outline-none focus:shadow-outline transition ease-in-out duration-150">
                  Chat with us!
                </a>
              </div>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <div className="rounded-md shadow-sm">
                <a
                  href="https://discord.gg/dnD6FHx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-600 hover:text-indigo-500 focus:outline-none focus:shadow-outline transition ease-in-out duration-150">
                  <FontAwesomeIcon
                    icon={faDiscord}
                    style={{
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      marginBottom: '-5px'
                    }}
                  />
                </a>
              </div>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
              <button
                type="button"
                className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 sm:-mr-2 transition ease-in-out duration-150"
                aria-label="Dismiss"
                onClick={handleDisable}>
                {/* <!-- Heroicon name: x --> */}
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default observer(Banner)
