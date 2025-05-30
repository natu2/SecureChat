import { Link } from "react-router-dom";

const WelcomeBack = () => {
  return (
    <div>
      <h1> Welcome to Secure Chat!</h1>
      <Link to="/send-message">Compose a Message </Link>
      <Link to="/recent-messages">View Message History </Link>
    </div>
  );
};

export default WelcomeBack;
