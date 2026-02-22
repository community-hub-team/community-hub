import "./TeamsContents.css";
import BottomNav from "../../components/bottomNav/BottomNav";
import TeamCard from "../../components/TeamCard/TeamCard";

function TeamsContents() {
  return (
    <div className="phone">
      <section className="greeting">
        <p>Here are your teams</p>
      </section>

      <section className="cards">
        <TeamCard title="Marketing Team" members="5 members" color="blue" />
        <TeamCard title="Product Team" members="8 members" color="green" />
        <TeamCard title="Design Team" members="4 members" color="purple" />
      </section>

      <BottomNav active="teams" />
    </div>
  );
}

export default TeamsContents;
