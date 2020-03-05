import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name }
  }
}) => {
  return (
    <div className="profile-about bg-light p-2">
      {bio && (
        <Fragment>
          <h2 className="text-primary">{name.trim().split(" ")[0]}'s Bio</h2>
          <p>{bio}</p>
          <div className="line"></div>
        </Fragment>
      )}
      {skills.map((skill, index) => (
        <div className="p-1" key={index}>
          <i className="fa fa-check"></i> {skill}
        </div>
      ))}
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
