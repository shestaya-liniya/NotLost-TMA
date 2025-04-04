import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router";
import Ai from "@/pages/Ai";
import Events from "@/pages/Events";
import Folders from "@/pages/Folders";
import TabBarLayout from "@/ui/tab-bar/TabBarLayout";
import { ROUTES } from "./routes";
import KeepAlive from "react-activation";

const TabViewContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.split("/").pop() || "folders";

  return (
    <TabBarLayout
      activeTab={activeTab}
      setActiveTab={(tab) => navigate(`/${tab}`)}
    >
      <div className="relative w-screen h-full overflow-hidden">
        <Routes location={location}>
          <Route path={ROUTES.AI} element={<Ai />} />
          <Route
            path={ROUTES.FOLDERS}
            element={
              <KeepAlive cacheKey="folders">
                <Folders />
              </KeepAlive>
            }
          />
          <Route path={ROUTES.EVENTS} element={<Events />} />
          <Route path="*" element={<Navigate to={ROUTES.FOLDERS} />} />
        </Routes>
      </div>
    </TabBarLayout>
  );
};

export default TabViewContainer;
