import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getProfiles } from "../../actions/profile";
import ProfileItem from "./ProfileItem";

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  //   console.log("main profile", profile);
  console.log("profiles ", profiles);
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">All Users</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i>Browse and connect with
            fellow users
          </p>
          <div className="profiles">
            {profiles !== null ? (
              profiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4> No Profiles Found </h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
