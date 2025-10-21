export default function Box({ className, children }) {
  return (
    <div className="filter-[drop-shadow(0px_6px_0_#00000095)] pb-[6px]">
      <div className={`pixel-corners bg-darker p-4 md:p-6 ${className || ""}`}>
        {children}
      </div>
    </div>
  );
}
