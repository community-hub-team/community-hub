import TopNavTeams from "./TopNavTeams";
import TeamsContents from "./TeamsContents";
import BottomNav from "../../components/bottomNav/BottomNav";

function TeamsRender() {
  return (
    <div className="home">
      <TopNavTeams />
      <TeamsContents />
      <BottomNav active="teams" />
    </div>
  );
}

export default TeamsRender;
