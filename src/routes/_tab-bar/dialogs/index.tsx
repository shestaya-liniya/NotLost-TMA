import { createFileRoute } from "@tanstack/react-router";
import { FilterBySearch } from "./-filters";
import ContactsList from "./-list";

const ContactsPage = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="w-full  -mt-4 pl-4 pr-4">
        <div className="relative">
          <FilterBySearch value={""} onChange={() => {}} />
          <div className="text-accent font-semibold text-center w-full animate-pulse absolute z-10 -top-4">
            NotLost Beta
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto items-center text-white ">
        <ContactsList />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_tab-bar/dialogs/")({
  component: ContactsPage,
});
