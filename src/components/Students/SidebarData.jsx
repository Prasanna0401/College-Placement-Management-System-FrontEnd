// Filename - components/SidebarData.js

import React from "react";
import { AiFillHome } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import { RiArrowDownSFill, RiArrowUpSFill, RiPlayListAddLine } from "react-icons/ri";
import { FaIndustry, FaListCheck, FaBuildingColumns, FaListUl, FaRegCalendarCheck } from "react-icons/fa6";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/student/dashboard",
    icon: <AiFillHome />
  },
  {
    title: "Applied Jobs",
    path: "/student/myjob",
    icon: <FaRegCalendarCheck />,
  },
  {
    title: "Placements",
    // path: "",
    icon: <FaIndustry />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,

    subNav: [
      {
        title: "Placement Profile",
        path: "/student/placement-profile",
        icon: <ImProfile />,
        cName: "sub-nav",
      },
      {
        title: "Job Listings",
        path: "/student/job-listings",
        icon: <FaListCheck />,
      },
    ],
  },
  {
    title: "My Internship",
    icon: <FaBuildingColumns />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,

    subNav: [
      {
        title: "List All",
        path: "/student/internship",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/student/add-internship",
        icon: <RiPlayListAddLine />,
      },
    ],
  },
];
