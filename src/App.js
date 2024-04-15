import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Example from './example';

const App = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = item => {
    setDroppedItems(prevItems => [...prevItems, item]);
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Example />
      </DndProvider>
    </div>
  );
};

export default App;
