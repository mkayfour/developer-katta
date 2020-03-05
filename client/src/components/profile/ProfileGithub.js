import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getGithubRepos } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const ProfileGithub = ({ username, getGithubRepos, profile }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos(username)]);

  console.log("repos", profile.repos);
  const repos = profile.repos;
  //   console.log("profile", profile);
  //   console.log("repos", profile.repos);
  return (
    <div className="profile-github">
      {repos === null ? (
        <Spinner />
      ) : (
        // repos.map(repo => (
        //   <div key={repo._id} className="repo bg-white p-1 my-1">
        //     <div>
        //       <h4>
        //         <a
        //           href={repo.html_url}
        //           target="_blank"
        //           rel="noopener noreferrer"
        //         >
        //           {repo.name}
        //         </a>
        //       </h4>
        //     </div>
        //   </div>
        // ))
        <div className="repo bg-white p-1 my-1">
          <h2 className="text-primary my-1">Github Repos</h2>
          <h4>
            <p>'Feature coming Soon' </p>
          </h4>
        </div>
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
