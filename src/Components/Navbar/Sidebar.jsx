import React from "react";
import { IconButton, Drawer, Card, List, ListItem } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SidebarWithBurgerMenu() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <IconButton
        variant="text"
        size="lg"
        className="fixed top-8 left-8 z-50"
        onClick={openDrawer}
      >
        {isDrawerOpen ? (
          <XMarkIcon className="h-10 w-10 stroke-2" />
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.54266 10.2861H21.2569C21.9844 10.2861 22.6821 10.5751 23.1964 11.0895C23.7108 11.6039 23.9998 12.3015 23.9998 13.029C23.9998 13.7564 23.7108 14.4541 23.1964 14.9685C22.6821 15.4829 21.9844 15.7718 21.2569 15.7718H7.54266C6.81521 15.7718 6.11756 15.4829 5.60317 14.9685C5.08878 14.4541 4.7998 13.7564 4.7998 13.029C4.7998 12.3015 5.08878 11.6039 5.60317 11.0895C6.11756 10.5751 6.81521 10.2861 7.54266 10.2861ZM26.7427 32.229H40.4569C41.1844 32.229 41.8821 32.518 42.3964 33.0324C42.9108 33.5467 43.1998 34.2444 43.1998 34.9718C43.1998 35.6993 42.9108 36.397 42.3964 36.9113C41.8821 37.4257 41.1844 37.7147 40.4569 37.7147H26.7427C26.0152 37.7147 25.3176 37.4257 24.8032 36.9113C24.2888 36.397 23.9998 35.6993 23.9998 34.9718C23.9998 34.2444 24.2888 33.5467 24.8032 33.0324C25.3176 32.518 26.0152 32.229 26.7427 32.229ZM7.54266 21.2576H40.4569C41.1844 21.2576 41.8821 21.5465 42.3964 22.0609C42.9108 22.5753 43.1998 23.273 43.1998 24.0004C43.1998 24.7279 42.9108 25.4255 42.3964 25.9399C41.8821 26.4543 41.1844 26.7433 40.4569 26.7433H7.54266C6.81521 26.7433 6.11756 26.4543 5.60317 25.9399C5.08878 25.4255 4.7998 24.7279 4.7998 24.0004C4.7998 23.273 5.08878 22.5753 5.60317 22.0609C6.11756 21.5465 6.81521 21.2576 7.54266 21.2576Z"
              fill="black"
            />
          </svg>
        )}
      </IconButton>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Card color="transparent" shadow={false} className="h-[calc(100vh-2rem)] w-full p-4">
          <List>
            <ListItem>Concierge</ListItem>
            <ListItem>Safe</ListItem>
            <ListItem>Owner's Club</ListItem>
            <ListItem>Real Insight</ListItem>
            <ListItem>Buy/Sell/Lease</ListItem>
            <ListItem>NRI</ListItem>
            <ListItem>Lend</ListItem>
            <ListItem>Advice</ListItem>
          </List>
        </Card>
      </Drawer>
    </>
  );
}
