// Filename - components/SidebarData.js

import React from "react";
import { FaListUl } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { RiArrowDownSFill, RiArrowUpSFill, RiPlayListAddLine } from "react-icons/ri";
import { PiStudentDuotone } from "react-icons/pi";
import { FaClipboardCheck, FaIndustry, FaEnvelopeOpenText } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { LiaIndustrySolid } from "react-icons/lia";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/management/dashboard",
    icon: <AiFillHome />
  },
  {
    title: "Students",
    icon: <PiStudentDuotone />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: "List All",
        path: "/management/students",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Approve",
        path: "/management/approve-student",
        icon: <FaClipboardCheck />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "TPO",
    icon: <GrUserWorker />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,

    subNav: [
      {
        title: "List All",
        path: "/management/tpo-admin",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/management/add-tpo-admin",
        icon: <RiPlayListAddLine />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "Company",
    icon: <LiaIndustrySolid />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: "List All",
        path: "/management/companys",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/management/add-company",
        icon: <RiPlayListAddLine />,
      },
    ],
  },
  {
    title: "Job Listings",
    icon: <FaIndustry />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,

    subNav: [
      {
        title: "List All",
        path: "/management/job-listings",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/management/post-job",
        icon: <RiPlayListAddLine />,
      },
    ],
  },
  {
    title: "Notice",
    icon: <FaEnvelopeOpenText />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,

    subNav: [
      {
        title: "List All",
        path: "/management/all-notice",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Send",
        path: "/management/send-notice",
        icon: <RiPlayListAddLine />,
      },
    ],
  },
];
