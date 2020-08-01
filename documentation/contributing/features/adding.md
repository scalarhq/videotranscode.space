# Adding Your Feature

There are two main places you need to add your feature.

# Adding your Feature to TypeScript

1. Import your feature and its UI into {@link Feature}
2. Add it as a Feature type

```ts
export type Feature = typeof TranscodeFeature | typeof CompressionFeature; // Add your feature here
```

3. Adding the FeatureElement to the object literal

- The feature key should be your feature class
- The description is the your facing description of your feature.
- The ui key should be your feature ui
- **Make the key of this object CAPS**

```ts
export type FeatureElement = {
  feature: Feature;
  description: string;
  ui: JSX.Element | string;
};
```

# Adding Your Features to JSON

This step is super simple, just add your key to `src/features/featureKeys.json` with the value true

**If you don't do this, you will not be able to use your feature in Workflows**

**Congratulations! You have added your feature**
