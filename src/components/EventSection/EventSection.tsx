// src/components/EventSection/EventSection.tsx
import React from "react";

// Dummy event list (replace with real props)
const dummyEvents = [
  { over: 1, ball: 1, bat: "Kohli", bwl: "Jadeja", runs: 1, ext: "", wkt: "", pitch: "Full", wheel: "Cover", comm: "Single", edit: false },
  // more events...
];

const EventSection: React.FC = () => (
  <div className="bg-[#181d23] rounded-2xl shadow-xl p-4 w-full overflow-x-auto mt-3">
    <table className="w-full text-xs text-white">
      <thead>
        <tr className="bg-[#181d23] text-[#e1ffbe]">
          <th>Ov</th><th>Ball</th><th>Bat</th><th>Bwl</th><th>Runs</th>
          <th>Ext</th><th>Wkt</th><th>Pitch</th><th>Wheel</th>
          <th>Comm</th><th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {dummyEvents.map((ev, idx) => (
          <tr key={idx} className={ev.wkt ? "bg-[#39151c]" : ""}>
            <td>{ev.over}</td><td>{ev.ball}</td><td>{ev.bat}</td><td>{ev.bwl}</td><td>{ev.runs}</td>
            <td>{ev.ext}</td><td>{ev.wkt}</td><td>{ev.pitch}</td><td>{ev.wheel}</td>
            <td>{ev.comm}</td>
            <td>
              <button className="text-blue-400 hover:underline">Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {dummyEvents.length === 0 && (
      <div className="text-center text-gray-500 py-2">No balls recorded.</div>
    )}
  </div>
);

export default EventSection;
