import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import { getProfileById } from "../../actions/profile";
import { Link } from "react-router-dom";
import ProfileAbout from "./ProfileAbout";

const Profile = ({
  getProfileById,
  profile: { profile, loading },
  match,
  auth
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, []);

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back to Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <ProfileTop profile={profile} />
          <ProfileAbout profile={profile} />
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getProfileById })(Profile);
