import React from "react";

interface DualListSelectorProps {
  allItems: { id: string; label: string }[];
  selected: string[];
  setSelected: (ids: string[]) => void;
  label?: string;
}

const DualListSelector: React.FC<DualListSelectorProps> = ({
  allItems,
  selected,
  setSelected,
  label = "Selected"
}) => {
  const available = allItems.filter(item => !selected.includes(item.id));
  const selectedItems = allItems.filter(item => selected.includes(item.id));

  function add(id: string) {
    setSelected([...selected, id]);
  }
  function remove(id: string) {
    setSelected(selected.filter(sid => sid !== id));
  }

  return (
    <div className="flex gap-4">
      <div>
        <div className="font-semibold mb-1">Available</div>
        <div className="border rounded p-2 h-40 w-40 overflow-auto bg-gray-50">
          {available.map(item => (
            <div key={item.id} className="flex items-center justify-between mb-1">
              <span>{item.label}</span>
              <button className="text-blue-600 font-bold ml-2" onClick={() => add(item.id)}>+</button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="font-semibold mb-1">{label}</div>
        <div className="border rounded p-2 h-40 w-40 overflow-auto bg-blue-50">
          {selectedItems.map(item => (
            <div key={item.id} className="flex items-center justify-between mb-1">
              <span>{item.label}</span>
              <button className="text-red-600 font-bold ml-2" onClick={() => remove(item.id)}>-</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DualListSelector;
