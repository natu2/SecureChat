import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div>
      <h1> Welcome to Secure Chat!</h1>
      <Link to="/login">Login </Link>
      <Link to="/sign-up">Sign-Up </Link>
    </div>
  );
};

export default Welcome;
