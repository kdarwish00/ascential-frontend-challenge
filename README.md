# Ascential Frontend App

### [👉 Go to the challenge 👈](./CHALLENGE.md)

### [🚀 See the app in action 🚀](https://ascential-frontend-challenge.development.platform-team.com)

### Task 1
- would say took an hour to fix/add feature
- changed the functionality of the formatDateTime util to allow an optional parameter for timezone. If called with timezone, will show the timezone of the events location as the main time and the user time as a tooltip
- used tooltip from chakra ui

### Task 2
- would say took 1.5 hours to add feature. I had to come back to make this reusuable for components that may be built as requested. This was done with [the util](./src/utils/favourites.ts) and the [component](./src/components/FavouriteButton.tsx)
- changed the functionality of the formatDateTime util to allow an optional parameter for timezone. If called with timezone, will show the timezone of the events location as the main time and the user time as a tooltip
- designs were not provided so added to the end of cards. I also felt that a favourite should stand out more when there was only 1 or 2 in the section. So I made them bigger than the rest. I tried to keep design patterns the same for how they were displayed originally. So the favourites are placed differntly. This may be a point for debate but I see it both ways
-I also decided to only place them on their pages (/events and /venues). Didn't make sense to me to have them there

### Task 3

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
