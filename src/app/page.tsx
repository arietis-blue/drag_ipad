"use client";

import React, { useState } from "react";

interface DraggableItem {
  id: number;
  position: { x: number; y: number };
  group: number;
}

const DraggableObject: React.FC<{
  item: DraggableItem;
  onDrag: (id: number, position: { x: number; y: number }) => void;
  onTouchEnd: (id: number) => void;
}> = ({ item, onDrag, onTouchEnd }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      onDrag(item.id, { x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEndWrapper = () => {
    setIsDragging(false);
    onTouchEnd(item.id);
  };

  return (
    <div
      className={`absolute ${
        item.group === 1 ? "bg-blue-500 shadow-lg" : "bg-red-500 shadow-lg"
      } rounded-lg transition-transform duration-200`}
      style={{ left: item.position.x, top: item.position.y }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEndWrapper}
    >
      <div className="w-20 h-20 rounded-lg"></div>
    </div>
  );
};

const Page: React.FC = () => {
  const [items, setItems] = useState<DraggableItem[]>([
    { id: 1, position: { x: 80, y: 100 }, group: 1 },
    { id: 2, position: { x: 80, y: 200 }, group: 1 },
    { id: 3, position: { x: 400, y: 100 }, group: 2 },
    { id: 4, position: { x: 400, y: 200 }, group: 2 },
  ]);

  const handleTouchEnd = (itemId: number) => {
    const newItems = items.map((item) => ({ ...item }));

    const itemToUpdate = newItems.find((item) => item.id === itemId);
    if (itemToUpdate) {
      // ここでitemToUpdateを使って必要な処理を行う
    }

    const sortedItems = newItems
      .filter((item) => item.group === 1)
      .sort((a, b) => a.position.y - b.position.y)
      .map((item, index) => ({
        ...item,
        position: { x: 80, y: 100 + index * 100 },
      }))
      .concat(
        newItems
          .filter((item) => item.group === 2)
          .sort((a, b) => a.position.y - b.position.y)
          .map((item, index) => ({
            ...item,
            position: { x: 400, y: 100 + index * 100 },
          }))
      );

    setItems(sortedItems);
  };

  const handleDrag = (id: number, position: { x: number; y: number }) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, position } : item
    );

    const groupARegion = { x: 0, y: 0, width: 200, height: 1000 };
    const groupBRegion = { x: 200, y: 0, width: 200, height: 1000 };

    if (
      position.x >= groupARegion.x &&
      position.x <= groupARegion.x + groupARegion.width &&
      position.y >= groupARegion.y &&
      position.y <= groupARegion.y + groupARegion.height
    ) {
      newItems.forEach((item) => {
        if (item.id === id) {
          item.group = 1;
        }
      });
    }

    if (
      position.x >= groupBRegion.x &&
      position.x <= groupBRegion.x + groupBRegion.width &&
      position.y >= groupBRegion.y &&
      position.y <= groupBRegion.y + groupBRegion.height
    ) {
      newItems.forEach((item) => {
        if (item.id === id) {
          item.group = 2;
        }
      });
    }

    setItems(newItems);
  };

  const addNewObject = () => {
    const newItem: DraggableItem = {
      id: items.length + 1,
      position: { x: 100, y: 100 + items.length * 100 },
      group: 1,
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="h-screen flex items-center m-5 justify-center relative space-x-10">
      <div
        className="absolute rounded-lg border-2 border-blue-500 bg-blue-100"
        style={{ left: 0, top: 0, width: 300, height: 500 }}
      ></div>
      <div
        className="absolute rounded-lg border-2 border-red-500 bg-red-100"
        style={{ left: 300, top: 0, width: 300, height: 500 }}
      ></div>

      {items.map((item) => (
        <DraggableObject
          key={item.id}
          item={item}
          onDrag={handleDrag}
          onTouchEnd={() => handleTouchEnd(item.id)}
        />
      ))}
      <button
        className="transform -translate-x-1/2 bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
        onClick={addNewObject}
      >
        オブジェクトを追加
      </button>
    </div>
  );
};

export default Page;
