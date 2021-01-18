import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import features, { Features } from '@features/features'
import React from 'react'

import WorkflowSortable from './sortableWorkflow'

const WorkflowDragWrapper = ({
  workflow,
  updateEditFeature,
  setWorkflow
}: {
  workflow: string[]
  setWorkflow: React.Dispatch<React.SetStateAction<string[]>>
  updateEditFeature: (featureKey: keyof Features) => void
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setWorkflow(items => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        <li>
          <div className="relative pb-8">
            <span
              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-indigo-500 bg-opacity-70"
              aria-hidden="true"
            />

            <div className="relative flex space-x-3">
              <div>
                <span className="h-8 w-8 rounded-full  flex items-center justify-center ">
                  {/* Heroicon name: user */}
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
                      d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                    />
                  </svg>
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                <div>
                  <p className="text-m text-gray-200">Using inputted files</p>
                </div>
              </div>
            </div>
          </div>
        </li>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={workflow}
            strategy={verticalListSortingStrategy}>
            {workflow.map((featureKey, index) => {
              const name = features[featureKey as keyof typeof features].name

              return (
                <WorkflowSortable
                  key={index}
                  id={featureKey}
                  name={name}
                  index={index}
                  length={workflow.length}
                  featureKey={featureKey}
                  updateEditFeature={updateEditFeature}
                  setWorkflow={setWorkflow}></WorkflowSortable>
              )
            })}
          </SortableContext>
        </DndContext>
      </ul>
    </div>
  )
}
export default WorkflowDragWrapper
