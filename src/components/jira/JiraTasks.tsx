import { DragEvent, useState } from 'react';

import { IoCheckmarkCircleOutline, IoEllipsisHorizontalOutline } from 'react-icons/io5';
import classNames from 'classnames';

import { SingleTask } from './SingleTask';
import { Task, TaskStatus } from '../../interfaces';
import { useTaskStore } from '../../stores';

interface Props {
  title: string;
  tasks: Task[];
  value: TaskStatus;
}

export const JiraTasks = ({ tasks, title, value }: Props) => {
  const isDragging = useTaskStore((state) => !!state.draggingTaskId);
  const [onDragOver, setOnDragOver] = useState(false);

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event?.preventDefault();

    setOnDragOver(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event?.preventDefault();

    setOnDragOver(true);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event?.preventDefault();

    setOnDragOver(false);
  };

  return (
    <div
      className={
        classNames("!text-black border-4 relative flex flex-col rounded-[20px]  bg-white bg-clip-border shadow-3xl shadow-shadow-500  w-full !p-4 3xl:p-![18px]", {
          'border-blue-500 border-dotted': isDragging,
          'border-green-500 border-dotted': isDragging && onDragOver,
        })
      }
      onDragLeave={ handleDragLeave }
      onDragOver={ handleDragOver }
      onDrop={ handleDrop }
    >
      {/* Task Header */ }
      <div className="relative flex flex-row justify-between">
        <div className="flex items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100">
            <span className="flex justify-center items-center h-6 w-6 text-brand-500">
              <IoCheckmarkCircleOutline style={ { fontSize: '50px' } } />
            </span>
          </div>

          <h4 className="ml-4 text-xl font-bold text-navy-700">{ title }</h4>
        </div>

        <button>
          <IoEllipsisHorizontalOutline />
        </button>
      </div>

      {/* Task Items */ }
      <div className="h-full w-full">
        {
          tasks.map((task) => (
            <SingleTask
              key={ task.id }
              task={ task }
            />
          ))
        }
      </div>
    </div>
  );
};