# Feature UI

Once the feature class has been created, we need to create a feature UI for the user to interact with the feature

A feature UI can be any react component, so there is no limit to what can be a feature UI. But if you are custom making your entire UI please check {@page Clui UI Components} as we have certain things that need to be done.

We have a list of pre-made features ui components, the entire list can be found at `src/clui-ui-components` feel free to use any of these components. **Except the submit button**, that is already implemented for you.

Depending on the component you choose there are certain props you need to pass to it, but regardless of component you choose you need to pass a parents props

This prop represents a tree structure of where the configuration is being called for and thus very important, **if your feature is setting multiple values you will have to especially take not of this**

For example, the {@link TranscodeFeature} sets a FORMAT and a CODEC.

So when passing the props to the component that sets the FORMAT's value we pass the following

```js
{
  ...,
  parents: ["TRANSCODE", "FORMAT"],
}
```

but while passing the props to the component that sets the CODEC's value we pass the following

```js
{
  ...,
  parents: ["TRANSCODE","FORMAT","CODEC"],
}
```

**In fact, this is how the configuration is set in the store**

Regarding the other props please check the API reference for each CLUI UI Components

A few common ones are here:

- {@link List}
- {@link Slider}

If you want a deeper understand of what we are going to be doing with the parents prop, please read more {@page Parents Architecture}.
