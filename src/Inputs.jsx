import React, { memo } from 'react';
import { useDrag } from 'react-dnd';
import "./custom.css";


const style = {
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};

export const Inputs = memo(function Inputs({ id, name, type, handleInputChange, handleAddInput, handleDeleteInput }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'InputEle',
      item: { id, name, type },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, name, type],
  );

  const isButtonEnabled = name.trim() !== '' && type.trim() !== '';

  return (
    <div style={{ ...style, opacity: isDragging ? 0.4 : 1 }} data-testid="inputEle">
      <div ref={drag} style={{ cursor: 'move' }}>
        <input
          placeholder="Column Name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => handleInputChange(id, 'name', e.target.value)}
        />
      </div>
      <select
        value={type}
        onChange={(e) => handleInputChange(id, 'type', e.target.value)}
      >
        <option value="">Select data type</option>
        <option value="VARCHAR">VARCHAR</option>
        <option value="INTEGER">INTEGER</option>
        <option value="BOOLEAN">BOOLEAN</option>
      </select>
      <button onClick={handleAddInput} disabled={!isButtonEnabled}>+</button>
      <button onClick={()=>handleDeleteInput(id)}>-</button>

    </div>
  );
});
