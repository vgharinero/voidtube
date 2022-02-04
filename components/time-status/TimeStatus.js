import "./TimeStatus.css";

const TimeStatus = ({ duration }) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = duration - hours * 3600 - minutes * 60;

  return (
    <>
      {duration && (
        <div className="time-status">
          {hours > 0 ? hours + ":" : ""}
          {hours > 0 ? String(minutes).padStart(2, "0") : minutes}:
          {String(seconds).padStart(2, "0")}
        </div>
      )}
    </>
  );
};

export default TimeStatus;
