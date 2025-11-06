export default function Tooltip({ hovered, mousePos }: any) {
  return (
    <div
      className="absolute z-30 px-3 py-2 bg-gray-900/90 border border-gray-700 rounded-lg shadow-md text-white text-xs pointer-events-none"
      style={{ left: mousePos.x + 12, top: mousePos.y - 20 }}
    >
      <div className="font-semibold">{hovered.name}</div>
      <div className="text-gray-300">Cloud: {hovered.provider}</div>
    </div>
  );
}
