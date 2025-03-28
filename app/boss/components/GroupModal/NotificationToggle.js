import React from "react";

const NotificationToggle = ({ isEnabled, onToggle }) => {
  return (
    <label className="flex items-center gap-2 text-sm text-white">
      <input
        type="checkbox"
        checked={isEnabled}
        onChange={onToggle}
        className="accent-yellow-400"
      />
      알림 설정
    </label>
  );
};

export default NotificationToggle;
