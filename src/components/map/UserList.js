import React from "react";

function UserList({ users, loggedUser, setMarkers, panTo }) {
  function panToMarker(lat, lng) {
    try {
      panTo(
        {
          lat: lat,
          lng: lng,
        },
        12
      );
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
              <div key={index} className="user-box">
                <p
                  key={user._id}
                  onClick={() => {
                    setMarkers(user.markers);
                  }}
                >
                  {user.username}
                </p>
                <ul>
                  {user.markers.map((marker, index) => {
                    return (
                      <li
                        className="listed-marker"
                        key={index}
                        onClick={() => {
                          panToMarker(marker.lat, marker.lng);
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
