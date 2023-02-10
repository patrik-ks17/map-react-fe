import React from "react";
import TimePicker from "react-time-picker";
import PushMarker from "../../hooks/PushMarker";
import { useAlert } from "react-alert";

function MarkerSetting({
  markers,
  selected,
  setSelected,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  setMarkerPending,
}) {
  const alert = useAlert();
  
  function lc_editMarker() {
    const sport = document.querySelector(
      "form[id='markerform'] input[name='sport']"
    ).value;
    const timerange = {
      start: startTime,
      end: endTime,
    };
    markers.map((marker, index) => {
      if (marker.lat === selected.lat && marker.lng === selected.lng) {
        markers[index].sport = sport;
        markers[index].time = timerange;
      }
    });
    PushMarker(selected);
    setSelected({});
    setMarkerPending({});
    alert.success("Sikeresen hozzáadva");
  }

  return (
    <div className="set-marker">
      <form id="markerform">
        <span>Sport</span>
        <input type={"text"} name={"sport"} defaultValue=""></input>
        <span>Kezdés</span>
        <TimePicker disableClock onChange={setStartTime} value={startTime} className="timepicker" />
        <span>Vége</span>
        <TimePicker
          disableClock
          onChange={(e) => setEndTime(e)}
          value={endTime}
          className="timepicker"
        />
        <button type={"button"} onClick={lc_editMarker}>
          Felvesz
        </button>
      </form>
    </div>
  );
}

export default MarkerSetting;
