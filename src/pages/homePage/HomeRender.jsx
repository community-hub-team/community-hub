import TopNavHome from "./TopNavHome";
import HomeContents from "./HomeContents";
import BottomNav from "../../components/bottomNav/BottomNav";
import { useUser } from "../../context/UserContext.jsx";

function HomeRender() {
  const { user } = useUser();

  if (user === null)
    return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;

  return (
    <div className="home">
      <TopNavHome />
      <HomeContents user={user} />
      <BottomNav active="home" />
    </div>
  );
}

export default HomeRender;
