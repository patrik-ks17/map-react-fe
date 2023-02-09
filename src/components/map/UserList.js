import React from "react";

function UserList({ users, loggedUser, setMarkers, panTo }) {
  function panToMarker(panTo, lat, lng) {
    try {
      panTo({
        lat: lat,
        lng: lng,
       }, 14);
  } catch (e) {
    console.error(e);
  }
  }

  return (
    <div className="users-list">
      <div className="btn-mymarker">
        <button onClick={() => setMarkers(loggedUser.markers)}>
          Jelöléseim
        </button>
      </div>
      <div>
        <ul>
          {users.map((user, index) => {
            return (
              <div
                key={index}
                className="user-box"
                onClick={() => {
                  setMarkers(user.markers);
                }}
              >
                <span key={user._id}>{user.username}</span>
                <ul>
                  {user.markers.map((marker, index) => {
                    return (
                      <li
                        className="listed-marker"
                        key={index}
                        onClick={() => {
                          panToMarker(panTo, marker.lat, marker.lng);
                        }}
                      >
                        <span>{marker.sport}</span>
                        <span>
                          {marker.time.start + " - " + marker.time.end}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default UserList;
