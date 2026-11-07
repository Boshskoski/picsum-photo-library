# Picsum Photo Library

A small photo app built with Angular. You scroll through an endless list of random photos, tap a photo to add it to your favorites, and open a favorite to see it full size. Favorites are saved in the browser, so they are still there after a refresh.

Photos come from [Lorem Picsum](https://picsum.photos).

## Start the app

```bash
npm install
```

```bash
npm start
```

Then open `http://localhost:4200/`.

## Run the tests

```bash
npm test
```

## Project structure

The app uses a feature-driven architecture:

- `core/` – basic pieces used by the whole app (models, constants, storage helper)
- `shared/` – reusable parts used by many features (header, photo grid, loader)
- `features/` – one folder for each feature: `photos`, `favorites` and `photo-details`
- `routes/` – the app's routes
