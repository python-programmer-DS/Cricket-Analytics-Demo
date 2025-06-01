import UsersPage from "./modules/Masters/UsersPage";
import CompetitionsPage from "./modules/Masters/CompetitionsPage";
import TeamsPage from "./modules/Masters/TeamsPage";
import PlayersPage from "./modules/Masters/PlayersPage";
import OfficialsPage from "./modules/Masters/OfficialsPage";
import CoachesPage from "./modules/Masters/CoachesPage";
import VenuesPage from "./modules/Masters/VenuesPage";
import ShotTypesPage from "./modules/Masters/ShotTypesPage";
import BallTypesPage from "./modules/Masters/BallTypesPage";
import BowlerSpecializationPage from "./modules/Masters/BowlerSpecializationPage";
import FieldingFactorsPage from "./modules/Masters/FieldingFactorsPage";
import DatabaseConfigPage from "./modules/Config/DatabaseConfigPage";
import ApplicationConfigPage from "./modules/Config/ApplicationConfigPage";
import ShortcutConfigPage from "./modules/Config/ShortcutConfigPage";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./modules/Home/Home";
import ConfigPage from "./modules/Config/ConfigPage";
import MastersPage from "./modules/Masters/MastersPage";
import MatchRegistrationPage from "./modules/MatchRegistration/MatchRegistrationPage";
import VideoSettingsPage from "./modules/VideoSettings/VideoSettingsPage";
import ReportsPage from "./modules/Reports/ReportsPage";
import SettingsPage from "./modules/Settings/SettingsPage";
import Scoring from "./modules/Scoring/MatchScoringPage"

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/config" element={<ConfigPage />} />
      <Route path="/masters" element={<MastersPage />} />
      <Route path="/match-registration" element={<MatchRegistrationPage />} />
      <Route path="/video-settings" element={<VideoSettingsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/config" element={<ConfigPage />} />
      <Route path="/config/database" element={<DatabaseConfigPage />} />
      <Route path="/config/application" element={<ApplicationConfigPage />} />
      <Route path="/config/shortcuts" element={<ShortcutConfigPage />} />
      <Route path="/masters/users" element={<UsersPage />} />
      <Route path="/masters/competitions" element={<CompetitionsPage />} />
      <Route path="/masters/teams" element={<TeamsPage />} />
      <Route path="/masters/players" element={<PlayersPage />} />
      <Route path="/masters/officials" element={<OfficialsPage />} />
      <Route path="/masters/coaches" element={<CoachesPage />} />
      <Route path="/masters/venues" element={<VenuesPage />} />
      <Route path="/masters/shot-types" element={<ShotTypesPage />} />
      <Route path="/masters/ball-types" element={<BallTypesPage />} />
      <Route path="/masters/bowler-specializations" element={<BowlerSpecializationPage />} />
      <Route path="/masters/fielding-factors" element={<FieldingFactorsPage />} />
      <Route path="/scoring" element={<Scoring />} />
    </Routes>
  </BrowserRouter>
);

export default App;
