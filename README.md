# Ascential Frontend App

### [Link to my version](https://ascential-project.netlify.app)

### Task 1
- **Estimated time**: 1 hour
- Updated the `formatDateTime` utility to allow an optional `timezone` parameter. If a timezone is provided, the main time will display the event's local time, with the user's local time shown as a tooltip.
- Integrated the tooltip feature using Chakra UI.

### Task 2
- **Estimated time**: 1.5 hours
- Implemented a feature to allow for reusable components, which may be needed in future development. This was done by updating the [utility](./src/utils/favourites.ts) and creating the [component](./src/components/FavouriteButton.tsx).
- Due to the absence of provided designs, I placed the "favourite" feature at the end of the cards. Additionally, I made the "favourite" elements larger when there were only one or two in a section, ensuring they stand out more. I followed existing design patterns as closely as possible, but the placement differs slightly, which might be a point of discussion.
- Decided to limit the display of favourites to their respective pages (/events and /venues), as it didn’t make sense to include them elsewhere.
- In a later commit, I created a [useFavouriteHook](./src/hooks/useFavouriteHook.ts) to improve code readability and maintainability.

### Task 3
- **Estimated time**: 3-4 hours
- Focused primarily on integrating the recommendation feature. Utilised the API's recommendation endpoint, adjusting the existing [useSeatGeek](./src/utils/useSeatGeek.ts) utility, and created a [Recommendations](./src/components/Recommendations.tsx) component. This component was added to the [Event](./src/pages/event/:id/Event.tsx) page to provide event-specific recommendations.
- Restructured the project by separating pages and components to avoid confusion and reduce errors, which occurred due to similarly named components. This restructuring will improve future development and onboarding processes.
- Refactored and componentised code as much as possible. In addition to the favourites feature, I also applied this approach to the event/venue details on their respective ID pages, recognising similarities in their formats. This should facilitate future development if similar pages are added.

### If I had more time:
- Introduced some test code, which wasn't a requirement, but in a real-life scenario, I would definitely implement it.
- Enhanced the page further. This can be done by adding animations or more features. I purposely chose the features that I thought would be the most challenging so I decided against doing animations.


## Develop
- create `.env` file based on `.env.sample`
- run `yarn` to install dependencies
- run `yarn dev` to start development environment

## Build
- run `yarn` to install dependencies
- run `yarn build` to build app for production
- output is in `dist` directory,
  [ready to be deployed](https://create-react-app.dev/docs/deployment/)

## Data
All data is fetched from the SeatGeek API at
[seatgeek.com](https://platform.seatgeek.com/).

## Technologies
- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Frontend build tooling
- [Chakra UI](https://chakra-ui.com/) - Design system and component library,
  with [Emotion](https://emotion.sh), its peer dependency
- [SWR](https://swr.now.sh/) - Data fetching and caching library
