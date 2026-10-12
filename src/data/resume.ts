// All site content lives in this file. Edit here; layout code lives in src/pages/index.astro.
//
// Entries with `todo: true` are placeholders and render with a TODO badge.

export interface Experience {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
  todo?: boolean;
}

export interface Project {
  name: string;
  url: string;
  description: string;
  todo?: boolean;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Education {
  school: string;
  degree: string;
  dates: string;
}

export interface Link {
  label: string;
  href: string;
}

export interface Resume {
  name: string;
  location: string;
  intro: string;
  experience: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
  links: Link[];
}

export const resume: Resume = {
  name: "Roan Urquhart",
  location: "Raleigh, NC",
  intro: "Roan Urquhart is a software engineer in Raleigh, NC.",

  experience: [
    {
      title: "TODO: 2024 – present",
      company: "TODO: company",
      dates: "",
      bullets: ["TODO: fill in"],
      todo: true,
    },
    {
      title: "Senior Software Engineer",
      company: "Corvus Insurance",
      dates: "January 2024 – September 2024",
      bullets: [
        "Built and led an engineering team with a focus on consistent delivery and feature ownership. This team frequently ranked among the most productive at the company",
        "Architected a proof-of-concept that used Large Language Models (LLMs) to accurately extract complex data from PDF applications, which if implemented could save the company $160,000 a year.",
        "Served as the domain technical expert during a months-long project to create a robust Data Platform for our underwriting software.",
      ],
    },
    {
      title: "Software Engineer",
      company: "Corvus Insurance",
      dates: "January 2022 – January 2024",
      bullets: [
        "Architected and delivered a new product line over the total of 10 months which enabled Corvus to write insurance worldwide, which was previously impossible.",
        "Served consistently as a Project Lead, a role that involves leading the planning, scoping, and delivery of an entire team's work over a single cycle (5 weeks).",
        "Developed several new data integrations with third-party software companies, such as AWS and SentinelOne, which allowed Corvus to provide security recommendations to policyholders.",
        "Mentored both engineering interns and associates, many of which have been promoted and run their own teams currently.",
        "Prototyped a GMail Add-on, using Google's App Script, which streamlined the Underwriter-Broker communication archival process.",
      ],
    },
    {
      title: "Associate Software Engineer",
      company: "Corvus Insurance",
      dates: "October 2021 – January 2022",
      bullets: [
        "Developed a strong understanding of functional programming techniques and design through the usage of two functional programming languages; Elixir and Elm.",
        "Supported internal underwriter stakeholders by triaging and resolving issues reported within Corvus's primary application.",
      ],
    },
    {
      title: "Associate Software Development Engineer",
      company: "SentryOne",
      dates: "June 2020 – October 2021",
      bullets: [
        "Collaborated with a small team of engineers to design and implement major new features in C# across several of SentryOne's on-premise and SaaS products.",
        "Contributed to the release of a new SaaS product by building and troubleshooting CI/CD pipelines within Azure DevOps.",
        "Implemented REST APIs in Go to support data retrieval, sorting, and pagination for a front end web application",
        "Leveraged Docker containers to improve development and testing efficiency.",
        "Improved personal engineering skills by following Test-Driven Design principles, learning advanced refactoring techniques, and performing code reviews.",
        "Presented at company-wide meetings in order to demonstrate the functionality of new software.",
        "Maintained and provisioned cloud infrastructure in Azure using Terraform templates.",
      ],
    },
    {
      title: "Software Engineering Intern",
      company: "SentryOne",
      dates: "Summer 2019",
      bullets: [
        "Collaborated with a small team of engineers on backend development tasks related to SentryOne's main desktop client.",
        "Participated in various Agile Scrum ceremonies and delivered feature work in two week sprint intervals.",
        "Developed a training application in Typescript React for the benefit of the onboarding of future interns.",
      ],
    },
  ],

  projects: [
    {
      name: "software-factory",
      url: "https://github.com/roanurquhart/software-factory",
      description: "TODO: describe this project",
      todo: true,
    },
    {
      name: "spotify-playlist-generator",
      url: "https://github.com/roanurquhart/spotify-playlist-generator",
      description: "TODO: describe this project",
      todo: true,
    },
    {
      name: "Unity-Fluid-Simulation",
      url: "https://github.com/roanurquhart/Unity-Fluid-Simulation",
      description: "TODO: describe this project",
      todo: true,
    },
  ],

  skills: [
    {
      label: "Programming Languages",
      items: ["Elixir", "Elm", "C#", "Golang"],
    },
    {
      label: "Database Technologies",
      items: ["Postgres", "SQL Server"],
    },
    {
      label: "Development Tools",
      items: ["AWS Console", "Open Search", "GitHub", "Visual Studio"],
    },
  ],

  education: [
    {
      school: "The University of North Carolina at Chapel Hill",
      degree: "Bachelors Degree in Computer Science",
      dates: "August 2016 – May 2020",
    },
  ],

  links: [
    { label: "Email", href: "mailto:roanurquhart@gmail.com" },
    { label: "GitHub", href: "https://github.com/roanurquhart" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/roan-urquhart/" },
  ],
};
