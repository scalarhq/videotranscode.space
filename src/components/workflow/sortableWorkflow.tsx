import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Features } from '@features/features'
import React from 'react'
import ReactToolTip from 'react-tooltip'

function WorkflowSortable({
  id,
  name,
  featureKey,
  index,
  length,
  updateEditFeature,
  setWorkflow
}: {
  id: string
  name: string
  featureKey: string
  index: number
  length: number
  setWorkflow: React.Dispatch<React.SetStateAction<string[]>>
  updateEditFeature: (featureKey: keyof Features) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <li className="cursor-default">
        <div className="relative pb-8">
          {index !== length - 1 ? (
            <span
              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-indigo-500 bg-opacity-70"
              aria-hidden="true"
            />
          ) : null}
          <div className="relative flex space-x-3">
            <div>
              <span className="h-8 w-8 rounded-full cursor-move flex items-center justify-center ">
                {/* Heroicon name: thumb-up */}
                <svg
                  className="h-8 w-8 text-default"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </span>
            </div>
            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 cursor-move">
              <div>
                <p className="text-m text-gray-200 select-none">
                  {index + 1}.{' '}
                  <span className="text-gray-50 font-bold">{name}</span> feature
                  will be processed.
                </p>
              </div>
              <div className="text-right flex items-center text-m whitespace-nowrap text-gray-400">
                <p
                  onClick={() => {
                    updateEditFeature(featureKey as keyof Features)
                  }}
                  data-tip
                  data-for={`edit-tip-${index}`}
                  className="cursor-pointer underline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </p>
                <p
                  onClick={() => {
                    setWorkflow(items => {
                      return items.filter(key => key !== featureKey)
                    })
                  }}
                  data-tip
                  data-for={`delete-tip-${index}`}
                  className="cursor-pointer px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </p>
              </div>
            </div>
          </div>
        </div>
        <ReactToolTip
          id={`delete-tip-${index}`}
          place="bottom"
          effect="solid"
          type="error">
          Delete Feature
        </ReactToolTip>
        <ReactToolTip
          id={`edit-tip-${index}`}
          place="bottom"
          effect="solid"
          type="dark">
          Edit Feature
        </ReactToolTip>
      </li>
    </div>
  )
}

export default WorkflowSortable
