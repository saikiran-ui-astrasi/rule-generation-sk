import React, { memo } from 'react';
import { useDrop } from 'react-dnd';
import "./custom.css";


const style = {
  height: '4rem',
  width: '8rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'black',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
  border: "1px solid"
};

export const DNDComp = memo(function DNDComp({
  accept,
  lastDroppedItem,
  onDrop,
  customActive
}) {

  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  let backgroundColor = 'white';
  let cursor;
  if (isActive) {
    cursor = customActive ? "move" : "not-allowed"
  } else if (canDrop) {
    cursor = customActive ? "move" : "not-allowed"
  }


  return (
    <div ref={drop} style={{ ...style, backgroundColor, cursor: customActive ? "move" : "not-allowed" }} data-testid="dndComp">
      {/* {lastDroppedItem ? `Name:  */}
      {lastDroppedItem?.name}
     {/* Type: ${lastDroppedItem?.type}` : ""} */}
    </div>
  );
});
