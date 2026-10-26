The code structure now looks like this:
js/
├── app/
│ ├── Header.tsx
│ ├── RouteContent.tsx
│ └── routes.ts
├── components/
│ └── Panel.tsx
├── features/
│ ├── dashboard/
│ │ ├── DashboardContainer.tsx
│ │ └── DashboardView.tsx
│ ├── people-locations/
│ │ ├── LocationCard.tsx
│ │ ├── PeopleLocationsView.tsx
│ │ └── PersonCard.tsx
│ └── timeline/
│ ├── TimelineEventCard.tsx
│ └── TimelineView.tsx
├── ReactApp.tsx
├── react-main.tsx
├── state.ts
├── types.ts
└── utils.ts
